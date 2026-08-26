import { Link, Navigate, useParams } from 'react-router-dom'
import { getWorkById, WORKS } from '../data/works.js'
import WorkThumb from '../components/WorkThumb.jsx'
import './WorksDetail.css'

export default function WorksDetail() {
  const { id } = useParams()
  const work = getWorkById(id)

  if (!work) return <Navigate to="/#works" replace />

  const otherWorks = WORKS.filter((w) => w.id !== work.id && w.category === work.category).slice(0, 3)

  return (
    <>
      <section className="wd-hero">
        <WorkThumb work={work} />
        <div className="container wd-hero-body">
          <Link to="/#works" className="wd-back">
            ← 実績一覧へ戻る
          </Link>
          <div className="wd-tags">
            {work.tags.map((t) => (
              <span className="tag" key={t}>
                {t}
              </span>
            ))}
          </div>
          <h1>{work.title}</h1>
          <p className="wd-client">{work.client}</p>
        </div>
      </section>

      <section className="section">
        <div className="container wd-grid">
          <div className="wd-body">
            <p className="wd-summary">{work.summary}</p>

            <h2 className="sd-heading">制作前の課題</h2>
            <p className="wd-text">{work.challenge}</p>

            <h2 className="sd-heading">提案内容・アプローチ</h2>
            <p className="wd-text">{work.approach}</p>

            <h2 className="sd-heading">成果</h2>
            <p className="wd-text">{work.result}</p>
          </div>

          <aside className="wd-aside">
            <div className="card wd-info-card">
              <dl>
                <div>
                  <dt>クライアント</dt>
                  <dd>{work.client}</dd>
                </div>
                <div>
                  <dt>業種</dt>
                  <dd>{work.industry}</dd>
                </div>
                <div>
                  <dt>使用ツール・技術</dt>
                  <dd>{work.tools.join(' / ')}</dd>
                </div>
              </dl>
            </div>
            <div className="card sd-cta-card">
              <p className="sd-cta-title">同じようなご相談はありますか？</p>
              <p className="sd-cta-desc">類似の課題感でも、まずはお気軽にご相談ください。</p>
              <a href="#contact" className="btn btn-primary sd-cta-btn">
                お問い合わせ
              </a>
            </div>
          </aside>
        </div>

        {otherWorks.length > 0 && (
          <div className="container">
            <h2 className="sd-heading">関連する実績</h2>
            <div className="grid wd-related-grid">
              {otherWorks.map((w) => (
                <Link to={`/works/${w.id}`} className="card sd-work-card" key={w.id}>
                  <WorkThumb work={w} />
                  <p className="sd-work-title">{w.title}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  )
}
