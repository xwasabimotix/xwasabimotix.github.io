import { Link } from 'react-router-dom'
import Logo from './Logo.jsx'
import MoreFiller from './MoreFiller.jsx'
import { SERVICES } from '../data/services.js'
import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <MoreFiller className="footer-filler" count={16} />

      <div className="container footer-main">
        <div className="footer-brand">
          <Logo variant="footer" showTagline />
          <p>AIとクリエイティブで、未来をつくる。</p>
        </div>

        <nav className="footer-nav" aria-label="サービス">
          <p className="footer-nav-title">SERVICE</p>
          <ul>
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link to={`/service/${s.slug}`}>{s.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="footer-nav" aria-label="サイト内リンク">
          <p className="footer-nav-title">COMPANY</p>
          <ul>
            <li>
              <Link to="/#works">WORKS</Link>
            </li>
            <li>
              <Link to="/#about">ABOUT</Link>
            </li>
            <li>
              <a href="#contact">CONTACT</a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="container footer-bottom">
        <p>&copy; {year} SAKAI TECC</p>
      </div>
    </footer>
  )
}
