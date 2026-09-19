const members = [
  { name: 'Eade Marren', role: 'Chief Executive' },
  { name: 'Savannah Nguyen', role: 'Operations Head' },
  { name: 'Kristin Watson', role: 'Marketing Lead' },
  { name: 'Darlene Robertson', role: 'Business Director' },
]

export default function Team() {
  return (
    <section>
      <div className="container">
        <div className="section-head">
          <span>Meet Our Team</span>
          <h1>People Behind Bexon</h1>
          <p>Experienced leaders focused on growth, delivery, and innovation.</p>
        </div>
        <div className="cards">
          {members.map(m => (
            <article className="panel" key={m.name}>
              <h3>{m.name}</h3>
              <p className="muted">{m.role}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
