import { useEffect, useRef, useState } from 'react'
import ScrambleText from './ScrambleText.jsx'
import './MoreFiller.css'

const STAGGER_MS = 100 / 1.5

export default function MoreFiller({ count = 6, className = '' }) {
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
              baseDuration={STAGGER_MS}
              stagger={STAGGER_MS}
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
