import { useEffect, useState } from 'react'
import './BackToTop.css'

const FADE_RATIO = 0.1

export default function BackToTop() {
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    const handleScroll = () => {
      const threshold = window.innerHeight * FADE_RATIO
      setOpacity(threshold > 0 ? Math.min(window.scrollY / threshold, 1) : 1)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      type="button"
      className="back-to-top"
      style={{ opacity, pointerEvents: opacity === 0 ? 'none' : 'auto' }}
      onClick={handleClick}
      aria-label="ページトップへ戻る"
    >
      <span className="back-to-top-line" aria-hidden="true" />
      <span className="back-to-top-text">PAGE TOP</span>
    </button>
  )
}
