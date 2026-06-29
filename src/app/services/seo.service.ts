import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';

export interface SeoData {
  title: string;
  description: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  schema?: object[];
  breadcrumbs?: Array<{ name: string; url: string }>;
  keywords?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private meta = inject(Meta);
  private titleService = inject(Title);
  private router = inject(Router);
  private document = inject(DOCUMENT);
  private readonly MAX_TITLE_CHARS = 70;

  readonly baseUrl = 'https://www.calculhub.in';
  readonly siteName = 'CalculHub';

  init(): void {
    this.updateForCurrentRoute();

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        this.updateForCurrentRoute();
      });
  }

  private updateForCurrentRoute(): void {
    let route = this.router.routerState.snapshot.root;
    while (route.firstChild) {
      route = route.firstChild;
    }
    const data = route.data as SeoData;
    if (data?.title) {
      this.updateSeo(data);
    }
  }

  updateSeo(data: SeoData): void {
    const fullTitle = data.title.includes(this.siteName)
      ? data.title
      : `${data.title} | ${this.siteName}`;
    const canonical = data.canonical || this.baseUrl + this.router.url;

    // Title: ensure it doesn't exceed the visual/pixel budget by clamping length
    const separator = ` | ${this.siteName}`;
    let displayTitle = fullTitle;
    if (fullTitle.endsWith(separator)) {
      const base = fullTitle.slice(0, -separator.length);
      const maxBaseLen = this.MAX_TITLE_CHARS - separator.length;
      if (maxBaseLen < 20) {
        displayTitle = this.siteName;
      } else if (base.length > maxBaseLen) {
        displayTitle = base.slice(0, Math.max(0, maxBaseLen - 3)).trim() + '...' + separator;
      }
    } else if (displayTitle.length > this.MAX_TITLE_CHARS) {
      displayTitle = displayTitle.slice(0, Math.max(0, this.MAX_TITLE_CHARS - 3)).trim() + '...';
    }

    // Title
    this.titleService.setTitle(displayTitle);

    // Meta description
    this.meta.updateTag({ name: 'description', content: data.description });

    // Keywords
    if (data.keywords) {
      this.meta.updateTag({ name: 'keywords', content: data.keywords });
    } else {
      this.meta.removeTag("name='keywords'");
    }

    // Article Freshness Signals
    if (data.publishedTime) {
      this.meta.updateTag({ property: 'article:published_time', content: data.publishedTime });
    } else {
      this.meta.removeTag("property='article:published_time'");
    }
    if (data.modifiedTime) {
      this.meta.updateTag({ property: 'article:modified_time', content: data.modifiedTime });
    } else {
      this.meta.removeTag("property='article:modified_time'");
    }

    // Canonical
    this.setCanonical(canonical);

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: data.ogTitle || fullTitle });
    this.meta.updateTag({ property: 'og:description', content: data.ogDescription || data.description });
    this.meta.updateTag({ property: 'og:url', content: canonical });
    this.meta.updateTag({ property: 'og:site_name', content: this.siteName });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:locale', content: 'en_IN' });
    const ogImage = data.ogImage || `${this.baseUrl}/og-image.png`;
    this.meta.updateTag({ property: 'og:image', content: ogImage });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });

    // Twitter Card
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: data.ogTitle || fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: data.ogDescription || data.description });
    this.meta.updateTag({ name: 'twitter:image', content: ogImage });

    // JSON-LD Schemas
    this.clearSchemas();
    if (data.schema) {
      data.schema.forEach((s) => this.injectSchema(s));
    }

    // Breadcrumb Schema
    if (data.breadcrumbs && data.breadcrumbs.length > 0) {
      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: data.breadcrumbs.map((bc, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: bc.name,
          item: bc.url,
        })),
      };
      this.injectSchema(breadcrumbSchema);
    }
  }

  private setCanonical(url: string): void {
    const head = this.document.head;
    let link: HTMLLinkElement | null = head.querySelector('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private clearSchemas(): void {
    const schemas = this.document.head.querySelectorAll('script[type="application/ld+json"][data-dynamic="true"]');
    schemas.forEach((s) => s.remove());
  }

  private injectSchema(schema: object): void {
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-dynamic', 'true');
    script.text = JSON.stringify(schema);
    this.document.head.appendChild(script);
  }
}
