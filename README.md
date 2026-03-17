# Berlin Demo Finder

Interactive map of demonstrations and assemblies in Berlin, scraped from official police listings.

## What it does

- Scrapes Berlin police assembly/demonstration listings daily
- Geocodes locations via Google Maps API (cached per address)
- Displays events on a clustered Google Map with category-colored markers
- Co-located events (same address) show as location pins with a scrollable event list
- Filters by date range, keyword, postal code, and category
- Translates demo topics into 15+ languages via AI
- Analytics dashboard with weekly trends, peak hours, and top locations

## Stack

- **Next.js 15** (App Router, TypeScript, Tailwind CSS)
- **Supabase** (Postgres for demos, translations, geocode cache)
- **Google Maps** (@vis.gl/react-google-maps + Supercluster)
- **Cheerio** (HTML scraping)
- **Recharts** (analytics charts)
- **SWR** (client-side data fetching)

## Getting started

```bash
cp .env.local.example .env.local  # fill in API keys
npm install
npm run dev                       # http://localhost:3000
```

Required environment variables: see `.env.local.example`.

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm test` | Run all tests (Jest) |

## Project structure

```
src/
  app/           # Next.js pages, API routes (scrape, translate)
  components/    # Map, filters, popover, nav, icons
  contexts/      # FilterContext, LanguageContext
  hooks/         # useClusteredMarkers, useFilteredDemos, useTranslatedDemos
  lib/           # Scraper, geocoder, analytics, formatting utilities
  i18n/          # Translation dictionaries
supabase/        # Database migrations
__tests__/       # Jest tests mirroring src/lib structure
```
