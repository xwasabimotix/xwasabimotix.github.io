import { useId } from 'react'

export default function StatIcon({ type, percent = 0 }) {
  const gradId = useId()

  if (type === 'arrow') {
    return (
      <svg className="stat-icon" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={gradId} x1="8" y1="32" x2="32" y2="8" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#2f6bff" />
            <stop offset="1" stopColor="#17d9ff" />
          </linearGradient>
        </defs>
        <path
          d="M20 32V8M20 8L10 18M20 8L30 18"
          stroke={`url(#${gradId})`}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  if (type === 'calendar') {
    return (
      <svg className="stat-icon" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={gradId} x1="6" y1="5" x2="34" y2="33" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#2f6bff" />
            <stop offset="1" stopColor="#17d9ff" />
          </linearGradient>
        </defs>
        <rect x="6" y="9" width="28" height="24" rx="4" stroke={`url(#${gradId})`} strokeWidth="3" />
        <path d="M6 16H34" stroke={`url(#${gradId})`} strokeWidth="3" />
        <path d="M13 5V11" stroke={`url(#${gradId})`} strokeWidth="3" strokeLinecap="round" />
        <path d="M27 5V11" stroke={`url(#${gradId})`} strokeWidth="3" strokeLinecap="round" />
      </svg>
    )
  }

  if (type === 'ring') {
    const r = 15
    const circumference = 2 * Math.PI * r
    const offset = circumference - (percent / 100) * circumference

    return (
      <svg className="stat-icon" viewBox="0 0 40 40" aria-hidden="true">
        <defs>
          <linearGradient id={gradId} x1="5" y1="35" x2="35" y2="5" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#2f6bff" />
            <stop offset="1" stopColor="#17d9ff" />
          </linearGradient>
        </defs>
        <circle cx="20" cy="20" r={r} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="4" />
        <circle
          cx="20"
          cy="20"
          r={r}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 20 20)"
        />
      </svg>
    )
  }

  return null
}
