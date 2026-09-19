export const services = [
  {
    slug: 'custom-software-development',
    icon: 'fa-solid fa-code',
    title: 'Custom Software Development',
    summary: 'Business-specific applications designed around your workflows.',
    text: 'Custom web applications designed around how the business actually operates—from first release through the versions that follow.',
    points: ['Discovery to production delivery', 'Maintainable architecture', 'Clear ownership after launch'],
  },
  {
    slug: 'laravel-development',
    icon: 'fa-brands fa-laravel',
    title: 'Laravel Development',
    summary: 'Enterprise-grade Laravel applications, REST APIs, SaaS platforms and backend systems.',
    text: 'Laravel is a core delivery stack: authentication, queues, billing-ready backends, and business systems that stay understandable as they grow.',
    points: ['Laravel APIs and web apps', 'Auth, queues, and reporting', 'MySQL data modeling'],
  },
  {
    slug: 'api-development',
    icon: 'fa-solid fa-plug',
    title: 'API Development',
    summary: 'Secure, scalable REST APIs and third-party integrations.',
    text: 'APIs for mobile apps, partner integrations, and internal platforms—with authentication, versioning, and the monitoring production systems need.',
    points: ['REST APIs and auth', 'Integrations and webhooks', 'Load-aware design'],
  },
  {
    slug: 'nodejs-development',
    icon: 'fa-brands fa-node-js',
    title: 'Node.js Development',
    summary: 'Real-time applications, microservices and high-performance backend systems.',
    text: 'When the product needs concurrent connections, streaming, or a shared JavaScript stack, Node.js is used for services that stay fast under load.',
    points: ['APIs and microservices', 'Real-time and event work', 'Node + React delivery'],
  },
  {
    slug: 'react-development',
    icon: 'fa-brands fa-react',
    title: 'React Development',
    summary: 'Modern dashboards, admin panels and business applications.',
    text: 'React SPAs that operations teams and customers actually use—responsive layouts, clean state, and UI that does not collapse after the first release.',
    points: ['React SPAs and dashboards', 'Responsive UI', 'Performance-minded UX'],
  },
  {
    slug: 'ai-integration',
    icon: 'fa-solid fa-microchip',
    title: 'AI Development & Integration',
    summary: 'AI inside the software already in production—LLMs, RAG, agents and automation.',
    text: 'AI is not sold as a slogan. Chatbots, document intelligence, RAG, agents, and LLM calls are wired into Laravel and Python/FastAPI systems that are already in production.',
    points: [
      'AI chatbots and assistants',
      'Document intelligence and RAG',
      'AI agents and workflow automation',
      'LLM integrations and AI-powered search',
    ],
  },
  {
    slug: 'saas-development',
    icon: 'fa-solid fa-cloud',
    title: 'SaaS Development',
    summary: 'From MVP to scalable multi-tenant SaaS platforms.',
    text: 'Internal tools and new ideas become SaaS platforms: tenancy, permissions, APIs, and the operational pieces that keep tenants isolated.',
    points: ['Multi-tenant architecture', 'Billing-ready backends', 'Admin and customer apps'],
  },
  {
    slug: 'legacy-system-modernization',
    icon: 'fa-solid fa-recycle',
    title: 'Legacy Modernization',
    summary: 'Modernize old PHP/CodeIgniter applications without rebuilding everything from scratch.',
    text: 'PHP, Laravel, and custom stacks are modernized in stages: stabilize what is live, extract APIs, and rebuild the parts that are blocking growth.',
    points: ['Strangler and staged rewrites', 'API extraction', 'Risk-aware cutovers'],
  },
  {
    slug: 'performance-optimization',
    icon: 'fa-solid fa-gauge-high',
    title: 'Performance Optimization',
    summary: 'Diagnose and speed up slow applications, APIs, and databases.',
    text: 'When an application is in production but too slow, the stack is profiled, bottlenecks are fixed, and the system can take growth without a full rewrite.',
    points: ['API and query profiling', 'Caching and architecture fixes', 'Measured before/after'],
  },
]

export const businessNeeds = [
  { need: 'New product', solution: 'Custom software development', to: '/services/custom-software-development' },
  { need: 'Slow application', solution: 'Performance optimization', to: '/services/performance-optimization' },
  { need: 'Old PHP application', solution: 'Legacy modernization', to: '/services/legacy-system-modernization' },
  { need: 'Need mobile backend', solution: 'API development', to: '/services/api-development' },
  { need: 'Want AI', solution: 'AI integration & automation', to: '/services/ai-integration' },
  { need: 'Need SaaS', solution: 'SaaS architecture & development', to: '/services/saas-development' },
  { need: 'Multiple systems', solution: 'API & system integration', to: '/services/api-development' },
  { need: 'Growing traffic', solution: 'Scalable architecture', to: '/services/custom-software-development' },
]

export const solutions = [
  {
    slug: 'startups',
    icon: 'fa-solid fa-rocket',
    title: 'Startups',
    summary: 'Ship an MVP that can become a real product, not a throwaway prototype.',
    text: 'Founders get from idea to production software with a stack that will not need a full rewrite the moment the first customers arrive.',
    points: ['MVP to v1 delivery', 'Sensible architecture', 'Fast feedback loops'],
  },
  {
    slug: 'smes',
    icon: 'fa-solid fa-briefcase',
    title: 'SMEs',
    summary: 'Custom systems that replace spreadsheets, stalled tools, and vendor lock-in.',
    text: 'Growing companies need software that fits operations: portals, APIs, reporting, and internal tools that staff will actually use.',
    points: ['Operations platforms', 'Integrations', 'Reliable delivery'],
  },
  {
    slug: 'enterprise',
    icon: 'fa-solid fa-building',
    title: 'Enterprise',
    summary: 'Production systems with clear ownership, security, and room to scale.',
    text: 'Delivery partnership on APIs, internal platforms, and modernization programs that have to stay live while they change.',
    points: ['Secure APIs and auth', 'Legacy coexistence', 'Long-term maintainability'],
  },
  {
    slug: 'ecommerce',
    icon: 'fa-solid fa-cart-shopping',
    title: 'E-commerce',
    summary: 'Catalog, checkout, and operations software that can take traffic.',
    text: 'Commerce backends, admin tools, and storefronts—built and modernized so catalog, orders, and integrations stay consistent as volume grows.',
    points: ['Catalog and order APIs', 'Admin operations', 'Payment and partner integrations'],
  },
  {
    slug: 'fintech',
    icon: 'fa-solid fa-building-columns',
    title: 'FinTech',
    summary: 'Careful software for money movement, reporting, and audit-friendly workflows.',
    text: 'FinTech products need disciplined APIs, access control, and audit trails. The operational software is built around those constraints.',
    points: ['Auth and permissions', 'Reporting pipelines', 'Integration-heavy backends'],
  },
  {
    slug: 'ai-solutions',
    icon: 'fa-solid fa-brain',
    title: 'AI Solutions',
    summary: 'AI that sits inside a business process, with a human still in control.',
    text: 'AI features are designed around a real job to be done: support, documents, operations, or product UX—then shipped as part of the application, not a side experiment.',
    points: ['Use-case first', 'Human-in-the-loop', 'Wired into your stack'],
  },
]

export const caseStudies = [
  {
    slug: 'ai-interview-platform',
    kicker: 'AI · Education',
    title: 'AI Interview Preparation Platform',
    summary:
      'AI-powered platform for resume analysis, interview preparation, question generation and candidate evaluation.',
    stack: ['AI', 'Laravel', 'Python', 'FastAPI', 'React', 'MySQL', 'Redis'],
    challenge:
      'Static question banks and generic coaching do not match a candidate’s résumé, role, or the way real interviews actually run. Teams needed a product that could analyse a profile, generate relevant questions, and support evaluation—not another content site.',
    solution:
      'Hanzala Subhani built an AI interview preparation platform that reads résumés, generates role-specific questions, supports practice sessions, and helps evaluate answers. Laravel owns the product, auth, and data; Python/FastAPI runs the AI workloads; React is the candidate and admin experience.',
    architecture:
      'A Laravel application handles users, sessions, and persistence in MySQL. Redis is used for queues, caching, and short-lived interview state. FastAPI services call LLMs for résumé analysis, question generation, and evaluation, so the AI layer can scale independently of the product API.',
    technology:
      'Laravel and React for the product surface; Python and FastAPI for model calls; MySQL for durable records; Redis for cache and background jobs. The split keeps interview UX fast while AI work stays off the request path.',
    result:
      'A production interview product with résumé-aware preparation, generated questions, and evaluation workflows—the same Laravel + Python/FastAPI pattern Hanzala Subhani uses to put AI inside other business systems.',
  },
  {
    slug: 'perfume-ecommerce',
    kicker: 'E-commerce',
    title: 'Perfume E-commerce Platform',
    summary:
      'A commerce platform covering catalog, orders, inventory, payments, admin, and customer management.',
    stack: ['Laravel', 'React', 'MySQL', 'REST API'],
    features: [
      'Product management',
      'Orders',
      'Inventory',
      'Admin',
      'Payments',
      'Customer management',
    ],
    challenge:
      'A fragrance retailer needed more than a brochure storefront. Catalog, stock, orders, payments, and customer records had to live in one system operations staff could run day to day.',
    solution:
      'Hanzala Subhani delivered a Laravel commerce backend with a React admin and storefront surfaces, REST APIs for catalog and checkout, and payment plus customer flows that keep order state consistent.',
    architecture:
      'Laravel owns products, inventory, orders, customers, and payments. React consumes REST APIs for admin operations and customer-facing catalog/checkout. MySQL holds the commercial records the business depends on.',
    technology:
      'Laravel for domain logic and APIs, React for admin and storefront UI, MySQL for catalog and order data, REST for a clean split between backend and clients.',
    result:
      'One platform for product management, orders, inventory, admin, payments, and customers—without stitching together disconnected tools for each step of the sale.',
  },
  {
    slug: 'multi-api-admin',
    kicker: 'APIs · Operations',
    title: 'Multi-API Admin Platform',
    summary: 'One administration interface that manages multiple business systems through authenticated REST APIs.',
    stack: ['Laravel', 'JWT', 'React', 'REST APIs'],
    features: [
      'Single admin UI',
      'JWT-authenticated APIs',
      'Multiple backend systems',
      'Shared operations console',
    ],
    challenge:
      'Operations staff were jumping between separate back-office tools. Each business system had its own login and UI, so simple tasks meant context-switching instead of completing work.',
    solution:
      'Hanzala Subhani built a React administration console that talks to multiple Laravel (and adjacent) REST APIs behind JWT auth—so one interface can create, inspect, and update records across systems.',
    architecture:
      'Each business domain stays behind its own API. The admin SPA authenticates with JWT, then orchestrates calls to those APIs. Laravel services enforce permissions and keep domain boundaries intact instead of collapsing everything into one monolith screen.',
    technology:
      'Laravel REST APIs, JWT for session-less auth, and a React admin that treats multiple backends as one operations surface.',
    result:
      'Staff work from a single admin while the underlying systems remain separately deployable APIs—easier operations without a risky rewrite of every product behind the console.',
  },
]

export const industries = [
  {
    slug: 'fintech',
    icon: 'fa-solid fa-building-columns',
    title: 'FinTech',
    summary: 'Payment integrations, transaction systems and financial workflows.',
    to: '/solutions/fintech',
  },
  {
    slug: 'ecommerce',
    icon: 'fa-solid fa-cart-shopping',
    title: 'E-commerce',
    summary: 'Catalogs, orders, payments, inventory and integrations.',
    to: '/work/perfume-ecommerce',
  },
  {
    slug: 'saas',
    icon: 'fa-solid fa-cloud',
    title: 'SaaS',
    summary: 'Multi-tenant applications and subscription platforms.',
    to: '/services/saas-development',
  },
  {
    slug: 'education',
    icon: 'fa-solid fa-graduation-cap',
    title: 'Education',
    summary: 'Learning platforms and interview/assessment systems.',
    to: '/work/ai-interview-platform',
  },
  {
    slug: 'ai',
    icon: 'fa-solid fa-brain',
    title: 'AI',
    summary: 'AI-powered automation, document processing and intelligent applications.',
    to: '/services/ai-integration',
  },
]

export const aiCapabilities = [
  { title: 'AI Chatbots', text: 'Assistants that sit inside your product, not a disconnected widget.' },
  { title: 'Document Intelligence', text: 'Extract, classify, and summarise the files your team already handles.' },
  { title: 'RAG Systems', text: 'Answers grounded in your documents and data, with retrieval you can inspect.' },
  { title: 'AI Agents', text: 'Multi-step tasks with a human still in control of what gets committed.' },
  { title: 'LLM Integrations', text: 'Model calls wired into Laravel and Python/FastAPI backends.' },
  { title: 'Workflow Automation', text: 'AI where a repetitive process already exists—not a demo in a vacuum.' },
  { title: 'AI-powered Search', text: 'Find the right record, clause, or answer across business content.' },
]

export const projectTypes = [
  'Discovery & Architecture',
  'MVP Development',
  'Dedicated Development Team',
  'Enterprise Modernization',
  'New product / SaaS',
  'AI integration',
  'E-commerce',
  'API / backend',
  'Legacy modernization',
  'Performance optimization',
  'Technical consultation',
  'Other',
]

export const engagements = [
  {
    slug: 'discovery-architecture',
    icon: 'fa-solid fa-compass',
    title: 'Discovery & Architecture',
    audience: 'For businesses that need technical planning before development.',
    text: 'A short, senior-led engagement to clarify the product, constraints, integrations, and a buildable roadmap—before you fund months of engineering.',
    points: ['Business and technical discovery', 'Architecture and integration plan', 'Phased delivery roadmap'],
  },
  {
    slug: 'mvp-development',
    icon: 'fa-solid fa-rocket',
    title: 'MVP Development',
    audience: 'For startups validating a product.',
    text: 'Ship a first production version that real users can run—not a throwaway prototype that has to be rewritten the moment it works.',
    points: ['Scoped v1 that can go live', 'Sensible architecture for what comes next', 'Laravel, React, APIs, or AI where it earns a place'],
  },
  {
    slug: 'dedicated-team',
    icon: 'fa-solid fa-user-group',
    title: 'Dedicated Development Team',
    audience: 'For companies needing ongoing engineering support.',
    text: 'A senior engineering partner for product work that does not stop at launch—features, APIs, performance, and the backlog that follows.',
    points: ['Ongoing delivery capacity', 'Direct access to the technical lead', 'Work fitted to your existing systems'],
  },
  {
    slug: 'enterprise-modernization',
    icon: 'fa-solid fa-recycle',
    title: 'Enterprise Modernization',
    audience: 'For existing applications requiring modernization, optimization or migration.',
    text: 'Stabilize and evolve what is already in production—APIs, performance, staged rewrites, and migrations that keep the business online.',
    points: ['Legacy PHP and Laravel systems', 'API extraction and optimization', 'Risk-aware cutovers, not a big-bang rewrite'],
  },
]

export const budgetRanges = [
  'To be discussed',
  'Under $5,000',
  '$5,000–$15,000',
  '$15,000–$40,000',
  '$40,000+',
]

export const projectTimelines = [
  'ASAP',
  '1–3 months',
  '3–6 months',
  '6+ months',
  'Not sure yet',
]

export const technologies = [
  {
    name: 'Laravel',
    text: 'Primary backend for business systems, SaaS, and REST APIs.',
  },
  {
    name: 'Node.js',
    text: 'Services, real-time features, and JavaScript backends.',
  },
  {
    name: 'React',
    text: 'Customer apps, admin consoles, and responsive SPAs.',
  },
  {
    name: 'Python',
    text: 'Automation, data work, and AI integration.',
  },
  {
    name: 'FastAPI',
    text: 'Python services for LLM calls, RAG, and AI workloads next to Laravel.',
  },
  {
    name: 'AI',
    text: 'Practical model integration inside production workflows.',
  },
  {
    name: 'Cloud',
    text: 'Deployments, environments, and systems that can scale.',
  },
  {
    name: 'MySQL',
    text: 'Relational modeling for products that have to stay consistent.',
  },
  {
    name: 'Docker',
    text: 'Repeatable environments from local development to release.',
  },
]

export const processSteps = [
  {
    n: '01',
    title: 'Discover',
    text: 'Understand your business, requirements and technical challenges.',
  },
  {
    n: '02',
    title: 'Architect',
    text: 'Define the technology, architecture, integrations and roadmap.',
  },
  {
    n: '03',
    title: 'Build',
    text: 'Develop the product using modern engineering practices.',
  },
  {
    n: '04',
    title: 'Test',
    text: 'Performance, security, reliability and functional testing.',
  },
  {
    n: '05',
    title: 'Launch',
    text: 'Deploy to production and monitor the system.',
  },
  {
    n: '06',
    title: 'Scale',
    text: 'Continuous improvements, optimization and new features.',
  },
]

export const homeTrustedStack = ['Laravel', 'PHP', 'Node.js', 'React', 'Python', 'AI']

export const homeWhatWeBuild = [
  { title: 'Custom Software', icon: 'fa-solid fa-code', to: '/services/custom-software-development' },
  { title: 'API Development', icon: 'fa-solid fa-plug', to: '/services/api-development' },
  { title: 'SaaS Platforms', icon: 'fa-solid fa-cloud', to: '/services/saas-development' },
  { title: 'AI Solutions', icon: 'fa-solid fa-brain', to: '/services/ai-integration' },
  { title: 'E-commerce', icon: 'fa-solid fa-cart-shopping', to: '/solutions/ecommerce' },
  { title: 'Legacy Modernization', icon: 'fa-solid fa-recycle', to: '/services/legacy-system-modernization' },
]

export const homeWhyHSubhani = [
  {
    icon: 'fa-solid fa-clock',
    title: '16+ Years Engineering Experience',
    text: 'Sixteen years of shipping production software, not a portfolio of prototypes. The patterns come from systems that had to stay live.',
  },
  {
    icon: 'fa-solid fa-user-gear',
    title: 'Senior Technical Leadership',
    text: 'You work directly with the technical lead who designs and reviews the build. No account-manager layer translating requirements.',
  },
  {
    icon: 'fa-solid fa-server',
    title: 'API & Backend Expertise',
    text: 'Authentication, queues, versioning, and monitoring treated as delivery requirements rather than things bolted on after launch.',
  },
  {
    icon: 'fa-solid fa-diagram-project',
    title: 'Scalable Architecture',
    text: 'Systems modelled around how the business actually operates, so growth means adding capacity instead of funding a rewrite.',
  },
  {
    icon: 'fa-solid fa-microchip',
    title: 'AI Integration',
    text: 'LLMs, RAG, and agents wired into Laravel and Python services already in production — measured against a real job to be done.',
  },
  {
    icon: 'fa-solid fa-handshake',
    title: 'Long-Term Technology Partnership',
    text: 'Delivery does not stop at launch. Features, performance work, and the backlog that follows stay with the same engineers.',
  },
]

/** Architecture layers rendered in the home hero panel. Mirrors the real delivery stack. */
export const homeArchitectureLayers = [
  {
    tier: 'Client',
    label: 'React SPA',
    detail: 'Dashboards, admin consoles, customer apps',
    icon: 'fa-brands fa-react',
  },
  {
    tier: 'Product API',
    label: 'Laravel',
    detail: 'Auth, domain logic, billing-ready backends',
    icon: 'fa-brands fa-laravel',
  },
  {
    tier: 'AI Services',
    label: 'Python · FastAPI',
    detail: 'LLM calls, RAG, document intelligence',
    icon: 'fa-solid fa-microchip',
  },
  {
    tier: 'Data',
    label: 'MySQL · Redis',
    detail: 'Durable records, cache, queues',
    icon: 'fa-solid fa-database',
  },
]

export const homeTechnology = ['Laravel', 'Node', 'React', 'Python', 'MySQL', 'Redis', 'AWS']

export const homeInsightTopics = ['Laravel', 'Backend', 'Architecture', 'AI', 'Python']

export function findService(slug) {
  return services.find(item => item.slug === slug) || null
}

export function findSolution(slug) {
  return solutions.find(item => item.slug === slug) || null
}

export function findCaseStudy(slug) {
  return caseStudies.find(item => item.slug === slug) || null
}
