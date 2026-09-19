import CtaActions from '../components/CtaActions'
import PageHero from '../components/PageHero'
import { Link } from 'react-router-dom'
import { engagements } from '../data/agency'

export default function Pricing() {
  return (
    <div className="agency-page">
      <PageHero
        kicker="Work with us"
        title="Engagement models"
        lead="No fixed price list for complex software. Choose the engagement that matches the problem, then Hanzala Subhani scopes the work."
      />
      <section className="agency-section">
        <div className="container">
          <div className="agency-grid agency-grid--engagements">
            {engagements.map(item => (
              <article className="agency-card engagement-card" key={item.slug}>
                <div className="agency-card-icon" aria-hidden="true">
                  <i className={item.icon} />
                </div>
                <h2>{item.title}</h2>
                <p className="engagement-audience">{item.audience}</p>
                <p>{item.text}</p>
                <ul className="agency-points">
                  {item.points.map(point => (
                    <li key={point}>
                      <i className="fa-solid fa-check" aria-hidden="true" />
                      {point}
                    </li>
                  ))}
                </ul>
                <Link to={`/contact?type=${item.slug}`} className="agency-card-link">
                  Start this engagement
                  <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
          <p className="agency-section-cta">
            <CtaActions />
          </p>
        </div>
      </section>
    </div>
  )
}
