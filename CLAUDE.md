# Berlin Demo Finder

Interactive map app that scrapes Berlin police assembly/demonstration listings, geocodes locations, and displays them on a Google Map with filtering and analytics.

## Stack
- Next.js 15 (App Router, TypeScript, Tailwind CSS)
- Supabase (Postgres)
- Google Maps (@vis.gl/react-google-maps)
- Cheerio (scraping)
- Recharts (analytics)
- Jest (TDD)

## Commands
- `npm test` — run all tests
- `npm run dev` — local dev server
- `npm run build` — production build

## Conventions
- TDD: write tests first, then implementation
- All scraper/geocoder/analytics functions are pure where possible
- Supabase: anon key for reads, service role for writes
- Tests in `__tests__/` mirroring `src/lib/` structure

@~/.claude/AGENTS.md
