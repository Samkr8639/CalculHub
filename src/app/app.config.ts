import { ApplicationConfig, isDevMode, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideServiceWorker } from '@angular/service-worker';
import { LucideAngularModule } from 'lucide-angular';
import {
  House, TrendingUp, Receipt, PiggyBank, ChartBar, Landmark, Vault,
  FileText, BadgeCheck, Building, Percent, Calculator, SquareFunction,
  Grid2x2, Sigma, Activity, Bike, GraduationCap, Calendar,
  Facebook, Twitter, Linkedin, Instagram,
  ChevronDown, ChevronRight, Heart, Scale, Target, User,
} from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    importProvidersFrom(LucideAngularModule.pick({
      House, TrendingUp, Receipt, PiggyBank, ChartBar, Landmark, Vault,
      FileText, BadgeCheck, Building, Percent, Calculator, SquareFunction,
      Grid2x2, Sigma, Activity, Bike, GraduationCap, Calendar,
      Facebook, Twitter, Linkedin, Instagram,
      ChevronDown, ChevronRight, Heart, Scale, Target, User,
    })),
  ]
};
