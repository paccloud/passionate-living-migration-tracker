# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based project tracker application for the Passionate Living website migration project. It's a single-page application built with Vite that allows tracking milestones, billing, and overall project progress.

## Development Commands

### Development Server
```bash
npm run dev
```
Opens development server at http://localhost:5173

### Build
```bash
npm run build
```
Creates production build in `dist/` directory

### Lint
```bash
npm run lint
```
Runs ESLint with the project's configuration

### Preview Production Build
```bash
npm preview
```
Previews the production build locally

## Architecture

### Component Structure

The application follows a simple, single-component architecture:

- **App.jsx**: Root component that renders the MigrationTracker
- **MigrationTracker.jsx**: Main component containing all application logic and UI
  - Manages milestone tracking with status transitions (upcoming → in-progress → completed)
  - Manages billing items with payment status tracking
  - Includes two sub-components:
    - `MilestoneForm`: Inline form for adding/editing milestones
    - `BillingForm`: Inline form for adding/editing billing items
  - Uses inline styles with a design system based on:
    - Primary color: #8B1A1A (burgundy)
    - Accent color: #FF8C42 (orange)
    - Background: #FFF8F0 (cream)
    - Fonts: Montserrat (headings), Open Sans (body), Pacifico (logo)

### State Management

All state is managed locally in the MigrationTracker component using React useState:
- `milestones`: Array of milestone objects with properties: id, title, description, status, completedDate/targetDate, billingStatus
- `billing`: Array of billing objects with properties: id, name, date, amount, status
- `currentWeek`, `targetLaunch`, `projectTitle`, `projectSubtitle`: Project metadata
- Edit/view state toggles for UI interaction

### Data Flow

State is initialized with default data (defaultMilestones, defaultBilling) and modified through user interactions:
- Status changes cycle through predefined states (click to toggle)
- CRUD operations for milestones and billing items
- All calculations (progress %, completed count, billing totals) are derived from state

## Tech Stack

- **Build Tool**: Vite
- **Framework**: React 19.2.0
- **Icons**: lucide-react
- **Styling**: Inline styles (no CSS-in-JS library, no Tailwind)
- **Linting**: ESLint 9 with flat config format

## Code Style Notes

- Uses flat ESLint config (eslint.config.js) with globalIgnores pattern
- Custom rule: `no-unused-vars` allows uppercase/underscore prefixed variables
- React Hooks and React Refresh plugins are configured
- ECMAScript 2020+ features are enabled
