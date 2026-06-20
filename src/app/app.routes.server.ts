import { RenderMode, ServerRoute } from '@angular/ssr';
import { BLOG_POSTS } from './blog/blog-posts.data';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'blog/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      return BLOG_POSTS.map(post => ({ slug: post.slug }));
    }
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
