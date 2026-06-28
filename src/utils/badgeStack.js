// Leaflet iconAnchor[1] for a forecast badge of `height` px at stack `slot`
// among the active layers sharing a grid cell. Slot 0 centers on the cell;
// each next slot drops a full badge height (+2px gap) below → toe-to-toe,
// never overlapping. (slot 1, height 16 → -10, matching the prior wind anchor.)
const GAP = 2

export function badgeAnchorY(height, slot) {
  return height / 2 - slot * (height + GAP)
}
