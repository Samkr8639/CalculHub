# Project Blueprint

## Overview
This document outlines the design, features, and technical implementation of the CalculHub application. CalculHub is a modern, minimalist web application providing various calculators, designed with a focus on a sleek dark corporate aesthetic and optimal user experience.

## Project Details

### Style, Design, and Features
- **Theme**: Modern, minimalist, and dark corporate design. Bold, professional, and clean with ample spacing.
- **Color Palette**:
    - Primary Red: #E11931 (key accents and primary actions)
    - Background Black: #0A0A0A
    - Card Black: #151515
    - Pure White Text: #FFFFFF
    - Light Grey Text: #8F8F8F
    - Border Grey: #2A2A2A
- **Typography**: Clean, modern sans-serif font like Inter.
- **Header**: Displays "CalculHub" as the app title. Navigation includes "Home", "About", and "Blog". Spans 100% width.
- **Hero Section**: A powerful and visually striking hero section with a dark background. Features a prominent title, a separate concise tagline, and a call-to-action button that scrolls to the calculators section, all designed for a bold and professional impression. The hero section will feature large, impactful text, alongside a profile image to the right, creating a bold and professional look.
- **Footer**: Includes quick links, social media icons, and legal information. Spans 100% width.
- **Page Animations**: Fade-in on load with a stagger effect using GSAP.
- **Calculator Cards**: Staggered fade-in, scale on hover, with descriptive text and CTA buttons. Now categorized.
- **Category Filters**: Buttons for filtering calculator types, dynamically generated and categorized.
- **Global Styles**: Comprehensive color palette for dark mode, improved typography, consistent button styles, subtle background texture, and refined shadow system.

## Current Changes Plan: Remove Background Image and Make Hero Section Dark

### Steps:
1.  **Update `blueprint.md`**: Updated the plan in the blueprint file.
2.  **Modify `src/app/home/home.component.css`**: 
    *   Remove the `background-image` property from the `.hero-background` style.
    *   Set the `background-color` of `.hero-background` to `var(--background-black)` and adjust the opacity.
