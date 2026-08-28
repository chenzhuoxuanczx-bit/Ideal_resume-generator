import type { ResumeData } from './resume-types'

const DEFAULT_ARK_BASE_URL = 'https://ark.cn-beijing.volces.com/api/v3'
const DEFAULT_ARK_MODEL = 'deepseek-v4-pro-ga-260813'

const resumeSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    name: { type: 'string', minLength: 1 },
    email: { type: 'string', minLength: 1 },
    phone: { type: 'string', minLength: 1 },
    linkedinUrl: { type: 'string', minLength: 1 },
    portfolioUrl: { type: 'string', minLength: 1 },
    targetRole: { type: 'string', minLength: 1 },
    targetLocation: { type: 'string', minLength: 1 },
    education: {
      type: 'object',
      additionalProperties: false,
      properties: {
        school: { type: 'string', minLength: 1 },
        location: { type: 'string', minLength: 1 },
        dateRange: { type: 'string', minLength: 1 },
        degree: { type: 'string', minLength: 1 },
        details: { type: 'string', minLength: 1 },
      },
      required: ['school', 'location', 'dateRange', 'degree', 'details'],
    },
    skillCategories: {
      type: 'array',
      minItems: 3,
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          label: { type: 'string', minLength: 1 },
          items: {
            type: 'array',
            minItems: 3,
            items: { type: 'string', minLength: 1 },
          },
        },
        required: ['label', 'items'],
      },
    },
    experience: {
      type: 'array',
      minItems: 3,
      items: { $ref: '#/$defs/entry' },
    },
    projects: {
      type: 'array',
      minItems: 2,
      items: { $ref: '#/$defs/entry' },
    },
    leadership: {
      type: 'array',
      minItems: 1,
      items: { $ref: '#/$defs/entry' },
    },
    awards: {
      type: 'array',
      minItems: 2,
      items: { type: 'string', minLength: 1 },
    },
  },
  required: [
    'name',
    'email',
    'phone',
    'linkedinUrl',
    'portfolioUrl',
    'targetRole',
    'targetLocation',
    'education',
    'skillCategories',
    'experience',
    'projects',
    'leadership',
    'awards',
  ],
  $defs: {
    entry: {
      type: 'object',
      additionalProperties: false,
      properties: {
        organization: { type: 'string', minLength: 1 },
        location: { type: 'string', minLength: 1 },
        dateRange: { type: 'string', minLength: 1 },
        role: { type: 'string', minLength: 1 },
        bullets: {
          type: 'array',
          minItems: 2,
          items: { type: 'string', minLength: 1 },
        },
      },
      required: ['organization', 'location', 'dateRange', 'role', 'bullets'],
    },
  },
}

type GenerateResumeOptions = {
  apiKey: string
  baseUrl?: string
  jobDescription: string
  model?: string
}

export async function generateResumeViaArk({
  apiKey,
  baseUrl = DEFAULT_ARK_BASE_URL,
  jobDescription,
  model = DEFAULT_ARK_MODEL,
}: GenerateResumeOptions): Promise<ResumeData> {
  let lastResume: ResumeData | null = null

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const resume = await requestResume({
      apiKey,
      attempt,
      baseUrl,
      jobDescription,
      model,
      previousResume: lastResume,
    })
    const normalized = normalizeResume(resume)
    const invalidBullets = findBulletsMissingMetrics(normalized)

    if (invalidBullets.length === 0) {
      return normalized
    }

    lastResume = normalized
  }

  throw new Error(
    'The model did not return fully quantified bullets after retrying. Try a more detailed JD.',
  )
}

async function requestResume({
  apiKey,
  attempt,
  baseUrl,
  jobDescription,
  model,
  previousResume,
}: GenerateResumeOptions & {
  attempt: number
  previousResume: ResumeData | null
}): Promise<ResumeData> {
  const retryInstruction =
    attempt === 0 || !previousResume
      ? ''
      : '\nPrevious attempt failed because some bullets lacked explicit measurable impact. Rewrite the resume and ensure every bullet contains at least one concrete number, percentage, currency amount, count, time reduction, growth rate, or scale metric.'

  const response = await fetch(`${baseUrl}/responses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: 'system',
          content: [
            {
              type: 'input_text',
              text:
                'You generate fictional but high-quality sample resumes for applicants to study. The output must be tailored to the job description and formatted as structured JSON. Every bullet must sound credible and must include measurable impact. Do not use placeholders like TBD. Do not claim the candidate is real. Keep contact details fictional but polished. Keep the tone concise, professional, and achievement-heavy.',
            },
          ],
        },
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: [
                'Create an ideal sample resume for this job description.',
                'Requirements:',
                '- Match the style of a strong one-page business-school style resume.',
                '- Use fictional personal details and fictional experiences.',
                '- Include sections for education, skills summary, professional experience, projects, leadership experience, and honours & awards.',
                '- Every bullet in experience, projects, and leadership must contain measurable impact.',
                '- Metrics may be percentages, dollar values, volumes, growth rates, conversion lifts, time saved, counts, or service levels.',
                '- Avoid vague bullets like improved performance unless a number proves it.',
                '- Keep each bullet to one sentence.',
                '- Make the candidate look ideal for the role, but still plausible.',
                retryInstruction,
                'Job description:',
                jobDescription,
                previousResume
                  ? `Previous invalid JSON content for correction:\n${JSON.stringify(previousResume)}`
                  : '',
              ]
                .filter(Boolean)
                .join('\n'),
            },
          ],
        },
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'ideal_resume',
          strict: true,
          schema: resumeSchema,
        },
      },
      thinking: { type: 'disabled' },
    }),
  })

  if (!response.ok) {
    const responseBody = await response.text()
    throw new Error(`Ark API request failed: ${response.status} ${responseBody}`)
  }

  const payload = (await response.json()) as Record<string, unknown>
  const outputText = extractOutputTextFromArkPayload(payload)

  if (!outputText) {
    console.error('Ark payload without extractable output text', payload)
    throw new Error('Ark returned no extractable text output.')
  }

  return parseResumeJson(outputText, payload)
}

function extractOutputTextFromArkPayload(payload: Record<string, unknown>) {
  const candidates = [
    payload.output_text,
    getNestedValue(payload, ['response', 'output_text']),
    ...extractTextCandidates(payload.output),
    ...extractTextCandidates(getNestedValue(payload, ['response', 'output'])),
    ...extractTextCandidates(payload.content),
    ...extractTextCandidates(payload.choices),
  ]

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate.trim()
    }
  }

  return ''
}

function extractTextCandidates(value: unknown): string[] {
  if (!value) {
    return []
  }

  if (typeof value === 'string') {
    return [value]
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => extractTextCandidates(item))
  }

  if (typeof value !== 'object') {
    return []
  }

  const record = value as Record<string, unknown>
  const directText = [
    record.text,
    record.output_text,
    record.input_text,
    record.value,
    record.arguments,
    record.refusal,
  ].filter((entry): entry is string => typeof entry === 'string')

  const nested = [
    record.content,
    record.output,
    record.message,
    record.delta,
    record.json,
    record.result,
  ].flatMap((entry) => extractTextCandidates(entry))

  return [...directText, ...nested]
}

function parseResumeJson(
  outputText: string,
  payload: Record<string, unknown>,
): Promise<ResumeData> | ResumeData {
  const normalized = outputText.trim()
  const candidates = [
    normalized,
    stripMarkdownCodeFence(normalized),
    extractBracketedJson(normalized),
  ].filter(Boolean)

  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate) as ResumeData
    } catch {}
  }

  console.error('Ark text output was not valid JSON', {
    outputPreview: normalized.slice(0, 4000),
    payload,
  })
  throw new Error('Ark returned text, but it was not valid JSON.')
}

function stripMarkdownCodeFence(value: string) {
  const match = value.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
  return match?.[1]?.trim() || ''
}

function extractBracketedJson(value: string) {
  const objectStart = value.indexOf('{')
  const objectEnd = value.lastIndexOf('}')

  if (objectStart !== -1 && objectEnd > objectStart) {
    return value.slice(objectStart, objectEnd + 1).trim()
  }

  const arrayStart = value.indexOf('[')
  const arrayEnd = value.lastIndexOf(']')

  if (arrayStart !== -1 && arrayEnd > arrayStart) {
    return value.slice(arrayStart, arrayEnd + 1).trim()
  }

  return ''
}

function getNestedValue(value: Record<string, unknown>, path: string[]) {
  let current: unknown = value

  for (const key of path) {
    if (!current || typeof current !== 'object' || !(key in current)) {
      return undefined
    }

    current = (current as Record<string, unknown>)[key]
  }

  return current
}

function normalizeResume(resume: ResumeData): ResumeData {
  return {
    ...resume,
    experience: resume.experience.map(normalizeEntry),
    projects: resume.projects.map(normalizeEntry),
    leadership: resume.leadership.map(normalizeEntry),
  }
}

function normalizeEntry(entry: ResumeData['experience'][number]) {
  return {
    ...entry,
    bullets: entry.bullets.map((bullet) => ensureMetricPunctuation(bullet.trim())),
  }
}

function ensureMetricPunctuation(bullet: string) {
  return /[.!?]$/.test(bullet) ? bullet : `${bullet}.`
}

function findBulletsMissingMetrics(resume: ResumeData) {
  const entries = [...resume.experience, ...resume.projects, ...resume.leadership]
  const metricPattern =
    /(\d|\b\d+%|\b\d+x|\b\d+\.\d+%|\$\d|€\d|£\d|\bpercent\b|\bpercentage points?\b|\bminutes?\b|\bhours?\b|\bdays?\b|\bweeks?\b|\bmonths?\b|\byears?\b|\busers?\b|\bcustomers?\b|\bmembers?\b|\borders?\b|\brevenue\b|\bARR\b|\bMRR\b|\bGMV\b)/i

  return entries.flatMap((entry) =>
    entry.bullets.filter((bullet) => !metricPattern.test(bullet)),
  )
}
