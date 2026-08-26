import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import heroOfficeImg from '../assets/hero-office.png'
import ScrambleText from './ScrambleText.jsx'
import './Hero.css'

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

export default function Hero() {
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

      // プレースホルダーにも --accent クラスを付けてあるので、行の実体が
      // 何個生成済みでも常に15文字(3行×5文字)ぶん存在し、計算結果は毎回同じになる。
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

        // 背景の帯の縦幅は、DO/CREATE行ではなく「MORE」3行分の実測範囲に厳密に追従させる。
        // 削り量は固定pxではなくtotalHに対する割合にして、文字の縮小率とズレないようにする
        const topTrim = totalH * 0.06
        const bottomTrim = totalH * 0.02
        setHeroLineRect({
          top: minY + topTrim,
          height: totalH - topTrim - bottomTrim,
        })
      }

      // 斜めではなく、「MORE」の実位置のほんの少し左に固定した垂直線でフェードさせる
      const firstAccentEl = accentEls[0]
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

  return (
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
                          {c === ' ' ? ' ' : c}
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
  )
}
