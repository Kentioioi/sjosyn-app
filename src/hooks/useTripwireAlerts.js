import { useEffect, useRef } from 'react'
import { segmentsIntersect, insideCorridor } from '../utils/geom'

// Detekterer krysning for ETT valgt fartøy. Kjører KUN når bakgrunnsvarsling
// er AV (enabled=true): da er backend ikke involvert, og frontend er eneste
// detektor mens appen er åpen. Når push er PÅ eier backenden deteksjonen helt
// — hooken er da no-op, så vi aldri får dobbeltvarsel.
//
// Tripwiren slettes IKKE ved fyring — den blir værende armert og kan fyre på
// neste krysning. Deteksjonen er overgangs-basert (kun ved selve krysningen),
// så ingen spam; en 60s cooldown guard'er mot jitter rett på linja/kanten.
// Bruker velger selv om wiren skal fjernes (via banner / popup).

const STALE_MS = 15 * 60_000
const COOLDOWN_MS = 60_000

export function useTripwireAlerts(vessel, tripwire, onCross, enabled = true) {
  const prevPosRef = useRef(null)
  const lastFireRef = useRef(0)

  useEffect(() => {
    if (!enabled || !vessel || !tripwire || !tripwire.armed) {
      prevPosRef.current = null
      return
    }
    // Stale rapport → posisjonen er upålitelig. Ikke seed eller sammenlign,
    // ellers kan et gammelt hopp fabrikere en phantom-krysning.
    const ts = vessel.timestamp ? Date.parse(vessel.timestamp) : NaN
    if (Number.isFinite(ts) && Date.now() - ts > STALE_MS) {
      prevPosRef.current = null
      return
    }
    const cur = [vessel.lat, vessel.lon]
    const prev = prevPosRef.current
    prevPosRef.current = cur
    if (!prev) return
    if (prev[0] === cur[0] && prev[1] === cur[1]) return

    // Korridor: fyr på inne→ute. Linje (default): fyr på krysning av a-b.
    const isCorridor = tripwire.type === 'corridor' && Array.isArray(tripwire.path) && tripwire.path.length >= 1
    const triggered = isCorridor
      ? insideCorridor(prev, tripwire.path, tripwire.widthM) && !insideCorridor(cur, tripwire.path, tripwire.widthM)
      : (tripwire.a && tripwire.b && segmentsIntersect(prev, cur, tripwire.a, tripwire.b))
    if (!triggered) return
    const now = Date.now()
    if (now - lastFireRef.current < COOLDOWN_MS) return
    lastFireRef.current = now
    onCross?.(vessel)
  }, [vessel?.mmsi, vessel?.lat, vessel?.lon, vessel?.timestamp, tripwire, onCross, enabled])
}
