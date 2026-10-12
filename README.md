# SKA-Low component testbed

Next.js (static export) + MUI v5 + `@ska-telescope/ska-gui-components`, deployed to GitHub Pages.

## Run locally
    npm install
    npm run dev

## Deploy
1. Push to GitHub, branch `main`.
2. Repo Settings > Pages > Source: **GitHub Actions**.
3. The workflow sets `BASE_PATH` to the repo name automatically.

## Adding a component
1. Create `src/components/MyComponent.tsx` (`'use client'`, accept a `testId` prop).
2. Add realistic states to `src/mocks/`.
3. Render each state on `src/app/page.tsx` (or a new page).
