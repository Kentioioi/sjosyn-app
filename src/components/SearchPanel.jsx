import { useState, useMemo, useRef, useEffect } from 'react'
import { getVesselType, getVesselColor, formatSpeed, isPlausibleSpeed } from '../utils/vesselTypes'

// Vindusrendring: bare et lite antall rader mountes uansett hvor mange treff
// (jf. 3780-rad-lag). DEFAULT_ROW_HEIGHT = .vessel-list-item min-height (56px),
// men ekte rad-høyde måles fra DOM så matten holder uansett fontmetrikk.
// OVERSCAN gir noen ekstra rader over/under så scroll ikke blinker.
const DEFAULT_ROW_HEIGHT = 56
const OVERSCAN = 6

export default function SearchPanel({ vessels, onSelectVessel, onClose }) {
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const resultsRef = useRef(null)
  const rowRef = useRef(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [viewportH, setViewportH] = useState(0)
  const [rowHeight, setRowHeight] = useState(DEFAULT_ROW_HEIGHT)

  const categories = [
    { id: 'all', label: 'Alle' },
    { id: 'cargo', label: '📦 Last', types: [70,71,72,73,74,79] },
    { id: 'tanker', label: '🛢 Tank', types: [80,81,82,83,84,89] },
    { id: 'passenger', label: '🛳 Passasjer', types: [60,61,62,63,64,69] },
    { id: 'fishing', label: '🎣 Fiske', types: [30] },
    { id: 'pleasure', label: '⛵ Fritid', types: [36,37] },
    { id: 'special', label: '🚨 Spesial', types: [50,51,52,53,54,55] },
  ]

  const filtered = useMemo(() => {
    let result = [...vessels]
    if (query) {
      const q = query.toLowerCase()
      result = result.filter(v =>
        v.name?.toLowerCase().includes(q) ||
        v.mmsi?.includes(q) ||
        v.destination?.toLowerCase().includes(q)
      )
    }
    if (typeFilter !== 'all') {
      const cat = categories.find(c => c.id === typeFilter)
      if (cat?.types) result = result.filter(v => cat.types.includes(parseInt(v.type)))
    }
    // Ugyldig fart (AIS-sentinel / umulige verdier) sorteres som 0 så den
    // ikke dytter åpenbart feil tall øverst i søket.
    const sortSog = v => (isPlausibleSpeed(v.sog) ? v.sog : 0)
    return result.sort((a, b) => sortSog(b) - sortSog(a))
  }, [vessels, query, typeFilter])

  // Mål synlig høyde på resultatlista (og oppdater ved resize) så vinduet
  // dekker akkurat det som vises.
  useEffect(() => {
    const el = resultsRef.current
    if (!el) return
    const measure = () => setViewportH(el.clientHeight)
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // Nullstill scroll til topp når filteret endres, ellers kan vinduet havne
  // utenfor den nye (kortere) lista.
  useEffect(() => {
    if (resultsRef.current) resultsRef.current.scrollTop = 0
    setScrollTop(0)
  }, [query, typeFilter])

  // Mål ekte rad-høyde fra en faktisk montert rad (inkl. padding + border) så
  // spacer-matten matcher det DOM-en faktisk rendrer.
  useEffect(() => {
    const h = rowRef.current?.offsetHeight
    if (h && h !== rowHeight) setRowHeight(h)
  })

  // Beregn hvilket utsnitt av rader som faktisk skal mountes.
  const total = filtered.length
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - OVERSCAN)
  const visibleCount = Math.ceil((viewportH || 0) / rowHeight) + OVERSCAN * 2
  const endIndex = Math.min(total, startIndex + visibleCount)
  const visible = filtered.slice(startIndex, endIndex)
  const padTop = startIndex * rowHeight
  const padBottom = (total - endIndex) * rowHeight

  return (
    <div className="search-panel" onClick={e => e.stopPropagation()}>
      <div className="search-panel-header">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            placeholder="Søk fartøy, MMSI, destinasjon …"
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <button className="search-clear" onClick={() => setQuery('')}>✕</button>
          )}
        </div>
        <button className="close-btn" onClick={onClose} title="Lukk" aria-label="Lukk">✕</button>
      </div>

      <div className="filter-chips">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`filter-chip ${typeFilter === cat.id ? 'active' : ''}`}
            onClick={() => setTypeFilter(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="search-results-header">
        <span>{filtered.length} fartøy</span>
      </div>

      <div
        className="search-results"
        ref={resultsRef}
        onScroll={e => setScrollTop(e.currentTarget.scrollTop)}
      >
        {filtered.length === 0 ? (
          <div className="empty-state">Ingen fartøy funnet</div>
        ) : (
          <>
            {padTop > 0 && <div style={{ height: padTop }} aria-hidden="true" />}
            {visible.map((vessel, i) => {
              const vType = getVesselType(vessel.type)
              return (
                <button
                  key={vessel.mmsi}
                  ref={i === 0 ? rowRef : null}
                  className="vessel-list-item"
                  onClick={(e) => { e.stopPropagation(); onSelectVessel(vessel); onClose() }}
                >
                  <span className="vessel-list-dot" style={{ background: getVesselColor(vessel.type) }} />
                  <div className="vessel-list-info">
                    <div className="vessel-list-name">{vessel.name}</div>
                    <div className="vessel-list-meta">
                      {vType.label} · {formatSpeed(vessel.sog)}
                      {vessel.destination ? ` · ➜ ${vessel.destination}` : ''}
                    </div>
                  </div>
                  <span className="vessel-list-mmsi">{vessel.mmsi}</span>
                </button>
              )
            })}
            {padBottom > 0 && <div style={{ height: padBottom }} aria-hidden="true" />}
          </>
        )}
      </div>
    </div>
  )
}
