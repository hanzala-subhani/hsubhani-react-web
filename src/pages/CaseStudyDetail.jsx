import { Link, Navigate, useParams } from 'react-router-dom'
import CtaActions from '../components/CtaActions'
import PageHero from '../components/PageHero'
import { findCaseStudy } from '../data/agency'

const narrative = [
  ['Challenge', 'challenge'],
  ['Solution', 'solution'],
  ['Architecture', 'architecture'],
  ['Technology', 'technology'],
  ['Result', 'result'],
]

export default function CaseStudyDetail() {
  const { slug } = useParams()
  const study = findCaseStudy(slug)
  if (!study) return <Navigate to="/work" replace />

  return (
    <div className="agency-page">
      <PageHero kicker="Our case studies" title={study.title} lead={study.summary} />
      <section className="agency-detail">
        <div className="container case-detail">
          <ul className="agency-study-stack">
            {study.stack.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {study.features?.length ? (
            <ul className="agency-study-features case-detail-features">
              {study.features.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
          <div className="case-detail-grid">
            {narrative.map(([label, key]) =>
              study[key] ? (
                <article className="case-detail-block" key={key}>
                  <h2>{label}</h2>
                  <p>{study[key]}</p>
                </article>
              ) : null,
            )}
          </div>
          <div className="agency-detail-actions">
            <CtaActions />
            <Link to="/work" className="btn btn-ghost">
              Back to case studies
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
