import { useState } from 'react'
import { SERVICES } from '../data/services.js'
import FlyInText from './FlyInText.jsx'
import './Contact.css'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
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

          {submitted ? (
            <div className="contact-success card">
              <p className="contact-success-title">お問い合わせありがとうございます。</p>
              <p>担当者よりあらためてご連絡いたします。</p>
            </div>
          ) : (
            <form className="contact-form card" onSubmit={handleSubmit}>
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
