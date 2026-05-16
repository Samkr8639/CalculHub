# 🧮 CalculHub

<img width="3418" height="1980" alt="image" src="https://github.com/user-attachments/assets/fa39bb0b-5c31-4c74-b23a-52a890f23404" />


CalculHub is a premium, all-in-one suite of advanced calculators and mathematical tools designed for accuracy, speed, and a sleek user experience. Built with the latest **Angular v20+** paradigms, it leverages reactive **Signals**, **Standalone Components**, high-performance **Change Detection**, and **Server-Side Rendering (SSR)** to provide a seamless, SEO-optimized interactive dashboard.

Live: [calcul-hub.vercel.app](https://calcul-hub.vercel.app)

---

## ✨ Features

- **📊 Dynamic Visualizations**: Real-time charts and progress tracking using `Chart.js`.
- **🏥 Health & Fitness Suite**: includes BMI, Body Fat, Ideal Weight, and BMR/TDEE calculators with logic-based recommendations.
- **💰 Financial Tools**: Advanced calculators for interest, loans, and investment planning.
- **📐 Mathematical Precision**: Powered by `math.js`, `nerdamer`, and `algebra.js` for complex symbolic and numerical computations.
- **🎨 Premium UI/UX**: A state-of-the-art dark-mode aesthetic with smooth animations driven by **GSAP** and interactive elements powered by **Swiper**.
- **📱 Fully Responsive**: Optimized for every screen size, from mobile phones to high-resolution desktops.
- **🔍 SEO Optimized**: Server-side rendering (SSR), dynamic meta tags, JSON-LD structured data, and content sections optimized for search engine bots.

## 🚀 Tech Stack

- **Framework**: Angular v20+ (Standalone Components, Signals, Native Control Flow, SSR)
- **Styling**: Modern CSS with CSS Variables & Glassmorphism effects
- **Icons**: Lucide Angular
- **Animations**: GSAP (GreenSock Animation Platform)
- **Charts**: Chart.js
- **Mathematical Engines**: Mathjs, Nerdamer, Algebra.js
- **Slider/Layout**: Swiper.js

## 🛠️ Development

### Prerequisites
- Node.js (Latest LTS)
- Angular CLI

### Installation
```bash
git clone https://github.com/Samkr8639/CalculHub.git
cd CalculHub
npm install
```

### Running Locally
```bash
npm start          # ng serve
npm run build      # ng build (SSR-enabled)
```

---

## SEO & Technical Setup

### ✅ Implemented

| Part | Feature | Status |
|------|---------|--------|
| 1 | Angular SSR (Server-Side Rendering) | ✅ Done |
| 3 | Unique title + meta description per page | ✅ Done |
| 4 | `/sitemap.xml` in `/public` | ✅ Done |
| 5 | `/robots.txt` in `/public` (all crawlers allowed) | ✅ Done |
| 6 | Canonical tags via SeoService | ✅ Done |
| 7 | Open Graph + Twitter Card meta tags | ✅ Done |
| 8 | JSON-LD structured data (WebApplication, FAQPage, BreadcrumbList) | ✅ Done |
| 9 | Content sections on calculator pages | ✅ Done |
| 10 | Home page with H1, calculator grid, about section | ✅ Done |
| 13 | AI crawlers (GPTBot, ClaudeBot, PerplexityBot) allowed in robots.txt | ✅ Done |
| 13 | HTML sitemap at `/sitemap` for AI crawlers | ✅ Done |
| 14 | Internal linking via SEO nav and related links | ✅ Done |

---

## Part 2 — Custom Domain Setup (Manual)

1. Purchase a domain: `calculhub.com`, `calculhub.in`, or `thecalculhub.com`
2. Go to **Vercel Dashboard → Project → Settings → Domains**
3. Add your custom domain and follow the DNS configuration steps
4. Update `BASE_URL` in `src/app/app.routes.ts` from `calcul-hub.vercel.app` to your new domain
5. Update `src/index.html` canonical and OG URL defaults
6. Update `public/sitemap.xml` URLs
7. Update `public/robots.txt` sitemap URL
8. To 301-redirect from `calcul-hub.vercel.app` → `calculhub.com`, add to `vercel.json`:
   ```json
   "redirects": [
     {
       "source": "/:path*",
       "has": [{ "type": "host", "value": "calcul-hub.vercel.app" }],
       "destination": "https://calculhub.com/:path*",
       "permanent": true
     }
   ]
   ```

---

## Part 12 — Google Search Console Setup (Manual)

1. Go to **https://search.google.com/search-console**
2. Click **Add property** → enter your domain (e.g. `calculhub.com`)
3. Verify ownership using **HTML tag method**:
   - Copy the meta tag Google gives you (e.g. `<meta name="google-site-verification" content="YOUR_CODE">`)
   - Add it to `src/index.html` inside `<head>`
   - Deploy and click **Verify** in Search Console
4. Once verified:
   - Go to **Sitemaps** → Submit → enter `sitemap.xml` → Submit
   - Go to **URL Inspection** → paste homepage URL → **Request Indexing**
   - Do the same for your 5 most important calculator pages
5. Check back in **48–72 hours** for indexing status

### Bing Webmaster Tools

1. Go to **https://www.bing.com/webmasters**
2. Add your site and verify via XML file or meta tag
3. Submit sitemap: `https://your-domain.com/sitemap.xml`

---

## Architecture

- **Framework**: Angular 21 with SSR (`@angular/ssr`)
- **Rendering**: Prerendered static HTML for all calculator routes
- **SEO**: `SeoService` dynamically sets title, meta, canonical, OG, and JSON-LD per route
- **Icons**: `lucide-angular@0.567.0`
- **Charts**: Chart.js
- **Animations**: GSAP

## Calculator Routes

| Category | Calculators |
|----------|------------|
| Financial | Mortgage, Compound Interest, GST, SIP, FD, Income Tax, Mutual Fund, PPF, Loan Eligibility, Home Loan EMI, Retirement, Investment, Bike Loan EMI, Education Loan EMI |
| Mathematical | Percentage, Scientific, Algebra, Matrix, Statistics |
| Health | Calorie/TDEE, BMI, Body Fat, Ideal Weight |

## 📄 License
MIT License - Developed with ❤️ by [Sameer Kumar](https://github.com/Samkr8639)
