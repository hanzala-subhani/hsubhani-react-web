import CtaActions from '../components/CtaActions'
import PageHero from '../components/PageHero'
import { SITE_STACK } from '../config/app.config'
import { technologies } from '../data/agency'

export default function Technology() {
  return (
    <div className="agency-page">
      <PageHero
        kicker="Technology"
        title="The stack behind production software"
        lead={`${SITE_STACK.join(' · ')}. Chosen because this is how Hanzala Subhani delivers—not because it looks current on a homepage.`}
      />
      <section className="agency-section">
        <div className="container">
          <div className="agency-grid agency-grid--tech">
            {technologies.map(item => (
              <article className="agency-card" key={item.name}>
                <h2>{item.name}</h2>
                <p>{item.text}</p>
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
