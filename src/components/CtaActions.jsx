import { Link } from 'react-router-dom'
import { CTA_PRIMARY, CTA_SECONDARY } from '../config/app.config'

export default function CtaActions({ className = '', ghostClassName = '' }) {
  return (
    <div className={`cta-actions ${className}`.trim()}>
      <Link to="/contact" className="btn btn-teal">
        {CTA_PRIMARY}
        <span className="btn-ico" aria-hidden="true">
          <i className="fa-solid fa-arrow-up-right" />
        </span>
      </Link>
      <Link to="/contact?intent=consult" className={`btn btn-ghost ${ghostClassName}`.trim()}>
        {CTA_SECONDARY}
      </Link>
    </div>
  )
}
