import { Fragment, useEffect } from 'react'
import { Polyline, CircleMarker, Circle, Popup, useMapEvents } from 'react-leaflet'
import { corridorEdges } from '../utils/geom'

// Tegne-modus + render av aktive tripwires (linje + rute/korridor + driftvakt-sirkel).
// I draftMode lytter komponenten på map-klikk og kaller onAddPoint(latlng).
// Når draftMode er av rendres geometrien + endepunkter. Klikk på geometrien
// viser popup med tilhørende fartøy + "Fjern"-knapp.

function ClickCatcher({ onAddPoint }) {
  useMapEvents({
    click: e => onAddPoint([e.latlng.lat, e.latlng.lng]),
  })
  return null
}

function formatWhen(ts) {
  if (!ts) return 'Aldri'
  const ms = Date.now() - ts
  if (ms < 60_000) return 'nå nettopp'
  if (ms < 3_600_000) return `${Math.floor(ms / 60_000)} min siden`
  if (ms < 86_400_000) return `${Math.floor(ms / 3_600_000)} t siden`
  const d = new Date(ts)
  return d.toLocaleDateString('nb-NO', { day: '2-digit', month: 'short' })
    + ' kl. ' + d.toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' })
}

const YELLOW = '#ffd166'
const NODE_OPTS = { color: YELLOW, weight: 2, fillColor: '#1a2332', fillOpacity: 0.9 }

function TripwirePopup({ mmsi, name, t, liveVessel, onRemoveTripwire, onSelectVessel, onSetCorridorWidth, onSetCircleRadius, onRecenterCircle }) {
  const isCorridor = t.type === 'corridor'
  const isCircle = t.type === 'circle'
  return (
    <Popup minWidth={isCorridor || isCircle ? 220 : undefined}>
      <div className="tw-popup">
        <div className="tw-popup-title">{name}</div>
        <div className="tw-popup-row"><span>MMSI</span><strong>{mmsi}</strong></div>
        <div className="tw-popup-row">
          <span>Type</span>
          <strong>{isCircle ? 'Driftvakt' : isCorridor ? 'Rute' : 'Linje'}</strong>
        </div>
        {t.createdAt && (
          <div className="tw-popup-row"><span>Opprettet</span><strong>{formatWhen(t.createdAt)}</strong></div>
        )}
        {isCorridor && onSetCorridorWidth && (
          <div className="tw-popup-width">
            <label>Bredde: <strong>{t.widthM ?? 1000} m</strong></label>
            <input type="range" min="250" max="4000" step="50"
              value={t.widthM ?? 1000}
              onChange={e => onSetCorridorWidth(mmsi, Number(e.target.value))} />
            <div className="tw-popup-presets">
              {[1000, 2000, 3000, 4000].map(w => (
                <button key={w}
                  className={`corridor-preset${(t.widthM ?? 1000) === w ? ' corridor-preset--active' : ''}`}
                  onClick={() => onSetCorridorWidth(mmsi, w)}>{w}</button>
              ))}
            </div>
          </div>
        )}
        {isCircle && onSetCircleRadius && (
          <div className="tw-popup-width">
            <label>Radius: <strong>{t.radiusM ?? 200} m</strong></label>
            <input type="range" min="50" max="5000" step="50"
              value={t.radiusM ?? 200}
              onChange={e => onSetCircleRadius(mmsi, Number(e.target.value))} />
            <div className="tw-popup-presets">
              {[100, 200, 500, 1000].map(r => (
                <button key={r}
                  className={`corridor-preset${(t.radiusM ?? 200) === r ? ' corridor-preset--active' : ''}`}
                  onClick={() => onSetCircleRadius(mmsi, r)}>{r}</button>
              ))}
            </div>
          </div>
        )}
        <div className="tw-popup-actions">
          {liveVessel && onSelectVessel && (
            <button className="tw-popup-btn" onClick={() => onSelectVessel(liveVessel)}>Vis fartøy</button>
          )}
          {isCircle && liveVessel && onRecenterCircle && (
            <button className="tw-popup-btn" onClick={() => onRecenterCircle(mmsi)}>Sentrer på fartøyet</button>
          )}
          {onRemoveTripwire && (
            <button className="tw-popup-btn tw-popup-btn--danger" onClick={() => onRemoveTripwire(mmsi)}>Fjern</button>
          )}
        </div>
      </div>
    </Popup>
  )
}

// Usynlig, tykk «hit»-linje gjør tynne stiplede tripwires lette å treffe på
// touch. Bærer popup-en; de synlige linjene er interactive=false.
const HIT_OPTS = { color: '#000', weight: 26, opacity: 0, lineCap: 'round' }

export default function TripwireOverlay({
  tripwires, draftMode, draftPoint, draftPath = [], draftWidth = 1000, draftCircle = null, onAddPoint,
  vessels = [], onRemoveTripwire, onSelectVessel, onSetCorridorWidth, onSetCircleRadius, onRecenterCircle,
}) {
  const draftEdges = draftPath.length >= 2 ? corridorEdges(draftPath, draftWidth) : null
  useEffect(() => {
    const map = document.querySelector('.leaflet-container')
    if (!map) return
    if (draftMode) map.classList.add('tripwire-draw-mode')
    else map.classList.remove('tripwire-draw-mode')
    return () => map.classList.remove('tripwire-draw-mode')
  }, [draftMode])

  return (
    <>
      {draftMode && <ClickCatcher onAddPoint={onAddPoint} />}

      {/* Linje under tegning: første punkt */}
      {draftMode && draftPoint && (
        <CircleMarker center={draftPoint} radius={6}
          pathOptions={{ color: YELLOW, weight: 2, fillColor: YELLOW, fillOpacity: 0.7 }} />
      )}

      {/* Rute under tegning: live korridor-kanter (bredde-forhåndsvisning) + senterlinje + noder */}
      {draftMode && draftPath.length > 0 && (
        <>
          {draftEdges && (
            <>
              <Polyline positions={draftEdges.left} pathOptions={{ color: YELLOW, weight: 1.5, opacity: 0.5 }} interactive={false} />
              <Polyline positions={draftEdges.right} pathOptions={{ color: YELLOW, weight: 1.5, opacity: 0.5 }} interactive={false} />
            </>
          )}
          {draftPath.length >= 2 && (
            <Polyline positions={draftPath}
              pathOptions={{ color: YELLOW, weight: 3, opacity: 0.9, dashArray: '6 6' }} interactive={false} />
          )}
          {draftPath.map((p, i) => (
            <CircleMarker key={`draft-${i}`} center={p} radius={5}
              pathOptions={{ color: YELLOW, weight: 2, fillColor: YELLOW, fillOpacity: 0.7 }} interactive={false} />
          ))}
        </>
      )}

      {/* Driftvakt under tegning: live sirkel (senter flyttes med tapp, radius med slider) */}
      {draftMode && draftCircle && (
        <>
          <Circle center={draftCircle.center} radius={draftCircle.radiusM}
            pathOptions={{ color: YELLOW, weight: 2, opacity: 0.9, dashArray: '6 6', fillColor: YELLOW, fillOpacity: 0.08 }}
            interactive={false} />
          <CircleMarker center={draftCircle.center} radius={6}
            pathOptions={{ color: YELLOW, weight: 2, fillColor: YELLOW, fillOpacity: 0.7 }} interactive={false} />
        </>
      )}

      {Object.entries(tripwires).map(([mmsi, t]) => {
        if (!t) return null
        const liveVessel = vessels.find(v => String(v.mmsi) === mmsi)
        const name = liveVessel?.name || t.vesselName || `MMSI ${mmsi}`

        const popup = !draftMode && (
          <TripwirePopup mmsi={mmsi} name={name} t={t} liveVessel={liveVessel}
            onRemoveTripwire={onRemoveTripwire} onSelectVessel={onSelectVessel}
            onSetCorridorWidth={onSetCorridorWidth}
            onSetCircleRadius={onSetCircleRadius} onRecenterCircle={onRecenterCircle} />
        )
        const paused = t.armed === false
        const lineOp = paused ? 0.4 : 0.95
        const edgeOp = paused ? 0.25 : 0.55

        // ── Korridor / rute ──
        if (t.type === 'corridor' && Array.isArray(t.path) && t.path.length >= 2) {
          const edges = corridorEdges(t.path, t.widthM ?? 250)
          return (
            <Fragment key={mmsi}>
              {/* Kant-linjer viser bredden på alle zoom-nivå */}
              {edges && (
                <>
                  <Polyline positions={edges.left}
                    pathOptions={{ color: YELLOW, weight: 1.5, opacity: edgeOp }} interactive={false} />
                  <Polyline positions={edges.right}
                    pathOptions={{ color: YELLOW, weight: 1.5, opacity: edgeOp }} interactive={false} />
                </>
              )}
              {/* Synlig senterlinje (ikke-klikkbar) */}
              <Polyline positions={t.path} interactive={false}
                pathOptions={{ color: YELLOW, weight: 3, opacity: lineOp, dashArray: '6 6', className: 'tripwire-line' }} />
              {/* Fat usynlig trykk-sone → popup */}
              <Polyline positions={t.path} pathOptions={HIT_OPTS}>{popup}</Polyline>
              {t.path.map((p, i) => (
                <CircleMarker key={`${mmsi}-n${i}`} center={p} radius={4} pathOptions={NODE_OPTS}>{popup}</CircleMarker>
              ))}
            </Fragment>
          )
        }

        // ── Driftvakt (sirkel) ──
        if (t.type === 'circle' && Array.isArray(t.center) && t.radiusM > 0) {
          return (
            <Fragment key={mmsi}>
              {/* Synlig disk — IKKE interaktiv: må ikke sluke tapp på fartøy inni
                  sirkelen (ankervakta sin båt ligger alltid inni). Popup nås via
                  usynlig fet kant-ring under (samme mønster som HIT_OPTS). */}
              <Circle center={t.center} radius={t.radiusM} interactive={false}
                pathOptions={{ color: YELLOW, weight: 2, opacity: lineOp, dashArray: '6 6', fillColor: YELLOW, fillOpacity: paused ? 0.04 : 0.08, className: 'tripwire-line' }} />
              {/* Fat usynlig trykk-sone langs kanten → popup. fill:false gjør at
                  interiøret slipper klikk gjennom til fartøyene. */}
              <Circle center={t.center} radius={t.radiusM}
                pathOptions={{ ...HIT_OPTS, fill: false }}>
                {popup}
              </Circle>
              <CircleMarker center={t.center} radius={6} pathOptions={NODE_OPTS} interactive={false} />
            </Fragment>
          )
        }

        // ── Linje (default / bakoverkompat) ──
        if (!t.a || !t.b) return null
        return (
          <Fragment key={mmsi}>
            <Polyline positions={[t.a, t.b]} interactive={false}
              pathOptions={{ color: YELLOW, weight: 3, opacity: lineOp, dashArray: '6 6', className: 'tripwire-line' }} />
            {/* Fat usynlig trykk-sone → popup */}
            <Polyline positions={[t.a, t.b]} pathOptions={HIT_OPTS}>{popup}</Polyline>
            <CircleMarker center={t.a} radius={6} pathOptions={NODE_OPTS}>{popup}</CircleMarker>
            <CircleMarker center={t.b} radius={6} pathOptions={NODE_OPTS}>{popup}</CircleMarker>
          </Fragment>
        )
      })}
    </>
  )
}
