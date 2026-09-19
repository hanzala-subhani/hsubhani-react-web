import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CHAT_INTRO, CHAT_STARTERS, resolveBotReply } from '../data/chatbot'
import { SITE_BRAND_MARK, WHATSAPP_LINK } from '../config/app.config'

const introMessage = {
  id: 'intro',
  from: 'bot',
  text: CHAT_INTRO,
  quickReplies: CHAT_STARTERS,
}

let messageSeq = 0
const nextId = () => `m${++messageSeq}`

export default function ChatBot({ open, onClose }) {
  const [messages, setMessages] = useState([introMessage])
  const [draft, setDraft] = useState('')
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef(null)
  const inputRef = useRef(null)
  const replyTimer = useRef(null)

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, typing])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = e => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => () => clearTimeout(replyTimer.current), [])

  function send(text) {
    const value = String(text || '').trim()
    if (!value || typing) return
    setMessages(prev => [...prev, { id: nextId(), from: 'user', text: value }])
    setDraft('')
    setTyping(true)
    clearTimeout(replyTimer.current)
    replyTimer.current = setTimeout(() => {
      const reply = resolveBotReply(value)
      setTyping(false)
      setMessages(prev => [...prev, { id: nextId(), from: 'bot', ...reply }])
    }, 650)
  }

  const lastBotIndex = messages.reduce(
    (found, msg, i) => (msg.from === 'bot' ? i : found),
    -1,
  )

  return (
    <section
      className={`chatbot${open ? ' is-open' : ''}`}
      role="dialog"
      aria-label={`Chat with ${SITE_BRAND_MARK}`}
      aria-modal="false"
      aria-hidden={!open}
    >
      <header className="chatbot-head">
        <span className="chatbot-avatar" aria-hidden="true">
          <i className="fa-solid fa-robot" />
        </span>
        <div className="chatbot-head-text">
          <strong>{SITE_BRAND_MARK}</strong>
          <span className="chatbot-status">
            <i className="chatbot-status-dot" aria-hidden="true" />
            Assistant · replies instantly
          </span>
        </div>
        <button
          type="button"
          className="chatbot-close"
          onClick={onClose}
          aria-label="Close chat"
        >
          <i className="fa-solid fa-xmark" aria-hidden="true" />
        </button>
      </header>

      <div className="chatbot-body" ref={scrollRef}>
        {messages.map((msg, i) => (
          <div key={msg.id} className={`chatbot-row chatbot-row--${msg.from}`}>
            {msg.from === 'bot' ? (
              <span className="chatbot-bot-mark" aria-hidden="true">
                <i className="fa-solid fa-robot" />
              </span>
            ) : null}
            <div className="chatbot-bubble-group">
              <p className={`chatbot-bubble chatbot-bubble--${msg.from}`}>{msg.text}</p>
              {msg.cta ? (
                <Link className="chatbot-cta" to={msg.cta.to} onClick={onClose}>
                  {msg.cta.label}
                  <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                </Link>
              ) : null}
              {msg.quickReplies && i === lastBotIndex && !typing ? (
                <div className="chatbot-chips">
                  {msg.quickReplies.map(chip => (
                    <button
                      key={chip}
                      type="button"
                      className="chatbot-chip"
                      onClick={() => send(chip)}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ))}

        {typing ? (
          <div className="chatbot-row chatbot-row--bot">
            <span className="chatbot-bot-mark" aria-hidden="true">
              <i className="fa-solid fa-robot" />
            </span>
            <p className="chatbot-bubble chatbot-bubble--bot chatbot-typing" aria-label="Typing">
              <i /><i /><i />
            </p>
          </div>
        ) : null}
      </div>

      <form
        className="chatbot-input"
        onSubmit={e => {
          e.preventDefault()
          send(draft)
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          placeholder="Ask about services, pricing, timelines…"
          aria-label="Your message"
          maxLength={400}
        />
        <button type="submit" aria-label="Send message" disabled={!draft.trim() || typing}>
          <i className="fa-solid fa-paper-plane" aria-hidden="true" />
        </button>
      </form>

      <p className="chatbot-foot">
        Prefer a human?{' '}
        <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
          Chat on WhatsApp
        </a>
      </p>
    </section>
  )
}
