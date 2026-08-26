import { useEffect, useRef, useState } from 'react'
import ScrambleText from './ScrambleText.jsx'
import { SLOW_STAGGER_MS } from '../utils/typingCurve.js'
import './MoreFiller.css'

// 幅が狭いほど速く: 1400px以上で1.2倍、390px以下で2倍、間は線形補間
const WIDE_REF = 1400
const NARROW_REF = 390
const WIDE_SPEED = 1.2
const NARROW_SPEED = 2

const getSpeedMultiplier = (width) => {
  const t = (WIDE_REF - width) / (WIDE_REF - NARROW_REF)
  const clamped = Math.min(1, Math.max(0, t))
  return WIDE_SPEED + (NARROW_SPEED - WIDE_SPEED) * clamped
}

export default function MoreFiller({ count = 20, className = '' }) {
  const [started, setStarted] = useState(false)
  const [activeLine, setActiveLine] = useState(0)
  const [speedMultiplier, setSpeedMultiplier] = useState(WIDE_SPEED)
  const containerRef = useRef(null)

  useEffect(() => {
    const updateSpeed = () => setSpeedMultiplier(getSpeedMultiplier(window.innerWidth))
    updateSpeed()
    window.addEventListener('resize', updateSpeed)
    return () => window.removeEventListener('resize', updateSpeed)
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el || started) return undefined
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [started])

  const handleLineComplete = (index) => {
    setActiveLine((v) => (v === index ? v + 1 : v))
  }

  const stagger = SLOW_STAGGER_MS / speedMultiplier

  return (
    <div className={`more-filler ${className}`} ref={containerRef} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span className="more-filler-line" key={i}>
          {started && i <= activeLine ? (
            <ScrambleText
              as="span"
              text="MORE."
              baseDuration={stagger}
              stagger={stagger}
              onComplete={() => handleLineComplete(i)}
            />
          ) : (
            <span className="more-filler-pending">
              {Array.from('MORE.').map((c, ci) => (
                <span className="scramble-char" key={ci}>
                  {c}
                </span>
              ))}
            </span>
          )}
        </span>
      ))}
    </div>
  )
}
