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

## Current Requested Change: Revert Page Scroll and Footer Height Changes

### Plan Overview

The goal is to revert the previous changes made to implement the "sticky footer" pattern. The `src/styles.css` file will be restored to its state before the modifications related to page scroll and footer positioning.

### Detailed Outline for Reverting Changes

*   **Revert Global HTML/Body Styling:** The `height: 100%` will be removed from `html, body`.
*   **Revert Flex Container for Body:** The `display: flex; flex-direction: column;` will be removed from `body`.
*   **Revert Expanding Main Content:** The `flex: 1;` will be removed from `main`.

### Plan and Steps for Current Change

1.  **Modify `src/styles.css`:** Reverted to its state before the sticky footer implementation.
2.  **Run `ng build`:** Verified that the changes compile without errors.
3.  **Update `blueprint.md`:** Documented the reversion of the sticky footer changes. (This step)
