import { useEffect, useRef } from 'react'
import { segmentsIntersect, insideCorridor, insideCircle } from '../utils/geom'

// Detekterer krysning for ETT valgt fartøy. Kjører KUN når bakgrunnsvarsling
// er AV (enabled=true): da er backend ikke involvert, og frontend er eneste
// detektor mens appen er åpen. Når push er PÅ eier backenden deteksjonen helt
// — hooken er da no-op, så vi aldri får dobbeltvarsel.
//
// Tripwiren slettes IKKE ved fyring — den blir værende armert og kan fyre på
// neste krysning. Linje/rute er overgangs-basert (kun ved selve krysningen)
// med 60s jitter-cooldown. Driftvakt (sirkel) er TILSTANDS-basert: utenfor
// sirkelen = alarmtilstand som re-fyrer hvert 2. min til båten er innenfor
// igjen. Bruker velger selv om vakta skal fjernes (via banner / popup).

const STALE_MS = 15 * 60_000
const COOLDOWN_MS = 60_000
// Driftvakt (sirkel) er tilstandsbasert (utenfor = alarm) og RE-FYRER så
// lenge båten er utenfor — 2 min mellom bannere. Re-fyring skjer ved første
// ferske AIS-rapport etter cooldown (effekten trigges av posisjon/timestamp)
// — ved sparsom AIS-rapportering kan re-fyring komme senere enn 2 min.
const CIRCLE_COOLDOWN_MS = 2 * 60_000

export function useTripwireAlerts(vessel, tripwire, onCross, enabled = true) {
  const prevPosRef = useRef(null)
  const lastFireRef = useRef(0)
  const guardIdRef = useRef(null)

  useEffect(() => {
    if (!enabled || !vessel || !tripwire || !tripwire.armed) {
      prevPosRef.current = null
      return
    }
    // Ny/erstattet vakt (annen id): nullstill baseline + cooldown. Uten dette
    // arver en NY vakt forrige vakts fyringsstempel — f.eks. bytte linje→
    // driftvakt kunne utsette første alarm med opptil 2 min.
    if (tripwire.id !== guardIdRef.current) {
      guardIdRef.current = tripwire.id
      prevPosRef.current = null
      lastFireRef.current = 0
    }
    // Stale rapport → posisjonen er upålitelig. Ikke seed eller sammenlign,
    // ellers kan et gammelt hopp fabrikere en phantom-krysning.
    const ts = vessel.timestamp ? Date.parse(vessel.timestamp) : NaN
    if (Number.isFinite(ts) && Date.now() - ts > STALE_MS) {
      prevPosRef.current = null
      return
    }
    const cur = [vessel.lat, vessel.lon]

    // Driftvakt (sirkel): tilstandsbasert — fyr når fartøyet ER utenfor,
    // re-fyr hver CIRCLE_COOLDOWN_MS så lenge det forblir utenfor. Trenger
    // ingen prev-baseline: også et stillestående fartøy utenfor skal fyre.
    const isCircle = tripwire.type === 'circle' && Array.isArray(tripwire.center) && tripwire.radiusM > 0
    if (isCircle) {
      if (insideCircle(cur, tripwire.center, tripwire.radiusM)) return
      const now = Date.now()
      if (now - lastFireRef.current < CIRCLE_COOLDOWN_MS) return
      lastFireRef.current = now
      onCross?.(vessel)
      return
    }

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
