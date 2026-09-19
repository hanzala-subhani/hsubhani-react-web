import PageHero from '../components/PageHero'
import OfferGrid from '../components/OfferGrid'
import { solutions } from '../data/agency'

export default function Solutions() {
  return (
    <div className="agency-page">
      <PageHero
        kicker="Solutions"
        title="Built for how your business actually runs"
        lead="Startups, SMEs, enterprise teams, commerce, FinTech, and AI-led products—same delivery standard, different constraints."
      />
      <section className="agency-section">
        <div className="container">
          <OfferGrid items={solutions} basePath="/solutions" />
        </div>
      </section>
    </div>
  )
}
