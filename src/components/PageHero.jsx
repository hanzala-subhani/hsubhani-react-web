export default function PageHero({ kicker, title, lead }) {
  return (
    <header className="agency-hero">
      <div className="container">
        {kicker ? <p className="agency-hero-kicker">{kicker}</p> : null}
        <h1>{title}</h1>
        {lead ? <p className="agency-hero-lead">{lead}</p> : null}
      </div>
    </header>
  )
}
