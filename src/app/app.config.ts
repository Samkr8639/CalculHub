import { ApplicationConfig, isDevMode, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideServiceWorker } from '@angular/service-worker';
import { Banknote, ChartLine, ChartNoAxesColumnIncreasing, ChartNoAxesCombined, HeartPulse, LucideAngularModule, Star, Flame, Search, ArrowRight, Home } from 'lucide-angular';
import {
  House, TrendingUp, Receipt, PiggyBank, BarChart3, Landmark, Vault,
  FileText, BadgeCheck, Building, Percent, Calculator, SquareFunction,
  Grid2x2, Sigma, Activity, Bike, GraduationCap, Calendar,
  Facebook, Twitter, Linkedin, Instagram, Github,
  ChevronDown, ChevronRight, Heart, Scale, Target, User, Info, Map,
  Coins, Bitcoin, Gem, Menu, X, Cpu,
} from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(withEventReplay()),
    provideHttpClient(),
    provideAnimationsAsync(),
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
      Coins, Bitcoin, Gem, ChartNoAxesColumnIncreasing, ChartLine, Banknote, HeartPulse, Star, ChartNoAxesCombined, Menu, X,
      Flame, Search, ArrowRight, Home, Cpu
    }))
  ]
};
