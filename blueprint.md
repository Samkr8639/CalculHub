# Project Blueprint: CalculHub

## Overview

CalculHub is a comprehensive online calculator application designed to provide a wide array of precise, beautifully designed, and intuitive tools for students, professionals, and curious minds. Our mission is to empower users with clarity for informed decisions across various domains, including finance, mathematics, health, and more. The application leverages modern Angular features like standalone components, signals for reactive state management, and native control flow for optimal performance and maintainability.

## Project Outline

### Initial Version Features (Existing)

*   **Core Application Structure:**
    *   Standalone `AppComponent` serving as the root, integrating `HeaderComponent`, `FooterComponent`, and `RouterOutlet`.
    *   Global styling defined in `src/styles.css` using CSS variables for a consistent theme.
    *   Responsive design adhering to modern web standards.
*   **Theming:**
    *   `ThemeService` using Angular signals to manage dark/light mode preference.
    *   Theme preference persisted in `localStorage` and automatically detected from system settings.
*   **Navigation & Routing:**
    *   `app.routes.ts` defines lazy-loaded routes for various calculator categories (financial, mathematical, health, other) and static routes for `HomeComponent`, `AboutComponent`, and `BlogComponent`.
*   **Animations:**
    *   GSAP used for subtle entrance animation on the `body` element.
*   **Dependency Management:**
    *   `package.json` outlines project dependencies.
    *   `Chart.js` is available for interactive charts and visualizations.
*   **Build & Deployment:**
    *   `angular.json` configures the Angular application build process.
*   **Accessibility:**
    *   Basic accessibility considerations for semantic HTML and interactive elements.
*   **Mortgage Calculator:**
    *   Functional mortgage payment and amortization schedule calculation.
    *   Interactive number inputs and synchronized sliders for loan amount, interest rate, and loan term.
    *   Amortization chart using Chart.js.
    *   Loan term unit selection (Years/Months).
*   **Side Panel Navigation:**
    *   A reusable `SidePanelComponent` displaying a categorized list of all calculators.
    *   Integrated into `FinancialComponent` for seamless navigation between calculators.
    *   Active link highlighting.
    *   Paycheck calculator icon updated to wallet SVG.

## Current Requested Change: Fix Side Panel and Content Scrolling

### Plan Overview

The goal is to modify the layout of the calculator pages to ensure the side panel remains fixed in position while the main calculator content area is independently scrollable. This provides a more consistent navigation experience.

### Detailed Outline for Fixed Side Panel

*   **Layout Structure:** The `financial-page-container` will serve as the main flex container, occupying the full height of the viewport (minus the header). It will prevent overall page scrolling.
*   **Side Panel:** The `SidePanelComponent` will occupy a fixed width and its content will be scrollable if it exceeds its height. It will be positioned to stay in view.
*   **Calculator Content:** The `financial-calculator-content` area will take up the remaining horizontal space and will be independently scrollable, allowing users to view all calculator details without affecting the side panel.

### Plan and Steps for Current Change

1.  **Update `blueprint.md`:** (Already done)
2.  **Modify `src/app/financial/financial.component.css`:**
    *   Update `.financial-page-container` to set `height: calc(100vh - 68px);` (assuming 68px is header height) and `overflow: hidden;`.
    *   Update `.side-panel` (or ensure its existing styles support) `height: 100%;` and `overflow-y: auto;`.
    *   Update `.financial-calculator-content` to set `height: 100%;` and `overflow-y: auto;`.
3.  **Run `ng build`:** After implementing the changes, I will run `ng build` to check for compilation errors.
