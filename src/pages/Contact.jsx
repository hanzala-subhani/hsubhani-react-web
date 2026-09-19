import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PageHero from '../components/PageHero'
import { CTA_PRIMARY, CTA_TALK } from '../config/app.config'
import { budgetRanges, engagements, projectTimelines, projectTypes } from '../data/agency'
import { sendContactInquiry } from '../lib/contactMail'

const emptyForm = {
  name: '',
  company: '',
  email: '',
  projectType: '',
  budget: '',
  description: '',
  timeline: '',
}

function initialProjectType(searchParams) {
  if (searchParams.get('intent') === 'consult') return 'Technical consultation'
  const engagement = engagements.find(item => item.slug === searchParams.get('type'))
  return engagement?.title || ''
}

export default function Contact() {
  const [searchParams] = useSearchParams()
  const consult = searchParams.get('intent') === 'consult'
  const [form, setForm] = useState(() => ({
    ...emptyForm,
    projectType: initialProjectType(searchParams),
  }))
  const [status, setStatus] = useState(null)
  const [sending, setSending] = useState(false)

  const copy = useMemo(
    () =>
      consult
        ? {
            kicker: CTA_TALK,
            title: 'Book a technical consultation',
            lead: 'Share the system you want to build, modernize, or add AI to. Hanzala Subhani will follow up with a clear next step.',
          }
        : {
            kicker: 'Work with us',
            title: 'Start a project',
            lead: 'Share the product, integration, or modernization you need. The more context you give, the faster Hanzala Subhani can respond.',
          },
    [consult],
  )

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.email || !form.projectType || !form.description) {
      setStatus({ type: 'error', msg: 'Please fill in name, email, project type, and a project description.' })
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setStatus({ type: 'error', msg: 'Please enter a valid email address.' })
      return
    }

    setSending(true)
    setStatus(null)
    try {
      await sendContactInquiry({ ...form, consult })
      setStatus({
        type: 'success',
        msg: consult
          ? 'Consultation request sent. Hanzala Subhani will follow up with a time to talk.'
          : 'Project details sent. Hanzala Subhani will follow up with a clear next step.',
      })
      setForm(emptyForm)
    } catch (err) {
      setStatus({
        type: 'error',
        msg: err.message || 'Could not send the inquiry. Please try again.',
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="agency-page">
      <PageHero kicker={copy.kicker} title={copy.title} lead={copy.lead} />
      <section className="agency-section">
        <div className="container">
          <div className="panel contact-form">
            {status && <div className={`form-msg ${status.type}`}>{status.msg}</div>}
            <form className="form-grid" onSubmit={handleSubmit}>
              <div className="form-grid two">
                <label className="form-field">
                  <span>Name *</span>
                  <input name="name" value={form.name} onChange={handleChange} autoComplete="name" disabled={sending} />
                </label>
                <label className="form-field">
                  <span>Company</span>
                  <input name="company" value={form.company} onChange={handleChange} autoComplete="organization" disabled={sending} />
                </label>
              </div>
              <label className="form-field">
                <span>Email *</span>
                <input name="email" type="email" value={form.email} onChange={handleChange} autoComplete="email" disabled={sending} />
              </label>
              <div className="form-grid two">
                <label className="form-field">
                  <span>Project type *</span>
                  <select name="projectType" value={form.projectType} onChange={handleChange} disabled={sending}>
                    <option value="">Select a type</option>
                    {projectTypes.map(item => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="form-field">
                  <span>Estimated budget</span>
                  <select name="budget" value={form.budget} onChange={handleChange} disabled={sending}>
                    <option value="">Select a range</option>
                    {budgetRanges.map(item => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="form-field">
                <span>Project description *</span>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="What are you trying to ship, modernize, or integrate?"
                  disabled={sending}
                />
              </label>
              <label className="form-field">
                <span>Expected timeline</span>
                <select name="timeline" value={form.timeline} onChange={handleChange} disabled={sending}>
                  <option value="">Select a timeline</option>
                  {projectTimelines.map(item => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <button type="submit" className="btn btn-teal" disabled={sending}>
                {sending ? 'Sending…' : consult ? 'Request consultation' : CTA_PRIMARY}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
