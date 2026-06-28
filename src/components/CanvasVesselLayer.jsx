import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import { DomUtil } from 'leaflet'
import { getVesselColor } from '../utils/vesselTypes'
import { sizeForVessel } from './VesselIcon'
import { stepVessel, easeAlpha, projectPoint, TICK_MS } from '../utils/vesselGeo'
import { buildLabelLayout } from '../utils/labelLayout'

// Canvas renderer for vessels — the scalable alternative to one DOM divIcon per
// vessel. Thousands of boats become draw calls on ONE <canvas> instead of ~6 DOM
// nodes each (2600 vessels = ~15.8k nodes on the DOM path → ~600 on this path).
//
// Draws: heading triangles, selected ring, stale dim, and heading vectors
// (5'/10'/15' dead-reckon projection). Name labels are HYBRID — kept as DOM
// elements (crisp text/outline) but only for vessels on screen, in a pooled
// label pane, laid out with the same de-overlap as the DOM path. Motion (shared
// dead-reckoning), click hit-test, and zoom-animation tracking all included.
// Gated behind MapView's VESSEL_RENDER flag (default 'dom').

const CLICK_HIT_PX = 14          // tap tolerance for selecting the nearest vessel
// Draw triangles this fraction of a screen BEYOND each edge. The AIS poll loads
// vessels out to ~0.6 screen past the view (60% bbox margin), so drawing that far
// means every loaded vessel is already painted before it reaches the edge — it
// slides in on a pan/fling instead of popping in (DOM-path behaviour). Canvas
// draw is cheap (it's DOM *nodes* that cost, not draw calls), so this is ~free.
const CULL_MARGIN_FRAC = 0.6
const LABEL_FONT = "600 9px system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
const VLF_POS = { top: 'vlf-top', bottom: 'vlf-bottom', left: 'vlf-left', right: 'vlf-right' }
const VL_SIZE = { '0.42rem': 'vl-sm', '0.50rem': 'vl-md', '0.58rem': 'vl-lg' }

// Heading vector: dashed dead-reckon projection line + 5'/10'/15' dots, mirroring
// the SVG HeadingVector. `labeled` adds the minute text (selected vessel only).
function drawVector(ctx, map, entry, labeled, size) {
  const v = entry.vessel
  const sog = v.sog ?? 0
  if (sog < 0.5) return
  const cog = v.cog ?? 0
  const base = map.latLngToContainerPoint(entry.rendered)
  // Cull vectors whose base is more than a full screen off any edge — the tail
  // reaches at most ~15 min ahead, so anything that far out can't touch the view.
  // Avoids projectPoint×3 + stroke per off-screen vessel each frame (vectorsForAll
  // iterates the whole registry, most of which is off-screen at high zoom).
  const M = Math.max(size.x, size.y)
  if (base.x < -M || base.y < -M || base.x > size.x + M || base.y > size.y + M) return
  const pts = [5, 10, 15].map(m => {
    const ll = projectPoint(entry.rendered[0], entry.rendered[1], cog, sog, m)
    return map.latLngToContainerPoint(ll)
  })
  const color = getVesselColor(v.type)
  ctx.save()
  ctx.globalAlpha = 0.85
  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.setLineDash([4, 6])
  ctx.beginPath()
  ctx.moveTo(base.x, base.y)
  for (const p of pts) ctx.lineTo(p.x, p.y)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.globalAlpha = 1
  pts.forEach((p, i) => {
    ctx.beginPath()
    ctx.arc(p.x, p.y, i === 2 ? 5 : 4, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
    ctx.lineWidth = 1.5
    ctx.strokeStyle = '#ffffff'
    ctx.stroke()
  })
  if (labeled) {
    // Below the dot, matching the DOM createMinuteLabel anchor (iconAnchor y=-4).
    ctx.font = LABEL_FONT
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.lineWidth = 3
    ctx.strokeStyle = 'rgba(10,20,30,0.85)'
    ctx.fillStyle = '#ffffff'
    ;['5′', '10′', '15′'].forEach((t, i) => {
      ctx.strokeText(t, pts[i].x, pts[i].y + 4)
      ctx.fillText(t, pts[i].x, pts[i].y + 4)
    })
  }
  ctx.restore()
}

function drawVessel(ctx, map, entry, selected, size, darkMap) {
  const v = entry.vessel
  const p = map.latLngToContainerPoint(entry.rendered)
  const mx = size.x * CULL_MARGIN_FRAC, my = size.y * CULL_MARGIN_FRAC
  if (p.x < -mx || p.y < -my || p.x > size.x + mx || p.y > size.y + my) return

  const color = getVesselColor(v.type)
  const sz = sizeForVessel(v, selected)
  const outer = sz + 8
  const heading = v.hdg ?? v.cog ?? 0
  const stale = v.stale === true

  // Selected highlight ring (behind the triangle) — always full opacity.
  if (selected) {
    ctx.globalAlpha = 1
    ctx.beginPath()
    ctx.arc(p.x, p.y, outer / 2 - 1, 0, Math.PI * 2)
    ctx.fillStyle = color + '33'
    ctx.fill()
    ctx.lineWidth = 1.5
    ctx.strokeStyle = color
    ctx.stroke()
  }

  // Heading triangle — same geometry as the SVG icon, rotated by heading.
  ctx.save()
  ctx.translate(p.x, p.y)
  ctx.rotate((heading * Math.PI) / 180)
  ctx.beginPath()
  ctx.moveTo(0, -sz / 2)
  ctx.lineTo(sz / 2.8, sz / 2.8)
  ctx.lineTo(0, sz / 4)
  ctx.lineTo(-sz / 2.8, sz / 2.8)
  ctx.closePath()

  // Fill dims for stale (ghost = hollow); solid for live.
  ctx.globalAlpha = stale ? 0.28 : 1
  ctx.fillStyle = color
  ctx.fill()

  // Outline. Live vessels get a SOFT edge — the bright category fill carries
  // visibility, so this is just definition (theme-aware so the darker fills keep
  // an edge on the dark basemap). Stale "ghosts" have a hollow fill, so they get
  // a HARD, full-strength, theme-aware outline that carries them on any basemap.
  ctx.globalAlpha = 1
  if (selected) {
    ctx.lineWidth = 1.6
    ctx.strokeStyle = '#ffffff'
  } else if (stale) {
    ctx.lineWidth = 1.2
    ctx.strokeStyle = darkMap ? 'rgba(255,255,255,0.75)' : 'rgba(10,20,24,0.88)'
  } else {
    ctx.lineWidth = 0.8
    ctx.strokeStyle = darkMap ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)'
  }
  ctx.stroke()
  ctx.restore()
  ctx.globalAlpha = 1
}

export default function CanvasVesselLayer({
  vessels, selectedMmsi, onSelectVessel, project = true,
  pickMode = false, drawMode = false,
  showLabels = false, vectorsForAll = false, zoom = 0, trackHours = 0,
  darkMap = false,
}) {
  const map = useMap()
  const regRef = useRef(new Map())   // mmsi -> { vessel, rendered:[lat,lon]|null, msgMs }
  // Latest props for use inside the interval/listeners without re-subscribing.
  const stateRef = useRef({})
  stateRef.current = { selectedMmsi, onSelectVessel, project, pickMode, drawMode, showLabels, vectorsForAll, zoom, trackHours, darkMap }

  // Sync the registry from the vessels prop each poll, preserving the rendered
  // (dead-reckoned) position so motion is continuous across updates.
  useEffect(() => {
    const reg = regRef.current
    const seen = new Set()
    for (const v of vessels) {
      const key = String(v.mmsi)
      seen.add(key)
      const msgMs = Date.parse(v.timestamp) || Date.now()
      const e = reg.get(key)
      if (e) { e.vessel = v; e.msgMs = msgMs }
      else reg.set(key, { vessel: v, rendered: null, msgMs })
    }
    for (const k of reg.keys()) if (!seen.has(k)) reg.delete(k)
  }, [vessels])

  // Create the canvas + motion loop + map listeners once per map.
  useEffect(() => {
    const PANE = 'vesselCanvasPane'
    let pane = map.getPane(PANE)
    if (!pane) {
      pane = map.createPane(PANE)
      pane.style.zIndex = 600           // over wave/wind (440/442), with markers
      pane.style.pointerEvents = 'none' // clicks fall through to the map → hit-test
    }
    const canvas = DomUtil.create('canvas', 'leaflet-vessel-canvas', pane)
    const ctx = canvas.getContext('2d')
    let dpr = window.devicePixelRatio || 1
    // Geo top-left the canvas bitmap was last drawn for — used by the zoomanim
    // handler to CSS-transform the bitmap so it tracks an animated zoom.
    let drawTopLeftLatLng = null

    // ── Hybrid name labels: DOM elements for on-screen vessels only ──────────
    // Triangles are on the canvas, but names stay as DOM (crisp text/outline).
    // Each label is wrap(positioned at the vessel's layer point via setPosition)
    // > inner(.vessel-label--free, offset to the side via a .vlf-* transform).
    let labelPane = map.getPane('vesselLabelPane')
    if (!labelPane) {
      labelPane = map.createPane('vesselLabelPane')
      labelPane.style.zIndex = 601
      labelPane.style.pointerEvents = 'none'
    }
    const labelEls = new Map()   // mmsi -> { wrap, inner }

    const positionLabels = () => {
      if (!labelEls.size) return
      const reg = regRef.current
      labelEls.forEach((o, mmsi) => {
        const e = reg.get(mmsi)
        if (!e || !e.rendered) { o.wrap.style.display = 'none'; return }
        o.wrap.style.display = ''
        DomUtil.setPosition(o.wrap, map.latLngToLayerPoint(e.rendered))
      })
    }

    // Recompute which vessels get a DOM label (on-screen + named) and their
    // de-overlap side/size. Cheap (tens of on-screen items); not run per frame.
    const updateLabelSet = () => {
      const { showLabels, zoom } = stateRef.current
      const reg = regRef.current
      if (!showLabels) { labelEls.forEach(o => o.wrap.remove()); labelEls.clear(); return }
      const size = map.getSize()
      const list = []
      reg.forEach((e, mmsi) => {
        if (!e.rendered) return
        const name = e.vessel.name
        if (!name || name.startsWith('MMSI ')) return
        const p = map.latLngToContainerPoint(e.rendered)
        if (p.x < -30 || p.y < -30 || p.x > size.x + 30 || p.y > size.y + 30) return
        list.push({ mmsi, lat: e.rendered[0], lon: e.rendered[1], name, stale: e.vessel.stale === true })
      })
      const CAP = 300   // safety bound; on-screen named count is normally far lower
      const capped = list.length > CAP ? list.slice(0, CAP) : list
      const layout = buildLabelLayout(capped, zoom)
      const want = new Set()
      for (const s of capped) {
        want.add(s.mmsi)
        const lay = layout.get(s.mmsi) || { pos: 'top', fontSize: '0.58rem' }
        let o = labelEls.get(s.mmsi)
        if (!o) {
          const wrap = document.createElement('div')
          wrap.style.position = 'absolute'
          wrap.style.left = '0'
          wrap.style.top = '0'
          const inner = document.createElement('div')
          inner.textContent = s.name
          wrap.appendChild(inner)
          labelPane.appendChild(wrap)
          o = { wrap, inner }
          labelEls.set(s.mmsi, o)
        }
        // Re-sync text for pooled labels (AIS can deliver a corrected name for the
        // same MMSI) and dim stale ones to match the DOM .vessel-wrap--stale label.
        if (o.inner.textContent !== s.name) o.inner.textContent = s.name
        o.inner.className = `vessel-label vessel-label--free ${VLF_POS[lay.pos] || 'vlf-top'} ${VL_SIZE[lay.fontSize] || 'vl-lg'}${s.stale ? ' vessel-label--stale' : ''}`
      }
      labelEls.forEach((o, mmsi) => { if (!want.has(mmsi)) { o.wrap.remove(); labelEls.delete(mmsi) } })
      positionLabels()
    }

    const resize = () => {
      const size = map.getSize()
      // Unmeasured container at mount (backgrounded/hidden PWA launch) → getSize
      // is 0. Don't collapse the canvas to 0×0; a later 'resize' (BoundsWatcher's
      // invalidateSize) or whenReady below will size it once the map has extent.
      if (!size.x || !size.y) return
      dpr = window.devicePixelRatio || 1
      canvas.width = size.x * dpr
      canvas.height = size.y * dpr
      canvas.style.width = size.x + 'px'
      canvas.style.height = size.y + 'px'
    }

    // Keep the canvas glued to the viewport despite the map pane's pan transform
    // (Leaflet.heat pattern), then draw every vessel in container-point space.
    const draw = () => {
      // setPosition writes a plain translate, which also clears any scale left by
      // the zoomanim handler below — so a redraw at zoomend lands crisp.
      DomUtil.setPosition(canvas, map.containerPointToLayerPoint([0, 0]))
      drawTopLeftLatLng = map.containerPointToLatLng([0, 0])
      const size = map.getSize()
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, size.x, size.y)
      const reg = regRef.current
      const { selectedMmsi, vectorsForAll, trackHours, darkMap } = stateRef.current
      const sel = String(selectedMmsi ?? '')
      const selEntry = reg.get(sel)?.rendered ? reg.get(sel) : null

      // 1) Heading vectors UNDER the triangles (matches DOM z: vectors < markers).
      if (vectorsForAll) {
        reg.forEach((e, mmsi) => { if (e.rendered && mmsi !== sel) drawVector(ctx, map, e, false, size) })
      }
      if (trackHours === 0 && selEntry) drawVector(ctx, map, selEntry, true, size)

      // 2) Triangles (selected drawn last so its ring sits on top).
      reg.forEach((e, mmsi) => { if (e.rendered && mmsi !== sel) drawVessel(ctx, map, e, false, size, darkMap) })
      if (selEntry) drawVessel(ctx, map, selEntry, true, size, darkMap)

      // 3) Reposition the DOM name labels to the current rendered positions.
      positionLabels()
    }

    resize()
    draw()

    // Motion: setInterval (not rAF) so it ticks even while the preview isn't
    // compositing, and matches MotionTicker's cadence. Pauses when hidden.
    let last = performance.now()
    let resumedAt = Date.now()
    const onResume = () => { if (document.visibilityState === 'visible') resumedAt = Date.now() }
    document.addEventListener('visibilitychange', onResume)
    window.addEventListener('pageshow', onResume)

    let labelTick = 0
    const timer = setInterval(() => {
      if (document.hidden) { last = performance.now(); return }
      const now = performance.now()
      const dt = now - last; last = now
      const ctx2 = { project: stateRef.current.project, alpha: easeAlpha(dt), dtEff: Math.min(dt, 1500), nowMs: Date.now(), freezeBeforeMs: resumedAt }
      regRef.current.forEach(e => { e.rendered = stepVessel(e, ctx2) })
      // Refresh the label SET ~1×/s (new polls, drift); positions update every
      // frame inside draw(). Cheap — only the on-screen named subset.
      if (++labelTick % 10 === 0) updateLabelSet()
      draw()
    }, TICK_MS)

    const onViewChange = () => draw()                          // move/zoom frames
    const onSettle = () => { updateLabelSet(); draw() }         // after pan/zoom
    const onResize = () => { resize(); updateLabelSet(); draw() }
    // During an animated (CSS) zoom Leaflet fires ONLY 'zoomanim' per frame (not
    // move/zoom/moveend), so without this the layer would freeze and snap at
    // zoomend. CSS-transform the canvas bitmap to track the zoom (mirrors
    // Leaflet's renderer _animateZoom) and reposition each DOM label to its new
    // layer point (mirrors Marker._animateZoom — labels don't scale). The next
    // draw (on zoomend) resets the canvas transform via setPosition.
    const onZoomAnim = (e) => {
      if (!drawTopLeftLatLng) return
      const scale = map.getZoomScale(e.zoom)
      DomUtil.setTransform(canvas, map._latLngToNewLayerPoint(drawTopLeftLatLng, e.zoom, e.center), scale)
      const reg = regRef.current
      labelEls.forEach((o, mmsi) => {
        const en = reg.get(mmsi)
        // Mirror positionLabels: hide orphans (vessel removed by a poll mid-zoom)
        // instead of leaving them frozen at a stale point until zoomend.
        if (en?.rendered) { o.wrap.style.display = ''; DomUtil.setPosition(o.wrap, map._latLngToNewLayerPoint(en.rendered, e.zoom, e.center)) }
        else o.wrap.style.display = 'none'
      })
    }
    map.on('move zoom', onViewChange)
    map.on('moveend zoomend viewreset', onSettle)
    map.on('resize', onResize)
    map.on('zoomanim', onZoomAnim)
    // Recover from a zero-size mount (hidden/backgrounded launch): re-size + draw
    // once the map is ready, in case getSize() was 0 when the effect first ran.
    map.whenReady(() => { resize(); updateLabelSet(); draw() })

    const onClick = (ev) => {
      const { onSelectVessel, pickMode, drawMode } = stateRef.current
      if (!onSelectVessel) return
      // Home-pick and tripwire-draw also listen to map 'click'. Don't steal the
      // tap to select a vessel while either mode is active (both fire otherwise).
      if (pickMode || drawMode) return
      const cp = ev.containerPoint
      let best = null, bestD = CLICK_HIT_PX * CLICK_HIT_PX
      regRef.current.forEach(e => {
        if (!e.rendered) return
        const p = map.latLngToContainerPoint(e.rendered)
        const dx = p.x - cp.x, dy = p.y - cp.y
        const d = dx * dx + dy * dy
        if (d < bestD) { bestD = d; best = e.vessel }
      })
      if (best) onSelectVessel(best)
    }
    map.on('click', onClick)

    return () => {
      clearInterval(timer)
      document.removeEventListener('visibilitychange', onResume)
      window.removeEventListener('pageshow', onResume)
      map.off('move zoom', onViewChange)
      map.off('moveend zoomend viewreset', onSettle)
      map.off('resize', onResize)
      map.off('zoomanim', onZoomAnim)
      map.off('click', onClick)
      labelEls.forEach(o => o.wrap.remove())
      labelEls.clear()
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas)
    }
  }, [map])

  return null
}
