import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ChatBot from './ChatBot'
import { CONTACT_PHONE_TEL, WHATSAPP_LINK } from '../config/app.config'

export default function FloatingActions() {
  const [chatOpen, setChatOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => setChatOpen(false), [pathname])

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

      <button
        type="button"
        className={`fab fab--chat${chatOpen ? ' is-active' : ''}`}
        onClick={() => setChatOpen(o => !o)}
        aria-label={chatOpen ? 'Close chat assistant' : 'Open chat assistant'}
        aria-expanded={chatOpen}
      >
        <span className="fab-ping" aria-hidden="true" />
        <i
          className={`fa-solid ${chatOpen ? 'fa-xmark' : 'fa-comment-dots'}`}
          aria-hidden="true"
        />
        <span className="fab-label" aria-hidden="true">
          {chatOpen ? 'Close chat' : 'Chat with us'}
        </span>
      </button>

      <ChatBot open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  )
}
