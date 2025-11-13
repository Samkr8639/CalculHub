# Project Blueprint

## Overview
This project is an Angular application that provides various financial calculators. It aims to offer a visually appealing, interactive, and cutting-edge user experience by leveraging the latest Angular features, including signals, standalone components, and new control flow.

## Project Outline

### Initial Version
- **Styling:** Modern, dark-themed UI with a focus on good readability and interactive elements.
- **Components:**
    - `AppComponent`: Main application shell.
    - `HeaderComponent`: Application header with navigation.
    - `FooterComponent`: Application footer.
    - `NavigationComponent`: Handles primary navigation.
    - `SidePanelComponent`: Placeholder for future sidebar functionality.
    - `HomeComponent`: Landing page.
    - `AboutComponent`: About page.
    - `BlogComponent`: Blog page.
    - `FinancialComponent`: Parent component for financial calculators.
    - `HealthComponent`: Parent component for health calculators.
    - `MathematicalComponent`: Parent component for mathematical calculators.
    - `OtherComponent`: Parent component for other calculators.
    - `CompoundInterestCalculatorComponent`: Calculates compound interest.
    - `GstCalculatorComponent`: Calculates GST.
    - `MortgageCalculatorComponent`: Calculates mortgage details.
- **Features:**
    - Routing for different calculator categories and informational pages.
    - Interactive input fields with sliders for various financial parameters.
    - Dynamic calculation results displayed in a clear summary.
    - Chart.js integration for visual representation of calculation outcomes.
    - Responsive design for mobile and web.
- **Best Practices:**
    - All components are standalone.
    - `ChangeDetectionStrategy.OnPush` is used for all components.
    - Native Angular control flow (`@if`, `@for`, `@switch`) is implemented.
    - Signals are used for state management.
    - `inject()` is used for dependency injection.

### Current Change: Implementing SIP Calculator

#### Plan
The goal is to implement a SIP Calculator with identical CSS and functionality to the existing GST Calculator. This will involve creating new component files and integrating them into the application.

#### Steps
1.  **Create `sip-calculator.component.ts`:** Create the TypeScript file for the SIP Calculator component, including signals for inputs (Monthly Investment, Annual Return Rate, Investment Tenure) and outputs (Maturity Amount, Total Invested, Estimated Gains), along with the `calculateSip` logic based on the provided formula.
2.  **Create `sip-calculator.component.html`:** Create the HTML template for the SIP Calculator, replicating the layout and input structure of the GST Calculator, including sliders and a chart canvas.
3.  **Create `sip-calculator.component.css`:** Copy the CSS from `gst-calculator.component.css` to ensure consistent styling.
4.  **Integrate into `app.routes.ts`:** Add a new route to enable navigation to the SIP Calculator.
