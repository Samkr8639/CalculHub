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

### Other Sections

*   **Health:** A placeholder section for future health-related calculators.
*   **Other:** A placeholder for uncategorized calculators.
*   **About:** Provides information about the application.
*   **Blog:** A section for articles and updates.

## 4. Current Development Plan

### Build Stabilization

*   **Bug Fix:** Resolved a series of build errors related to the `chart.js` library and server-side rendering (SSR). The errors were caused by the library being initialized on the server, which resulted in a `NotYetImplemented` error.
*   **Solution:** The fix involved implementing a consistent pattern of dynamically importing `chart.js/auto` within an `async` `createChart` method in all components that use charts. This ensures that the library is only imported and initialized in the browser environment.
*   **Template Synchronization:** Corrected the template of the `compound-interest-calculator` to align with the signal-based properties and methods in the component class. This also required importing the `FormsModule`.
*   **Status:** The application is now building successfully, and all calculators are functioning as expected.
