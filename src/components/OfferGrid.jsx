import { Link } from 'react-router-dom'

export default function OfferGrid({ items, basePath }) {
  return (
    <div className="agency-grid">
      {items.map(item => (
        <article className="agency-card" key={item.slug}>
          <div className="agency-card-icon" aria-hidden="true">
            <i className={item.icon} />
          </div>
          <h2>{item.title}</h2>
          <p>{item.summary}</p>
          <Link to={`${basePath}/${item.slug}`} className="agency-card-link">
            Learn more
            <i className="fa-solid fa-arrow-right" aria-hidden="true" />
          </Link>
        </article>
      ))}
    </div>
  )
}
