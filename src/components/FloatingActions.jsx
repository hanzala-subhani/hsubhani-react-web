import { Link } from 'react-router-dom'
import { CONTACT_PHONE_TEL, WHATSAPP_LINK } from '../config/app.config'

export default function FloatingActions() {
  return (
    <div className="fab-rail">
      <a
        className="fab fab--whatsapp"
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <i className="fa-brands fa-whatsapp" aria-hidden="true" />
        <span className="fab-label" aria-hidden="true">WhatsApp</span>
      </a>

      <a
        className="fab fab--call"
        href={`tel:${CONTACT_PHONE_TEL}`}
        aria-label={`Call ${CONTACT_PHONE_TEL}`}
      >
        <i className="fa-solid fa-phone fab-ico-shake" aria-hidden="true" />
        <span className="fab-label" aria-hidden="true">Call now</span>
      </a>

      <Link className="fab fab--query" to="/contact" aria-label="Send a query">
        <i className="fa-solid fa-envelope-open-text" aria-hidden="true" />
        <span className="fab-label" aria-hidden="true">Send a query</span>
      </Link>
    </div>
  )
}
