import { ApplicationConfig, isDevMode, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideServiceWorker } from '@angular/service-worker';
import { LucideAngularModule } from 'lucide-angular';
import {
  House, TrendingUp, Receipt, PiggyBank, BarChart3, Landmark, Vault,
  FileText, BadgeCheck, Building, Percent, Calculator, SquareFunction,
  Grid2x2, Sigma, Activity, Bike, GraduationCap, Calendar,
  Facebook, Twitter, Linkedin, Instagram, Github,
  ChevronDown, ChevronRight, Heart, Scale, Target, User, Info, Map,
} from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    importProvidersFrom(LucideAngularModule.pick({
      House, TrendingUp, Receipt, PiggyBank, BarChart3, Landmark, Vault,
      FileText, BadgeCheck, Building, Percent, Calculator, SquareFunction,
      Grid2x2, Sigma, Activity, Bike, GraduationCap, Calendar,
      Facebook, Twitter, Linkedin, Instagram, Github,
      ChevronDown, ChevronRight, Heart, Scale, Target, User, Info, Map,
    })),
  ]
};
