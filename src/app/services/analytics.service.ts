import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { track } from '@vercel/analytics';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private platformId = inject(PLATFORM_ID);

  trackEvent(eventName: string, properties?: Record<string, string | number | boolean>) {
    if (isPlatformBrowser(this.platformId)) {
      try {
        track(eventName, properties);
        console.log(`[Analytics] Tracked event: ${eventName}`, properties);
      } catch (err) {
        console.error('[Analytics] Failed to track event:', err);
      }
    }
  }
}
