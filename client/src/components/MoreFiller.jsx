import { useEffect, useRef, useState } from 'react'
import ScrambleText from './ScrambleText.jsx'
import { SLOW_STAGGER_MS } from '../utils/typingCurve.js'
import './MoreFiller.css'

export default function MoreFiller({ count = 20, className = '' }) {
  const [started, setStarted] = useState(false)
  const [activeLine, setActiveLine] = useState(0)
  const containerRef = useRef(null)

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

  return (
    <div className={`more-filler ${className}`} ref={containerRef} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span className="more-filler-line" key={i}>
          {started && i <= activeLine ? (
            <ScrambleText
              as="span"
              text="MORE."
              baseDuration={SLOW_STAGGER_MS}
              stagger={SLOW_STAGGER_MS}
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
