import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import founderImg from '../assets/founder.png'
import heroOfficeImg from '../assets/hero-office.png'
import { SERVICES } from '../data/services.js'
import { CATEGORIES, WORKS } from '../data/works.js'
import { BLOG_POSTS } from '../data/blog.js'
import { COMPANY_INFO, HISTORY, INTERVIEW } from '../data/about.js'
import WorkThumb from '../components/WorkThumb.jsx'
import StatIcon from '../components/StatIcon.jsx'
import CountUp from '../components/CountUp.jsx'
import FlyInText from '../components/FlyInText.jsx'
import ScrambleText from '../components/ScrambleText.jsx'
import './Top.css'
import './Service.css'
import './Works.css'
import './About.css'

const REASONS = [
  {
    title: 'AI活用による制作スピード',
    desc: 'ラフ生成から実装補助まで、AIを制作フローに組み込むことで、クオリティを保ちながらスピードを両立します。',
  },
  {
    title: 'イラスト・3D領域まで内製できる表現力の幅',
    desc: 'Webにとどまらず、イラストや3Dビジュアライズまで一貫して内製。世界観のズレが起きません。',
  },
  {
    title: '代表自身が手を動かせる技術力への信頼',
    desc: '企画から実制作まで、代表自身が手を動かします。伝言ゲームによるロスがありません。',
  },
  {
    title: '小規模だからこその柔軟な対応',
    desc: '意思決定が速く、要件の変化にも柔軟にキャッチアップしながら伴走します。',
  },
]

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

const HERO_TITLE_LINES = ['DO MORE.', 'MAKE MORE.', 'CREATE MORE.']
const HERO_FILLER_COUNT = 8
const HERO_FAST_STAGGER_MS = 8
const HERO_SLOW_STAGGER_MS = 100 / 1.5
const HERO_EASE_STEEPNESS = 2.6

const smoothstep = (t) => t * t * (3 - 2 * t)
const clamp01 = (t) => Math.min(1, Math.max(0, t))

// compress the ramp into the last part of the range (change happens late, near the title)
const shapeLate = (t) => clamp01((t - (1 - 1 / HERO_EASE_STEEPNESS)) * HERO_EASE_STEEPNESS)
// compress the ramp into the first part of the range (change happens early, right after the title)
const shapeEarly = (t) => clamp01(t * HERO_EASE_STEEPNESS)

// top filler: fast (far from title) -> slow (near title), steep transition right before the title
const fillerStaggerIn = (i) =>
  HERO_FAST_STAGGER_MS +
  (HERO_SLOW_STAGGER_MS - HERO_FAST_STAGGER_MS) * smoothstep(shapeLate(i / (HERO_FILLER_COUNT - 1)))

// bottom filler: slow (near title) -> fast (far from title), steep transition right after the title
const fillerStaggerOut = (i) =>
  HERO_SLOW_STAGGER_MS +
  (HERO_FAST_STAGGER_MS - HERO_SLOW_STAGGER_MS) * smoothstep(shapeEarly(i / (HERO_FILLER_COUNT - 1)))

const HERO_LINES = [
  ...Array.from({ length: HERO_FILLER_COUNT }, (_, i) => ({
    text: 'MORE.',
    filler: true,
    stagger: fillerStaggerIn(i),
  })),
  ...HERO_TITLE_LINES.map((text) => ({ text, filler: false, stagger: HERO_SLOW_STAGGER_MS })),
  ...Array.from({ length: HERO_FILLER_COUNT }, (_, i) => ({
    text: 'MORE.',
    filler: true,
    stagger: fillerStaggerOut(i),
  })),
]
const HERO_REAL_END_INDEX = HERO_FILLER_COUNT + HERO_TITLE_LINES.length - 1

export default function Top() {
  const [worksCategory, setWorksCategory] = useState('all')
  const [titleSettled, setTitleSettled] = useState(false)
  const [activeLine, setActiveLine] = useState(0)
  const [heroLineRect, setHeroLineRect] = useState(null)
  const [heroFadePct, setHeroFadePct] = useState(null)
  const [fadeRevealDone, setFadeRevealDone] = useState(false)
  const heroSectionRef = useRef(null)
  const doLineRef = useRef(null)
  const createLineRef = useRef(null)

  useLayoutEffect(() => {
    const measure = () => {
      const section = heroSectionRef.current
      const doEl = doLineRef.current
      const createEl = createLineRef.current
      if (!section || !doEl || !createEl) return
      const sectionRect = section.getBoundingClientRect()
      const doRect = doEl.getBoundingClientRect()
      const createRect = createEl.getBoundingClientRect()
      setHeroLineRect({
        top: doRect.top - sectionRect.top + 15,
        height: createRect.bottom - doRect.top - 15,
      })

      // 斜めではなく、「MORE」の実位置のほんの少し左に固定した垂直線でフェードさせる
      const firstAccentEl = section.querySelector('.scramble-char--accent')
      if (sectionRect.width > 0 && firstAccentEl) {
        const W = sectionRect.width
        const moreX = firstAccentEl.getBoundingClientRect().left - sectionRect.left
        const lineXPct = (moreX / W) * 100
        setHeroFadePct({
          doX: lineXPct,
          doY: 0,
          createX: lineXPct,
          createY: 100,
        })
      }

      // 3行分の「MORE.」オーバーレイ写真が1枚の連続した画像に見えるよう揃える。
      // プレースホルダーにも同じ --accent クラスを付けてあるので、行の実体が
      // 何個生成済みでも常に15文字ぶん存在し、計算結果(totalH等)は毎回同じになる。
      // 行がプレースホルダー→実際のScrambleTextに切り替わるとDOM要素が
      // 作り直されるため、activeLine変化のたびに再適用している。
      const accentEls = Array.from(section.querySelectorAll('.scramble-char--accent'))
      if (accentEls.length > 0) {
        const rects = accentEls.map((el) => {
          const r = el.getBoundingClientRect()
          return { el, x: r.left - sectionRect.left, y: r.top - sectionRect.top, h: r.height }
        })
        const minX = Math.min(...rects.map((r) => r.x))
        const minY = Math.min(...rects.map((r) => r.y))
        const maxY = Math.max(...rects.map((r) => r.y + r.h))
        const totalH = maxY - minY
        rects.forEach(({ el, x, y }) => {
          el.style.setProperty('--accent-bg-size', `auto ${totalH}px`)
          el.style.setProperty('--accent-bg-pos', `${-(x - minX)}px ${-(y - minY)}px`)
        })
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [activeLine])

  useEffect(() => {
    if (!titleSettled) return undefined
    // 初回のワイプ演出(1.1s)が終わったら、以降(リサイズ含む)は
    // アニメーションさせず即座にスナップさせる
    const timer = setTimeout(() => setFadeRevealDone(true), 1300)
    return () => clearTimeout(timer)
  }, [titleSettled])

  const handleTitleLineComplete = (index) => {
    if (index === HERO_REAL_END_INDEX) {
      setTitleSettled(true)
    }
    setActiveLine((v) => (v === index ? v + 1 : v))
  }

  const filteredWorks = useMemo(
    () => (worksCategory === 'all' ? WORKS : WORKS.filter((w) => w.category === worksCategory)),
    [worksCategory],
  )

  return (
    <>
      {/* ファーストビュー */}
      <section className="hero-section bg-navy" ref={heroSectionRef}>
        <div
          className="hero-line"
          aria-hidden="true"
          style={heroLineRect ? { top: heroLineRect.top, height: heroLineRect.height, transform: 'none' } : undefined}
        >
          <img
            src={heroOfficeImg}
            alt=""
            className="hero-line-img"
            style={
              heroFadePct
                ? {
                    clipPath:
                      titleSettled
                        ? `polygon(0% 0%, ${heroFadePct.doX}% ${heroFadePct.doY}%, ${heroFadePct.createX}% ${heroFadePct.createY}%, 0% 100%)`
                        : 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
                    transition: fadeRevealDone ? 'none' : undefined,
                  }
                : undefined
            }
          />
        </div>
        <div className="hero-mask">
          <div className="container hero-grid">
            <div className="hero-copy">
              <h1>
                {HERO_LINES.map((item, i) => (
                  <span
                    className={`hero-title-line ${item.filler ? 'hero-title-filler' : ''}`}
                    aria-hidden={item.filler ? 'true' : undefined}
                    key={i}
                    ref={item.text === 'DO MORE.' ? doLineRef : item.text === 'CREATE MORE.' && !item.filler ? createLineRef : undefined}
                  >
                    {i <= activeLine ? (
                      <ScrambleText
                        as="span"
                        text={item.text}
                        accentLength={item.filler ? 0 : 5}
                        baseDuration={item.stagger}
                        stagger={item.stagger}
                        onComplete={() => handleTitleLineComplete(i)}
                      />
                    ) : (
                      <span className="hero-title-line-pending">
                        {Array.from(item.text).map((c, ci, arr) => (
                          <span
                            className={`scramble-char ${
                              !item.filler && ci >= arr.length - 5 ? 'scramble-char--accent' : ''
                            }`}
                            key={ci}
                          >
                            {c === ' ' ? ' ' : c}
                          </span>
                        ))}
                      </span>
                    )}
                    {!item.filler && item.text === 'CREATE MORE.' && (
                      <span className={`hero-sub ${titleSettled ? 'is-visible' : ''}`}>*This is a fictional website.</span>
                    )}
                  </span>
                ))}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* 選ばれる理由 */}
      {/* 波の演出を一時停止中: className に section--wave-top を戻せば復活 */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">WHY SAKAI TECC</p>
            <h2>
              <FlyInText as="span" text="選ばれる理由" />
            </h2>
          </div>
          <div className="grid reasons-grid">
            {REASONS.map((r) => (
              <div className="card reason-card" key={r.title}>
                <h3>{r.title}</h3>
                <p>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="section" id="about">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">ABOUT</p>
            <h2>
              <FlyInText as="span" text="会社概要・代表メッセージ" />
            </h2>
            <p>誰がつくっているかを、正直にお伝えしたいと思っています。</p>
          </div>
          <div className="message-grid">
            <div className="message-photo">
              <img src={founderImg} alt="代表" />
            </div>
            <div>
              <h3 className="message-heading">
                First - 手を動かす
                <br />
                Second - 検証する
                <br />
                Third - 分析する
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

      {/* WORKS */}
      <section className="section" id="works">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">WORKS</p>
            <h2>
              <FlyInText as="span" text="制作実績" />
            </h2>
            <p>Web制作・ビジュアル制作・AI活用開発支援、それぞれの実績をご紹介します。</p>
          </div>

          <div className="works-filter" role="tablist" aria-label="実績カテゴリ">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                type="button"
                role="tab"
                aria-selected={worksCategory === c.key}
                className={`works-filter-btn ${worksCategory === c.key ? 'is-active' : ''}`}
                onClick={() => setWorksCategory(c.key)}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="grid works-grid">
            {filteredWorks.map((work) => (
              <Link to={`/works/${work.id}`} className="card work-card" key={work.id}>
                <WorkThumb work={work} />
                <div className="work-card-body">
                  <p className="work-card-tag">{work.industry}</p>
                  <p className="work-card-title">{work.title}</p>
                  <p className="work-card-copy">{work.copy}</p>
                </div>
              </Link>
            ))}
          </div>

          {filteredWorks.length === 0 && <p className="works-empty">該当する実績がありません。</p>}
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
      <section className="section section--tight bg-navy">
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
          <div className="section-head section-head--row">
            <div>
              <p className="eyebrow">BLOG</p>
              <h2>
                <FlyInText as="span" text="最新記事" />
              </h2>
            </div>
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

      {/* 採用バナー */}
      <section className="recruit-banner">
        <div className="container recruit-banner-inner">
          <div>
            <p className="eyebrow eyebrow--light">RECRUIT</p>
            <h2>
              <FlyInText as="span" text="一緒に「想像を形にする」仲間を募集しています" />
            </h2>
            <p>Web・ビジュアル・AI、興味のある領域から関わっていただけます。</p>
          </div>
          <a href="#contact" className="btn btn-ghost">
            採用について問い合わせる
          </a>
        </div>
      </section>
    </>
  )
}
