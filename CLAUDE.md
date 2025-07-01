# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Recipe Keeper is a Next.js 15 (App Router) application for managing and browsing recipes. It integrates with Sanity CMS for content management and includes PWA capabilities.

### Key Technologies
- **Next.js 15** with App Router
- **Sanity CMS** for content management 
- **Tailwind CSS** for styling
- **Radix UI** components with shadcn/ui
- **PWA** functionality with next-pwa

## Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Architecture

### Data Flow
- Recipes are stored in Sanity CMS with schema defined in `sanity/schemaTypes/recipe.js`
- Frontend fetches data using the Sanity client (`sanity/lib/client.js`)
- Recipe filtering and search happens server-side with GROQ queries

### Key Directories
- `app/` - Next.js App Router pages and layouts
- `components/` - React components (includes shadcn/ui components in `ui/`)
- `sanity/` - Sanity CMS configuration and schema
- `lib/` - Utility functions
- `utils/` - Helper functions (e.g., `blocksToLines.js` for Portable Text processing)

### Recipe Schema
The recipe document type includes:
- Basic info: name, slug, image, author, source
- Time fields: prepTime, cookTime
- Categories: cuisine, meal (with predefined options)
- Content: ingredients and cookingInstructions (both as Portable Text blocks)

### Sanity Studio
- Accessible at `/studio` route
- Configured in `sanity.config.js`
- Uses Vision plugin for GROQ query testing

### Component Architecture
- Uses shadcn/ui components with Radix UI primitives
- FilterForm handles recipe filtering by cuisine/meal/search
- RandomRecipeButton provides random recipe selection
- Recipe pages render Portable Text content for ingredients and instructions

### PWA Configuration
- Service worker and manifest configured via next-pwa
- PWA features disabled in development, enabled in production
- Manifest located at `/public/manifest.json`

## Important Notes

- Recipe queries include image sorting logic (recipes with images appear first)
- The app uses server-side filtering with GROQ queries for performance
- Portable Text blocks are processed with custom utilities in `utils/blocksToLines.js`
- Images are optimized using Sanity's image transformation API