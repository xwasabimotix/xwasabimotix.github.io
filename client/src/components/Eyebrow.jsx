import { useEffect, useRef, useState } from 'react'
import ScrambleText from './ScrambleText.jsx'

export default function Eyebrow({ text, className = '' }) {
  const ref = useRef(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true)
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
      {started ? (
        <ScrambleText text={text} />
      ) : (
        <span className="scramble-text">
          {Array.from(text).map((c, i) => (
            <span className="scramble-char" key={i} data-char={c}>
              {c === ' ' ? ' ' : c}
            </span>
          ))}
        </span>
      )}
    </p>
  )
}
