import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, signal, computed, inject, HostListener, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { BLOG_POSTS, BlogPost } from './blog-posts.data';
import { SeoService } from '../services/seo.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private seoService = inject(SeoService);
  private platformId = inject(PLATFORM_ID);
  private sanitizer = inject(DomSanitizer);

  private routeSub?: Subscription;
  private querySub?: Subscription;

  // Data signals
  public allPosts = signal<BlogPost[]>(BLOG_POSTS);
  public currentPost = signal<BlogPost | null>(null);

  public safeContentHtml = computed<SafeHtml | null>(() => {
    const post = this.currentPost();
    if (!post) return null;
    return this.sanitizer.bypassSecurityTrustHtml(post.contentHtml);
  });

  // Filter & Search Signals
  public searchQuery = signal<string>('');
  public selectedCategory = signal<string>('All');
  public selectedTag = signal<string>('All');
  public selectedAuthor = signal<string>('All');
  public selectedReadTime = signal<string>('All');
  public selectedSort = signal<string>('latest');
  
  // Pagination & Display Signals
  public currentPage = signal<number>(1);
  public pageSize = signal<number>(6);
  public isInfiniteScroll = signal<boolean>(false);
  public visiblePostsCount = signal<number>(6);

  // Detail View Scroll Signals
  public readingProgress = signal<number>(0);
  public activeSection = signal<string>('introduction');

  // Filter Panels Toggles
  public showAdvancedFilters = signal<boolean>(false);

  // Categories list
  public categories = computed(() => {
    const list = new Set(this.allPosts().map(p => p.category));
    return ['All', ...Array.from(list)];
  });

  // Tags list
  public tags = computed(() => {
    const list = new Set<string>();
    this.allPosts().forEach(p => p.tags.forEach(t => list.add(t)));
    return ['All', ...Array.from(list)];
  });

  // Authors list
  public authors = computed(() => {
    const list = new Set<string>();
    this.allPosts().forEach(p => list.add(p.author.name));
    return ['All', ...Array.from(list)];
  });

  // Reading time options
  public readTimeOptions = ['All', 'Short (< 5 min)', 'Medium (5-10 min)', 'Long (> 10 min)'];

  // Filtered and Sorted posts
  public filteredPosts = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const category = this.selectedCategory();
    const tag = this.selectedTag();
    const author = this.selectedAuthor();
    const readTimeOpt = this.selectedReadTime();
    
    let posts = this.allPosts();

    // 1. Category Filter
    if (category !== 'All') {
      posts = posts.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    // 2. Tag Filter
    if (tag !== 'All') {
      posts = posts.filter(p => p.tags.some(t => t.toLowerCase() === tag.toLowerCase()));
    }

    // 3. Author Filter
    if (author !== 'All') {
      posts = posts.filter(p => p.author.name.toLowerCase() === author.toLowerCase());
    }

    // 4. Read Time Filter
    if (readTimeOpt !== 'All') {
      if (readTimeOpt === 'Short (< 5 min)') {
        posts = posts.filter(p => p.readTimeMin < 5);
      } else if (readTimeOpt === 'Medium (5-10 min)') {
        posts = posts.filter(p => p.readTimeMin >= 5 && p.readTimeMin <= 10);
      } else if (readTimeOpt === 'Long (> 10 min)') {
        posts = posts.filter(p => p.readTimeMin > 10);
      }
    }

    // 5. Search query Filter
    if (query) {
      posts = posts.filter(post => 
        post.title.toLowerCase().includes(query) || 
        post.summary.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query) ||
        post.tags.some(t => t.toLowerCase().includes(query)) ||
        post.author.name.toLowerCase().includes(query)
      );
    }

    // 6. Sorting
    const sort = this.selectedSort();
    posts = [...posts]; // Copy array
    if (sort === 'latest') {
      posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sort === 'oldest') {
      posts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (sort === 'popular') {
      posts.sort((a, b) => b.likes - a.likes);
    } else if (sort === 'views') {
      posts.sort((a, b) => b.views - a.views);
    } else if (sort === 'trending') {
      posts.sort((a, b) => b.trendingScore - a.trendingScore);
    } else if (sort === 'alphabetical') {
      posts.sort((a, b) => a.title.localeCompare(b.title));
    }

    return posts;
  });

  // Featured Post - shown on first page of index without search
  public featuredPost = computed(() => {
    if (
      this.searchQuery() ||
      this.selectedCategory() !== 'All' ||
      this.selectedTag() !== 'All' ||
      this.selectedAuthor() !== 'All' ||
      this.selectedReadTime() !== 'All' ||
      this.currentPage() !== 1 ||
      this.isInfiniteScroll()
    ) {
      return null;
    }
    const posts = this.allPosts();
    const featured = posts.find(p => p.featured);
    return featured || posts[0] || null;
  });

  // Paginated view of articles
  public paginatedPosts = computed(() => {
    const posts = this.filteredPosts();
    const isInfinite = this.isInfiniteScroll();
    
    if (isInfinite) {
      return posts.slice(0, this.visiblePostsCount());
    } else {
      const page = this.currentPage();
      const size = this.pageSize();
      const startIndex = (page - 1) * size;
      return posts.slice(startIndex, startIndex + size);
    }
  });

  // Filter out the featured post from grid view on page 1
  public gridPosts = computed(() => {
    const posts = this.paginatedPosts();
    const featured = this.featuredPost();
    if (featured && this.currentPage() === 1 && !this.isInfiniteScroll()) {
      return posts.filter(p => p.slug !== featured.slug);
    }
    return posts;
  });

  public totalPages = computed(() => {
    const totalItems = this.filteredPosts().length;
    const size = this.pageSize();
    return Math.ceil(totalItems / size);
  });

  // Related posts computed list
  public relatedArticles = computed(() => {
    const post = this.currentPost();
    if (!post) return [];

    return this.allPosts()
      .filter(p => p.slug !== post.slug)
      .map(p => {
        let score = 0;
        if (p.category === post.category) score += 3;
        const commonTags = p.tags.filter(t => post.tags.includes(t));
        score += commonTags.length * 2;
        return { post: p, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(item => item.post);
  });

  ngOnInit(): void {
    // Subscribe to paramMap for slug changes
    this.routeSub = this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        const post = this.allPosts().find(p => p.slug === slug);
        if (post) {
          this.currentPost.set(post);
          this.updatePostSeo(post);
          this.resetScroll();
        } else {
          this.router.navigate(['/blog']);
        }
      } else {
        this.currentPost.set(null);
        this.updateIndexSeo();
      }
    });

    // Subscribe to queryParamMap to sync URL to filter states
    this.querySub = this.route.queryParamMap.subscribe(params => {
      this.searchQuery.set(params.get('q') || '');
      this.selectedCategory.set(params.get('category') || 'All');
      this.selectedTag.set(params.get('tag') || 'All');
      this.selectedAuthor.set(params.get('author') || 'All');
      this.selectedReadTime.set(params.get('readTime') || 'All');
      this.selectedSort.set(params.get('sort') || 'latest');
      
      const pageStr = params.get('page');
      const pageNum = pageStr ? parseInt(pageStr, 10) : 1;
      this.currentPage.set(isNaN(pageNum) ? 1 : pageNum);

      // If infinite scroll is enabled, match visible count
      if (this.isInfiniteScroll()) {
        const currentSize = this.pageSize();
        this.visiblePostsCount.set(pageNum * currentSize);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) this.routeSub.unsubscribe();
    if (this.querySub) this.querySub.unsubscribe();
  }

  // URL State updates helper
  public updateQueryParams(params: Record<string, string | number | null | undefined>): void {
    const currentParams = { ...this.route.snapshot.queryParams };
    
    Object.keys(params).forEach(key => {
      const val = params[key];
      if (
        val === null || 
        val === undefined || 
        val === '' || 
        val === 'All' || 
        (key === 'page' && val === 1) || 
        (key === 'sort' && val === 'latest')
      ) {
        delete currentParams[key];
      } else {
        currentParams[key] = String(val);
      }
    });

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: currentParams,
      replaceUrl: false
    });
  }

  // Action methods triggered by UI interaction
  public onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.updateQueryParams({ q: input.value || null, page: 1 });
  }

  public setCategory(category: string): void {
    this.updateQueryParams({ category, page: 1 });
  }

  public setTag(tag: string): void {
    this.updateQueryParams({ tag, page: 1 });
  }

  public setAuthor(author: string): void {
    this.updateQueryParams({ author, page: 1 });
  }

  public setReadTime(readTime: string): void {
    this.updateQueryParams({ readTime, page: 1 });
  }

  public setSort(sort: string): void {
    this.updateQueryParams({ sort, page: 1 });
  }

  public setPage(page: number): void {
    this.updateQueryParams({ page });
    this.resetScroll();
  }

  public resetFilters(): void {
    this.updateQueryParams({
      q: null,
      category: 'All',
      tag: 'All',
      author: 'All',
      readTime: 'All',
      sort: 'latest',
      page: 1
    });
  }

  public toggleAdvancedFilters(): void {
    this.showAdvancedFilters.update(v => !v);
  }

  public toggleInfiniteScroll(): void {
    this.isInfiniteScroll.update(val => !val);
    if (this.isInfiniteScroll()) {
      this.visiblePostsCount.set(this.pageSize());
    } else {
      this.updateQueryParams({ page: 1 });
    }
  }

  public loadMore(): void {
    const currentCount = this.visiblePostsCount();
    const totalCount = this.filteredPosts().length;
    if (currentCount < totalCount) {
      const nextCount = currentCount + this.pageSize();
      this.visiblePostsCount.set(nextCount);
      
      // Update page query param as a indicator of scroll depth
      const size = this.pageSize();
      const pageIndex = Math.ceil(nextCount / size);
      this.updateQueryParams({ page: pageIndex });
    }
  }

  private resetScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  private updatePostSeo(post: BlogPost): void {
    const schemas: any[] = [
      {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': `https://calculhub.in/blog/${post.slug}`
        },
        'headline': post.title,
        'description': post.summary,
        'image': post.heroImage,
        'datePublished': `${post.date}T00:00:00+05:30`,
        'dateModified': `${post.date}T00:00:00+05:30`,
        'author': {
          '@type': 'Person',
          'name': post.author.name
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'CalculHub',
          'logo': {
            '@type': 'ImageObject',
            'url': 'https://calculhub.in/og-image.png'
          }
        }
      }
    ];

    if (post.schema) {
      schemas.push(...post.schema);
    }

    this.seoService.updateSeo({
      title: post.seo.title,
      description: post.seo.description,
      keywords: post.seo.keywords,
      canonical: `https://calculhub.in/blog/${post.slug}`,
      ogImage: post.heroImage,
      publishedTime: `${post.date}T00:00:00+05:30`,
      modifiedTime: `${post.date}T00:00:00+05:30`,
      breadcrumbs: [
        { name: 'Home', url: 'https://calculhub.in' },
        { name: 'Blog', url: 'https://calculhub.in/blog' },
        { name: post.title, url: `https://calculhub.in/blog/${post.slug}` }
      ],
      schema: schemas
    });
  }

  private updateIndexSeo(): void {
    this.seoService.updateSeo({
      title: 'Blog — Financial Tips, Health Guides & Math Tricks | CalculHub',
      description: 'Read expert articles on personal finance, health metrics, and mathematical concepts. CalculHub blog helps you understand and use calculators better.',
      canonical: 'https://calculhub.in/blog',
      breadcrumbs: [
        { name: 'Home', url: 'https://calculhub.in' },
        { name: 'Blog', url: 'https://calculhub.in/blog' }
      ]
    });
  }

  @HostListener('window:scroll', [])
  public onWindowScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Handle Infinite Scroll detection
    if (this.isInfiniteScroll()) {
      const threshold = 150;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const scrollPos = window.scrollY || document.documentElement.scrollTop;
      
      if (docHeight - (scrollPos + windowHeight) < threshold) {
        this.loadMore();
      }
    }

    // Handle TOC Highlight Spy
    if (!this.currentPost()) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    if (docHeight > 0) {
      this.readingProgress.set((scrollTop / docHeight) * 100);
    }

    const post = this.currentPost();
    if (post) {
      let currentActive = post.toc[0]?.id || 'introduction';
      
      for (const section of post.toc) {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            currentActive = section.id;
          }
        }
      }
      
      if (scrollTop + window.innerHeight >= document.documentElement.scrollHeight - 60) {
        currentActive = post.toc[post.toc.length - 1]?.id || currentActive;
      }

      this.activeSection.set(currentActive);
    }
  }

  public scrollToSection(event: Event, id: string): void {
    event.preventDefault();
    if (!isPlatformBrowser(this.platformId)) return;
    const element = document.getElementById(id);
    if (element) {
      this.activeSection.set(id);
      const yOffset = -110;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }
}
