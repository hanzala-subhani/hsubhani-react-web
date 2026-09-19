import { services, solutions } from './agency'
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  SITE_BRAND_MARK,
  SITE_STACK,
} from '../config/app.config'

const serviceTitles = services.slice(0, 5).map(s => s.title)
const solutionTitles = solutions.slice(0, 4).map(s => s.title)

export const CHAT_INTRO =
  `Hi! I'm the ${SITE_BRAND_MARK} assistant. Ask about services, timelines or pricing — or jump straight to a human.`

export const CHAT_STARTERS = [
  'What services do you offer?',
  'What does a project cost?',
  'Which tech stack do you use?',
  'I want to start a project',
]

/**
 * Ordered intent table. First matching pattern wins, so keep the narrow
 * patterns above the broad ones.
 */
const intents = [
  {
    match: /^(hi|hey|hello|yo|salam|assalam[ou]? ?alaikum|namaste)\b|^good (morning|afternoon|evening)/i,
    reply: () => ({
      text: 'Hello! Good to see you. What are you looking to build?',
      quickReplies: ['Web application', 'API / backend', 'AI solution', 'Talk to a human'],
    }),
  },
  {
    match: /price|pricing|cost|budget|quote|rate|charge|how much|fees?/i,
    reply: () => ({
      text: 'Engagements are scoped per project rather than sold as fixed packages — it depends on scope, integrations and timeline. The engagement models page breaks down how we structure it, and a short call gets you a real number.',
      cta: { label: 'See engagement models', to: '/pricing' },
      quickReplies: ['Get a quote', 'How long does it take?'],
    }),
  },
  {
    match: /how long|timeline|duration|deadline|when can you|delivery|deliver|process|milestone/i,
    reply: () => ({
      text: 'Typical timelines: 2–4 weeks for a focused build, 6–12 weeks for a full product. Every engagement starts with discovery, then moves through architecture, build, and handover in reviewable milestones.',
      cta: { label: 'See how we work', to: '/process' },
      quickReplies: ['Start a project', 'What does it cost?'],
    }),
  },
  {
    match: /\bai\b|artificial intelligence|chatbot|llm|gpt|rag|agent|machine learning|automation/i,
    reply: () => ({
      text: `AI is wired into systems already running in production — chatbots and assistants, document intelligence, RAG pipelines and LLM integrations inside Laravel and Python/FastAPI backends. Not a bolt-on widget.`,
      cta: { label: 'Explore AI solutions', to: '/solutions' },
      quickReplies: ['Start a project', 'Which tech stack do you use?'],
    }),
  },
  {
    match: /stack|technolog|framework|language|laravel|node|react|python|fastapi|database|aws|cloud/i,
    reply: () => ({
      text: `Core stack: ${SITE_STACK.join(', ')}. Backend-heavy by default — Laravel and Node for APIs, React on the front end, Python/FastAPI where AI work lives.`,
      cta: { label: 'See the full stack', to: '/technology' },
      quickReplies: ['What services do you offer?', 'Start a project'],
    }),
  },
  {
    match: /service|what do you (do|offer)|offering|capabilit|help me with/i,
    reply: () => ({
      text: `Main services: ${serviceTitles.join(', ')}. Each one has a detail page with scope and deliverables.`,
      cta: { label: 'Browse services', to: '/services' },
      quickReplies: ['Show me solutions', 'What does it cost?'],
    }),
  },
  {
    match: /solution|product|platform|saas|industr/i,
    reply: () => ({
      text: `Packaged solutions include ${solutionTitles.join(', ')} — built as products, then adapted to how your business actually runs.`,
      cta: { label: 'Browse solutions', to: '/solutions' },
      quickReplies: ['See past work', 'Start a project'],
    }),
  },
  {
    match: /work|portfolio|case stud|example|project you|built|client/i,
    reply: () => ({
      text: 'Case studies cover the problem, the architecture decisions and the measured outcome — production systems, not concept demos.',
      cta: { label: 'Read case studies', to: '/work' },
      quickReplies: ['Start a project', 'What services do you offer?'],
    }),
  },
  {
    match: /whatsapp|chat on whats/i,
    reply: () => ({
      text: 'WhatsApp is the fastest route — tap the green button in the corner and it opens with a message ready to send.',
      quickReplies: ['Start a project', 'Email instead'],
    }),
  },
  {
    match: /call|phone|mobile|number|ring me/i,
    reply: () => ({
      text: `Direct line: ${CONTACT_PHONE}. The call button in the corner dials it for you.`,
      quickReplies: ['Start a project', 'Email instead'],
    }),
  },
  {
    match: /email|mail|write to/i,
    reply: () => ({
      text: `Email works well for detailed briefs: ${CONTACT_EMAIL}. Replies usually land within one business day.`,
      quickReplies: ['Start a project'],
    }),
  },
  {
    match: /human|real person|talk to|speak to|founder|hanzala|consult|meeting|book/i,
    reply: () => ({
      text: `Happy to hand you over. ${SITE_BRAND_MARK} handles technical conversations directly — share a few lines about the project and you'll get a real reply, not a sales sequence.`,
      cta: { label: 'Start the conversation', to: '/contact' },
      quickReplies: ['Call instead', 'Email instead'],
    }),
  },
  {
    match: /start|hire|quote|get in touch|contact|inquir|enquir|interested|work with|new project|build/i,
    reply: () => ({
      text: 'Great — the contact form captures scope, budget range and timeline so the first reply is useful instead of a discovery email chain.',
      cta: { label: 'Start a project', to: '/contact' },
      quickReplies: ['Talk to a human', 'What does it cost?'],
    }),
  },
  {
    match: /blog|article|insight|read|interview|course|learn/i,
    reply: () => ({
      text: 'Insights covers engineering write-ups, and there are interview prep topics and courses alongside them.',
      cta: { label: 'Read insights', to: '/blog' },
      quickReplies: ['What services do you offer?'],
    }),
  },
  {
    match: /thank|thanks|thx|shukriya|great|awesome|cool|nice|ok|okay|got it|bye|goodbye/i,
    reply: () => ({
      text: 'Anytime. If you want to take it further, the contact form or WhatsApp will reach a human directly.',
      quickReplies: ['Start a project', 'Talk to a human'],
    }),
  },
]

const fallback = () => ({
  text: "I didn't quite catch that. I can help with services, pricing, timelines, tech stack and past work — or connect you with a human.",
  quickReplies: CHAT_STARTERS,
})

/**
 * Resolve a scripted reply for user input. Swap this for an API call to move
 * the widget onto a real conversational backend; the return shape stays valid.
 */
export function resolveBotReply(input) {
  const text = String(input || '').trim()
  if (!text) return fallback()
  const intent = intents.find(item => item.match.test(text))
  return intent ? intent.reply() : fallback()
}
