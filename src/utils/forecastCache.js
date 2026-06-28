// Persist the forecast cell cache to IndexedDB so 30-min-valid wave/wind data
// survives reloads and pan-backs — turning a cold ~3 s fan-out into a near-instant
// restore (and cutting MET load, since restored cells aren't re-fetched).
//
// Per-namespace store (wave / wind). Everything is BEST-EFFORT: if IndexedDB is
// unavailable (private mode, blocked, quota), every method no-ops and the
// existing in-memory Map cache keeps working exactly as before. Writes are
// fire-and-forget so they never block the fetch path.
import { createStore, set as idbSet, del as idbDel, entries as idbEntries } from 'idb-keyval'

// Ask the browser to keep our IndexedDB data across the multi-day gaps typical of
// this user base (otherwise it's best-effort and can be evicted). Once per load.
let askedPersist = false
function requestPersist() {
  if (askedPersist) return
  askedPersist = true
  try { navigator.storage?.persist?.() } catch { /* ignore */ }
}

export function makeForecastStore(namespace, ttlMs) {
  let store = null
  try { store = createStore(`sjosyn-forecast-${namespace}`, 'cells') } catch { store = null }

  return {
    // Load still-fresh entries into `map`; prune expired ones. Resolves once.
    // Doesn't clobber entries already present (a live fetch may have beaten it).
    async hydrate(map) {
      if (!store) return
      requestPersist()
      try {
        const all = await idbEntries(store)
        const now = Date.now()
        for (const [k, v] of all) {
          if (v && typeof v.at === 'number' && now - v.at < ttlMs) {
            if (!map.has(k)) map.set(k, v)
          } else {
            idbDel(k, store).catch(() => {})   // drop stale on read
          }
        }
      } catch { /* ignore — fall back to in-memory */ }
    },

    // Best-effort persist of one cell entry (fire-and-forget).
    save(key, entry) {
      if (!store) return
      try { idbSet(key, entry, store).catch(() => {}) } catch { /* ignore */ }
    },
  }
}
