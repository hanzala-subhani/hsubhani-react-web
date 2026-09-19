export const interviewCategories = [
  {
    slug: 'business-strategy',
    title: 'Business Strategy',
    icon: 'fa-chart-line',
    subs: [
      {
        slug: 'market-analysis', label: 'Market Analysis', icon: 'fa-magnifying-glass-chart',
        questions: [
          { q: 'What is a SWOT analysis and how do you apply it?', a: 'SWOT stands for Strengths, Weaknesses, Opportunities, and Threats. It is a framework used to evaluate a business or project by identifying internal factors (strengths and weaknesses) and external factors (opportunities and threats) that affect its success.' },
          { q: 'How do you define a target market?', a: 'A target market is a specific group of consumers most likely to buy your product or service. It is defined through demographic, psychographic, geographic, and behavioral segmentation.' },
          { q: "What is Porter's Five Forces model?", a: "Porter's Five Forces is a framework for analyzing the competitive forces in an industry: threat of new entrants, bargaining power of suppliers, bargaining power of buyers, threat of substitutes, and competitive rivalry." },
          { q: 'How do you conduct a competitive analysis?', a: 'A competitive analysis involves identifying your key competitors, evaluating their products, pricing, marketing strategies, strengths, and weaknesses, and using that information to position your own offering more effectively.' },
          { q: 'What is market segmentation and why does it matter?', a: 'Market segmentation divides a broad market into subsets of consumers with common needs or characteristics. It matters because it allows businesses to tailor products, messaging, and channels to specific groups, improving relevance and conversion.' },
          { q: 'Explain the difference between TAM, SAM, and SOM.', a: 'TAM (Total Addressable Market) is the total demand for a product. SAM (Serviceable Addressable Market) is the portion your business model can target. SOM (Serviceable Obtainable Market) is the realistic share you can capture.' },
        ],
      },
      {
        slug: 'competitive-strategy', label: 'Competitive Strategy', icon: 'fa-chess',
        questions: [
          { q: "What are the three generic competitive strategies by Porter?", a: "Porter's three generic strategies are cost leadership (being the lowest-cost producer), differentiation (offering unique value), and focus (targeting a narrow segment with either cost or differentiation)." },
          { q: 'How do you build a sustainable competitive advantage?', a: 'Sustainable competitive advantage comes from resources or capabilities that are valuable, rare, difficult to imitate, and well-organized — often referred to as the VRIO framework.' },
          { q: 'What is a blue ocean strategy?', a: 'Blue ocean strategy involves creating uncontested market space by making competition irrelevant, rather than competing in existing markets. It focuses on value innovation — simultaneously pursuing differentiation and low cost.' },
          { q: 'How do you respond to a new market entrant?', a: 'Responses include strengthening customer relationships, accelerating product development, adjusting pricing, increasing marketing investment, or leveraging switching costs and network effects to retain customers.' },
          { q: 'What is first-mover advantage and when does it not apply?', a: "First-mover advantage is the benefit gained by being the first to enter a market. It does not always apply when the market is not yet ready, when technology changes rapidly, or when fast followers can learn from the pioneer's mistakes at lower cost." },
        ],
      },
      {
        slug: 'growth-planning', label: 'Growth Planning', icon: 'fa-seedling',
        questions: [
          { q: 'What is the Ansoff Matrix?', a: 'The Ansoff Matrix is a strategic planning tool that presents four growth strategies: market penetration, market development, product development, and diversification, based on whether products and markets are new or existing.' },
          { q: 'How do you prioritize growth initiatives?', a: 'Growth initiatives are prioritized by evaluating potential impact, resource requirements, time to value, strategic alignment, and risk. Frameworks like ICE scoring (Impact, Confidence, Ease) are commonly used.' },
          { q: 'What is the difference between organic and inorganic growth?', a: 'Organic growth comes from internal efforts like increasing sales, expanding product lines, or entering new markets. Inorganic growth comes from external means such as mergers, acquisitions, or partnerships.' },
          { q: 'How do you build a growth roadmap?', a: 'A growth roadmap starts with a clear goal, identifies the key levers that drive growth, sequences initiatives by priority and dependency, assigns ownership, and defines measurable milestones with review checkpoints.' },
        ],
      },
      {
        slug: 'okrs-kpis', label: 'OKRs & KPIs', icon: 'fa-bullseye',
        questions: [
          { q: 'What is the difference between OKRs and KPIs?', a: 'OKRs (Objectives and Key Results) are goal-setting frameworks focused on ambitious outcomes and measurable results. KPIs (Key Performance Indicators) are ongoing metrics that track the health of a business process. OKRs drive change; KPIs monitor performance.' },
          { q: 'How do you write a good OKR?', a: 'A good OKR has an inspiring, qualitative Objective and 2-4 quantitative Key Results that are measurable, time-bound, and directly indicate progress toward the objective. Key Results should be outcomes, not tasks.' },
          { q: 'How do you cascade OKRs across an organisation?', a: 'Cascading OKRs means aligning team and individual OKRs to company-level OKRs. Each team identifies how their work contributes to the top-level objectives, creating a connected hierarchy of goals.' },
          { q: 'What makes a KPI effective?', a: 'An effective KPI is specific, measurable, actionable, relevant to the business goal, and time-bound. It should be a leading indicator where possible, giving early signal rather than just confirming past results.' },
        ],
      },
      {
        slug: 'business-models', label: 'Business Models', icon: 'fa-diagram-project',
        questions: [
          { q: 'What is the Business Model Canvas?', a: 'The Business Model Canvas is a strategic management template with nine building blocks: customer segments, value propositions, channels, customer relationships, revenue streams, key resources, key activities, key partnerships, and cost structure.' },
          { q: 'What is a subscription business model and what are its advantages?', a: 'A subscription model charges customers a recurring fee for ongoing access to a product or service. Advantages include predictable revenue, higher customer lifetime value, and stronger retention incentives.' },
          { q: 'How do platform business models differ from traditional ones?', a: 'Platform models create value by facilitating interactions between two or more user groups (e.g., buyers and sellers). Unlike traditional pipeline models that create and sell products, platforms enable exchanges and grow through network effects.' },
          { q: 'What is unit economics and why does it matter?', a: 'Unit economics measures the revenue and cost associated with a single unit of business (e.g., one customer or one transaction). It matters because it reveals whether the core business is profitable at scale before growth costs are applied.' },
        ],
      },
      {
        slug: 'risk-management', label: 'Risk Management', icon: 'fa-shield-halved',
        questions: [
          { q: 'What are the four main risk response strategies?', a: 'The four strategies are: avoid (eliminate the risk), mitigate (reduce likelihood or impact), transfer (shift risk to a third party, e.g., insurance), and accept (acknowledge and monitor the risk without action).' },
          { q: 'How do you build a risk register?', a: 'A risk register documents identified risks, their likelihood, potential impact, risk owner, and the chosen response strategy. It is a living document reviewed regularly throughout a project or business cycle.' },
          { q: 'What is the difference between risk appetite and risk tolerance?', a: 'Risk appetite is the amount of risk an organisation is willing to accept in pursuit of its objectives. Risk tolerance is the acceptable variation around that appetite — the boundaries within which the organisation will operate.' },
          { q: 'How do you identify risks in a new business initiative?', a: 'Risk identification techniques include brainstorming with stakeholders, reviewing historical data from similar projects, using checklists, conducting SWOT analysis, and running pre-mortem exercises to imagine what could go wrong.' },
        ],
      },
    ],
  },
  {
    slug: 'leadership-management',
    title: 'Leadership & Management',
    icon: 'fa-users-gear',
    subs: [
      {
        slug: 'team-leadership', label: 'Team Leadership', icon: 'fa-people-group',
        questions: [
          { q: 'What is the difference between a manager and a leader?', a: 'Managers focus on processes, planning, and ensuring tasks are completed correctly. Leaders focus on vision, inspiration, and motivating people toward a goal. Effective leaders often do both, but the distinction lies in influence versus authority.' },
          { q: 'How do you motivate a disengaged team member?', a: 'Start with a private, honest conversation to understand the root cause. Address any blockers, clarify expectations, reconnect them to the purpose of their work, and identify development opportunities that align with their interests.' },
          { q: 'What leadership style do you adapt to different situations?', a: "Situational leadership suggests adapting your style based on the team member's competence and commitment. Use a directing style for low competence, coaching for developing skills, supporting for capable but uncertain individuals, and delegating for high performers." },
          { q: 'How do you build psychological safety in a team?', a: 'Psychological safety is built by modelling vulnerability, welcoming dissenting opinions, responding constructively to mistakes, and consistently demonstrating that speaking up has no negative consequences.' },
        ],
      },
      {
        slug: 'change-management', label: 'Change Management', icon: 'fa-arrows-rotate',
        questions: [
          { q: "What is Kotter's 8-Step Change Model?", a: "Kotter's model guides organisations through change in eight steps: create urgency, build a guiding coalition, form a strategic vision, enlist volunteers, enable action by removing barriers, generate short-term wins, sustain acceleration, and institute change." },
          { q: 'How do you manage resistance to change?', a: 'Resistance is managed by involving people early, communicating the why clearly, addressing fears directly, identifying and empowering change champions, and celebrating early wins to build momentum.' },
          { q: 'What is ADKAR and how is it used?', a: 'ADKAR is a change management model focusing on individual change: Awareness of the need, Desire to support it, Knowledge of how to change, Ability to implement, and Reinforcement to sustain it. It helps identify where individuals are stuck in a change process.' },
        ],
      },
      {
        slug: 'decision-making', label: 'Decision Making', icon: 'fa-scale-balanced',
        questions: [
          { q: 'What is the RACI matrix and how do you use it?', a: 'RACI defines roles in decision-making: Responsible (does the work), Accountable (owns the outcome), Consulted (provides input), Informed (kept updated). It clarifies ownership and prevents confusion in cross-functional decisions.' },
          { q: 'How do you make decisions with incomplete information?', a: 'Use structured frameworks to identify what you know, what you need to know, and what you can reasonably assume. Set a decision deadline, gather the most critical missing data, and accept that some uncertainty is unavoidable.' },
          { q: 'What is a pre-mortem and when should you use it?', a: 'A pre-mortem is a technique where the team imagines a future failure and works backward to identify what caused it. Use it before major decisions or project launches to surface risks that optimism bias might otherwise hide.' },
        ],
      },
      {
        slug: 'conflict-resolution', label: 'Conflict Resolution', icon: 'fa-handshake',
        questions: [
          { q: 'What are the five conflict resolution styles?', a: 'The Thomas-Kilmann model identifies five styles: competing (assertive, uncooperative), collaborating (assertive, cooperative), compromising (middle ground), avoiding (unassertive, uncooperative), and accommodating (unassertive, cooperative).' },
          { q: 'How do you mediate a conflict between two team members?', a: 'Meet with each person separately first to understand their perspective. Then bring them together in a neutral setting, establish ground rules, focus on interests rather than positions, and work toward a mutually acceptable resolution.' },
          { q: 'How do you handle conflict in a remote team?', a: 'Remote conflict requires more deliberate communication. Address it promptly via video call rather than text, ensure both parties feel heard, document agreed resolutions, and follow up to confirm the issue is resolved.' },
        ],
      },
      {
        slug: 'coaching-mentoring', label: 'Coaching & Mentoring', icon: 'fa-graduation-cap',
        questions: [
          { q: 'What is the GROW coaching model?', a: 'GROW stands for Goal (what do you want to achieve?), Reality (where are you now?), Options (what could you do?), and Will (what will you do?). It is a structured framework for coaching conversations.' },
          { q: 'What is the difference between coaching and mentoring?', a: "Coaching is typically short-term, focused on specific performance goals, and does not require the coach to have expertise in the coachee's field. Mentoring is longer-term, relationship-based, and involves sharing experience and guidance from someone more senior." },
          { q: 'How do you give effective feedback?', a: 'Effective feedback is specific, timely, behaviour-focused (not personal), and delivered with the intent to help. The SBI model (Situation, Behaviour, Impact) is a useful structure for keeping feedback clear and objective.' },
        ],
      },
    ],
  },
  {
    slug: 'operations-process',
    title: 'Operations & Process',
    icon: 'fa-gears',
    subs: [
      {
        slug: 'process-improvement', label: 'Process Improvement', icon: 'fa-arrow-trend-up',
        questions: [
          { q: 'What is a process map and how do you create one?', a: 'A process map is a visual representation of the steps in a workflow. To create one, identify the start and end points, list every step in sequence, assign owners, and use standard symbols (swimlane diagrams are common for cross-functional processes).' },
          { q: 'What is the PDCA cycle?', a: 'PDCA (Plan-Do-Check-Act) is a continuous improvement cycle. Plan the change, Do it on a small scale, Check the results against expectations, and Act to standardise the improvement or begin the cycle again.' },
          { q: 'How do you identify bottlenecks in a process?', a: 'Bottlenecks are identified by mapping the process, measuring throughput and wait times at each step, and finding where work accumulates. The Theory of Constraints suggests focusing improvement efforts on the single biggest constraint first.' },
          { q: 'What is value stream mapping?', a: 'Value stream mapping is a lean technique that visualises the flow of materials and information required to deliver a product or service. It distinguishes value-adding steps from waste, helping teams identify improvement opportunities.' },
        ],
      },
      {
        slug: 'project-management', label: 'Project Management', icon: 'fa-list-check',
        questions: [
          { q: 'What is the triple constraint in project management?', a: 'The triple constraint (or iron triangle) refers to the three competing demands of scope, time, and cost. Changing one typically affects the others. Quality is sometimes added as a fourth dimension.' },
          { q: 'What is the difference between Agile and Waterfall?', a: 'Waterfall is a sequential, plan-driven approach where each phase is completed before the next begins. Agile is iterative and flexible, delivering work in short sprints with continuous feedback and adaptation.' },
          { q: 'How do you manage scope creep?', a: 'Scope creep is managed through a clear change control process: document the original scope, require formal approval for any additions, assess the impact on timeline and budget, and communicate changes to all stakeholders.' },
          { q: 'What is a critical path in project planning?', a: 'The critical path is the longest sequence of dependent tasks that determines the minimum project duration. Any delay on the critical path delays the entire project, making it the primary focus for schedule management.' },
          { q: 'How do you run an effective project retrospective?', a: 'A retrospective covers three questions: what went well, what did not go well, and what will we do differently. It should be blameless, time-boxed, and result in specific, actionable commitments — not just observations.' },
        ],
      },
      {
        slug: 'automation', label: 'Automation', icon: 'fa-robot',
        questions: [
          { q: 'How do you decide which processes to automate?', a: 'Good automation candidates are high-volume, rule-based, repetitive, low-exception, and time-sensitive. Avoid automating processes that are poorly defined, highly variable, or likely to change significantly in the near term.' },
          { q: 'What is RPA and where is it best applied?', a: 'Robotic Process Automation (RPA) uses software bots to mimic human interactions with digital systems. It is best applied to structured, repetitive tasks like data entry, report generation, and system-to-system data transfer.' },
          { q: 'What are the risks of over-automating?', a: 'Over-automation risks include brittle systems that break when inputs change, loss of human oversight for edge cases, reduced team understanding of underlying processes, and high maintenance overhead when upstream systems evolve.' },
        ],
      },
    ],
  },
  {
    slug: 'marketing-sales',
    title: 'Marketing & Sales',
    icon: 'fa-bullhorn',
    subs: [
      {
        slug: 'digital-marketing', label: 'Digital Marketing', icon: 'fa-mobile-screen',
        questions: [
          { q: 'What is the difference between inbound and outbound marketing?', a: 'Inbound marketing attracts customers through content, SEO, and social media — pulling them toward your brand. Outbound marketing pushes messages to a broad audience through ads, cold outreach, and direct mail.' },
          { q: 'How do you measure the ROI of a digital marketing campaign?', a: 'ROI is measured by tracking revenue attributed to the campaign against total campaign costs. Attribution models (first-touch, last-touch, multi-touch) determine how credit is assigned across touchpoints.' },
          { q: 'What is a conversion funnel?', a: 'A conversion funnel maps the stages a prospect moves through from awareness to purchase: typically Awareness, Interest, Consideration, Intent, Evaluation, and Purchase. Optimising each stage improves overall conversion rate.' },
          { q: 'What is A/B testing and how do you run one?', a: 'A/B testing compares two versions of a variable (headline, CTA, layout) to determine which performs better. Run it by isolating one variable, splitting traffic randomly, running the test until statistical significance is reached, then implementing the winner.' },
        ],
      },
      {
        slug: 'sales-funnel', label: 'Sales Funnel', icon: 'fa-filter',
        questions: [
          { q: 'What is the difference between a lead, prospect, and opportunity?', a: 'A lead is an unqualified contact who has shown some interest. A prospect is a qualified lead who fits your target profile. An opportunity is a prospect actively engaged in a buying process with a defined need and budget.' },
          { q: 'What is SPIN selling?', a: 'SPIN selling is a consultative sales methodology using four question types: Situation (understand context), Problem (identify pain), Implication (explore consequences), Need-Payoff (connect solution to value). It is most effective for complex B2B sales.' },
          { q: 'How do you shorten a long sales cycle?', a: 'Shorten sales cycles by qualifying leads more rigorously upfront, identifying the economic buyer early, providing clear ROI evidence, reducing friction in the evaluation process, and creating urgency through time-limited incentives or business case deadlines.' },
          { q: 'What is customer lifetime value (CLV) and how is it calculated?', a: 'CLV is the total revenue a business can expect from a single customer over the entire relationship. A simple formula: CLV = Average Purchase Value × Purchase Frequency × Customer Lifespan.' },
        ],
      },
      {
        slug: 'crm-retention', label: 'CRM & Retention', icon: 'fa-heart-pulse',
        questions: [
          { q: 'What is a CRM and what are its core functions?', a: 'A CRM (Customer Relationship Management) system manages interactions with current and potential customers. Core functions include contact management, pipeline tracking, activity logging, reporting, and communication automation.' },
          { q: 'What is Net Promoter Score (NPS)?', a: 'NPS measures customer loyalty by asking: "How likely are you to recommend us to a friend?" on a 0-10 scale. Promoters (9-10) minus Detractors (0-6) gives the NPS. It is a leading indicator of retention and growth.' },
          { q: 'How do you reduce customer churn?', a: 'Reduce churn by identifying at-risk customers early through usage data and engagement signals, proactively reaching out, addressing unresolved issues, improving onboarding, and ensuring customers are achieving their desired outcomes.' },
        ],
      },
    ],
  },
  {
    slug: 'finance-accounting',
    title: 'Finance & Accounting',
    icon: 'fa-coins',
    subs: [
      {
        slug: 'financial-analysis', label: 'Financial Analysis', icon: 'fa-chart-pie',
        questions: [
          { q: 'What are the three main financial statements?', a: 'The three main financial statements are the Income Statement (profit and loss over a period), the Balance Sheet (assets, liabilities, and equity at a point in time), and the Cash Flow Statement (cash inflows and outflows over a period).' },
          { q: 'What is EBITDA and why is it used?', a: 'EBITDA (Earnings Before Interest, Taxes, Depreciation, and Amortisation) measures operating profitability before non-cash and financing items. It is used to compare profitability across companies and capital structures.' },
          { q: 'What is the difference between gross margin and net margin?', a: 'Gross margin is revenue minus cost of goods sold, expressed as a percentage of revenue. Net margin is revenue minus all expenses (including operating costs, interest, and taxes), expressed as a percentage of revenue.' },
          { q: 'How do you perform a break-even analysis?', a: 'Break-even analysis calculates the point where total revenue equals total costs. Break-even point (units) = Fixed Costs ÷ (Selling Price per Unit − Variable Cost per Unit). It shows the minimum sales needed to avoid a loss.' },
        ],
      },
      {
        slug: 'budgeting', label: 'Budgeting', icon: 'fa-wallet',
        questions: [
          { q: 'What is zero-based budgeting?', a: "Zero-based budgeting requires every expense to be justified from scratch each period, rather than using the previous period as a baseline. It forces prioritisation and can surface inefficiencies, but is more time-intensive than incremental budgeting." },
          { q: 'What is the difference between a fixed and flexible budget?', a: 'A fixed budget remains unchanged regardless of actual activity levels. A flexible budget adjusts based on actual volume, making it more useful for performance evaluation in businesses with variable output.' },
          { q: 'How do you manage budget variances?', a: 'Budget variances are managed by identifying whether they are favourable or unfavourable, understanding the root cause (volume, price, or efficiency), and deciding whether to adjust the forecast, reallocate resources, or take corrective action.' },
        ],
      },
      {
        slug: 'valuation', label: 'Valuation', icon: 'fa-building-columns',
        questions: [
          { q: 'What are the main business valuation methods?', a: 'The three main approaches are: income-based (DCF — discounting future cash flows), market-based (comparable company analysis or precedent transactions), and asset-based (net asset value). Each is suited to different contexts and business types.' },
          { q: 'What is discounted cash flow (DCF) analysis?', a: 'DCF values a business by projecting future free cash flows and discounting them back to present value using a discount rate (typically WACC). The result represents what those future cash flows are worth today.' },
          { q: 'What is WACC and how is it used in valuation?', a: 'WACC (Weighted Average Cost of Capital) is the average rate a company is expected to pay to finance its assets, weighted by the proportion of debt and equity. It is used as the discount rate in DCF analysis.' },
        ],
      },
    ],
  },
  {
    slug: 'technology-it',
    title: 'Technology & IT',
    icon: 'fa-computer',
    subs: [
      {
        slug: 'cybersecurity', label: 'Cybersecurity', icon: 'fa-lock',
        questions: [
          { q: 'What is the CIA triad in cybersecurity?', a: 'The CIA triad stands for Confidentiality (data is accessible only to authorised users), Integrity (data is accurate and unaltered), and Availability (systems and data are accessible when needed). It is the foundation of information security policy.' },
          { q: 'What is the difference between authentication and authorisation?', a: 'Authentication verifies who you are (e.g., username and password). Authorisation determines what you are allowed to do once authenticated (e.g., read-only vs. admin access).' },
          { q: 'What is a zero-trust security model?', a: 'Zero-trust assumes no user or system is trusted by default, even inside the network perimeter. Every access request is verified, least-privilege access is enforced, and activity is continuously monitored.' },
          { q: 'How do you respond to a data breach?', a: 'A data breach response follows an incident response plan: contain the breach, assess the scope, notify affected parties and regulators as required, remediate the vulnerability, and conduct a post-incident review to prevent recurrence.' },
        ],
      },
      {
        slug: 'cloud-devops', label: 'Cloud & DevOps', icon: 'fa-cloud',
        questions: [
          { q: 'What is the difference between IaaS, PaaS, and SaaS?', a: 'IaaS (Infrastructure as a Service) provides virtualised computing resources. PaaS (Platform as a Service) provides a platform for developing and deploying applications. SaaS (Software as a Service) delivers fully managed software over the internet.' },
          { q: 'What is CI/CD and why does it matter?', a: 'CI/CD (Continuous Integration/Continuous Delivery) automates the process of integrating code changes, running tests, and deploying to production. It reduces release risk, speeds up delivery, and enables faster feedback loops.' },
          { q: 'What is infrastructure as code (IaC)?', a: 'IaC manages and provisions infrastructure through machine-readable configuration files rather than manual processes. Tools like Terraform and AWS CloudFormation enable consistent, repeatable, version-controlled infrastructure deployments.' },
        ],
      },
      {
        slug: 'data-analytics', label: 'Data & Analytics', icon: 'fa-database',
        questions: [
          { q: 'What is the difference between descriptive, predictive, and prescriptive analytics?', a: 'Descriptive analytics summarises what happened. Predictive analytics forecasts what is likely to happen. Prescriptive analytics recommends actions to achieve a desired outcome.' },
          { q: 'What is a data warehouse and how does it differ from a data lake?', a: 'A data warehouse stores structured, processed data optimised for querying and reporting. A data lake stores raw data in its native format at scale, supporting a wider range of analytics including machine learning.' },
          { q: 'What is data governance and why is it important?', a: 'Data governance is the framework of policies, processes, and standards that ensure data is accurate, consistent, secure, and used appropriately. It is important for regulatory compliance, decision quality, and building trust in data.' },
          { q: 'What is the difference between a metric and a dimension in analytics?', a: 'A metric is a quantitative measurement (e.g., revenue, page views). A dimension is a qualitative attribute used to segment or filter metrics (e.g., region, product category, date). Together they enable meaningful analysis.' },
        ],
      },
      {
        slug: 'tech-strategy', label: 'Tech Strategy', icon: 'fa-sitemap',
        questions: [
          { q: 'How do you build a technology roadmap?', a: 'A technology roadmap aligns technology investments with business goals. It identifies current state, desired future state, key initiatives, dependencies, timelines, and resource requirements — and is reviewed regularly as priorities evolve.' },
          { q: 'What is technical debt and how do you manage it?', a: 'Technical debt is the accumulated cost of shortcuts and suboptimal decisions in a codebase or system. It is managed by making it visible, quantifying its impact, allocating dedicated time for remediation, and building quality standards into development processes.' },
          { q: 'How do you evaluate a build vs. buy decision?', a: 'Evaluate build vs. buy by assessing strategic differentiation (build what is core, buy what is commodity), total cost of ownership, time to value, integration complexity, vendor risk, and the internal capability to build and maintain the solution.' },
        ],
      },
    ],
  },
]
