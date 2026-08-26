export const FAST_STAGGER_MS = 8
export const SLOW_STAGGER_MS = 100 / 1.5
export const EASE_STEEPNESS = 2.6

export const smoothstep = (t) => t * t * (3 - 2 * t)
export const clamp01 = (t) => Math.min(1, Math.max(0, t))

// compress the ramp into the last part of the range (change happens late, near the end)
const shapeLate = (t) => clamp01((t - (1 - 1 / EASE_STEEPNESS)) * EASE_STEEPNESS)
// compress the ramp into the first part of the range (change happens early, right after the start)
const shapeEarly = (t) => clamp01(t * EASE_STEEPNESS)

// fast (far from the anchor) -> slow (near the anchor), steep transition right before it
export const staggerIn = (i, count) =>
  FAST_STAGGER_MS + (SLOW_STAGGER_MS - FAST_STAGGER_MS) * smoothstep(shapeLate(i / (count - 1)))

// slow (near the anchor) -> fast (far from the anchor), steep transition right after it
export const staggerOut = (i, count) =>
  SLOW_STAGGER_MS + (FAST_STAGGER_MS - SLOW_STAGGER_MS) * smoothstep(shapeEarly(i / (count - 1)))
