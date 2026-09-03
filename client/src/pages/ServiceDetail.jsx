import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { SERVICES, getServiceBySlug } from '../data/services.js'
import { WORKS } from '../data/works.js'
import WorkThumb from '../components/WorkThumb.jsx'
import './ServiceDetail.css'

const CATEGORY_BY_SLUG = { web: 'web', visual: '3d', ai: 'ai' }

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`faq-item ${open ? 'is-open' : ''}`}>
      <button type="button" className="faq-question" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <span>{q}</span>
        <span className="faq-toggle" aria-hidden="true" />
      </button>
      {open && <p className="faq-answer">{a}</p>}
    </div>
  )
}

export default function ServiceDetail() {
  const { slug } = useParams()
  const service = getServiceBySlug(slug)

  if (!service) return <Navigate to="/#service" replace />

  const relatedWorks = WORKS.filter((w) => w.category === CATEGORY_BY_SLUG[slug]).slice(0, 3)
  const otherServices = SERVICES.filter((s) => s.slug !== slug)

  return (
    <>
      <section className="page-hero bg-navy">
        <div className="container">
          <p className="eyebrow">SERVICE</p>
          <h1>{service.label}</h1>
          <p className="page-hero-lead">{service.lead}</p>
        </div>
      </section>

      <section className="section">
        <div className="container service-detail-grid">
          <div>
            <h2 className="sd-heading">できること</h2>
            <ul className="sd-list">
              {service.canDo.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <h2 className="sd-heading">制作の流れ</h2>
            <ol className="sd-flow">
              {service.flow.map((step, i) => (
                <li key={step.title}>
                  <span className="sd-flow-num">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <p className="sd-flow-title">{step.title}</p>
                    <p className="sd-flow-desc">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>

            <h2 className="sd-heading">料金帯の目安</h2>
            <div className="grid sd-price-grid">
              {service.priceTiers.map((tier) => (
                <div className="card sd-price-card" key={tier.name}>
                  <p className="sd-price-name">{tier.name}</p>
                  <p className="sd-price-value text-gradient">{tier.price}</p>
                  <p className="sd-price-desc">{tier.desc}</p>
                </div>
              ))}
            </div>
            <p className="sd-price-note">※ {service.priceNote}</p>

            {relatedWorks.length > 0 && (
              <>
                <h2 className="sd-heading">関連実績</h2>
                <div className="grid sd-works-grid">
                  {relatedWorks.map((work) => (
                    <Link to={`/works/${work.id}`} className="card sd-work-card" key={work.id}>
                      <WorkThumb work={work} />
                      <p className="sd-work-title">{work.title}</p>
                    </Link>
                  ))}
                </div>
              </>
            )}

            <h2 className="sd-heading">よくある質問</h2>
            <div className="faq-list">
              {service.faq.map((f) => (
                <FaqItem key={f.q} q={f.q} a={f.a} />
              ))}
            </div>
          </div>

          <aside className="sd-aside">
            <div className="card sd-cta-card">
              <p className="sd-cta-title">{service.label}について相談する</p>
              <p className="sd-cta-desc">要件が固まっていない段階でも構いません。まずはお気軽にご連絡ください。</p>
              <a href="#contact" className="btn btn-primary sd-cta-btn">
                お問い合わせ
              </a>
            </div>

            <div className="card sd-other-card">
              <p className="sd-other-title">他のサービス</p>
              <ul>
                {otherServices.map((s) => (
                  <li key={s.slug}>
                    <Link to={`/service/${s.slug}`}>{s.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
