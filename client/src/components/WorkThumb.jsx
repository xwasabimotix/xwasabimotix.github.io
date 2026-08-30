import { useEffect, useRef, useState } from 'react'
import './WorkThumb.css'

const CATEGORY_LABEL = {
  web: 'WEB',
  '3d': '3D',
  illustration: 'ILLUSTRATION',
  ai: 'AI',
}

export default function WorkThumb({ work, index = 0 }) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const fromSide = index % 2 === 0 ? 'from-left' : 'from-right'

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          setIsVisible(true)
          observer.disconnect()
        })
      },
      { threshold: 0.25 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`work-thumb work-thumb--${work.accent} ${fromSide} ${isVisible ? 'is-visible' : ''}`}
    >
      <span className="work-thumb-category">{CATEGORY_LABEL[work.category]}</span>
      <span className="work-thumb-title">{work.title}</span>
    </div>
  )
}
