import { Link } from 'react-router-dom'

export default function WorkStudyCard({ study, headingLevel = 'h3' }) {
  const Heading = headingLevel

  return (
    <article className="agency-study">
      <p className="agency-study-kicker">{study.kicker}</p>
      <Heading>{study.title}</Heading>
      <ul className="agency-study-stack">
        {study.stack.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p>{study.summary}</p>
      {study.features?.length ? (
        <ul className="agency-study-features">
          {study.features.map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
      <Link to={`/work/${study.slug}`} className="agency-card-link">
        Read the case
        <i className="fa-solid fa-arrow-right" aria-hidden="true" />
      </Link>
    </article>
  )
}
