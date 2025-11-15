
# Blueprint: My Calculator Application

This document outlines the architecture, design, features, and development plans for the My Calculator application.

## 1. Overview

My Calculator is a modern, web-based application designed to provide users with a suite of powerful and intuitive calculators. Built on Angular v20+, it leverages the latest framework features, including standalone components, signals for state management, and modern CSS for a responsive and visually appealing user experience.

The application is designed to be modular, with each calculator functioning as a self-contained feature, ensuring scalability and ease of maintenance.

## 2. Style and Design Guide

The application adheres to a modern, dark-theme aesthetic, prioritizing clarity, ease of use, and visual appeal.

*   **Theme:** Dark mode with high-contrast text and vibrant accent colors.
*   **Primary Accent Color:** A bold red (`#e11931`) used for active states, buttons, and highlights.
*   **Typography:** Clean, sans-serif fonts for readability.
*   **Layout:** Responsive, component-based layout with clean spacing and a clear visual hierarchy.
*   **Interactivity:** Smooth animations and transitions provide a dynamic user experience. Buttons and interactive elements feature hover effects and shadows to create a sense of depth.

## 3. Existing Features

### Algebra Calculator (`/algebra`)

A multi-function calculator for common algebraic tasks, organized into a tabbed interface.

*   **Equation Solver:** Solves linear equations, providing a step-by-step solution.
*   **Polynomial Factorer:** Factors quadratic polynomials and displays the process.
*   **Complex Number Arithmetic:** Performs addition, subtraction, and multiplication on complex numbers.
*   **Inequality Grapher:** A powerful tool that graphs multiple inequalities on a shared canvas, each with a unique color for clarity. Users can dynamically add and remove inequalities.

## 4. Current Development Plan: Statistics Calculator

This section outlines the plan for implementing the new Statistics Calculator.

### Phase 1: Foundational Statistics Calculator

**Objective:** To create a new, fully functional statistics calculator for essential statistical measures.

**Actionable Steps:**

1.  **Generate Component:** Create a new standalone `StatisticsCalculatorComponent`.
2.  **Establish Routing:** Add a new route, `/statistics`, to `app.routes.ts` to navigate to the new component.
3.  **Update Navigation:** Add a "Statistics" link to the main application header in `app.component.html`.
4.  **Build the UI:**
    *   Create an input field for users to enter a comma-separated list of numbers.
    *   Add a "Calculate" button to trigger the calculations.
    *   Design a results area to display the calculated values.
5.  **Implement Core Logic:**
    *   Implement functions to calculate the **Mean**, **Median (P50)**, and **Mode** from the user's input.
    *   Use signals to manage the state of the input and results.
6.  **Styling:** Apply the application's dark-theme styling to the new component to ensure a consistent look and feel.
