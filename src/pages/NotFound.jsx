import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="not-found-page">
      <div className="container not-found-inner">
        <p className="not-found-code" aria-hidden="true">
          404
        </p>
        <h1>Page not found</h1>
        <p>
          This link doesn&apos;t exist or may have moved. Head back home or browse the blog and
          courses.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="btn btn-primary">
            Go home
          </Link>
          <Link to="/blog" className="btn btn-ghost">
            View blog
          </Link>
        </div>
      </div>
    </section>
  )
}
