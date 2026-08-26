import { Link } from 'react-router-dom'
import './Logo.css'

export default function Logo({ variant = 'header', showTagline = false }) {
  return (
    <Link to="/" className={`logo logo--${variant}`} aria-label="SAKAI TECC ホームへ">
      <span className="logo-mark" aria-hidden="true">
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={`logoGrad-${variant}`} x1="4" y1="6" x2="60" y2="58" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#0b1230" />
              <stop offset="0.55" stopColor="#2f6bff" />
              <stop offset="1" stopColor="#17d9ff" />
            </linearGradient>
          </defs>
          <path
            d="M20 6C11 10 8 18 14 24c5 5 15 5 15 12 0 6-7 9-15 7"
            stroke={`url(#logoGrad-${variant})`}
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
          <path d="M30 44 46 12" stroke={`url(#logoGrad-${variant})`} strokeWidth="6" strokeLinecap="round" />
          <path d="M38 12h16" stroke={`url(#logoGrad-${variant})`} strokeWidth="6" strokeLinecap="round" />
          <circle cx="54" cy="10" r="5" fill="#17d9ff" />
        </svg>
      </span>
      <span className="logo-word">
        <span className="logo-word-main">
          SAKAI <span className="logo-word-accent">TECC</span>
        </span>
        {showTagline && <span className="logo-word-tagline">CREATE THE NEXT.</span>}
      </span>
    </Link>
  )
}
