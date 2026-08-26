import { useEffect, useRef, useState } from 'react'
import './CustomScrollbar.css'

const MIN_THUMB = 32
const FADE_START = 400
const FADE_RANGE = 200

export default function CustomScrollbar() {
  const trackRef = useRef(null)
  const draggingRef = useRef(false)
  const dragOffsetRef = useRef(0)
  const [metrics, setMetrics] = useState({ thumbHeight: 0, thumbTop: 0, opacity: 0, visible: false })

  useEffect(() => {
    const update = () => {
      const track = trackRef.current
      if (!track) return

      const viewportHeight = window.innerHeight
      const scrollHeight = document.documentElement.scrollHeight
      const trackHeight = track.clientHeight
      const opacity = Math.min(Math.max((window.scrollY - FADE_START) / FADE_RANGE, 0), 1)

      if (scrollHeight <= viewportHeight) {
        setMetrics((m) => (m.visible ? { ...m, visible: false } : m))
        return
      }

      const thumbHeight = Math.max((viewportHeight / scrollHeight) * trackHeight, MIN_THUMB)
      const maxScroll = scrollHeight - viewportHeight
      const maxThumbTop = trackHeight - thumbHeight
      const thumbTop = maxScroll > 0 ? (window.scrollY / maxScroll) * maxThumbTop : 0

      setMetrics({ thumbHeight, thumbTop, opacity, visible: true })
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    const resizeObserver = new ResizeObserver(update)
    resizeObserver.observe(document.documentElement)

    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      resizeObserver.disconnect()
    }
  }, [])

  const scrollToClientY = (clientY) => {
    const track = trackRef.current
    if (!track) return

    const rect = track.getBoundingClientRect()
    const trackHeight = rect.height
    const viewportHeight = window.innerHeight
    const scrollHeight = document.documentElement.scrollHeight
    const thumbHeight = Math.max((viewportHeight / scrollHeight) * trackHeight, MIN_THUMB)
    const maxThumbTop = trackHeight - thumbHeight
    const maxScroll = scrollHeight - viewportHeight

    let thumbTop = clientY - rect.top - dragOffsetRef.current
    thumbTop = Math.min(Math.max(thumbTop, 0), maxThumbTop)

    const ratio = maxThumbTop > 0 ? thumbTop / maxThumbTop : 0
    window.scrollTo({ top: ratio * maxScroll, behavior: 'instant' })
  }

  const handleThumbPointerDown = (e) => {
    draggingRef.current = true
    dragOffsetRef.current = e.clientY - e.currentTarget.getBoundingClientRect().top
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handleThumbPointerMove = (e) => {
    if (!draggingRef.current) return
    scrollToClientY(e.clientY)
  }

  const handleThumbPointerUp = () => {
    draggingRef.current = false
  }

  const handleTrackClick = (e) => {
    if (e.target !== trackRef.current) return
    dragOffsetRef.current = metrics.thumbHeight / 2
    scrollToClientY(e.clientY)
  }

  return (
    <div
      className={`custom-scrollbar ${metrics.visible ? '' : 'is-hidden'}`}
      ref={trackRef}
      onClick={handleTrackClick}
      style={{ opacity: metrics.opacity, pointerEvents: metrics.opacity === 0 ? 'none' : 'auto' }}
    >
      <div
        className="custom-scrollbar-thumb"
        style={{ height: metrics.thumbHeight, transform: `translateY(${metrics.thumbTop}px)` }}
        onPointerDown={handleThumbPointerDown}
        onPointerMove={handleThumbPointerMove}
        onPointerUp={handleThumbPointerUp}
        onPointerCancel={handleThumbPointerUp}
      />
    </div>
  )
}
