// Strukturell tynning av varsel-merker. Rutenettet er uniformt, så en
// px-avstandsterskel gjør enten ingenting eller fjerner alt — og grådig
// viewport-rekkefølge ville flippet HVILKE merker som vises for hver
// panorering. I stedet droppes hele rader/kolonner etter world-celleindeks
// (parset fra cellenøkkelen "gz/spacing/i/j"): deterministisk og stabilt
// under panorering.
//
// thin 0–100 (Innstillinger-slider):
//   0–:    alle punkter
//   1–49:  diagonal halvering (sjakkbrett)
//   50–74: hver 2. rad + kolonne (¼ igjen)
//   75–:   hver 3. rad + kolonne (1/9 igjen)
function cellIndex(key) {
  const p = key.split('/')
  return [Number(p[2]), Number(p[3])]
}

// JS % beholder fortegn — normaliser så negative indekser (vest/nord for
// origo) tynnes i samme mønster som positive.
const mod = (n, k) => ((n % k) + k) % k

export function thinForecastGrid(points, thin) {
  if (!thin || thin <= 0 || points.length < 2) return points
  if (thin < 50) {
    return points.filter(p => {
      const [i, j] = cellIndex(p.key)
      return mod(i + j, 2) === 0
    })
  }
  const k = thin < 75 ? 2 : 3
  return points.filter(p => {
    const [i, j] = cellIndex(p.key)
    return mod(i, k) === 0 && mod(j, k) === 0
  })
}
