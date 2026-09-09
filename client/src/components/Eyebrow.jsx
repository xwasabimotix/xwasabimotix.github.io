import { useEffect, useRef, useState } from 'react'
import ScrambleText from './ScrambleText.jsx'

export default function Eyebrow({ text, className = '' }) {
  const ref = useRef(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined

    // 一部の埋め込みブラウザ(VS CodeのSimple Browserなど)ではIntersectionObserverの
    // コールバックが発火しないことがあるため、一定時間で強制的に表示させるフォールバックを用意する
    const fallbackTimer = window.setTimeout(() => setStarted(true), 1500)

    if (typeof IntersectionObserver === 'undefined') {
      return () => window.clearTimeout(fallbackTimer)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true)
          observer.disconnect()
          window.clearTimeout(fallbackTimer)
        }
      },
      { threshold: 0.4 },
    )

    observer.observe(el)
    return () => {
      observer.disconnect()
      window.clearTimeout(fallbackTimer)
    }
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
