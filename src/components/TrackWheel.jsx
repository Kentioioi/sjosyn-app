import { useRef, useLayoutEffect, useEffect } from 'react'

// Vri-hjul (jog-dial) for spor-avspilling. Ribbene RULLER under en fast
// senter-peker mens du drar — som å vri et hjul. Momentum: slipp i fart →
// hjulet ruller videre og bremser. Maler via DOM-refs.
//
// TIDS-basert: én skjermbredde med dra = TIME_PER_WIDTH (8t), så ~3 sveip
// dekker ett døgn uansett hvor mange spor-punkter dagen har. `times` er epoch-ms
// per indeks (samme rekkefølge som value/max) — vi mapper rull → tid → nærmeste
// indeks, slik at tempoet blir konstant i TID, ikke i antall punkter.
const TIME_PER_WIDTH_MS = 8 * 3600 * 1000   // 8 t per skjermbredde → 3 sveip = 24 t
const STEPS_PER_WIDTH   = 160               // fallback (indeks/skjermbredde) når times mangler

export default function TrackWheel({ value, max, onChange, onScrubStart, color = '#00b4d8', times = null }) {
  const trackRef = useRef(null)
  const ribsRef = useRef(null)
  const scrollRef = useRef(0)        // px rullet (0 = start, maxScroll = slutt)
  const dragRef = useRef(null)
  const rafRef = useRef(0)
  const lastEmitRef = useRef(value ?? 0)
  const cbRef = useRef(onChange)
  useEffect(() => { cbRef.current = onChange }, [onChange])

  const hasTimes = Array.isArray(times) && times.length > 1
  const span = () => (hasTimes ? Math.max(1, times[times.length - 1] - times[0]) : 0)

  const trackW = () => trackRef.current?.clientWidth || 1
  const maxScroll = () => hasTimes
    ? Math.max(1, trackW() * (span() / TIME_PER_WIDTH_MS))
    : Math.max(1, trackW() * (Math.max(1, max) / STEPS_PER_WIDTH))
  const clampS = (s) => Math.max(0, Math.min(maxScroll(), s))

  // Nærmeste indeks for et tidspunkt (binærsøk i times).
  const indexForTime = (t) => {
    if (!hasTimes) return 0
    let lo = 0, hi = times.length - 1
    if (t <= times[0]) return 0
    if (t >= times[hi]) return hi
    while (lo < hi) {
      const mid = (lo + hi) >> 1
      if (times[mid] < t) lo = mid + 1; else hi = mid
    }
    return (lo > 0 && (t - times[lo - 1]) < (times[lo] - t)) ? lo - 1 : lo
  }

  // Rull-fraksjon → indeks. Tids-basert når times finnes, ellers lineær.
  const scrollToIndex = (s) => {
    const frac = s / maxScroll()
    if (hasTimes) return indexForTime(times[0] + frac * span())
    return Math.round(frac * max)
  }
  // Indeks → rull (for prop-synk). Tids-basert når times finnes.
  const indexToScroll = (i) => {
    if (hasTimes) {
      const t = times[Math.max(0, Math.min(times.length - 1, i))]
      return ((t - times[0]) / span()) * maxScroll()
    }
    return (max > 0 ? i / max : 0) * maxScroll()
  }

  const paint = () => {
    if (ribsRef.current) ribsRef.current.style.backgroundPositionX = `${-scrollRef.current}px`
  }
  const setScroll = (s) => {
    scrollRef.current = clampS(s); paint()
    const r = scrollToIndex(scrollRef.current)
    if (r !== lastEmitRef.current) { lastEmitRef.current = r; cbRef.current(r) }
  }
  const stop = () => { if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = 0 } }

  // Synk fra prop når vi ikke drar/glir.
  useLayoutEffect(() => {
    if (!dragRef.current && !rafRef.current) {
      const v = value ?? 0
      lastEmitRef.current = Math.round(v)
      scrollRef.current = indexToScroll(v)
      paint()
    }
  })
  useEffect(() => () => stop(), [])

  function down(e) {
    stop(); onScrubStart?.()
    const x = e.clientX
    dragRef.current = { lastX: x, samples: [{ t: performance.now(), x }] }
    try { e.currentTarget.setPointerCapture(e.pointerId) } catch { /* ignore */ }
  }
  function move(e) {
    const d = dragRef.current
    if (!d) return
    const x = e.clientX
    // Ribbene males med -scroll, så for at hjulet skal følge fingeren (dra høyre
    // → ribbe høyre, som å dra en filmstrimmel) må scroll synke når x øker.
    setScroll(scrollRef.current - (x - d.lastX))
    d.lastX = x
    d.samples.push({ t: performance.now(), x })
    if (d.samples.length > 5) d.samples.shift()
  }
  function up(e) {
    const d = dragRef.current
    if (!d) return
    dragRef.current = null
    try { e.currentTarget.releasePointerCapture(e.pointerId) } catch { /* ignore */ }
    const s = d.samples
    if (s.length < 2) return
    const a = s[0], b = s[s.length - 1]
    const dt = b.t - a.t
    if (dt <= 0) return
    let vel = (b.x - a.x) / dt        // px/ms
    if (Math.abs(vel) < 0.04) return
    let last = performance.now()
    const stepf = (now) => {
      const fdt = now - last; last = now
      vel *= Math.pow(0.95, fdt / 16)
      setScroll(scrollRef.current - vel * fdt)   // samme retning som drag (følg fingeren)
      if (scrollRef.current <= 0 || scrollRef.current >= maxScroll() || Math.abs(vel) < 0.01) { stop(); return }
      rafRef.current = requestAnimationFrame(stepf)
    }
    rafRef.current = requestAnimationFrame(stepf)
  }

  return (
    <div className="track-dial" ref={trackRef} style={{ '--dial': color }}
      onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
      <div className="track-dial-ribs" ref={ribsRef} />
      <div className="track-dial-sheen" aria-hidden />
      <div className="track-dial-center" aria-hidden />
    </div>
  )
}
