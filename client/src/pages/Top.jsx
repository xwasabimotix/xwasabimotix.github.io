import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import founderImg from '../assets/founder.png'
import workPhotoA from '../assets/Japanese Kaiseki Trio Overhead.png'
import workPhotoB from '../assets/Pastel Konpeitō Jars on Wood.png'
import { SERVICES } from '../data/services.js'
import { WORKS } from '../data/works.js'
import { BLOG_POSTS } from '../data/blog.js'
import { COMPANY_INFO, HISTORY, INTERVIEW } from '../data/about.js'
import WorkThumb from '../components/WorkThumb.jsx'
import StatIcon from '../components/StatIcon.jsx'
import CountUp from '../components/CountUp.jsx'
import FlyInText from '../components/FlyInText.jsx'
import Hero from '../components/Hero.jsx'
import Contact from '../components/Contact.jsx'
import MoreFiller from '../components/MoreFiller.jsx'
import './Top.css'
import './Service.css'
import './Works.css'
import './About.css'

const WORKS_LOOP_COUNT = 3
const WORKS_LOOPED = Array.from({ length: WORKS_LOOP_COUNT }, () => WORKS).flat()
const WORK_CARD_IMAGES = [workPhotoA, workPhotoB]

const STATS = [
  { value: 109, decimals: 0, suffix: '', label: '制作実績数', icon: 'arrow' },
  { value: 15.9, decimals: 1, suffix: '日', label: '平均納品日数', icon: 'calendar' },
  { value: 74.2, decimals: 1, suffix: '%', label: 'リピート率', icon: 'ring', percent: 74.2 },
]

const TESTIMONIALS = [
  {
    quote: '要望をイメージ以上の形で提案してもらえました。制作スピードにも驚きました。',
    person: '製造業 ご担当者様',
  },
  {
    quote: 'イラストと3Dを一貫して依頼できるので、世界観がぶれずに助かっています。',
    person: 'ゲーム開発スタジオ ご担当者様',
  },
  {
    quote: 'AI導入の相談から実装まで、伴走してもらえたので安心して任せられました。',
    person: '物流会社 ご担当者様',
  },
  {
    quote: 'レスポンスが早く、細かい修正にもスピーディーに対応いただけました。',
    person: '化粧品メーカー ご担当者様',
  },
  {
    quote: '発売前の製品を実写のようなビジュアルで訴求でき、社内の評価も高かったです。',
    person: '家電メーカー ご担当者様',
  },
  {
    quote: '定型業務の対応時間が大きく減り、他の業務に時間を充てられるようになりました。',
    person: '卸売業 ご担当者様',
  },
]

const TESTIMONIAL_ROWS = [
  { items: TESTIMONIALS, direction: 'right' },
  { items: [...TESTIMONIALS.slice(2), ...TESTIMONIALS.slice(0, 2)], direction: 'left' },
  { items: [...TESTIMONIALS.slice(4), ...TESTIMONIALS.slice(0, 4)], direction: 'right' },
]

export default function Top() {
  const worksGridRef = useRef(null)
  const dragStateRef = useRef({ dragging: false, startX: 0, startScrollLeft: 0, moved: 0 })
  const [worksVisible, setWorksVisible] = useState(false)
  const [worksSettled, setWorksSettled] = useState(false)
  const [activeWorkIndex, setActiveWorkIndex] = useState(0)

  useEffect(() => {
    const el = worksGridRef.current
    if (!el) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          setWorksVisible(true)
          observer.disconnect()
        })
      },
      { threshold: 0.2 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!worksVisible) return undefined
    const el = worksGridRef.current
    if (!el) return undefined

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setWorksSettled(true)
      return undefined
    }

    const handleEnd = (e) => {
      if (e.target !== el || e.propertyName !== 'transform') return
      setWorksSettled(true)
    }
    el.addEventListener('transitionend', handleEnd)
    return () => el.removeEventListener('transitionend', handleEnd)
  }, [worksVisible])

  // 無限スライドの起点として、ループ2周目(実データと同じ並びの中央ブロック)から開始する
  useLayoutEffect(() => {
    const el = worksGridRef.current
    const middleStart = el?.children[WORKS.length]
    if (middleStart) {
      el.scrollLeft = middleStart.offsetLeft
    }
  }, [])

  useEffect(() => {
    const el = worksGridRef.current
    if (!el) return undefined

    const handleScroll = () => {
      const cards = Array.from(el.children)
      if (cards.length === 0) return

      // 端まで来たら見た目には分からない位置へ瞬時に戻し、無限ループに見せる
      const blockWidth = el.scrollWidth / WORKS_LOOP_COUNT
      if (el.scrollLeft < blockWidth * 0.5) {
        el.scrollLeft += blockWidth
      } else if (el.scrollLeft > blockWidth * 1.5) {
        el.scrollLeft -= blockWidth
      }

      const center = el.scrollLeft + el.clientWidth / 2
      let closestIndex = 0
      let closestDist = Infinity
      cards.forEach((card, i) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2
        const dist = Math.abs(cardCenter - center)
        if (dist < closestDist) {
          closestDist = dist
          closestIndex = i
        }
      })
      setActiveWorkIndex(closestIndex % WORKS.length)
    }

    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToWork = (index) => {
    const el = worksGridRef.current
    if (!el) return
    const current = el.scrollLeft + el.clientWidth / 2
    let bestCard = null
    let bestDist = Infinity
    Array.from(el.children).forEach((card, i) => {
      if (i % WORKS.length !== index) return
      const cardCenter = card.offsetLeft + card.offsetWidth / 2
      const dist = Math.abs(cardCenter - current)
      if (dist < bestDist) {
        bestDist = dist
        bestCard = card
      }
    })
    if (!bestCard) return
    el.scrollTo({
      left: bestCard.offsetLeft - (el.clientWidth - bestCard.offsetWidth) / 2,
      behavior: 'smooth',
    })
  }

  const handleWorksPointerDown = (e) => {
    if (e.pointerType !== 'mouse') return
    const el = worksGridRef.current
    if (!el) return
    dragStateRef.current = { dragging: true, startX: e.clientX, startScrollLeft: el.scrollLeft, moved: 0 }
    el.setPointerCapture(e.pointerId)
    el.classList.add('is-dragging')
  }

  const handleWorksPointerMove = (e) => {
    const state = dragStateRef.current
    if (!state.dragging) return
    const el = worksGridRef.current
    if (!el) return
    const delta = e.clientX - state.startX
    state.moved = Math.max(state.moved, Math.abs(delta))
    el.scrollLeft = state.startScrollLeft - delta
  }

  const endWorksDrag = (e) => {
    const state = dragStateRef.current
    if (!state.dragging) return
    state.dragging = false
    const el = worksGridRef.current
    if (el) {
      el.classList.remove('is-dragging')
      if (e?.pointerId != null) {
        try {
          el.releasePointerCapture(e.pointerId)
        } catch {
          // ポインターが既に解放済みの場合は無視
        }
      }
    }
  }

  const handleWorksClickCapture = (e) => {
    if (dragStateRef.current.moved > 6) {
      e.preventDefault()
      e.stopPropagation()
    }
    dragStateRef.current.moved = 0
  }

  return (
    <>
      {/* ファーストビュー */}
      <Hero />

      {/* ABOUT */}
      <section className="section" id="about">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">ABOUT</p>
          </div>
          <div className="message-grid">
            <div>
              <h3 className="message-heading">
                01 行動を起こす
                <br />
                02 想いを形にする
                <br />
                03 価値を創造する
              </h3>
              <p className="message-text">
                独学でイラストや3D制作、ゲーム開発を学び、そこからWebやAIの領域へと軸足を広げてきました。
                「発注したら終わり」ではなく、企画から実制作まで自分自身が手を動かせることに、SAKAI TECCの価値があると考えています。
              </p>
              <p className="message-text">
                AIという新しい道具を、表現の幅を狭めるためではなく広げるために使う。
                イラスト・3D・Webという領域を横断しながら、クライアントの「想像」を、誠実に「形」にしていくことをこれからも大切にしていきます。
              </p>
              <p className="message-sign">代表取締役　坂井 滉弥</p>
            </div>
          </div>
        </div>
      </section>

      {/* WORKS */}
      <section className="section bg-soft works-section" id="works">
        <div className="container">
          <div className="section-head section-head--center">
            <p className="eyebrow">WORKS</p>
            <h2>
              <FlyInText as="span" text="制作実績" />
            </h2>
            <p>Web制作・ビジュアル制作・AI活用開発支援、それぞれの実績をご紹介します。</p>
          </div>

          <div
            className={`works-grid ${worksVisible ? 'is-visible' : ''} ${worksSettled ? 'is-settled' : ''}`}
            ref={worksGridRef}
            onPointerDown={handleWorksPointerDown}
            onPointerMove={handleWorksPointerMove}
            onPointerUp={endWorksDrag}
            onPointerCancel={endWorksDrag}
            onPointerLeave={endWorksDrag}
            onClickCapture={handleWorksClickCapture}
          >
            {WORKS_LOOPED.map((work, i) => (
              <Link
                to={`/works/${work.id}`}
                className="card work-card"
                key={i}
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
              >
                <WorkThumb work={work} image={WORK_CARD_IMAGES[i % WORK_CARD_IMAGES.length]} />
                <div className="work-card-body">
                  <p className="work-card-tag">{work.industry}</p>
                  <p className="work-card-title">{work.title}</p>
                  <p className="work-card-copy">{work.copy}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="works-dots" role="tablist" aria-label="制作実績スクロール位置">
            {WORKS.map((work, i) => (
              <button
                key={work.id}
                type="button"
                role="tab"
                aria-selected={i === activeWorkIndex}
                aria-label={`${i + 1}件目へスクロール`}
                className={`works-dot ${i === activeWorkIndex ? 'is-active' : ''}`}
                onClick={() => scrollToWork(i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 会社概要 */}
      <section className="section section--tight bg-soft">
        <div className="container">
          <p className="eyebrow">COMPANY</p>
          <h2 className="section-title">
            <FlyInText as="span" text="会社概要" />
          </h2>
          <table className="company-table">
            <tbody>
              {COMPANY_INFO.map((row) => (
                <tr key={row.label}>
                  <th>{row.label}</th>
                  <td>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 沿革 */}
      <section className="section">
        <div className="container">
          <p className="eyebrow">HISTORY</p>
          <h2 className="section-title">
            <FlyInText as="span" text="沿革" />
          </h2>
          <ol className="history-list">
            {HISTORY.map((h) => (
              <li key={h.year}>
                <span className="history-year">{h.year}</span>
                <span className="history-text">{h.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* INTERVIEW */}
      <section className="section section--tight bg-soft">
        <div className="container">
          <p className="eyebrow">INTERVIEW</p>
          <h2 className="section-title">
            <FlyInText as="span" text="代表インタビュー" />
          </h2>
          <div className="interview-list">
            {INTERVIEW.map((item) => (
              <div className="interview-item" key={item.q}>
                <p className="interview-q">
                  <span className="interview-q-label">Q.</span> {item.q}
                </p>
                <div className="interview-a-row">
                  <img src={founderImg} alt="坂井 滉弥" className="interview-avatar" />
                  <div className="interview-bubble">
                    {item.a.map((paragraph, i) => (
                      <p className="interview-a" key={i}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICE */}
      <section className="section section--tight bg-soft" id="service">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">SERVICE</p>
            <h2>
              <FlyInText as="span" text="事業内容" />
            </h2>
            <p>
              Web制作・ビジュアル制作(3D/イラスト)・AI活用開発支援の3本柱で、企画から実制作までワンストップで対応します。
            </p>
          </div>
          <div className="grid service-list-grid">
            {SERVICES.map((s, i) => (
              <Link to={`/service/${s.slug}`} className="card service-list-card" key={s.slug}>
                <span className="service-list-index">{String(i + 1).padStart(2, '0')}</span>
                <span className={`service-icon service-icon--${s.icon}`} aria-hidden="true" />
                <h3>{s.label}</h3>
                <p>{s.short}</p>
                <span className="service-card-link">詳しく見る →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 数字で見る実績 */}
      <section className="section section--tight bg-navy numbers-section">
        <MoreFiller className="numbers-filler" />
        <div className="container">
          <div className="section-head section-head--center">
            <p className="eyebrow eyebrow--light">NUMBERS</p>
            <h2>
              <FlyInText as="span" text="数字で見る実績" />
            </h2>
          </div>
          <div className="grid stats-grid">
            {STATS.map((s) => (
              <div className="stat-card" key={s.label}>
                <StatIcon type={s.icon} percent={s.percent} />
                <p className="stat-value text-gradient">
                  <CountUp value={s.value} decimals={s.decimals} suffix={s.suffix} />
                </p>
                <p className="stat-label">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* お客様の声 */}
      <section className="section">
        <div className="section-head section-head--center container">
          <p className="eyebrow">VOICE</p>
          <h2>
            <FlyInText as="span" text="お客様の声" />
          </h2>
        </div>
        <div className="testimonial-marquee-wrap">
          {TESTIMONIAL_ROWS.map((row, i) => (
            <div className="testimonial-marquee" key={i}>
              <div className={`testimonial-track testimonial-track--${row.direction}`}>
                {[...row.items, ...row.items].map((t, j) => (
                  <div className="card testimonial-card" key={j}>
                    <p className="testimonial-quote">“{t.quote}”</p>
                    <p className="testimonial-person">{t.person}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ブログ最新記事 */}
      <section className="section section--tight bg-soft">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">BLOG</p>
            <h2>
              <FlyInText as="span" text="最新記事" />
            </h2>
          </div>
          <div className="grid blog-grid">
            {BLOG_POSTS.map((post) => (
              <article className="card blog-card" key={post.id}>
                <p className="blog-date">{post.date}</p>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <Contact />
    </>
  )
}
