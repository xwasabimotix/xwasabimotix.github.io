import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Logo from './Logo.jsx'
import './Header.css'

const NAV_ITEMS = [
  { to: '/#about', label: 'ABOUT' },
  { to: '/#works', label: 'WORKS' },
  { to: '/#service', label: 'SERVICE' },
]

const SCROLL_START = 100
const SCROLL_RANGE = 200
const MAX_ALPHA = 0.8
const BASE_BLUR_PX = 16
const MIN_BLUR_RATIO = 0.5

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    setOpen(false)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const raw = (window.scrollY - SCROLL_START) / SCROLL_RANGE
      setScrollProgress(Math.min(Math.max(raw, 0), 1))
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`site-header ${scrollProgress > 0.5 ? 'is-light' : ''}`}
      style={{
        backgroundColor: `rgba(255, 255, 255, ${scrollProgress * MAX_ALPHA})`,
        backdropFilter: `blur(${BASE_BLUR_PX * (MIN_BLUR_RATIO + (1 - MIN_BLUR_RATIO) * scrollProgress)}px)`,
        WebkitBackdropFilter: `blur(${BASE_BLUR_PX * (MIN_BLUR_RATIO + (1 - MIN_BLUR_RATIO) * scrollProgress)}px)`,
      }}
    >
      <div className="container site-header-inner">
        <Logo variant="header" />

        <nav className={`site-nav ${open ? 'is-open' : ''}`} aria-label="グローバルナビゲーション">
          <ul>
            <li>
              <NavLink to="/" end onClick={() => setOpen(false)}>
                TOP
              </NavLink>
            </li>
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <Link to={item.to} onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <a href="#contact" className="btn btn-primary btn-sm site-nav-cta" onClick={() => setOpen(false)}>
            相談する
            <span className="btn-arrow" aria-hidden="true" />
          </a>
        </nav>

        <button
          type="button"
          className={`nav-toggle ${open ? 'is-open' : ''}`}
          aria-label="メニューを開閉する"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}
