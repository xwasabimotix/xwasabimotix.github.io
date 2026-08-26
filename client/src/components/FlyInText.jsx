import { Fragment, useEffect, useRef, useState } from 'react'
import './FlyInText.css'

export default function FlyInText({ text, as: Tag = 'span', className = '', charDelay = 0.1 }) {
  const lines = Array.isArray(text) ? text : [text]
  const ref = useRef(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          setStarted(true)
          observer.disconnect()
        })
      },
      { threshold: 0.4 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  let charIndex = 0

  return (
    <Tag className={`fly-in-text ${className}`} ref={ref}>
      {lines.map((line, lineIdx) => (
        <Fragment key={lineIdx}>
          {lineIdx > 0 && <br />}
          {Array.from(line).map((char) => {
            const delay = charIndex * charDelay
            charIndex += 1
            return (
              <span
                key={charIndex}
                className={`fly-in-char ${started ? 'is-active' : ''}`}
                style={{ animationDelay: `${delay}s` }}
              >
                {char === ' ' ? ' ' : char}
              </span>
            )
          })}
        </Fragment>
      ))}
    </Tag>
  )
}
