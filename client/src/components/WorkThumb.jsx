import './WorkThumb.css'

const CATEGORY_LABEL = {
  web: 'WEB',
  '3d': '3D',
  illustration: 'ILLUSTRATION',
  ai: 'AI',
}

export default function WorkThumb({ work }) {
  return (
    <div className={`work-thumb work-thumb--${work.accent}`}>
      <span className="work-thumb-category">{CATEGORY_LABEL[work.category]}</span>
      <span className="work-thumb-title">{work.title}</span>
    </div>
  )
}
