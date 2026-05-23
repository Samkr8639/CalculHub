# CalculHub — Full SEO & Technical Improvement Prompt


---

## CONTEXT

You are working on a web project called **CalculHub** — a multi-calculator web application currently hosted at `calcul-hub.vercel.app`. The site is built as a client-side JavaScript SPA (Single Page Application). It currently has a very low SEO score (~36/100) because crawlers (Google, Bing, ChatGPT, Perplexity) see a nearly empty HTML page with no real content.

Your job is to implement ALL of the following SEO and technical improvements across the entire codebase. Do not skip any section. Work through them in order.

---

## PART 1 — FRAMEWORK MIGRATION (Server-Side Rendering)

**Problem:** The site is a pure client-side SPA. When Googlebot fetches any page, it receives only `<title>CalculHub</title>` with no body content. This makes every page unindexable.

**Task:** Migrate the project to **Next.js** (if currently React) or **Nuxt 3** (if currently Vue). Every calculator page must render its full HTML content on the server before sending it to the browser.

Instructions:
- Run `npx create-next-app@latest` (or convert the existing project) and move all calculator components into the `app/` or `pages/` directory using the appropriate framework conventions.
- Each calculator must be its own route. Examples:
  - `/calculators/bmi-calculator`
  - `/calculators/emi-calculator`
  - `/calculators/age-calculator`
  - `/calculators/percentage-calculator`
  - `/calculators/gst-calculator`
  - (and so on for every calculator on the site)
- Use `generateStaticParams` (Next.js App Router) or `getStaticProps` (Pages Router) for static generation where possible. Use SSR (`getServerSideProps`) only for pages that truly need live data.
- The homepage (`/`) must also be server-rendered and must contain a visible list of all available calculators as real HTML anchor tags — not JavaScript-rendered links.
- After migration, verify by running `curl https://your-domain.com/calculators/bmi-calculator` and confirming that actual calculator content is present in the raw HTML response.

---

## PART 2 — CUSTOM DOMAIN SETUP

**Problem:** `calcul-hub.vercel.app` is a shared subdomain with zero domain authority. Google treats it as one of thousands of hobby projects.

**Task:** Configure a custom domain.

Instructions:
- Purchase a domain such as `calculhub.com`, `calculhub.in`, or `thecalculhub.com`.
- In the Vercel dashboard → Project Settings → Domains, add the custom domain.
- Update all internal references, canonical tags, sitemap URLs, and Open Graph URLs to use the new domain.
- Set up a redirect so `calcul-hub.vercel.app` permanently redirects (301) to the new custom domain.
- In `next.config.js`, add:
```js
async redirects() {
  return [
    {
      source: '/:path*',
      has: [{ type: 'host', value: 'calcul-hub.vercel.app' }],
      destination: 'https://calculhub.com/:path*',
      permanent: true,
    },
  ];
},
```

---

## PART 3 — METADATA: TITLE TAGS & META DESCRIPTIONS

**Problem:** Every page currently has the same generic title "CalculHub" and no meta description at all.

**Task:** Add unique, keyword-optimized `<title>` and `<meta name="description">` to every single page.

Instructions:

For Next.js App Router, use the `metadata` export in each `page.tsx`:

```tsx
// app/calculators/bmi-calculator/page.tsx
export const metadata = {
  title: 'BMI Calculator — Check Your Body Mass Index Free | CalculHub',
  description: 'Calculate your Body Mass Index instantly. Enter your height and weight to get your BMI score, category (underweight/normal/overweight/obese), and health tips. Free, no signup.',
};
```

Follow this title pattern for every calculator page:
`[Calculator Name] — [What it does in plain English] | CalculHub`

Examples:
- `EMI Calculator — Calculate Loan EMI for Home, Car & Personal Loans | CalculHub`
- `Age Calculator — Find Your Exact Age in Years, Months & Days | CalculHub`
- `GST Calculator — Calculate GST Amount & Net Price Instantly | CalculHub`
- `Percentage Calculator — Find Percentage of Any Number | CalculHub`
- `SIP Calculator — Calculate SIP Returns & Maturity Amount | CalculHub`

Meta description rules:
- Length: 140–160 characters
- Must include the primary keyword naturally
- Must describe what the user can do, not just what the page is
- Must not be duplicated across pages

For the homepage:
```tsx
export const metadata = {
  title: 'CalculHub — Free Online Calculators for Finance, Health, Math & More',
  description: 'CalculHub offers 20+ free online calculators — BMI, EMI, age, GST, SIP, percentage and more. Fast, accurate, mobile-friendly. No login needed.',
};
```

---

## PART 4 — SITEMAP.XML

**Problem:** No sitemap exists. Google cannot discover or systematically crawl all calculator pages.

**Task:** Auto-generate a dynamic sitemap.

For Next.js App Router, create `app/sitemap.ts`:

```ts
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://calculhub.com';

  const calculators = [
    'bmi-calculator',
    'emi-calculator',
    'age-calculator',
    'percentage-calculator',
    'gst-calculator',
    'sip-calculator',
    'compound-interest-calculator',
    'simple-interest-calculator',
    // Add every calculator slug here
  ];

  const calculatorUrls = calculators.map((slug) => ({
    url: `${baseUrl}/calculators/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    ...calculatorUrls,
  ];
}
```

After deploying, verify the sitemap is accessible at `https://calculhub.com/sitemap.xml`.
Then submit it in **Google Search Console**: Sitemaps → Add new sitemap → enter `sitemap.xml` → Submit.
Also submit in **Bing Webmaster Tools**.

---

## PART 5 — ROBOTS.TXT

**Problem:** No robots.txt file exists. Crawlers are uncertain about what they can index, and AI crawlers (GPTBot, PerplexityBot) may be unintentionally blocked.

**Task:** Create `app/robots.ts` in Next.js App Router:

```ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
      },
    ],
    sitemap: 'https://calculhub.com/sitemap.xml',
  };
}
```

Important: Do NOT disallow any calculator pages. The goal is maximum crawlability.

---

## PART 6 — CANONICAL TAGS

**Problem:** No canonical tags exist. If the same calculator content is accessible at multiple URLs (e.g., with/without trailing slash, query params), Google will get confused and split ranking signals.

**Task:** Add `alternates.canonical` to every page's metadata:

```tsx
export const metadata = {
  title: 'BMI Calculator — Check Your Body Mass Index Free | CalculHub',
  description: '...',
  alternates: {
    canonical: 'https://calculhub.com/calculators/bmi-calculator',
  },
};
```

For the homepage:
```tsx
alternates: {
  canonical: 'https://calculhub.com',
},
```

---

## PART 7 — OPEN GRAPH & SOCIAL META TAGS

**Problem:** No Open Graph tags. When links are shared on WhatsApp, LinkedIn, Twitter/X, or Facebook, no preview card appears, dramatically reducing click-through rates.

**Task:** Add OG tags to every page's metadata:

```tsx
export const metadata = {
  title: 'BMI Calculator — Check Your Body Mass Index Free | CalculHub',
  description: 'Calculate your BMI instantly...',
  alternates: { canonical: 'https://calculhub.com/calculators/bmi-calculator' },
  openGraph: {
    title: 'BMI Calculator — CalculHub',
    description: 'Calculate your Body Mass Index instantly. Free, no signup.',
    url: 'https://calculhub.com/calculators/bmi-calculator',
    siteName: 'CalculHub',
    images: [
      {
        url: 'https://calculhub.com/og/bmi-calculator.png',
        width: 1200,
        height: 630,
        alt: 'BMI Calculator on CalculHub',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BMI Calculator — CalculHub',
    description: 'Calculate your BMI instantly. Free.',
    images: ['https://calculhub.com/og/bmi-calculator.png'],
  },
};
```

Create a simple OG image for each calculator. Use a consistent template: branded background, calculator name in large text, CalculHub logo. Size: 1200×630px. Place in `/public/og/[calculator-name].png`.

---

## PART 8 — STRUCTURED DATA (SCHEMA MARKUP)

**Problem:** No JSON-LD schema markup exists. This means Google doesn't understand the nature of each page and won't display rich results (star ratings, descriptions in search, featured snippets).

**Task:** Add JSON-LD structured data to every calculator page. Add it as a `<script>` tag in the page component itself (not in metadata).

Use `WebApplication` schema for each calculator page:

```tsx
// In the page component JSX
export default function BMICalculatorPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'BMI Calculator',
    url: 'https://calculhub.com/calculators/bmi-calculator',
    description: 'Free online BMI calculator. Enter your height and weight to instantly find your Body Mass Index and health category.',
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    featureList: 'Calculate BMI, Show BMI category, Support metric and imperial units',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {/* rest of your calculator UI */}
    </>
  );
}
```

Also add `FAQPage` schema to each calculator page with 3–5 common questions users ask about that calculator. Example for BMI:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is a healthy BMI range?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A BMI between 18.5 and 24.9 is considered healthy for adults. Below 18.5 is underweight, 25–29.9 is overweight, and 30 or above is obese."
      }
    },
    {
      "@type": "Question",
      "name": "How is BMI calculated?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "BMI is calculated by dividing your weight in kilograms by the square of your height in meters: BMI = weight(kg) / height(m)²."
      }
    }
  ]
}
```

Also add `BreadcrumbList` schema to every page:

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://calculhub.com" },
    { "@type": "ListItem", "position": 2, "name": "Calculators", "item": "https://calculhub.com/calculators" },
    { "@type": "ListItem", "position": 3, "name": "BMI Calculator", "item": "https://calculhub.com/calculators/bmi-calculator" }
  ]
}
```

---

## PART 9 — CONTENT ON EACH CALCULATOR PAGE

**Problem:** Calculator pages likely have no text content beyond the calculator widget itself. Google needs substantive written content to understand what the page is about and to rank it.

**Task:** Below each calculator widget, add the following static HTML content sections. This content must be server-rendered (part of the SSR HTML), not loaded lazily:

1. **What is [Calculator Name]?** — A 3–5 sentence plain-language explanation of what the calculator does and who it's for.

2. **How to use this calculator** — A numbered list (3–6 steps) explaining how to fill in the fields and interpret results.

3. **Formula used** — Show the actual formula in plain text and explain each variable. Example for BMI:
   > Formula: BMI = Weight (kg) ÷ Height (m)²
   > Where weight is in kilograms and height is in metres.

4. **FAQ section** — 4–6 questions and answers that real users search for. These should match the FAQ schema you added in Part 8.

5. **Related calculators** — A row of 3–4 links to related calculators on the site. Use real `<a href>` tags, not JavaScript navigation.

All content must be unique per page. Do not copy-paste the same text across pages.

---

## PART 10 — HOMEPAGE CONTENT

**Problem:** The homepage likely has minimal content visible to crawlers.

**Task:** The homepage must include the following server-rendered content:

1. **H1 heading** — e.g., `Free Online Calculators — Finance, Health, Math & More`
2. **Short intro paragraph** — 2–3 sentences describing what CalculHub is and who it helps.
3. **Calculator grid** — All calculators listed as real HTML links (`<a href="/calculators/bmi-calculator">BMI Calculator</a>`), grouped by category (Finance, Health, Math, Everyday).
4. **Category descriptions** — A brief 1–2 sentence description under each category heading.
5. **About section** — A short paragraph (4–6 sentences) explaining what CalculHub is, who built it, and why it's trustworthy. This is important for AI tools (ChatGPT, Perplexity) which read "About" content to understand a site.

---

## PART 11 — PAGE SPEED & CORE WEB VITALS

**Task:** Implement the following performance improvements:

- Add `loading="lazy"` to all images that are not above the fold.
- Add `width` and `height` attributes to every `<img>` tag to prevent layout shift (CLS).
- Use `next/image` for all images — it handles WebP conversion, responsive sizes, and lazy loading automatically.
- Ensure fonts are loaded with `font-display: swap` to prevent invisible text during load (FOIT).
- Do not import large libraries (like lodash, moment.js) — use only what you need or use lighter alternatives (date-fns instead of moment.js).
- Run `next build` and check the bundle size. Any route over 200KB (gzipped) should be code-split.
- Add `<link rel="preconnect">` tags in the `<head>` for any third-party domains you fetch from.

---

## PART 12 — GOOGLE SEARCH CONSOLE SETUP (MANUAL STEP — DOCUMENT IN README)

Add the following instructions to the project README so the site owner can do this manually:

```
## Search Console Setup

1. Go to https://search.google.com/search-console
2. Click "Add property" → enter your domain (e.g. calculhub.com)
3. Verify ownership using the HTML tag method:
   - Copy the meta tag Google gives you
   - Add it to your root layout.tsx: export const metadata = { verification: { google: 'YOUR_CODE_HERE' } }
   - Deploy and click Verify in Search Console
4. Once verified:
   - Go to Sitemaps → Submit → enter: sitemap.xml
   - Go to URL Inspection → paste your homepage URL → Request Indexing
   - Do the same for your 5 most important calculator pages
5. Check back in 48–72 hours for indexing status
```

---

## PART 13 — AI SEARCH VISIBILITY (ChatGPT, Perplexity, Gemini)

**Task:** Do the following to maximize visibility in AI-powered search engines:

1. **Do NOT block AI crawlers** — Ensure robots.txt (Part 5) explicitly allows GPTBot, PerplexityBot, ClaudeBot.

2. **Add a clear About page** at `/about` with the following content:
   - What CalculHub is (a free calculator hub)
   - Who built it and why
   - What types of calculators are available
   - A trust statement (e.g., "All formulas are based on standard mathematical and financial formulas")
   - Contact information or a contact form link

3. **Add a `/sitemap` HTML page** (different from sitemap.xml) — a human-readable page listing all calculators with their descriptions. AI crawlers read this to understand site structure.

4. **Use clear, factual language** in all content. Avoid marketing fluff. AI tools prefer precise, reference-style content.

5. **Add `<meta name="description">` that reads like a dictionary definition** for each calculator. Example: "A BMI calculator is a tool that computes Body Mass Index from a person's height and weight using the formula weight(kg)/height(m)²."

---

## PART 14 — INTERNAL LINKING

**Problem:** Without internal links, Google's crawler has difficulty discovering all pages, and PageRank doesn't flow between pages.

**Task:**

- Every calculator page must have a "Related calculators" section at the bottom with 3–5 links to other calculators on the site.
- The homepage must link to every calculator page using descriptive anchor text (not "click here" — use the actual calculator name).
- Add a breadcrumb navigation component at the top of every calculator page: `Home > Calculators > BMI Calculator`. Each breadcrumb item must be a real `<a href>` link.
- Create a `/calculators` index page that lists every calculator with its name, a one-line description, and a link. This page should be linked from the site header/footer.

---

## FINAL CHECKLIST

After implementing all the above, verify the following before deploying:

- [ ] `curl https://calculhub.com/calculators/bmi-calculator` returns full HTML content (not just `<title>`)
- [ ] `https://calculhub.com/sitemap.xml` is accessible and lists all calculator URLs
- [ ] `https://calculhub.com/robots.txt` is accessible and does not block any crawlers
- [ ] Every page has a unique title tag (check in browser tab / view-source)
- [ ] Every page has a unique meta description (check in view-source)
- [ ] Every page has canonical tag pointing to its own URL
- [ ] JSON-LD schema is present on every calculator page (check with Google's Rich Results Test: https://search.google.com/test/rich-results)
- [ ] OG image appears when you paste a URL into https://opengraph.xyz
- [ ] Google Search Console property is set up and sitemap submitted
- [ ] Lighthouse SEO score (run in Chrome DevTools) is above 90 on every page
- [ ] No console errors related to missing meta tags or schema

---

*End of prompt. Implement all 14 parts completely. Ask for clarification if the current tech stack (React/Vue/other) needs to be confirmed before starting Part 1.*