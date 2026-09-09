import { useEffect, useRef, useState } from 'react'
import ScrambleText from './ScrambleText.jsx'

export default function Eyebrow({ text, className = '' }) {
  const ref = useRef(null)
  const [typing, setTyping] = useState(false)

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
      {typing ? <ScrambleText text={text} /> : <span className="scramble-text">{text}</span>}
    </p>
  )
}
