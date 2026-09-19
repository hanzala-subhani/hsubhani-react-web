import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  CTA_NAV,
  SITE_BRAND_AGENCY,
  SOCIAL_LINKS,
} from '../config/app.config'
import { services, solutions } from '../data/agency'
import hanzalaLogo from '../images/hanzala-logo.webp'

const hiddenNavServiceSlugs = new Set([
  'legacy-system-modernization',
  'performance-optimization',
])

const navItems = [
  {
    to: '/services',
    label: 'Services',
    match: path => path.startsWith('/services'),
    children: services
      .filter(item => !hiddenNavServiceSlugs.has(item.slug))
      .map(item => ({ to: `/services/${item.slug}`, label: item.title })),
  },
  {
    to: '/solutions',
    label: 'Solutions',
    match: path => path.startsWith('/solutions'),
    children: solutions.map(item => ({ to: `/solutions/${item.slug}`, label: item.title })),
  },
  { to: '/work', label: 'Case Studies', match: path => path === '/work' || path.startsWith('/work/') },
  { to: '/technology', label: 'Technology', match: path => path.startsWith('/technology') },
  { to: '/about', label: 'About', match: path => path.startsWith('/about') },
  { to: '/blog', label: 'Insights', match: path => path === '/blog' || path.startsWith('/blog/') },
]

const headerSocialLinks = SOCIAL_LINKS.filter(link => link.label !== 'X')

export default function Header() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <NavLink className="brand brand--logo" to="/" aria-label={SITE_BRAND_AGENCY}>
          <img src={hanzalaLogo} alt={SITE_BRAND_AGENCY} className="brand-logo-img" />
        </NavLink>
        <nav className={`nav-links${open ? ' show' : ''}`} id="navLinks">
          {navItems.map(({ to, label, end, match, children }) => (
            <div className={`nav-item${children ? ' nav-item--has-sub' : ''}`} key={to}>
              <NavLink
                to={to}
                end={end ?? false}
                className={() => (match(pathname) ? 'active' : '')}
                onClick={() => setOpen(false)}
              >
                {label}
                {children ? <i className="fa-solid fa-chevron-down nav-caret" aria-hidden="true" /> : null}
              </NavLink>
              {children ? (
                <div className="nav-sub" role="group" aria-label={label}>
                  {children.map(child => (
                    <NavLink
                      key={child.to}
                      to={child.to}
                      className={({ isActive }) => (isActive ? 'active' : '')}
                      onClick={() => setOpen(false)}
                    >
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
          <NavLink to="/contact" className="btn btn-teal header-cta-mobile" onClick={() => setOpen(false)}>
            {CTA_NAV}
          </NavLink>
        </nav>
        <div className="header-actions">
          <div className="header-social" aria-label="Social media">
            {headerSocialLinks.map(s => (
              <a
                key={s.label}
                href={s.href}
                className="header-social-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
              >
                <i className={s.icon} aria-hidden="true" />
              </a>
            ))}
          </div>
          <NavLink to="/contact" className="btn btn-teal header-cta" onClick={() => setOpen(false)}>
            {CTA_NAV}
          </NavLink>
          <button
            type="button"
            className="menu-btn"
            aria-expanded={open}
            aria-controls="navLinks"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen(o => !o)}
          >
            <i className={`fa-solid ${open ? 'fa-xmark' : 'fa-bars'}`} />
          </button>
        </div>
      </div>
    </header>
  )
}
