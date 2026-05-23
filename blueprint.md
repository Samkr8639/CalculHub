# Blueprint: My Calculator Application

This document outlines the architecture, design, features, and development plans for the My Calculator application.

## 1. Overview

My Calculator is a modern, web-based application designed to provide users with a comprehensive suite of powerful and intuitive calculators. Built on Angular v20+, it leverages the latest framework features, including standalone components, signals for state management, and modern CSS for a responsive and visually appealing user experience.

The application is organized into logical categories (Financial, Mathematical, Health, etc.), with each calculator functioning as a self-contained feature. This modular architecture ensures scalability and ease of maintenance.

## 2. Style and Design Guide

The application adheres to a modern, dark-theme aesthetic, prioritizing clarity, ease of use, and visual appeal.

*   **Theme:** Dark mode with high-contrast text and vibrant accent colors.
*   **Primary Accent Color:** A bold red (`#e11931`) used for active states, buttons, and highlights.
*   **Typography:** Clean, sans-serif fonts for readability.
*   **Layout:** Responsive, component-based layout with clean spacing and a clear visual hierarchy.
*   **Interactivity:** Smooth animations and transitions provide a dynamic user experience. Buttons and interactive elements feature hover effects and shadows to create a sense of depth.

## 3. Existing Features

This section provides a definitive list of all calculators currently implemented in the application.

### Financial Calculators (`/financial`)

*   **Mortgage Calculator:** Calculates mortgage payments.
*   **Compound Interest Calculator:** Computes compound interest.
*   **GST Calculator:** Calculates Goods and Services Tax.
*   **SIP Calculator:** Models Systematic Investment Plans.
*   **FD Calculator:** Calculates returns on Fixed Deposits.
*   **Tax Calculator:** Computes income tax.
*   **Mutual Fund Calculator:** Estimates returns from mutual funds.
*   **PPF Calculator:** Calculates Public Provident Fund savings.
*   **Loan Eligibility Calculator:** Estimates loan eligibility.
*   **Home Loan EMI Calculator:** Calculates Equated Monthly Installments for home loans.
*   **Retirement Calculator:** Helps plan for retirement savings.
*   **Investment Calculator:** General-purpose investment calculator.
*   **Bike Loan EMI Calculator:** Calculates EMIs for bike loans.
*   **Education Loan EMI Calculator:** Calculates EMIs for education loans.

### Mathematical Calculators (`/mathematical`)

*   **Percentage Calculator:** Performs various percentage-based calculations.
*   **Scientific Calculator:** A full-featured scientific calculator.
*   **Algebra Calculator:** Solves equations and performs algebraic manipulations.
*   **Matrix Calculator:**
    *   **Description:** Performs a wide range of matrix operations, including addition, subtraction, multiplication, scalar multiplication, transpose, determinant, and inverse calculations.
    *   **Interface:** Users input matrix data into text areas, with rows separated by newlines and values separated by spaces or commas. The interface is styled with a premium dark theme, featuring responsive controls and a clear results display.
    *   **Functionality:** Includes a "Clear" button to reset all fields and robust error handling for invalid input.
*   **Statistics Calculator:** A tool for calculating fundamental and advanced statistical measures, including mean, median, mode, standard deviation, variance, 25th percentile (Q1), 75th percentile (Q3), and the interquartile range (IQR).

### Health & Fitness Calculators (`/health`)

*   **BMI Calculator:** Calculates Body Mass Index (BMI) with strict boundary validation (height 1-300cm, weight 1-600kg).
*   **BMR & TDEE Calculator:** Computes Basal Metabolic Rate and Total Daily Energy Expenditure using the Mifflin-St Jeor formula with gender, age, weight, and height bounds.
*   **Body Fat Calculator:** Calculates body fat percentage using the U.S. Navy Method, with strict safety checks on tape-measurement parameters.
*   **Calorie Calculator:** Estimates daily caloric maintenance and macro targets (protein, carbs, fats) across multiple formulas (Mifflin, Harris-Benedict, Katch-McArdle) with detailed inputs validation.
*   **Ideal Weight Calculator:** Computes ideal weight ranges using Robinson, Miller, Devine, and Hamwi formulas for heights above 152.4 cm.

### Other Sections

*   **Other:** A placeholder for uncategorized calculators.
*   **About:** Provides information about the application.
*   **Blog:** A section for articles and updates.

## 4. Current Development Plan

We have successfully standardized and enhanced the user experience across all **Mathematical** and **Health & Fitness** calculators by adding robust form validation triggered on click of the calculate buttons:

1. **Percentage Calculator (Completed):**
   - Introduced explicit "Calculate" buttons for each of the three percentage sections.
   - Refactored state from automatic computed signals to explicit calculation functions triggered by the calculate button.
   - Added input validation to ensure fields are populated with valid numbers, and displayed helpful error messages if validation fails.

2. **Algebra Calculator (Completed):**
   - Enhanced **Equation Solver** validation to check for empty inputs and ensure an `=` sign is present.
   - Enhanced **Polynomial Factorer** validation to check for empty inputs and ensure it contains a quadratic term (`x^2`).
   - Enhanced **Complex Numbers** validation with helpful format instructions (e.g. `a + bi`) when parse errors occur.
   - Enhanced **Inequality Grapher** validation to verify that inequality expressions are entered correctly with valid operators (`<`, `>`, `<=`, `>=`).

3. **Matrix Calculator (Completed):**
   - Added explicit input validation before parsing (e.g., Matrix A cannot be empty, Matrix B cannot be empty for two-matrix operations, and scalar must be a valid number).
   - Displayed nice red-bordered error boxes below inputs.

4. **Statistics Calculator (Completed):**
   - Improved list input validation to display clear errors if user inputs non-numeric characters or an empty dataset when clicking Calculate.

5. **Scientific Calculator (Completed):**
   - Validated calculations on the click of `=` (e.g. check for division by zero and show "Cannot divide by zero" instead of generic "Error" or "Infinity").

6. **Health & Fitness Suite (Completed):**
   - **BMI Calculator:** Strict height (1-300cm) and weight (1-600kg) bounds checking, applying `[class.error-border]` and displaying informative red-bordered warnings.
   - **BMR & TDEE Calculator:** Rigorous validation for age, height, and weight inputs using computed signal indicators.
   - **Body Fat Calculator:** Navy method validation to ensure Waist > Neck (males/other) and Waist + Hip > Neck (females/other), avoiding mathematically invalid inputs to log functions. Supports the `"Other"` gender option with balanced multi-formula averaging.
   - **Calorie Calculator:** Validation across Mifflin, Harris, and Katch equations, checking body fat percentages in Katch formula and displaying clear macro distribution states.
   - **Ideal Weight Calculator:** Height bounds checking to confirm the minimum required height of 152.4 cm (5 feet) for standard formulas to remain accurate. Supports the `"Other"` gender option with robust mathematical averaging across all scientific models.

7. **Build & Verify (Completed):**
   - Ran `ng build` to ensure all changes compile successfully without any TypeScript or Angular framework errors.

8. **Currency Standardization (Completed):**
   - Converted all currency displays in the financial suite from Dollars (`$`) to Rupees (`₹`).
   - Updated the `CurrencyPipe` arguments in templates (e.g. `Mortgage Calculator` and `Compound Interest Calculator`) from `'USD':'symbol'` to `'INR':'symbol-narrow':'1.0-0'` to format Indian Rupees elegantly.
   - Standardized Chart.js axis labels to show `Amount (₹)` in both TS components.

9. **Homepage SEO Modernization & Swiper Responsiveness (Completed):**
   - Declared `seoActiveTab` in `HomeComponent` to manage active SEO content tabs correctly without compiler errors.
   - Revamped `home.component.css` to implement an ultra-premium glassmorphic look for the SEO content sections, using radial gradients, backdrop-filters, custom HSL color palette, typography scaling (using `clamp()`), list item transitions, and modern details/summary FAQs.
   - Introduced dynamic `swiperBreakpoints` configurations in `HomeComponent` to ensure Swiper containers show only 1 slide on mobile screens, 2 on tablet, and 3-4 on larger monitors, binding `[breakpoints]="swiperBreakpoints"` in `home.component.html`.
   - Adjusted Angular workspace styles budgets in `angular.json` under `anyComponentStyle` from 20kB to 50kB to accommodate the rich homepage styles, ensuring clean, successful builds.

10. **Side Panel Mobile Optimization (Current Task):**
    - **Goal:** Transform the sidebar navigation into a smooth, premium collapsible drawer on mobile/tablet devices.
    - **Collapsible Drawer:** On mobile (width <= 768px), the sidebar will transition to a fixed-position drawer (`left: 0`, `top: 0`, `height: 100vh`) overlaying the content.
    - **Hamburger Toggle:** A sleek, animated hamburger menu button will be floating in the top-right header space on mobile.
    - **Backdrop Overlay:** A dark, blur-filtered backdrop will overlay the page content when the drawer is open. Clicking the backdrop will close the drawer.
    - **Close Button:** A visible Close ('X') button inside the top-right of the side-panel will allow easy closing.
    - **Navigation Triggers:** Clicking any calculator link in the drawer will automatically close the drawer, ensuring a smooth transition to the new tool.
    - **Desktop Behavior Preserved:** The responsive sidebar behavior is retained on screens larger than 768px, ensuring zero disruption to desktop layout structure.
    - **Signals State Management:** Leverage Angular Signals (`isOpen`) for clear, reactive state tracking.
