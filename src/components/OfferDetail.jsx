import { Link, Navigate } from 'react-router-dom'
import CtaActions from './CtaActions'
import PageHero from './PageHero'

export default function OfferDetail({ item, parentTo, parentLabel }) {
  if (!item) return <Navigate to={parentTo} replace />

  return (
    <div className="agency-page">
      <PageHero kicker={parentLabel} title={item.title} lead={item.summary} />
      <section className="agency-detail">
        <div className="container agency-detail-grid">
          <div>
            <p>{item.text}</p>
            <ul className="agency-points">
              {item.points.map(point => (
                <li key={point}>
                  <i className="fa-solid fa-check" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
            <div className="agency-detail-actions">
              <CtaActions />
              <Link to={parentTo} className="btn btn-ghost">
                Back to {parentLabel.toLowerCase()}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
