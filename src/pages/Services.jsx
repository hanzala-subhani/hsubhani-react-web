import PageHero from '../components/PageHero'
import OfferGrid from '../components/OfferGrid'
import { services } from '../data/agency'

export default function Services() {
  return (
    <div className="agency-page">
      <PageHero
        kicker="Our services"
        title="Software designed, built, and scaled"
        lead="From custom products and Laravel APIs to React apps, SaaS platforms, and AI integration—the work is production software, not a slide deck."
      />
      <section className="agency-section">
        <div className="container">
          <OfferGrid items={services} basePath="/services" />
        </div>
      </section>
    </div>
  )
}
