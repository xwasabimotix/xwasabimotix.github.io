export default function Eyebrow({ text, className = '' }) {
  return (
    <p className={`eyebrow ${className}`}>
      <span className="scramble-text">{text}</span>
    </p>
  )
}
