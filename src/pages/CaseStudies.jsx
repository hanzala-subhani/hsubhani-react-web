import CtaActions from '../components/CtaActions'
import PageHero from '../components/PageHero'
import WorkStudyCard from '../components/WorkStudyCard'
import { caseStudies } from '../data/agency'

export default function CaseStudies() {
  return (
    <div className="agency-page">
      <PageHero
        kicker="Our case studies"
        title="Proof from software actually shipped"
        lead="Interview AI, commerce operations, and a multi-API admin—case studies instead of generic capability claims."
      />
      <section className="agency-section">
        <div className="container">
          <div className="agency-study-list agency-study-list--work">
            {caseStudies.map(study => (
              <WorkStudyCard study={study} headingLevel="h2" key={study.slug} />
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
