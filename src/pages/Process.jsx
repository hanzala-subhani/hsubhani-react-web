import PageHero from '../components/PageHero'
import ProcessSteps from '../components/ProcessSteps'
import { processSteps } from '../data/agency'

export default function Process() {
  return (
    <div className="agency-page">
      <PageHero
        kicker="Process"
        title="How delivery works"
        lead="A professional delivery path from discovery to launch and scale—so the path after the first call is clear."
      />
      <section className="agency-section">
        <div className="container">
          <ProcessSteps steps={processSteps} />
        </div>
      </section>
    </div>
  )
}
