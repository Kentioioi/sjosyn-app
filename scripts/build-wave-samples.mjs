#!/usr/bin/env node
/**
 * build-wave-samples.mjs
 *
 * One-shot catalog builder for the wave-forecast layer.
 *
 * Walks a tight grid (~4.4 km step) over Norwegian waters (mainland +
 * coastal bbox), queries Open-Meteo Marine for each point with
 * cell_selection=sea, and records the SNAPPED model sea-cell coordinate
 * for every query that returned valid wave data. Dedupes by snapped coords
 * so the output is one entry per unique EWAM/MFWAM sea cell within the
 * Norwegian coastal bbox.
 *
 * The output (src/data/waveSamples.json) is then consumed by
 * useWaveForecast at runtime: instead of generating samples from a world
 * grid (which can land on mountains or far inland) we filter this
 * pre-verified catalog to the viewport and query Open-Meteo at those exact
 * coordinates. Every badge is by construction at a valid sea cell.
 *
 * Usage:
 *   node scripts/build-wave-samples.mjs
 *
 * Honours Open-Meteo's free-tier rate limits: 600/min, 5000/hour,
 * 10,000/day. The default settings run ~3000 requests over ~55 minutes,
 * comfortably inside all three limits. If you hit a 429, the script
 * will exit cleanly so you can resume from the last good state another
 * day (the JSON is written atomically once at the end — partial progress
 * is shown on stdout).
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT = path.join(__dirname, '..', 'src', 'data', 'waveSamples.json')

// Norway bbox plus a bit of buffer for coastal-shelf cells. The eastern
// part covers mostly Sweden/Finland inland — Open-Meteo snaps those to
// far-away sea cells, so they dedupe down to the same coastal entries we
// already capture from the west. Slightly wasteful but harmless.
const BBOX = { south: 57.5, north: 71.5, west: 4.0, east: 31.0 }
const STEP = 0.04          // ~4.4 km lat × ~2.2 km lon @ 60°N (finer than EWAM)
const BATCH_SIZE = 50      // coords per HTTP request (fits well under URL limits)
const REQ_INTERVAL_MS = 1100   // ~55 req/min, well under the 600/min limit
const FETCH_TIMEOUT_MS = 30_000

const BASE = 'https://marine-api.open-meteo.com/v1/marine'

function fmtCoord(n) { return n.toFixed(4) }

function buildGrid() {
  const points = []
  for (let lat = BBOX.south; lat <= BBOX.north + 1e-9; lat += STEP) {
    for (let lon = BBOX.west; lon <= BBOX.east + 1e-9; lon += STEP) {
      points.push([+lat.toFixed(4), +lon.toFixed(4)])
    }
  }
  return points
}

async function fetchBatch(batch) {
  const lats = batch.map(p => fmtCoord(p[0])).join(',')
  const lons = batch.map(p => fmtCoord(p[1])).join(',')
  const url = `${BASE}?latitude=${lats}&longitude=${lons}` +
    '&hourly=wave_height&forecast_hours=1&cell_selection=sea'
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS)
  try {
    const r = await fetch(url, { signal: ctrl.signal })
    const text = await r.text()
    if (!r.ok) {
      const err = new Error(`HTTP ${r.status}`)
      err.status = r.status
      err.body = text
      throw err
    }
    const data = JSON.parse(text)
    return Array.isArray(data) ? data : [data]
  } finally {
    clearTimeout(t)
  }
}

async function main() {
  const points = buildGrid()
  console.log(`grid: ${points.length} candidate points (${BBOX.south}..${BBOX.north}°N, ${BBOX.west}..${BBOX.east}°E @ ${STEP}°)`)
  const batches = []
  for (let i = 0; i < points.length; i += BATCH_SIZE) batches.push(points.slice(i, i + BATCH_SIZE))
  console.log(`batches: ${batches.length} (${BATCH_SIZE} pts/batch, ${REQ_INTERVAL_MS}ms throttle ≈ ${Math.round(batches.length * REQ_INTERVAL_MS / 60_000)} min)`)

  const seen = new Map()   // 'lat:lon' → [lat, lon]
  const t0 = Date.now()

  for (let i = 0; i < batches.length; i++) {
    let list
    try {
      list = await fetchBatch(batches[i])
    } catch (err) {
      if (err.status === 429) {
        console.error(`\n429 from Open-Meteo at batch ${i + 1}/${batches.length}: ${err.body?.slice(0, 200)}`)
        console.error('Quota exhausted. Re-run tomorrow (UTC midnight).')
        process.exit(1)
      }
      console.error(`batch ${i + 1} failed:`, err.message)
      continue
    }
    let added = 0
    for (const loc of list) {
      if (!loc?.hourly?.wave_height?.some(v => v != null)) continue
      const key = loc.latitude.toFixed(4) + ':' + loc.longitude.toFixed(4)
      if (seen.has(key)) continue
      seen.set(key, [+loc.latitude.toFixed(4), +loc.longitude.toFixed(4)])
      added++
    }
    if ((i + 1) % 10 === 0 || i === batches.length - 1) {
      const elapsed = (Date.now() - t0) / 1000
      const rate = (i + 1) / elapsed
      const eta = Math.round((batches.length - i - 1) / rate)
      process.stdout.write(`\r[${i + 1}/${batches.length}] +${added} new, ${seen.size} unique sea cells · eta ${eta}s`)
    }
    await new Promise(r => setTimeout(r, REQ_INTERVAL_MS))
  }

  console.log()
  const out = [...seen.values()].map(([lat, lon]) => ({ lat, lon }))
  // Sort north-to-south then west-to-east for stable diffs
  out.sort((a, b) => b.lat - a.lat || a.lon - b.lon)
  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true })
  fs.writeFileSync(OUTPUT, JSON.stringify(out))
  const kb = (fs.statSync(OUTPUT).size / 1024).toFixed(1)
  console.log(`wrote ${out.length} sea cells → ${OUTPUT} (${kb} KB)`)
}

main().catch(err => { console.error(err); process.exit(1) })
