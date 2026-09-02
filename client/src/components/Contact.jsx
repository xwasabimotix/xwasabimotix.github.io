import { useLayoutEffect, useRef, useState } from 'react'
import { SERVICES } from '../data/services.js'
import FlyInText from './FlyInText.jsx'
import './Contact.css'

export default function Contact() {
  const [phase, setPhase] = useState('form') // 'form' | 'shrinking' | 'success'
  const [panelHeight, setPanelHeight] = useState(undefined)
  const formRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    setPhase('shrinking')
    window.setTimeout(() => setPhase('success'), 350)
  }

  useLayoutEffect(() => {
    if (phase !== 'form' || !formRef.current) return undefined

    const el = formRef.current
    const update = () => setPanelHeight(el.offsetHeight)
    update()

    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [phase])

  return (
    <section className="section section--tight bg-soft" id="contact">
      <div className="container">
        <p className="eyebrow">CONTACT</p>
        <h2 className="section-title">
          <FlyInText as="span" text="お問い合わせ" />
        </h2>
        <p className="section-lead">
          Web制作からビジュアル制作、AI活用開発支援まで。小さなご相談から承ります。
        </p>

        <div className="contact-grid">
          <div className="contact-info">
            <dl>
              <div className="contact-info-row">
                <dt>Email</dt>
                <dd>hello@sakai-tecc.example</dd>
              </div>
              <div className="contact-info-row">
                <dt>対応時間</dt>
                <dd>平日 10:00 - 18:00</dd>
              </div>
            </dl>
            <p className="contact-note">
              ※本サイトは架空のデモサイトのため、フォームの送信は実際には行われません。
            </p>
          </div>

          <div
            className="contact-panel"
            style={{ minHeight: panelHeight ? `${panelHeight}px` : undefined }}
          >
            {phase === 'success' ? (
              <div className="contact-success">
                <div className="success-icon-wrap">
                  <svg
                    className="success-check-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10.5" stroke="currentColor" strokeWidth="1.6" />
                    <path
                      d="M7 12.5L10.5 16L17 8"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="contact-success-title">送信完了しました</p>
                <p>担当者よりあらためてご連絡いたします。</p>
              </div>
            ) : (
              <form
                ref={formRef}
                className={`contact-form card${phase === 'shrinking' ? ' is-shrinking' : ''}`}
                onSubmit={handleSubmit}
              >
                <label className="contact-field">
                  <span>お名前</span>
                  <input type="text" name="name" required />
                </label>
                <label className="contact-field">
                  <span>メールアドレス</span>
                  <input type="email" name="email" required />
                </label>
                <label className="contact-field">
                  <span>ご相談内容</span>
                  <select name="service" defaultValue="">
                    <option value="" disabled>
                      選択してください
                    </option>
                    {SERVICES.map((s) => (
                      <option key={s.slug} value={s.slug}>
                        {s.label}
                      </option>
                    ))}
                    <option value="other">その他</option>
                  </select>
                </label>
                <label className="contact-field">
                  <span>メッセージ</span>
                  <textarea name="message" rows={5} required />
                </label>
                <button type="submit" className="btn btn-primary">
                  送信する
                  <span className="btn-arrow" aria-hidden="true" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
