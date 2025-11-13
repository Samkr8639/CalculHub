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

### Previous Change: Implementing SIP Calculator

#### Plan
The goal was to implement a SIP Calculator with identical CSS and functionality to the existing GST Calculator. This involved creating new component files and integrating them into the application.

#### Steps
1.  **Create `sip-calculator.component.ts`:** Created the TypeScript file for the SIP Calculator component, including signals for inputs and outputs, and the calculation logic.
2.  **Create `sip-calculator.component.html`:** Created the HTML template for the SIP Calculator, replicating the layout and input structure of the GST Calculator.
3.  **Create `sip-calculator.component.css`:** Copied the CSS from `gst-calculator.component.css` to ensure consistent styling.
4.  **Integrate into `app.routes.ts`:** Added a new route to enable navigation to the SIP Calculator.

### Previous Change: Add Slider to Financial Section and Fix Card Height

#### Plan
The goal was to enhance the user experience by adding an auto-sliding carousel for the financial calculators on the home page and to fix the alignment of the buttons on the cards.

#### Steps
1.  **Install Swiper Library:** Installed the `swiper` library.
2.  **Configure Swiper:** Imported and registered the `swiper/element/bundle` in `main.ts`.
3.  **Implement Slider:** Wrapped the financial calculator cards in a `<swiper-container>`.
4.  **Enable Custom Elements:** Added `CUSTOM_ELEMENTS_SCHEMA` to `home.component.ts`.
5.  **Fix Uneven Card Height:** Added CSS to ensure all cards in the slider have the same height and that the buttons are aligned at the bottom.

### Current Change: Improve Slider Responsiveness and Controls

#### Plan
The goal is to make the financial calculator slider more responsive and user-friendly by adding navigation controls, pagination, and breakpoints for different screen sizes.

#### Steps
1.  **Enable Navigation and Pagination:** Added `navigation="true"` and `pagination="true"` to the `<swiper-container>` in `home.component.html`.
2.  **Implement Responsive Breakpoints:** In `home.component.ts`, used the `ngAfterViewInit` lifecycle hook to programmatically set the `slidesPerView` and `spaceBetween` based on the screen width. This makes the slider show 1 card on small screens, 2 on medium, and 3 on large screens.
3.  **Style Navigation and Pagination:** In `home.component.css`, added the `--swiper-theme-color` CSS variable to style the navigation arrows and pagination dots to match the application's red and black theme.
