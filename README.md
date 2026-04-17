# Salary Transparency App Frontend

Modern, minimalist salary transparency frontend built with Next.js (App Router), React, Tailwind CSS, and TypeScript.

## Flows Implemented

1. Landing and guest data flow
2. User profile settings
3. Salary history input (guest contributions)
4. Position search and filter
5. Position details and analytics

## Run

1. Install dependencies:

   npm install

2. Start development server:

   npm run dev

3. Optional quality checks:

   npm run typecheck
   npm run lint

## Clean Setup

1. Remove previous install and build artifacts:

   PowerShell:
   Remove-Item -Recurse -Force node_modules, .next

2. Reinstall dependencies:

   npm install

3. Verify the project after clean install:

   npm run build
   npm run lint
   npm run typecheck

## Notes

- Uses typed mock JSON data in `lib/mock-data.ts`
- Guest-entered salary history is persisted in localStorage and included in averages/search results
- Reusable UI components live in `components/ui`
- Responsive tables use horizontal scroll on small screens

## Release

- Deployed site: https://doxa56.github.io/maasatlas/
