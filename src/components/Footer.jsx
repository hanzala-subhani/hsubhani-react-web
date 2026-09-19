import { Link } from 'react-router-dom'
import {
  CONTACT_EMAIL,
  SITE_BRAND_AGENCY,
  SITE_BRAND_MARK,
  SITE_POSITIONING,
  SITE_TAGLINE,
  SOCIAL_LINKS,
} from '../config/app.config'

const exploreLinks = [
  { to: '/services', label: 'Services' },
  { to: '/solutions', label: 'Solutions' },
  { to: '/work', label: 'Case Studies' },
  { to: '/pricing', label: 'Engagements' },
  { to: '/technology', label: 'Technology' },
  { to: '/about', label: 'About Hanzala Subhani' },
  { to: '/blog', label: 'Insights' },
  { to: '/contact', label: 'Start a Project' },
]

export default function Footer() {
  return (
    <footer className="footer-site">
      <div className="footer-site-accent" aria-hidden="true" />
      <div className="container footer-site-inner">
        <div className="footer-site-grid">
          {/* 1 — Brand */}
          <div className="footer-site-brand">
            <Link className="brand brand--text brand--text-footer" to="/">
              <span className="brand-name">{SITE_BRAND_MARK}</span>
            </Link>
            <p className="footer-site-role">{SITE_POSITIONING}</p>
            <p className="footer-site-desc">{SITE_TAGLINE}</p>
            <div className="footer-site-social" aria-label="Social media">
              {SOCIAL_LINKS.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  className="footer-social-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                >
                  <i className={s.icon} aria-hidden="true" />
                </a>
              ))}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="footer-social-btn footer-social-btn--mail"
                aria-label="Email"
              >
                <i className="fa-solid fa-envelope" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* 2 — Explore */}
          <div className="footer-site-col">
            <h4 className="footer-site-heading">Explore</h4>
            <ul className="footer-site-links">
              {exploreLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to}>
                    <i className="fa-solid fa-chevron-right footer-link-ico" aria-hidden="true" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3 — Contact */}
          <div className="footer-site-col">
            <h4 className="footer-site-heading">Work with us</h4>
            <p className="footer-contact-intro">
              Share the product you want to build, modernize, or scale.
            </p>
            <ul className="footer-contact-list">
              {/* <li>
                <a href={`tel:${CONTACT_PHONE_TEL}`} className="footer-contact-item">
                  <span className="footer-contact-icon" aria-hidden="true">
                    <i className="fa-solid fa-phone" />
                  </span>
                  <span>
                    <strong>Call / WhatsApp</strong>
                    <span>{CONTACT_PHONE}</span>
                  </span>
                </a>
              </li> */}
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`} className="footer-contact-item">
                  <span className="footer-contact-icon" aria-hidden="true">
                    <i className="fa-solid fa-envelope" />
                  </span>
                  <span>
                    <strong>Email us</strong>
                    <span>{CONTACT_EMAIL}</span>
                  </span>
                </a>
              </li>
              <li className="footer-contact-location">
                <span className="footer-contact-icon" aria-hidden="true">
                  <i className="fa-solid fa-location-dot" />
                </span>
                <span>
                  <strong>Based in</strong>
                  <span>Dehradun, India</span>
                </span>
              </li>
            </ul>
            {/* <Link to="/contact" className="footer-contact-cta">
              Say hello
              <i className="fa-solid fa-arrow-up-right" aria-hidden="true" />
            </Link> */}
          </div>
        </div>

        <div className="footer-site-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} {SITE_BRAND_AGENCY}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
