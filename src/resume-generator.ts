import type {
  EducationEntry,
  ResumeData,
  ResumeEntry,
  SkillCategory,
} from './resume-types'

type Domain = 'analytics' | 'product' | 'operations' | 'marketing' | 'finance' | 'engineering'

type DomainConfig = {
  degree: string
  coursework: string[]
  skills: SkillCategory[]
  companies: string[]
  projectTitles: string[]
  awards: string[]
  experienceBullets: string[]
  projectBullets: string[]
  leadershipBullets: string[]
}

const firstNames = [
  'Avery',
  'Jordan',
  'Taylor',
  'Morgan',
  'Casey',
  'Riley',
  'Cameron',
  'Quinn',
  'Reese',
  'Skyler',
]

const lastNames = [
  'Bennett',
  'Walker',
  'Lin',
  'Patel',
  'Murphy',
  'Nguyen',
  'Kim',
  'Singh',
  'Chen',
  'Morris',
]

const universities = [
  ['National University of Singapore', 'Singapore'],
  ['University of Michigan', 'Ann Arbor, MI'],
  ['University of Toronto', 'Toronto, ON'],
  ['University College London', 'London, UK'],
  ['University of California, Berkeley', 'Berkeley, CA'],
  ['Carnegie Mellon University', 'Pittsburgh, PA'],
]

const cities = [
  'Singapore',
  'London, UK',
  'New York, NY',
  'Austin, TX',
  'Toronto, ON',
  'Remote',
]

const taxonomy = [
  {
    label: 'SQL',
    matches: ['sql', 'postgres', 'snowflake', 'bigquery', 'redshift'],
  },
  {
    label: 'Python',
    matches: ['python', 'pandas', 'numpy', 'scikit', 'jupyter'],
  },
  {
    label: 'Experimentation',
    matches: ['a/b', 'ab test', 'experiment', 'hypothesis testing'],
  },
  {
    label: 'Forecasting',
    matches: ['forecast', 'demand planning', 'capacity planning', 'scenario'],
  },
  {
    label: 'Dashboarding',
    matches: ['dashboard', 'tableau', 'power bi', 'looker'],
  },
  {
    label: 'Stakeholder Management',
    matches: ['stakeholder', 'cross-functional', 'executive', 'partner'],
  },
  {
    label: 'Product Strategy',
    matches: ['roadmap', 'product', 'go-to-market', 'user journey'],
  },
  {
    label: 'Operations',
    matches: ['operations', 'process', 'sop', 'vendor', 'procurement'],
  },
  {
    label: 'Marketing',
    matches: ['campaign', 'growth', 'crm', 'seo', 'paid media'],
  },
  {
    label: 'Finance',
    matches: ['finance', 'p&l', 'budget', 'pricing', 'valuation'],
  },
  {
    label: 'Engineering',
    matches: ['api', 'backend', 'frontend', 'typescript', 'react', 'system design'],
  },
]

const domainConfigs: Record<Domain, DomainConfig> = {
  analytics: {
    degree: 'Bachelor of Science (Honours), Business Analytics',
    coursework: [
      'Advanced SQL',
      'Experiment Design',
      'Forecasting',
      'Data Visualization',
      'Optimization',
    ],
    skills: [
      {
        label: 'Analytics and Tooling',
        items: ['SQL', 'Python', 'Tableau', 'Power BI', 'Excel', 'dbt'],
      },
      {
        label: 'Decision Science',
        items: ['A/B testing', 'Forecasting', 'Segmentation', 'Root cause analysis'],
      },
      {
        label: 'Business Communication',
        items: ['Executive reporting', 'Insight storytelling', 'Cross-functional alignment'],
      },
      {
        label: 'Operating Rhythm',
        items: ['KPI design', 'Weekly business reviews', 'Performance monitoring'],
      },
    ],
    companies: ['Northstar Commerce', 'Helio Mobility', 'Summit Health', 'Atlas Retail'],
    projectTitles: [
      'KPI Architecture for Marketplace Growth',
      'Demand Forecasting and Capacity Planning Model',
      'Customer Segmentation for Premium Retention',
    ],
    awards: [
      "Dean's List for Academic Excellence",
      'Merit Scholarship for Quantitative Business Studies',
      'Analytics Capstone Distinction',
    ],
    experienceBullets: [
      'Built KPI frameworks and SQL reporting pipelines for revenue, conversion, retention, and operational throughput, giving leadership a weekly view of performance drivers and decision trade-offs.',
      'Translated ambiguous business questions into experiment readouts, cohort analyses, and forecast models that improved prioritization quality and accelerated planning cycles.',
      'Partnered with product, operations, and commercial stakeholders to define success metrics, automate recurring analysis, and package findings into concise executive narratives.',
      'Designed dashboards and anomaly checks that reduced manual reporting effort while improving confidence in key business metrics used for quarterly reviews.',
    ],
    projectBullets: [
      'Developed a structured analysis model combining segmentation, KPI decomposition, and scenario planning to recommend the highest-impact levers for sustainable growth.',
      'Synthesized raw data into a stakeholder-ready recommendation deck with quantified upside, implementation trade-offs, and measurement plans.',
    ],
    leadershipBullets: [
      'Led a student analytics committee that mentored peers on case problem-solving, presentation structure, and business storytelling across semester-long workshops.',
      'Coordinated a cross-functional planning cadence for events and sponsors, balancing budget, delivery timelines, and attendee engagement goals.',
    ],
  },
  product: {
    degree: 'Bachelor of Arts, Economics and Product Strategy',
    coursework: [
      'Product Management',
      'Behavioral Economics',
      'User Research',
      'Experimentation',
      'Business Strategy',
    ],
    skills: [
      {
        label: 'Product Strategy',
        items: ['Roadmapping', 'User journey mapping', 'Requirement synthesis', 'PRD writing'],
      },
      {
        label: 'Research and Analytics',
        items: ['User interviews', 'Experimentation', 'Funnel analysis', 'Dashboarding'],
      },
      {
        label: 'Delivery',
        items: ['Cross-functional coordination', 'Sprint planning', 'Launch readiness'],
      },
      {
        label: 'Communication',
        items: ['Executive updates', 'Stakeholder alignment', 'Narrative framing'],
      },
    ],
    companies: ['Lattice Labs', 'Northbeam App', 'Orbit Commerce', 'Keystone Platform'],
    projectTitles: [
      'Lifecycle Journey Redesign for Activation',
      'Product-Led Growth Experiment Playbook',
      'Launch Prioritization Framework for New Features',
    ],
    awards: [
      'Product Innovation Challenge Finalist',
      "Dean's Commendation for Leadership",
      'Case Competition Winner in Digital Strategy',
    ],
    experienceBullets: [
      'Turned customer pain points and strategic goals into prioritized requirements, launch plans, and measurable success criteria across multiple product initiatives.',
      'Aligned engineering, design, data, and operations teams on trade-offs, sequencing, and release readiness to keep execution predictable and outcome-focused.',
      'Defined north-star metrics and learning agendas for new launches, using experiment results and customer feedback loops to sharpen roadmap decisions.',
      'Prepared executive updates that translated product complexity into clear recommendations, delivery risks, and impact scenarios.',
    ],
    projectBullets: [
      'Mapped end-to-end user journeys, surfaced friction points, and translated findings into a prioritized backlog with expected impact and success metrics.',
      'Created launch measurement plans tying adoption, retention, and satisfaction outcomes to concrete product decisions and follow-up actions.',
    ],
    leadershipBullets: [
      'Directed a campus product club that coached peers on problem framing, prototype reviews, and communicating product strategy to non-technical audiences.',
      'Built partnerships with sponsors, speakers, and student teams to run high-signal workshops and case-based learning sessions.',
    ],
  },
  operations: {
    degree: 'Bachelor of Science, Operations Management',
    coursework: [
      'Supply Chain Analytics',
      'Process Improvement',
      'Capacity Planning',
      'Vendor Management',
      'Financial Modeling',
    ],
    skills: [
      {
        label: 'Operations and Execution',
        items: ['Process design', 'SOP creation', 'Capacity planning', 'Vendor coordination'],
      },
      {
        label: 'Analytics and Reporting',
        items: ['Excel', 'SQL', 'Dashboarding', 'Root cause analysis'],
      },
      {
        label: 'Commercial Discipline',
        items: ['Budget tracking', 'Procurement', 'Negotiation', 'Service-level monitoring'],
      },
      {
        label: 'Leadership',
        items: ['Cross-functional execution', 'Escalation management', 'Program governance'],
      },
    ],
    companies: ['Bridge Logistics', 'Vertex Operations', 'Aster Services', 'Bluepeak Mobility'],
    projectTitles: [
      'Operational Throughput Improvement Program',
      'Vendor Performance Scorecard and Governance Model',
      'Capacity Planning for Seasonal Demand',
    ],
    awards: [
      'Operations Excellence Scholarship',
      'Top Team Award in Supply Chain Simulation',
      'Leadership Distinction in Campus Organizations',
    ],
    experienceBullets: [
      'Owned critical operating cadences across planning, vendor coordination, and escalation management, keeping service levels stable during periods of rapid demand change.',
      'Built process maps, performance scorecards, and exception handling workflows that improved visibility into bottlenecks and clarified accountability across stakeholders.',
      'Ran root cause analyses on quality, timeliness, and cost issues, then implemented corrective actions that increased reliability without inflating operating spend.',
      'Managed reporting for throughput, utilization, and service-level metrics, helping leaders balance customer experience, team capacity, and budget goals.',
    ],
    projectBullets: [
      'Modeled workflow constraints and staffing scenarios to identify the highest-leverage process changes for throughput, quality, and cost performance.',
      'Delivered a practical implementation plan with metrics, owner mapping, and governance checkpoints to sustain operational improvements after rollout.',
    ],
    leadershipBullets: [
      'Led large student events with ownership across procurement, scheduling, staffing, and risk management, ensuring dependable execution under tight timelines.',
      'Coached committee leads on project tracking, operating discipline, and stakeholder updates to keep initiatives on schedule and within budget.',
    ],
  },
  marketing: {
    degree: 'Bachelor of Business Administration, Marketing Analytics',
    coursework: [
      'Consumer Analytics',
      'Brand Strategy',
      'Performance Marketing',
      'CRM',
      'Experimentation',
    ],
    skills: [
      {
        label: 'Growth and Channel Strategy',
        items: ['Campaign planning', 'Lifecycle marketing', 'Channel mix optimization', 'GTM execution'],
      },
      {
        label: 'Analytics',
        items: ['Attribution analysis', 'Funnel optimization', 'A/B testing', 'Dashboarding'],
      },
      {
        label: 'Creative and Messaging',
        items: ['Audience insights', 'Value proposition framing', 'Creative briefs'],
      },
      {
        label: 'Commercial Collaboration',
        items: ['Sales alignment', 'Agency management', 'Budget pacing'],
      },
    ],
    companies: ['Northstar Consumer', 'Canvas Media', 'Spruce Commerce', 'Pulse Health'],
    projectTitles: [
      'Lifecycle Messaging Strategy for Retention',
      'Paid Media Efficiency Dashboard',
      'Audience Segmentation for Premium Conversion',
    ],
    awards: [
      'Marketing Strategy Case Competition Winner',
      "Dean's List for Academic Achievement",
      'Scholarship for Commercial Leadership',
    ],
    experienceBullets: [
      'Built integrated campaign plans across acquisition, activation, and retention, aligning targeting, messaging, and measurement to business goals.',
      'Turned campaign data into channel recommendations, budget shifts, and audience insights that improved conversion quality and reporting clarity.',
      'Partnered with creative, product, and sales stakeholders to translate strategic priorities into executable briefs, launch calendars, and performance reviews.',
      'Developed testing frameworks for landing pages, messaging, and audience strategy to systematically improve funnel performance over time.',
    ],
    projectBullets: [
      'Combined customer segmentation, message testing, and funnel analysis to define a sharper growth strategy for high-value audiences.',
      'Presented a recommendation set balancing expected upside, execution complexity, and measurement rigor for post-launch optimization.',
    ],
    leadershipBullets: [
      'Ran student-led campaigns and sponsor activations with clear audience strategy, event positioning, and performance reporting.',
      'Organized cross-team execution for content, outreach, and partner coordination while maintaining a consistent brand narrative.',
    ],
  },
  finance: {
    degree: 'Bachelor of Science, Finance and Decision Analytics',
    coursework: [
      'Corporate Finance',
      'Valuation',
      'Financial Modeling',
      'Market Analysis',
      'Data Analytics',
    ],
    skills: [
      {
        label: 'Finance and Modeling',
        items: ['Three-statement modeling', 'Valuation', 'Budgeting', 'Scenario analysis'],
      },
      {
        label: 'Analysis and Reporting',
        items: ['Excel', 'SQL', 'Variance analysis', 'KPI tracking'],
      },
      {
        label: 'Business Judgment',
        items: ['Pricing analysis', 'Resource allocation', 'Investment framing'],
      },
      {
        label: 'Communication',
        items: ['Management presentations', 'Executive summaries', 'Recommendation memos'],
      },
    ],
    companies: ['Crest Capital', 'Harbor Insights', 'Bluefield Partners', 'Northgate Holdings'],
    projectTitles: [
      'Profitability Driver Analysis and Planning Model',
      'Pricing and Margin Optimization Framework',
      'Investment Screening Dashboard for Growth Opportunities',
    ],
    awards: [
      'Finance Scholar Distinction',
      'Top Performer in Applied Valuation',
      'Case Competition Finalist in Corporate Strategy',
    ],
    experienceBullets: [
      'Built financial models and variance analyses linking revenue, cost, and operational assumptions to clear management decisions and planning trade-offs.',
      'Synthesized market data, internal KPIs, and scenario sensitivities into recommendation memos for budget allocation and growth opportunities.',
      'Partnered with operational stakeholders to translate financial targets into measurable execution plans and risk-monitoring routines.',
      'Created management reporting that improved transparency into profitability drivers and clarified where intervention would deliver the strongest returns.',
    ],
    projectBullets: [
      'Developed a decision model combining unit economics, scenario sensitivity, and market sizing to evaluate the most attractive growth pathways.',
      'Converted dense financial analysis into a concise executive narrative with prioritization logic, risks, and assumptions made explicit.',
    ],
    leadershipBullets: [
      'Led student investment and strategy forums, helping peers interpret business performance through a disciplined financial lens.',
      'Managed event budgets, speaker coordination, and sponsor relationships while maintaining strong reporting discipline and execution quality.',
    ],
  },
  engineering: {
    degree: 'Bachelor of Science, Computer Science',
    coursework: [
      'Algorithms',
      'Distributed Systems',
      'Databases',
      'Software Engineering',
      'Statistics',
    ],
    skills: [
      {
        label: 'Engineering',
        items: ['TypeScript', 'React', 'Node.js', 'API design', 'System debugging'],
      },
      {
        label: 'Data and Measurement',
        items: ['SQL', 'Observability', 'Experiment instrumentation', 'Performance analysis'],
      },
      {
        label: 'Delivery',
        items: ['Technical design', 'Cross-functional collaboration', 'Release planning'],
      },
      {
        label: 'Problem Solving',
        items: ['Root cause analysis', 'Automation', 'Scalability thinking'],
      },
    ],
    companies: ['Northstar Systems', 'Relay Cloud', 'Lattice AI', 'Pioneer Platforms'],
    projectTitles: [
      'Scalable Workflow Tooling for Cross-Functional Teams',
      'Reliability and Observability Upgrade Program',
      'Internal Platform for Faster Experiment Delivery',
    ],
    awards: [
      'Computer Science Merit Scholarship',
      'Hackathon Winner for Product Engineering',
      'Dean’s Honour Roll',
    ],
    experienceBullets: [
      'Built and shipped internal tools and customer-facing workflows with a strong focus on clarity, maintainability, and measurable business impact.',
      'Worked across product, design, and operations to translate requirements into technical plans, robust implementations, and reliable launches.',
      'Improved visibility into system behavior through instrumentation, monitoring, and workflow automation, reducing manual follow-up and troubleshooting time.',
      'Balanced delivery speed with sound engineering judgment by making trade-offs explicit and documenting scalable paths forward.',
    ],
    projectBullets: [
      'Designed and implemented a focused application that solved a concrete workflow bottleneck while keeping data structure, user experience, and extensibility aligned.',
      'Documented architecture, assumptions, and success metrics so stakeholders could evaluate trade-offs and iterate on the solution quickly.',
    ],
    leadershipBullets: [
      'Mentored peers on architecture reviews, implementation planning, and high-signal communication for cross-functional software projects.',
      'Organized technical workshops and collaborative build sessions that raised delivery quality across student project teams.',
    ],
  },
}

export const sampleJobDescription = `Senior Business Operations Analyst

We are looking for a strategic operator to support planning, KPI management, and cross-functional execution for a fast-growing marketplace business.

Responsibilities
- Build and maintain weekly business reviews and executive dashboards.
- Analyze funnel performance, retention, pricing, and demand trends using SQL and Excel.
- Partner with product, commercial, finance, and operations teams to identify growth opportunities.
- Translate ambiguous questions into structured analyses, forecasts, and actionable recommendations.
- Improve operating cadence, reporting quality, and decision-making rigor across the team.

Preferred qualifications
- 3+ years of experience in strategy, operations, analytics, consulting, or finance.
- Strong SQL and spreadsheet skills.
- Excellent communication and stakeholder management.
- Experience with experimentation, forecasting, or marketplace metrics is a plus.`

export function generateIdealResume(jobDescription: string): ResumeData {
  const normalized = jobDescription.trim()
  const fallback = normalized.length > 0 ? normalized : sampleJobDescription
  const seed = hashString(fallback)
  const targetRole = extractTitle(fallback)
  const targetLocation = extractLocation(fallback, seed)
  const domain = detectDomain(fallback)
  const config = domainConfigs[domain]

  return {
    name: `${pick(firstNames, seed)} ${pick(lastNames, seed * 3)}`,
    email: makeEmail(seed),
    phone: makePhone(seed),
    linkedinUrl: 'linkedin.com/in/ideal-candidate',
    portfolioUrl: 'portfolio.example/ideal-candidate',
    targetRole,
    targetLocation,
    education: buildEducation(config, domain, seed),
    skillCategories: buildSkillCategories(fallback, config),
    experience: buildExperience(targetRole, targetLocation, config, seed),
    projects: buildProjects(targetRole, config, seed),
    leadership: buildLeadership(config, seed),
    awards: buildAwards(config, seed),
  }
}

export function summarizeSignals(jobDescription: string): string[] {
  const lower = jobDescription.toLowerCase()
  const matched = taxonomy
    .filter((group) => group.matches.some((keyword) => lower.includes(keyword)))
    .map((group) => group.label)

  if (matched.length > 0) {
    return matched.slice(0, 6)
  }

  return ['Structured analysis', 'Cross-functional execution', 'Outcome-driven bullet writing']
}

function buildEducation(config: DomainConfig, domain: Domain, seed: number): EducationEntry {
  const [school, location] = pick(universities, seed * 5)
  const startYear = 2018 + (seed % 4)
  const endYear = startYear + 4

  return {
    school,
    location,
    dateRange: `${startYear} - ${endYear}`,
    degree: config.degree,
    details: `Relevant coursework includes ${config.coursework.join(', ')} with independent projects focused on ${educationFocus(domain)}.`,
  }
}

function buildSkillCategories(jobDescription: string, config: DomainConfig): SkillCategory[] {
  const lower = jobDescription.toLowerCase()

  return config.skills.map((category) => {
    const matchedItems = category.items.filter((item) =>
      lower.includes(item.toLowerCase()) || matchesTaxonomy(lower, item),
    )

    return {
      label: category.label,
      items: matchedItems.length >= 2 ? matchedItems : category.items,
    }
  })
}

function buildExperience(
  targetRole: string,
  targetLocation: string,
  config: DomainConfig,
  seed: number,
): ResumeEntry[] {
  const roleVariants = roleVariantsFor(targetRole)
  const nowYear = 2026

  return config.companies.slice(0, 3).map((organization, index) => {
    const endYear = nowYear - index
    const startYear = endYear - (index === 0 ? 2 : 1)
    const bullets = rotate(config.experienceBullets, seed + index).slice(0, 3)

    return {
      organization,
      location: index === 0 ? targetLocation : pick(cities, seed + index),
      dateRange: `${monthName(seed + index)} ${startYear} - ${index === 0 ? 'Present' : `${monthName(seed + index + 4)} ${endYear}`}`,
      role: roleVariants[index] ?? roleVariants[roleVariants.length - 1],
      bullets,
    }
  })
}

function buildProjects(targetRole: string, config: DomainConfig, seed: number): ResumeEntry[] {
  return config.projectTitles.slice(0, 3).map((projectTitle, index) => ({
    organization: index === 0 ? 'Applied Strategy Lab' : 'University Consulting Studio',
    location: index === 0 ? 'Academic Project' : 'Independent Project',
    dateRange: `${monthName(seed + index + 2)} 2025 - ${monthName(seed + index + 4)} 2026`,
    role: `${projectTitle} for ${targetRole}`,
    bullets: rotate(config.projectBullets, seed + index).slice(0, 2),
  }))
}

function buildLeadership(config: DomainConfig, seed: number): ResumeEntry[] {
  const organizations = [
    'University Business Society',
    'Operations and Analytics Association',
  ]

  return organizations.map((organization, index) => ({
    organization,
    location: 'Campus Leadership',
    dateRange: `${monthName(seed + index + 1)} 2024 - Present`,
    role: index === 0 ? 'President' : 'Program Director',
    bullets: rotate(config.leadershipBullets, seed + index).slice(0, 2),
  }))
}

function buildAwards(config: DomainConfig, seed: number): string[] {
  return rotate(config.awards, seed).slice(0, 3)
}

function roleVariantsFor(targetRole: string): string[] {
  const lower = targetRole.toLowerCase()

  if (lower.includes('manager')) {
    return [targetRole, 'Strategy and Operations Manager', 'Business Analyst']
  }

  if (lower.includes('analyst')) {
    return [targetRole, 'Senior Analyst', 'Business Analyst']
  }

  if (lower.includes('engineer')) {
    return [targetRole, 'Software Engineer', 'Product Engineer']
  }

  if (lower.includes('product')) {
    return [targetRole, 'Associate Product Manager', 'Product Strategy Analyst']
  }

  return [targetRole, `Associate ${targetRole}`, `Senior ${targetRole}`]
}

function extractTitle(jobDescription: string): string {
  const lines = jobDescription
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  const titleLine = lines.find((line) =>
    /(manager|analyst|engineer|specialist|associate|lead|director|consultant|strategist)/i.test(line),
  )

  if (titleLine) {
    return titleLine.replace(/\s{2,}/g, ' ').slice(0, 80)
  }

  return 'Business Operations Analyst'
}

function detectDomain(jobDescription: string): Domain {
  const lower = jobDescription.toLowerCase()
  const scores: Record<Domain, number> = {
    analytics: 0,
    product: 0,
    operations: 0,
    marketing: 0,
    finance: 0,
    engineering: 0,
  }

  scoreDomain(scores, 'analytics', [
    'analytics',
    'sql',
    'dashboard',
    'kpi',
    'forecast',
    'experimentation',
    'retention',
    'cohort',
  ], lower)
  scoreDomain(scores, 'product', [
    'product',
    'roadmap',
    'requirements',
    'launch',
    'user journey',
    'feature',
    'adoption',
  ], lower)
  scoreDomain(scores, 'operations', [
    'operations',
    'process',
    'vendor',
    'sop',
    'capacity',
    'service level',
    'execution',
  ], lower)
  scoreDomain(scores, 'marketing', [
    'marketing',
    'campaign',
    'crm',
    'brand',
    'acquisition',
    'growth',
    'retention marketing',
  ], lower)
  scoreDomain(scores, 'finance', [
    'finance',
    'valuation',
    'budget',
    'pricing',
    'profitability',
    'investment',
    'p&l',
  ], lower)
  scoreDomain(scores, 'engineering', [
    'engineering',
    'typescript',
    'react',
    'frontend',
    'backend',
    'api',
    'architecture',
  ], lower)

  return Object.entries(scores).sort((left, right) => right[1] - left[1])[0][0] as Domain
}

function scoreDomain(
  scores: Record<Domain, number>,
  domain: Domain,
  keywords: string[],
  lower: string,
) {
  for (const keyword of keywords) {
    if (lower.includes(keyword)) {
      scores[domain] += 1
    }
  }
}

function extractLocation(jobDescription: string, seed: number): string {
  const explicitMatch = jobDescription.match(
    /\b(remote|singapore|london|new york|toronto|austin|san francisco)\b/i,
  )

  if (!explicitMatch) {
    return pick(cities, seed * 7)
  }

  const value = explicitMatch[0].toLowerCase()
  const normalized: Record<string, string> = {
    remote: 'Remote',
    singapore: 'Singapore',
    london: 'London, UK',
    'new york': 'New York, NY',
    toronto: 'Toronto, ON',
    austin: 'Austin, TX',
    'san francisco': 'San Francisco, CA',
  }

  return normalized[value] ?? pick(cities, seed * 7)
}

function educationFocus(domain: Domain): string {
  switch (domain) {
    case 'product':
      return 'product strategy, experimentation, and customer insight synthesis'
    case 'operations':
      return 'service operations, process optimization, and capacity planning'
    case 'marketing':
      return 'lifecycle growth, campaign measurement, and audience strategy'
    case 'finance':
      return 'business valuation, profitability analysis, and planning'
    case 'engineering':
      return 'software systems, product delivery, and technical problem solving'
    default:
      return 'business analytics, forecasting, and decision support'
  }
}

function matchesTaxonomy(lower: string, item: string): boolean {
  const entry = taxonomy.find((group) => group.label.toLowerCase() === item.toLowerCase())
  return entry ? entry.matches.some((keyword) => lower.includes(keyword)) : false
}

function makeEmail(seed: number): string {
  const first = pick(firstNames, seed).toLowerCase()
  const last = pick(lastNames, seed * 3).toLowerCase()
  return `${first}.${last}@examplemail.com`
}

function makePhone(seed: number): string {
  const base = String(10000000 + (seed % 89999999))
  return `+1 (${base.slice(0, 3)}) ${base.slice(3, 6)}-${base.slice(6)}`
}

function hashString(value: string): number {
  let hash = 0

  for (const char of value) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  }

  return hash || 1
}

function pick<T>(items: T[], seed: number): T {
  return items[Math.abs(seed) % items.length]
}

function rotate<T>(items: T[], offset: number): T[] {
  const start = Math.abs(offset) % items.length
  return items.slice(start).concat(items.slice(0, start))
}

function monthName(value: number): string {
  return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][
    Math.abs(value) % 12
  ]
}
