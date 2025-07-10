# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development with Netlify CLI (recommended)
npm install
npm install -g netlify-cli
netlify dev  # Runs on port 8888

# Standard Next.js development
npm run dev  # Runs on port 3000 with Turbo

# Building and linting
npm run build
npm run lint

# Testing
npm run test      # Run Playwright tests
npm run test:ui   # Run Playwright tests with UI
```

## Architecture Overview

This is a Next.js application for Hydro protocol with the following key components:

- **Smart Contracts**: Hydro and Tribute contracts on Neutron blockchain
- **Frontend**: Next.js with App Router, TailwindCSS, and Cosmos-Kit for wallet integration
- **Data Layer**: Supabase for storage, Netlify Functions for scheduled data building
- **Documentation**: Nextra for docs pages in `/pages/docs/`
- **Deployment**: Netlify with branch deployments

### Key Directory Structure

- `app/(v2)/v2/` - New v2 UI implementation with local state management
- `app/(with-backend-data)/` - Main app pages that consume backend data
- `app/api/v2/` - API routes for v2 data fetching
- `contract-apis/` - Smart contract interaction and data fetching logic
- `functions/` - Netlify Functions for scheduled data building
- `components/` - Shared UI components

### Data Architecture

The app has two main data flows:

1. **Backend Data (Server-side)**: Built by scheduled functions and stored in Supabase
   - `scheduled-build-hydro-meta-data` - Top-level metadata
   - `scheduled-build-external-data` - External data sources  
   - `scheduled-build-hydro-round-data-in-background` - Core bid/round data
   - Data is namespaced by `NEXT_PUBLIC_SUPABASE_DATA_NAMESPACE`

2. **Wallet Data (Client-side)**: Real-time data fetched when wallet connects
   - Uses `useBackendData` hook to merge server and wallet data
   - Augmented with wallet-specific information in `contract-apis/`

### Route Groups

- `(v2)` - New v2 interface with simplified data fetching
- `(with-backend-data)` - Main app using full backend data pipeline

## Local Data Building

Set `NEXT_PUBLIC_SUPABASE_DATA_NAMESPACE` to your name/branch, then:

```bash
# Run dev server
netlify dev

# In another terminal, trigger functions:
netlify functions:invoke scheduled-build-hydro-meta-data --port 8888
netlify functions:invoke scheduled-build-external-data --port 8888
netlify functions:invoke scheduled-build-hydro-round-data-in-background --port 8888

# Or rebuild all data via API:
# Visit http://localhost:3000/api/build-data
```

## Testing

- Uses Playwright with Keplr wallet extension loaded
- Tests configured for Chrome, Firefox, and WebKit
- Extension support only works with Chrome
- Test files in `/tests/` directory

## Environment Configuration

- Development environment configured in `app/(v2)/v2/layout.tsx`
- Uses Neutron testnet contracts by default
- Set `NEXT_PUBLIC_ENVIRONMENT` to switch environments