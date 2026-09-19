import { CONTACT_INQUIRY_EMAIL } from '../config/app.config'

/**
 * Send a project inquiry to {@link CONTACT_INQUIRY_EMAIL}.
 * Uses FormSubmit (no backend). The first live submit sends an activation
 * email to that inbox — open it once to start receiving inquiries.
 */
export async function sendContactInquiry({
  name,
  company,
  email,
  projectType,
  budget,
  description,
  timeline,
  consult,
}) {
  const res = await fetch(`https://formsubmit.co/ajax/${CONTACT_INQUIRY_EMAIL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      name,
      email,
      company: company || '—',
      project_type: projectType,
      budget: budget || '—',
      timeline: timeline || '—',
      message: description,
      intent: consult ? 'Technical consultation' : 'Start a project',
      _replyto: email,
      _subject: consult
        ? `Consultation request from ${name}`
        : `Project inquiry from ${name}`,
      _template: 'table',
      _captcha: 'false',
    }),
  })

  const data = await res.json().catch(() => ({}))
  const ok = data.success === true || data.success === 'true'
  if (!res.ok || !ok) {
    throw new Error(data.message || 'Could not send the inquiry. Please try again.')
  }
}
