import PageHero from '../components/PageHero'
import ProcessSteps from '../components/ProcessSteps'
import CtaActions from '../components/CtaActions'
import {
  AGENCY_EXPERTISE,
  CAREER_HIGHLIGHTS,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_PHONE_TEL,
  SITE_ABOUT_LEAD,
  SITE_BRAND_AGENCY,
  SITE_BRAND_FULL,
  SITE_BRAND_MARK,
  SITE_AGENCY_SHORT,
  SITE_FOUNDER_BIO,
  SITE_FOUNDER_KICKER,
  SITE_FOUNDER_ROLE,
  SITE_POSITIONING,
  SOCIAL_LINKS,
  STATS_FOOTNOTE,
} from '../config/app.config'
import { processSteps } from '../data/agency'
import photoAbout from '../images/hanzala2.png'

export default function About() {
  return (
    <div className="about-page about-agency-page">
      <PageHero
        kicker={SITE_POSITIONING}
        title={`About ${SITE_BRAND_AGENCY}`}
        lead={SITE_ABOUT_LEAD}
      />

      <section className="about-expertise-section" aria-labelledby="about-expertise-heading">
        <div className="container">
          <div className="section-head">
            <span>Our expertise</span>
            <h2 id="about-expertise-heading">Our expertise spans</h2>
            <p>
              Production software across backend systems, APIs, SaaS, web applications, AI,
              cloud, and modernization—not a list of languages on a résumé.
            </p>
          </div>
          <ul className="about-expertise-grid">
            {AGENCY_EXPERTISE.map(item => (
              <li key={item.title}>
                <i className={item.icon} aria-hidden="true" />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="about-founder-section" aria-labelledby="about-founder-heading">
        <div className="container">
          <div className="about-founder-brand">
            <p className="about-founder-mark">{SITE_BRAND_MARK}</p>
            <p className="about-founder-agency">{SITE_AGENCY_SHORT}</p>
            <span className="about-founder-arrow" aria-hidden="true">
              <i className="fa-solid fa-arrow-down" />
            </span>
            <p className="about-founder-kicker">{SITE_FOUNDER_KICKER}</p>
          </div>

          <div className="about-founder-panel">
            <figure className="about-founder-photo">
              <img
                src={photoAbout}
                alt={`${SITE_BRAND_FULL}, ${SITE_FOUNDER_ROLE} at ${SITE_BRAND_AGENCY}`}
                decoding="async"
              />
            </figure>
            <div className="about-founder-copy">
              <h2 id="about-founder-heading">{SITE_BRAND_FULL}</h2>
              <p className="about-founder-role">{SITE_FOUNDER_ROLE}</p>
              <p className="about-founder-years">16+ Years Experience</p>
              <p>{SITE_FOUNDER_BIO}</p>
              <p>
                Hanzala Subhani is a founder-led software development agency. Clients work with a
                technical lead who still architects and ships the work—not a 200-person company
                pretending otherwise.
              </p>
              <ul className="about-founder-meta">
                <li>
                  <i className="fa-solid fa-location-dot" aria-hidden="true" />
                  Dehradun, India
                </li>
                <li>
                  <a href={`tel:${CONTACT_PHONE_TEL}`}>
                    <i className="fa-solid fa-phone" aria-hidden="true" />
                    {CONTACT_PHONE}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${CONTACT_EMAIL}`}>
                    <i className="fa-solid fa-envelope" aria-hidden="true" />
                    {CONTACT_EMAIL}
                  </a>
                </li>
              </ul>
              <div className="about-profile-social">
                {SOCIAL_LINKS.map(s => (
                  <a
                    key={s.label}
                    href={s.href}
                    className="about-profile-social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                  >
                    <i className={s.icon} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="home-experience-stats about-founder-stats">
            {CAREER_HIGHLIGHTS.map(item => (
              <div className="home-experience-stat" key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
          <p className="home-experience-note">{STATS_FOOTNOTE}</p>
        </div>
      </section>

      <section className="about-process-section" aria-labelledby="about-process-heading">
        <div className="container">
          <div className="section-head">
            <span>Process</span>
            <h2 id="about-process-heading">How delivery works</h2>
            <p>
              A delivery path you can brief a stakeholder on—from discovery through launch
              and the work that comes after.
            </p>
          </div>
          <ProcessSteps steps={processSteps} />
        </div>
      </section>

      <section className="home-agency-cta" aria-labelledby="about-cta-heading">
        <div className="container home-agency-cta-inner">
          <div>
            <h2 id="about-cta-heading">Have a product to build or a system to modernize?</h2>
            <p>Share the product that needs to ship. Hanzala Subhani will follow up with a clear next step.</p>
          </div>
          <div className="profile-bottom-actions">
            <CtaActions ghostClassName="home-neo-ghost" />
          </div>
        </div>
      </section>
    </div>
  )
}
