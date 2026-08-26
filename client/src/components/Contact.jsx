import { useState } from 'react'
import { SERVICES } from '../data/services.js'
import FlyInText from './FlyInText.jsx'
import './Contact.css'

export default function Contact() {
  const [phase, setPhase] = useState('form') // 'form' | 'shrinking' | 'success'

  const handleSubmit = (e) => {
    e.preventDefault()
    setPhase('shrinking')
    window.setTimeout(() => setPhase('success'), 350)
  }

  return (
    <section className="section section--tight bg-soft" id="contact">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">CONTACT</p>
          <h2>
            <FlyInText as="span" text="お問い合わせ" />
          </h2>
          <p>Web制作からビジュアル制作、AI活用開発支援まで。小さなご相談から承ります。</p>
        </div>

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

          {phase === 'success' ? (
            <div className="contact-success">
              <div className="success-icon-wrap">
                <svg
                  className="success-mail-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <rect x="2.5" y="5" width="19" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
                  <path
                    d="M3.5 6.5L12 13L20.5 6.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="success-check-row">
                <svg
                  className="success-check-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M5 12.5L10 17.5L19 7"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="contact-success-title">送信完了しました</p>
              </div>
              <p>担当者よりあらためてご連絡いたします。</p>
            </div>
          ) : (
            <form
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
    </section>
  )
}
