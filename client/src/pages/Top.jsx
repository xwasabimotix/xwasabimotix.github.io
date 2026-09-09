import founderImg from '../assets/founder.png'
import { BLOG_POSTS } from '../data/blog.js'
import { COMPANY_INFO, HISTORY, INTERVIEW } from '../data/about.js'
import StatIcon from '../components/StatIcon.jsx'
import CountUp from '../components/CountUp.jsx'
import Eyebrow from '../components/Eyebrow.jsx'
import Hero from '../components/Hero.jsx'
import Contact from '../components/Contact.jsx'
import MoreFiller from '../components/MoreFiller.jsx'
import './Top.css'
import './About.css'

const STATS = [
  {
    value: 109,
    decimals: 0,
    suffix: '',
    label: '制作実績数',
    icon: 'arrow',
    desc: 'Web制作からビジュアル制作、AI活用支援まで、業種を問わず数多くのプロジェクトを手がけてきました。ひとつひとつの案件に丁寧に向き合い、着実に実績を積み重ねています。',
  },
  {
    value: 15.9,
    decimals: 1,
    suffix: '日',
    label: '平均納品日数',
    icon: 'calendar',
    desc: 'スピーディな制作体制と、企画段階からの緊密な連携により、無駄のないスケジュールを実現。急なご依頼にも柔軟に対応し、品質を保ちながら短納期でお届けします。',
  },
  {
    value: 74.2,
    decimals: 1,
    suffix: '%',
    label: 'リピート率',
    icon: 'ring',
    percent: 74.2,
    desc: '納品後も継続的にご相談いただけるパートナーシップを大切にしています。高い満足度と信頼関係が、多くのお客様からのリピートにつながっています。',
  },
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
  return (
    <>
      {/* ファーストビュー */}
      <Hero />

      {/* ABOUT */}
      <section className="section" id="about">
        <div className="container">
          <Eyebrow text="ABOUT" />
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
                「発注したら終わり」ではなく、企画から実制作まで自分自身が手を動かせることに、tech MOREの価値があると考えています。
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
          <Eyebrow text="COMPANY" />
          <h2 className="section-title">会社概要</h2>
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
          <Eyebrow text="HISTORY" />
          <h2 className="section-title">沿革</h2>
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
          <Eyebrow text="INTERVIEW" />
          <h2 className="section-title">代表インタビュー</h2>
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

      {/* 数字で見る実績 */}
      <section className="section section--tight bg-navy numbers-section">
        <MoreFiller className="numbers-filler" />
        <div className="container">
          <Eyebrow text="NUMBERS" />
          <h2 className="section-title">数字で見る実績</h2>
          <div className="grid stats-grid">
            {STATS.map((s) => (
              <div className="stat-card" key={s.label}>
                <StatIcon type={s.icon} percent={s.percent} />
                <p className="stat-value text-gradient">
                  <CountUp value={s.value} decimals={s.decimals} suffix={s.suffix} />
                </p>
                <p className="stat-label">{s.label}</p>
                <p className="stat-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* お客様の声 */}
      <section className="section">
        <div className="container">
          <Eyebrow text="VOICE" className="eyebrow--center" />
          <h2 className="section-title section-title--center">お客様の声</h2>
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
          <Eyebrow text="BLOG" />
          <h2 className="section-title">最新記事</h2>
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
