# ⚓ MarineWatch

Personal marine AIS vessel tracker for Norwegian waters. Mobile-first PWA built
with React + Vite + Leaflet, powered by the official
[Barentswatch AIS API](https://www.barentswatch.no/minside/).

## Features

- **Live vessel map** — polls visible-area vessels at an adaptive rate
  (60 s zoomed out over all of Norway → 10 s at navigation zoom)
- **Smooth motion** — markers glide between position updates
- **Heading vectors** — dashed projection lines showing where a vessel will be
  in 5 / 10 / 15 minutes at current course and speed (↗ toggle for all vessels)
- **Size-scaled icons** — triangle size reflects real vessel length
- **Name labels** at high zoom
- **Track history** up to 14 days, with a day-picker timeline for long tracks
  and a ▶ playback button
- **Map styles** — Dark / Voyager / Light (CARTO) + optional OpenSeaMap
  nautical overlay
- **PIN gate** — 4-digit PIN; API credentials are stored AES-GCM-encrypted with
  a key derived from the PIN (PBKDF2), so the stored blob is useless without it
- **PWA** — installable on Android/iOS, offline tile caching via Workbox

## Setup

1. Free account at [barentswatch.no](https://www.barentswatch.no) → My page →
   create an **API client** with scope `ais`. Note the client ID and secret.
2. `npm install`
3. `npm run dev` — the Vite dev server proxies `/bw-token`, `/bw-ais`, and
   `/bw-historic` to the Barentswatch endpoints (see `vite.config.js`).
4. Enter the PIN (default `3476`, override with the `VITE_APP_PIN` env var),
   then your API credentials. Tick *Remember on this device* to skip this next
   time.

## Deployment (Netlify)

- `netlify.toml` builds with `npm run build`, publishes `dist/`, and redirects
  the three `/bw-*` routes to serverless proxy functions in
  `netlify/functions/` (CommonJS — see `netlify/functions/package.json`).
- Set `VITE_APP_PIN` in the Netlify environment to change the PIN.

## Architecture notes

- `src/hooks/useBarentswatch.js` — polling loop. Stable recursive `setTimeout`;
  reads bounds/interval from refs so pan/zoom never restarts it. Pauses when
  the tab is hidden. Preserves object references for unmoved vessels so
  memoized markers skip re-rendering.
- `src/hooks/useVesselTrack.js` — historical track fetch (Barentswatch keeps
  ~5 years of history).
- `src/utils/secureStore.js` — PIN-encrypted credential storage (WebCrypto).
- `src/components/MapView.jsx` — map, animated markers, heading vectors.
- Vessel markers are capped at 1000 below zoom 7 (fastest-moving first).
