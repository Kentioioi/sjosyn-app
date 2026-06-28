export default function StatsBar({ vessels, connected, msgCount, isDemoMode }) {
  // Tell bare ferske fartøy som "i fart" — stale rapporter er gjerne mer enn
  // 15 min gamle og kan vise feilaktig høy fart
  const moving = vessels.filter(v => v.sog > 0.5 && !v.stale).length
  const fastest = vessels.reduce((max, v) => (!v.stale && v.sog > (max?.sog || 0) ? v : max), null)

  return (
    <div className="stats-bar">
      <div className="stats-item">
        <div className={`conn-dot ${connected ? 'connected' : 'disconnected'}`} />
        <span>{isDemoMode ? 'DEMO' : connected ? 'DIREKTE' : 'AV'}</span>
      </div>
      <div className="stats-divider" />
      <div className="stats-item">
        <span className="stats-num">{vessels.length}</span>
        <span className="stats-label">fartøy</span>
      </div>
      <div className="stats-divider" />
      <div className="stats-item">
        <span className="stats-num">{moving}</span>
        <span className="stats-label">i fart</span>
      </div>
      {fastest && (
        <>
          <div className="stats-divider" />
          <div className="stats-item">
            <span className="stats-num">{fastest.sog.toFixed(1)}kn</span>
            <span className="stats-label">raskest</span>
          </div>
        </>
      )}
      <div className="stats-divider" />
      <div className="stats-item">
        <span className="stats-num">{msgCount}</span>
        <span className="stats-label">oppdat.</span>
      </div>
    </div>
  )
}
