import { useMemo, useRef, useEffect, useState } from 'react'
import { getVesselType, getVesselColor, formatSpeed, formatHeading, formatCoords, timeSince, isPlausibleSpeed } from '../utils/vesselTypes'
import TrackWheel from './TrackWheel'

const TRACK_OPTIONS = [
  { label: 'AV',  hours: 0 },
  { label: '6t',  hours: 6 },
  { label: '12t', hours: 12 },
  { label: '24t', hours: 24 },
  { label: '3d',  hours: 72 },
  { label: '7d',  hours: 168 },
  { label: '14d', hours: 336 },
]

const LOCALE = 'nb-NO'

function formatDateTime(isoStr) {
  if (!isoStr) return ''
  const d = new Date(isoStr)
  const now = new Date()
  if (d.toDateString() === now.toDateString())
    return d.toLocaleTimeString(LOCALE, { hour: '2-digit', minute: '2-digit' })
  return d.toLocaleDateString(LOCALE, { month: 'short', day: 'numeric' }) + ' ' +
    d.toLocaleTimeString(LOCALE, { hour: '2-digit', minute: '2-digit' })
}

// Split a track array into calendar-day buckets
function buildDayGroups(track) {
  if (!track || track.length < 2) return []
  const groups = []
  let lastKey = null, cur = null
  track.forEach((pt, i) => {
    const d = new Date(pt.time)
    const key = d.toDateString()
    if (key !== lastKey) {
      lastKey = key
      cur = {
        date: d,
        weekday: d.toLocaleDateString('nb-NO', { weekday: 'short' }),  // «man.»
        dayNum:  d.getDate(),                                          // 3
        month:   d.toLocaleDateString('nb-NO', { month: 'short' }),    // «jan.»
        startIdx: i,
        endIdx: i,
      }
      groups.push(cur)
    } else {
      cur.endIdx = i
    }
  })
  return groups
}

export default function VesselPanel({
  vessel, onClose,
  collapsed, onToggleCollapse,
  trackHours, onTrackHours,
  trackLoading, trackError, onRetryTrack, trackPoints,
  track,
  playheadIndex, onPlayheadChange,
  isInFleet, onToggleFleet,
}) {
  if (!vessel) return null
  const vType = getVesselType(vessel.type)
  const trackingMode = trackHours > 0
  const isLongTrack  = trackHours > 24

  // Trigger en re-render hvert 10 s når panelet er åpent og utvidet, så
  // "Sist sett" oppdaterer seg ("30 s siden" → "1 min siden" → ...) uten
  // at brukeren må lukke og åpne panelet på nytt.
  const [, setNowTick] = useState(0)
  useEffect(() => {
    if (collapsed) return
    const id = setInterval(() => setNowTick(t => t + 1), 10_000)
    return () => clearInterval(id)
  }, [collapsed, vessel?.mmsi])

  // Bottom-sheet-drag: panelet følger fingeren via DIREKTE DOM-transform (ingen
  // React-render per bevegelse — det var det som hakket, siden panelet er tungt).
  // På slipp setter vi inline transform til mål-posisjonen og lar CSS-transition
  // animere snappet; en effekt på `collapsed` rydder inline-stilen etterpå.
  const PEEK = 80   // synlig header-høyde når kollapset (må matche CSS .vessel-panel--collapsed)
  const panelRef = useRef(null)
  const dragRef = useRef(null)

  const maxOffset = () => Math.max(0, (panelRef.current?.offsetHeight || 0) - PEEK)

  // Synlig panelhøyde (over bunnmenyen) → krediteringen på kartet legger seg
  // rett over denne. Settes live under drag/snap/hvile via en CSS-variabel så
  // kreditt-teksten følger panelet naturlig i stedet for å henge på fast høyde.
  const setPeekVar = px =>
    document.documentElement.style.setProperty('--vessel-peek', `${Math.round(px)}px`)

  // Rydd inline stiler når tilstanden har satt seg → CSS-klassen styrer igjen.
  useEffect(() => {
    const el = panelRef.current
    if (!el) return
    el.style.transform = ''
    el.style.transition = ''
    document.documentElement.classList.remove('vessel-dragging')
    // Hvilehøyde: kollapset = PEEK, utvidet = full panelhøyde.
    setPeekVar(collapsed ? PEEK : el.offsetHeight)
  }, [collapsed])

  // Hold --vessel-peek synket når panelhøyden endrer seg uten kollaps-bytte
  // (f.eks. når past-track skrur om innholdet) — ellers blir kreditten stående
  // på en gammel høyde (midt på skjermen) i stedet for rett over fartøy-infoen.
  useEffect(() => {
    const el = panelRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(() => {
      if (dragRef.current) return            // under drag styrer inline-transform
      setPeekVar(collapsed ? PEEK : el.offsetHeight)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [collapsed])

  // Nullstill variabel + drag-klasse når panelet lukkes.
  useEffect(() => () => {
    document.documentElement.style.removeProperty('--vessel-peek')
    document.documentElement.classList.remove('vessel-dragging')
  }, [])

  function headerPointerDown(e) {
    if (e.target.closest('button')) return
    const base = collapsed ? maxOffset() : 0
    dragRef.current = { y0: e.clientY, base, cur: base, moved: false,
                        lastY: e.clientY, lastT: performance.now(), vy: 0 }
    const el = panelRef.current
    if (el) {
      el.style.transition = 'none'   // 1:1 med fingeren; React klobber ikke inline style
      el.style.transform = `translateY(${base}px)`
    }
    document.documentElement.classList.add('vessel-dragging')   // kreditt følger 1:1
    try { e.currentTarget.setPointerCapture(e.pointerId) } catch { /* no active pointer */ }
  }
  function headerPointerMove(e) {
    const d = dragRef.current
    if (!d) return
    const dy = e.clientY - d.y0
    if (Math.abs(dy) > 3) d.moved = true
    // Glidende fart (px/ms, + = nedover) → flick avgjør snap-retning ved slipp.
    const now = performance.now()
    const dt = now - d.lastT
    if (dt > 0) {
      const inst = (e.clientY - d.lastY) / dt
      d.vy = d.vy * 0.7 + inst * 0.3
      d.lastY = e.clientY
      d.lastT = now
    }
    d.cur = Math.max(0, Math.min(maxOffset(), d.base + dy))
    if (panelRef.current) {
      panelRef.current.style.transform = `translateY(${d.cur}px)`
      setPeekVar(panelRef.current.offsetHeight - d.cur)   // synlig høyde → kreditt følger
    }
  }
  function headerPointerEnd(e) {
    const d = dragRef.current
    if (!d) return
    dragRef.current = null
    try { e.currentTarget.releasePointerCapture(e.pointerId) } catch { /* already released */ }
    const el = panelRef.current
    const mo = maxOffset()
    // Et bevisst kast (fart over terskel) avgjør retning selv om fingeren ikke
    // passerte halvveis. Rolig drag faller tilbake på posisjon (halvveis-regel).
    const FLING = 0.4   // px/ms ≈ 400 px/s
    let shouldCollapse
    if (!d.moved) shouldCollapse = collapsed
    else if (d.vy > FLING) shouldCollapse = true       // kastet ned → kollaps
    else if (d.vy < -FLING) shouldCollapse = false     // kastet opp → utvid
    else shouldCollapse = d.cur > mo / 2               // rolig → posisjon
    document.documentElement.classList.remove('vessel-dragging')   // transition på igjen → myk snap
    if (el) {
      // Restaurer transition + sett mål → myk snap fra nåværende drag-posisjon.
      el.style.transition = ''
      el.style.transform = `translateY(${shouldCollapse ? mo : 0}px)`
      setPeekVar(shouldCollapse ? PEEK : el.offsetHeight)   // kreditt snapper med
    }
    if (shouldCollapse !== collapsed) onToggleCollapse()   // effekten over rydder inline
    else if (el) setTimeout(() => { if (el) { el.style.transform = ''; el.style.transition = '' } }, 340)
  }

  const hasTrack = !trackLoading && track && track.length > 1
  const playhead = hasTrack && playheadIndex >= 0 && playheadIndex < track.length
    ? track[playheadIndex] : null
  const atLive = !hasTrack || playheadIndex < 0 || playheadIndex >= track.length - 1

  // Tidsstempler (epoch-ms) per spor-punkt → vri-hjulet kan scrubbe tids-lineært
  // (konstant tid per sveip) i stedet for per antall punkter.
  const trackTimes = useMemo(
    () => (hasTrack ? track.map(p => +new Date(p.time)) : null),
    [track, hasTrack],
  )

  // ── Short track (≤ 24 h) ──────────────────────────────────────────────
  const sliderPct = hasTrack ? (playheadIndex / (track.length - 1)) * 100 : 100

  // ── Long track (> 24 h): group into days ─────────────────────────────
  const dayGroups = useMemo(
    () => isLongTrack ? buildDayGroups(track) : [],
    [track, isLongTrack],
  )

  // Which day bucket contains the current playhead?
  const activeDayIdx = useMemo(() => {
    if (!dayGroups.length || playheadIndex < 0) return Math.max(0, dayGroups.length - 1)
    const idx = dayGroups.findIndex(g => playheadIndex <= g.endIdx)
    return idx < 0 ? dayGroups.length - 1 : idx
  }, [dayGroups, playheadIndex])

  const activeGroup = dayGroups[activeDayIdx] ?? null

  // Day-scoped slider
  const dayMax   = activeGroup ? activeGroup.endIdx - activeGroup.startIdx : 0
  const dayValue = activeGroup
    ? Math.max(0, Math.min(dayMax, playheadIndex - activeGroup.startIdx))
    : 0
  const dayPct = dayMax > 0 ? (dayValue / dayMax) * 100 : 100

  // Hour ticks (6h, 12h, 18h) within the active day
  const hourTicks = useMemo(() => {
    if (!activeGroup || !track) return []
    const origin = new Date(track[activeGroup.startIdx].time)
    origin.setHours(0, 0, 0, 0)
    const ticks = []
    for (let h = 6; h < 24; h += 6) {
      const target = origin.getTime() + h * 3_600_000
      let closest = -1, best = Infinity
      for (let i = activeGroup.startIdx; i <= activeGroup.endIdx; i++) {
        const diff = Math.abs(new Date(track[i].time).getTime() - target)
        if (diff < best) { best = diff; closest = i }
      }
      if (closest >= 0 && best < 3_600_000) {
        const local = closest - activeGroup.startIdx
        ticks.push({ pct: dayMax > 0 ? (local / dayMax) * 100 : 0, label: `${h}:00` })
      }
    }
    return ticks
  }, [activeGroup, track, dayMax])

  // Auto-scroll active day chip into view
  const dayRowRef = useRef(null)
  useEffect(() => {
    if (!dayRowRef.current) return
    const chips = dayRowRef.current.querySelectorAll('.day-chip')
    chips[activeDayIdx]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [activeDayIdx])

  // ── Playback: animate the playhead through the track ─────────────────
  const [playing, setPlaying] = useState(false)
  // Step size so any track plays start-to-end in ~15 s at 80 ms/tick
  const playStep = hasTrack ? Math.max(1, Math.round(track.length / 187)) : 1

  useEffect(() => {
    if (!playing || !hasTrack) return
    if (playheadIndex >= track.length - 1) { setPlaying(false); return }
    const t = setTimeout(() => {
      onPlayheadChange(Math.min(track.length - 1, (playheadIndex < 0 ? 0 : playheadIndex) + playStep))
    }, 80)
    return () => clearTimeout(t)
  }, [playing, playheadIndex, hasTrack, track.length, playStep, onPlayheadChange])

  // Stop playback when the track or vessel changes
  useEffect(() => { setPlaying(false) }, [trackHours, vessel?.mmsi])

  function togglePlay() {
    if (!hasTrack) return
    if (playing) { setPlaying(false); return }
    if (atLive) onPlayheadChange(0)   // replay from the start
    setPlaying(true)
  }

  return (
    <div ref={panelRef}
         className={`vessel-panel${trackingMode ? ' vessel-panel--tracking' : ''}${collapsed ? ' vessel-panel--collapsed' : ''}`}
         onClick={e => e.stopPropagation()}>

      {/* ── Header — drag to collapse/expand ── */}
      <div className={`vessel-panel-header${trackingMode ? ' vessel-panel-header--compact' : ''}`}
           onPointerDown={headerPointerDown}
           onPointerMove={headerPointerMove}
           onPointerUp={headerPointerEnd}
           onPointerCancel={headerPointerEnd}>
        <div className="vessel-panel-title">
          <span className={`vessel-type-dot${trackingMode ? ' vessel-type-dot--sm' : ''}`}
                style={{ background: getVesselColor(vessel.type) }} />
          {trackingMode ? (
            <div className="vessel-title-stack">
              <div className="vessel-title-row">
                <span className="vessel-name-sm">{vessel.name || 'Ukjent fartøy'}</span>
                <span className="vessel-type-badge">{vType.label}</span>
              </div>
              <QuickFacts vessel={vessel} compact />
            </div>
          ) : (
            <div className="vessel-title-stack">
              <div className="vessel-title-row">
                <h2>{vessel.name || 'Ukjent fartøy'}</h2>
                <span className="vessel-type-label">{vType.label}</span>
              </div>
              <QuickFacts vessel={vessel} />
            </div>
          )}
        </div>
        <div className="vessel-panel-actions">
          <button className="collapse-btn" onClick={onToggleCollapse}
                  title={collapsed ? 'Vis detaljer' : 'Skjul detaljer'}
                  aria-label={collapsed ? 'Vis detaljer' : 'Skjul detaljer'}
                  aria-expanded={!collapsed}>
            <span className="collapse-chevron">{collapsed ? '▴' : '▾'}</span>
          </button>
          <button className="close-btn" onClick={onClose} title="Lukk">✕</button>
        </div>
      </div>

      {/* Body alltid montert — kollaps skjer via translateY (myk transition),
          ikke unmount, så panelet kan følge fingeren og animere jevnt. */}
      <>

      {/* ── Fleet-knapp ── */}
      <div className="fleet-add-row">
        <button
          className={`fleet-add-btn${isInFleet ? ' fleet-add-btn--active' : ''}`}
          onClick={onToggleFleet}
        >
          {isInFleet ? '★ Fjern fra flåten' : '☆ Legg til i flåten'}
        </button>
      </div>
      {/* Tripwire styres nå fra Tripwire-knappen i toolbar (Ny linje / Ny rute /
          Mine tripwires) + popup på kartet. Ingen egen rad i fartøy-panelet. */}

      {/* ── Track option buttons ── */}
      <div className={`track-bar${trackingMode ? ' track-bar--compact' : ''}`}>
        <span className="track-label">📍 Spor</span>
        <div className="track-opts">
          {TRACK_OPTIONS.map(opt => (
            <button
              key={opt.hours}
              className={`track-btn${trackHours === opt.hours ? ' active' : ''}`}
              onClick={() => onTrackHours(opt.hours)}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {trackLoading && <span className="track-loading">⟳</span>}
        {!trackLoading && trackHours > 0 && trackPoints > 0 && (
          <span className="track-pts">{trackPoints} pkt</span>
        )}
      </div>

      {/* ── Spor-feil ── liten ikke-blokkerende rad med «Prøv igjen» når
           hentingen feilet (ikke i demo-modus der trackHours == 0) ── */}
      {trackError && !trackLoading && trackHours > 0 && (
        <div className="track-error">
          <span className="track-error-msg">⚠ Kunne ikke hente spor</span>
          <button className="track-error-retry" onClick={onRetryTrack}>
            Prøv igjen
          </button>
        </div>
      )}

      {/* ── SHORT TRACK timeline (≤ 24 h) ── knop/tid OVER, vri-hjul UNDER ── */}
      {!isLongTrack && hasTrack && (
        <div className="timeline-wrap">
          <div className="timeline-readout">
            <span className={`timeline-ts${atLive ? ' timeline-live' : ''}`}>
              {atLive ? '● Direkte' : (playhead ? formatDateTime(playhead.time) : 'Vri hjulet')}
            </span>
            <span className="timeline-speed">{playhead ? formatSpeed(playhead.sog) : '—'}</span>
          </div>
          <div className="timeline-row timeline-row--wheel">
            <button className={`play-btn${playing ? ' playing' : ''}`} onClick={togglePlay}
                    title={playing ? 'Pause' : 'Spill av sporet'}>
              {playing ? '⏸' : '▶'}
            </button>
            <TrackWheel
              value={playheadIndex >= 0 ? playheadIndex : track.length - 1}
              max={track.length - 1}
              times={trackTimes}
              onChange={v => onPlayheadChange(v)}
              onScrubStart={() => setPlaying(false)}
              color="#ffd166"
            />
          </div>
        </div>
      )}

      {/* ── LONG TRACK timeline (> 24 h) ── dagene reflekterer hvor langt
           hjulet er rullet; hjulet scrubber HELE sporet. ── */}
      {isLongTrack && hasTrack && dayGroups.length > 0 && (
        <div className="timeline-long">

          {/* Dag-chips: speiler posisjon (aktiv dag) + hopp ved trykk */}
          <div className="day-row" ref={dayRowRef}>
            {dayGroups.map((g, i) => (
              <button
                key={i}
                className={`day-chip${i === activeDayIdx ? ' active' : ''}`}
                onClick={() => onPlayheadChange(dayGroups[i].endIdx)}
              >
                <span className="day-chip-wd">{g.weekday}</span>
                <span className="day-chip-num">{g.dayNum}</span>
                <span className="day-chip-mo">{g.month}</span>
                {i === dayGroups.length - 1 && atLive && (
                  <span className="day-chip-live" />
                )}
              </button>
            ))}
          </div>

          {/* Readout (dato + knop + tid) OVER hjulet */}
          <div className="day-slider-header">
            <span className="day-slider-date">
              {activeGroup?.date.toLocaleDateString(LOCALE, {
                weekday: 'long', month: 'long', day: 'numeric',
              })}
            </span>
            {atLive && activeDayIdx === dayGroups.length - 1 && (
              <span className="day-slider-live-pill">● Direkte</span>
            )}
          </div>
          <div className="timeline-readout">
            <span className="timeline-ts">
              {playhead
                ? new Date(playhead.time).toLocaleString(LOCALE, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                : 'Vri hjulet'}
            </span>
            <span className="timeline-speed">{playhead ? formatSpeed(playhead.sog) : '—'}</span>
          </div>

          {/* Vri-hjul UNDER — scrubber hele sporet på tvers av dager */}
          <div className="timeline-row timeline-row--wheel">
            <button className={`play-btn${playing ? ' playing' : ''}`} onClick={togglePlay}
                    title={playing ? 'Pause' : 'Spill av hele sporet'}>
              {playing ? '⏸' : '▶'}
            </button>
            <TrackWheel
              value={playheadIndex >= 0 ? playheadIndex : track.length - 1}
              max={track.length - 1}
              times={trackTimes}
              onChange={v => onPlayheadChange(v)}
              onScrubStart={() => setPlaying(false)}
              color="#ffd166"
            />
          </div>
        </div>
      )}

      {/* ── Speed legend ── */}
      {trackHours > 0 && trackPoints > 0 && (
        <div className="track-legend">
          <span style={{ color: '#4a6a8a' }}>■ I ro</span>
          <span style={{ color: '#2a9d8f' }}>■ Sakte</span>
          <span style={{ color: '#e9c46a' }}>■ Marsjfart</span>
          <span style={{ color: '#f4a261' }}>■ Rask</span>
          <span style={{ color: '#e63946' }}>■ Toppfart</span>
        </div>
      )}

      {/* ── Stat cards — hidden in tracking mode ── */}
      {!trackingMode && (
        <div className="vessel-panel-body">
          <div className="stat-grid">
            <StatCard icon="🆔" label="MMSI"     value={vessel.mmsi} />
            <StatCard icon="💨" label="Fart"     value={formatSpeed(vessel.sog)}    highlight />
            <StatCard icon="🧭" label="Kurs"     value={formatHeading(vessel.hdg)}  highlight />
            <StatCard icon="📍" label="Posisjon" value={formatCoords(vessel.lat, vessel.lon)} wide />
            {vessel.destination && (
              <StatCard icon="🚢" label="Destinasjon" value={vessel.destination} wide />
            )}
            {vessel.draught  && <StatCard icon="⬇"  label="Dypgang"     value={`${vessel.draught} m`} />}
            {vessel.length   && <StatCard icon="📏"  label="Lengde"      value={`${vessel.length} m`} />}
            {vessel.callsign && <StatCard icon="📡"  label="Kallesignal" value={vessel.callsign} />}
            {vessel.imo      && <StatCard icon="🔖"  label="IMO"         value={vessel.imo} />}
            <StatCard icon="🕐" label="Sist sett" value={timeSince(vessel.timestamp)} />
          </div>
        </div>
      )}

      {/* ── Speed bar footer ── */}
      <div className={`vessel-panel-footer${trackingMode ? ' vessel-panel-footer--compact' : ''}`}>
        <div className="speed-bar-wrap">
          <div className="speed-bar-label">
            <span>Fart</span>
            <span>{formatSpeed(vessel.sog)}</span>
          </div>
          <div className="speed-bar-track">
            <div className="speed-bar-fill" style={{
              width: `${Math.min(100, (vessel.sog / 30) * 100)}%`,
              background: vessel.sog > 20 ? '#e63946' : vessel.sog > 10 ? '#f4a261' : '#2a9d8f',
            }} />
          </div>
        </div>
      </div>

      </>
    </div>
  )
}

function StatCard({ icon, label, value, highlight, wide }) {
  return (
    <div className={`stat-card${highlight ? ' stat-highlight' : ''}${wide ? ' stat-wide' : ''}`}>
      <span className="stat-icon">{icon}</span>
      <div>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
      </div>
    </div>
  )
}

// Hurtigfakta i topp-panelet — fart og lengde lett synlig (også når panelet
// er minimert). Lengde vises i både meter og fot for båtfolk vant til begge.
function QuickFacts({ vessel, compact = false }) {
  const sog = vessel.sog
  const len = vessel.length
  const speed = isPlausibleSpeed(sog) ? `${sog.toFixed(1)} kn` : null
  const lenTxt = len != null && len > 0
    ? `${Math.round(len)} m / ${Math.round(len * 3.281)} ft`
    : null
  if (!speed && !lenTxt) return null
  return (
    <div className={`vessel-quick-facts${compact ? ' vessel-quick-facts--compact' : ''}`}>
      {speed && (
        <span className="vessel-quick-fact">
          <span className="vessel-quick-icon">💨</span>{speed}
        </span>
      )}
      {lenTxt && (
        <span className="vessel-quick-fact">
          <span className="vessel-quick-icon">📏</span>{lenTxt}
        </span>
      )}
    </div>
  )
}
