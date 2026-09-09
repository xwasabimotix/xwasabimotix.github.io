import { useEffect, useRef, useState } from 'react'
import ScrambleText from './ScrambleText.jsx'

const GRADIENT_FROM = '#2f6bff'
const GRADIENT_TO = '#17d9ff'

function hexToRgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function interpolateColor(fromHex, toHex, t) {
  const [r1, g1, b1] = hexToRgb(fromHex)
  const [r2, g2, b2] = hexToRgb(toHex)
  const r = Math.round(r1 + (r2 - r1) * t)
  const g = Math.round(g1 + (g2 - g1) * t)
  const b = Math.round(b1 + (b2 - b1) * t)
  return `rgb(${r}, ${g}, ${b})`
}

export default function Eyebrow({ text, className = '' }) {
  const ref = useRef(null)
  const [typing, setTyping] = useState(false)
  const chars = Array.from(text)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTyping(true)
          observer.disconnect()
        }
      },
      { threshold: 0.4 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <p className={`eyebrow ${className}`} ref={ref}>
      {typing ? (
        <ScrambleText text={text} gradientFrom={GRADIENT_FROM} gradientTo={GRADIENT_TO} />
      ) : (
        <span className="scramble-text">
          {chars.map((c, i) => (
            <span
              key={i}
              style={{ color: interpolateColor(GRADIENT_FROM, GRADIENT_TO, chars.length > 1 ? i / (chars.length - 1) : 0) }}
            >
              {c}
            </span>
          ))}
        </span>
      )}
    </p>
  )
}
