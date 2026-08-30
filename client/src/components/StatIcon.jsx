import { useId } from 'react'

export default function StatIcon({ type, percent = 0 }) {
  const gradId = useId()

  if (type === 'arrow') {
    return (
      <svg className="stat-icon" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={gradId} x1="8" y1="32" x2="32" y2="8" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#17d9ff" />
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
            <stop offset="0" stopColor="#17d9ff" />
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
    return (
      <svg className="stat-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"
          stroke="#17d9ff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M3 3v5h5" stroke="#17d9ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"
          stroke="#17d9ff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M16 16h5v5" stroke="#17d9ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  return null
}
