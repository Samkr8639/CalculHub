import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, signal, computed, inject, HostListener, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { BLOG_POSTS, BlogPost } from './blog-posts.data';
import { SeoService } from '../services/seo.service';

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

  private routeSub?: Subscription;

  // Data signals
  public allPosts = signal<BlogPost[]>(BLOG_POSTS);
  public currentPost = signal<BlogPost | null>(null);

  // Filter signals
  public searchQuery = signal<string>('');
  public selectedCategory = signal<string>('All');
  public readingProgress = signal<number>(0);
  public activeSection = signal<string>('introduction');

  // Categories list
  public categories = computed(() => {
    const list = new Set(this.allPosts().map(p => p.category));
    return ['All', ...Array.from(list)];
  });

  // Filtered posts for grid display
  public filteredPosts = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const category = this.selectedCategory();
    
    return this.allPosts().filter(post => {
      const matchesCategory = category === 'All' || post.category === category;
      const matchesSearch = !query || 
        post.title.toLowerCase().includes(query) || 
        post.summary.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  });

  ngOnInit(): void {
    // Subscribe to dynamic slug parameter
    this.routeSub = this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        const post = this.allPosts().find(p => p.slug === slug);
        if (post) {
          this.currentPost.set(post);
          this.updatePostSeo(post);
          this.resetScroll();
        } else {
          // If post doesn't exist, redirect back to blog index
          this.router.navigate(['/blog']);
        }
      } else {
        this.currentPost.set(null);
        this.updateIndexSeo();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  private updatePostSeo(post: BlogPost): void {
    this.seoService.updateSeo({
      title: post.seo.title,
      description: post.seo.description,
      keywords: post.seo.keywords,
      canonical: `https://calculhub.in/blog/${post.slug}`,
      breadcrumbs: [
        { name: 'Home', url: 'https://calculhub.in' },
        { name: 'Blog', url: 'https://calculhub.in/blog' },
        { name: post.title, url: `https://calculhub.in/blog/${post.slug}` }
      ],
      schema: [
        {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          'headline': post.title,
          'description': post.summary,
          'image': post.heroImage,
          'datePublished': post.publishDate,
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
      ]
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

  private resetScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  public setCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  public onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  // Track scroll position for TOC highlight and Reading progress indicator
  @HostListener('window:scroll', [])
  public onWindowScroll(): void {
    if (!isPlatformBrowser(this.platformId) || !this.currentPost()) return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // 1. Reading progress
    if (docHeight > 0) {
      this.readingProgress.set((scrollTop / docHeight) * 100);
    }

    // 2. Active Section Spy
    const post = this.currentPost();
    if (post) {
      let currentActive = post.toc[0]?.id || 'introduction';
      
      for (const section of post.toc) {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If the section top is above or near the top of the viewport (with a 150px buffer)
          if (rect.top <= 150) {
            currentActive = section.id;
          }
        }
      }
      
      // Bottom of page edge case
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
      this.activeSection.set(id); // Instantly highlight on click
      const yOffset = -110; // offset account for headers and progress bar
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }
}
