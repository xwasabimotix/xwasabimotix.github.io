import { useEffect, useMemo, useRef, useState } from 'react'
import './ScrambleText.css'

export default function ScrambleText({
  text,
  as: Tag = 'span',
  className = '',
  baseDuration = 200,
  stagger = 60,
  accentLength = 0,
  easeStart = 1,
  easePower = 3,
  onComplete,
}) {
  const chars = useMemo(() => Array.from(text), [text])
  const [settledCount, setSettledCount] = useState(0)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  const thresholds = useMemo(() => {
    const result = []
    let acc = baseDuration
    const span = Math.max(chars.length - 2, 1)

    for (let i = 0; i < chars.length; i += 1) {
      if (i > 0) {
        const t = Math.min((i - 1) / span, 1)
        const multiplier = 1 + (easeStart - 1) * Math.pow(1 - t, easePower)
        acc += stagger * multiplier
      }
      result.push(acc)
    }

    return result
  }, [chars, baseDuration, stagger, easeStart, easePower])

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setSettledCount(chars.length)
      onCompleteRef.current?.()
      return undefined
    }

    const timers = chars.map((_, i) =>
      setTimeout(() => {
        setSettledCount((v) => Math.max(v, i + 1))
      }, thresholds[i]),
    )

    const totalDuration = thresholds[thresholds.length - 1] ?? baseDuration
    const completeTimer = setTimeout(() => onCompleteRef.current?.(), totalDuration)

    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(completeTimer)
    }
  }, [chars, thresholds, baseDuration])

  return (
    <Tag className={`scramble-text ${className}`}>
      {chars.map((c, i) => {
        const isSettled = i < settledCount
        const isActiveCursor = i === settledCount
        const displayChar = c === ' ' ? ' ' : c

        return (
          <span
            key={i}
            className={`scramble-char ${isSettled ? 'is-settled' : ''} ${
              isActiveCursor ? 'is-active-cursor' : ''
            } ${i >= chars.length - accentLength ? 'scramble-char--accent' : ''}`}
            data-char={c}
          >
            {displayChar}
          </span>
        )
      })}
    </Tag>
  )
}
