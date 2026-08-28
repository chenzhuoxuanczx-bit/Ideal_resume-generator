import 'dotenv/config'
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PORT = Number(process.env.PORT || 8787)
const ARK_API_KEY = process.env.ARK_API_KEY || ''
const ARK_BASE_URL = process.env.ARK_BASE_URL || 'https://ark.cn-beijing.volces.com/api/v3'
const MODEL = process.env.ARK_MODEL || 'doubao-seed-2-1-pro-260628'
const DEBUG_LOG_PATH = path.join(__dirname, 'ark-debug.log')

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

const server = http.createServer(async (req, res) => {
  setCors(res)

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  if (req.method === 'GET' && req.url === '/api/health') {
    json(res, 200, { ok: true })
    return
  }

  if (req.method === 'GET' && req.url?.startsWith('/api/debug-log')) {
    json(res, 200, {
      logPath: DEBUG_LOG_PATH,
      lines: readRecentDebugLogLines(),
    })
    return
  }

  if (req.method === 'POST' && req.url === '/api/generate') {
    const requestId = `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

    try {
      if (!ARK_API_KEY) {
        json(res, 500, {
          error:
            'ARK_API_KEY is not set. Put it in the local .env file before generating resumes.',
        })
        return
      }

      const body = await readJson(req)
      const jobDescription = String(body?.jobDescription || '').trim()

      if (!jobDescription) {
        json(res, 400, { error: 'Job description is required.' })
        return
      }

      appendDebugLog({
        level: 'info',
        event: 'generate_start',
        requestId,
        baseUrl: ARK_BASE_URL,
        model: MODEL,
        apiKeySource: getApiKeySource(),
        jobDescriptionPreview: jobDescription.slice(0, 240),
      })

      const resume = await generateResumeWithValidation(jobDescription, requestId)
      json(res, 200, { resume })
      return
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown server error.'
      appendDebugLog({
        level: 'error',
        event: 'generate_failed',
        requestId,
        errorName: error instanceof Error ? error.name : 'UnknownError',
        errorMessage: message,
        errorStack: error instanceof Error ? error.stack : '',
      })
      json(res, 500, { error: message })
      return
    }
  }

  json(res, 404, { error: 'Not found.' })
})

await startServer()

async function generateResumeWithValidation(jobDescription, requestId) {
  let lastResume = null

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const resume = await requestResume(jobDescription, lastResume, attempt, requestId)
    const normalized = normalizeResume(resume)
    const invalidBullets = findBulletsMissingMetrics(normalized)

    if (invalidBullets.length === 0) {
      return normalized
    }

    appendDebugLog({
      level: 'warn',
      event: 'resume_validation_retry',
      requestId,
      attempt,
      invalidBulletCount: invalidBullets.length,
      invalidBullets,
    })

    lastResume = normalized
  }

  throw new Error(
    'The model did not return fully quantified bullets after retrying. Try a more detailed JD.',
  )
}

async function requestResume(jobDescription, previousResume, attempt, requestId) {
  const retryInstruction =
    attempt === 0 || !previousResume
      ? ''
      : `\nPrevious attempt failed because some bullets lacked explicit measurable impact. Rewrite the resume and ensure every bullet contains at least one concrete number, percentage, currency amount, count, time reduction, growth rate, or scale metric.`

  const url = `${ARK_BASE_URL}/responses`
  const requestPayload = {
    model: MODEL,
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
  }

  appendDebugLog({
    level: 'info',
    event: 'ark_fetch_start',
    requestId,
    attempt,
    url,
    model: MODEL,
    bodyPreview: JSON.stringify({
      ...requestPayload,
      auth: '<REDACTED>',
    }).slice(0, 4000),
  })

  let response
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ARK_API_KEY}`,
      },
      body: JSON.stringify(requestPayload),
    })
  } catch (error) {
    appendDebugLog({
      level: 'error',
      event: 'ark_fetch_exception',
      requestId,
      attempt,
      errorName: error instanceof Error ? error.name : 'UnknownError',
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : '',
    })
    throw new Error(
      `Ark fetch failed before receiving a response. Check ${DEBUG_LOG_PATH} for details.`,
    )
  }

  if (!response.ok) {
    const body = await response.text()
    appendDebugLog({
      level: 'error',
      event: 'ark_fetch_bad_status',
      requestId,
      attempt,
      status: response.status,
      statusText: response.statusText,
      responseBody: body.slice(0, 4000),
    })
    throw new Error(`Ark API request failed: ${response.status} ${body}`)
  }

  const payload = await response.json()
  const outputText = extractOutputTextFromArkPayload(payload)

  appendDebugLog({
    level: 'info',
    event: 'ark_fetch_success',
    requestId,
    attempt,
    payloadSummary: summarizeValueShape(payload),
    hasOutputText: Boolean(outputText),
    outputPreview: typeof outputText === 'string' ? outputText.slice(0, 1000) : '',
  })

  if (!outputText) {
    appendDebugLog({
      level: 'error',
      event: 'ark_fetch_empty_output',
      requestId,
      attempt,
      payloadSummary: summarizeValueShape(payload),
      payloadPreview: safeJsonPreview(payload, 4000),
    })
    throw new Error(
      `Ark returned no extractable text output. Check ${DEBUG_LOG_PATH} for the payload summary.`,
    )
  }

  return parseResumeJson(outputText, payload)
}

function getApiKeySource() {
  if (process.env.ARK_API_KEY) {
    return '.env'
  }
  return 'missing'
}

function appendDebugLog(entry) {
  const line = JSON.stringify({
    timestamp: new Date().toISOString(),
    ...entry,
  })

  fs.appendFileSync(DEBUG_LOG_PATH, `${line}\n`, 'utf8')
}

function readRecentDebugLogLines() {
  if (!fs.existsSync(DEBUG_LOG_PATH)) {
    return []
  }

  const content = fs.readFileSync(DEBUG_LOG_PATH, 'utf8')
  return content
    .split('\n')
    .filter(Boolean)
    .slice(-80)
}

function extractOutputTextFromArkPayload(payload) {
  const candidates = [
    payload?.output_text,
    payload?.response?.output_text,
    ...extractTextCandidates(payload?.output),
    ...extractTextCandidates(payload?.response?.output),
    ...extractTextCandidates(payload?.content),
    ...extractTextCandidates(payload?.choices),
  ]

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate.trim()
    }
  }

  return ''
}

function extractTextCandidates(value) {
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

  const directText = [
    value.text,
    value.output_text,
    value.input_text,
    value.value,
    value.arguments,
    value.refusal,
  ].filter((entry) => typeof entry === 'string')

  const nested = [
    value.content,
    value.output,
    value.message,
    value.delta,
    value.json,
    value.result,
  ].flatMap((entry) => extractTextCandidates(entry))

  const objectJson =
    value.type === 'json_schema' ||
    value.type === 'output_json' ||
    value.type === 'json' ||
    Array.isArray(value) ||
    false
      ? [safeJsonPreview(value, 20000)]
      : []

  return [...directText, ...nested, ...objectJson]
}

function parseResumeJson(outputText, payload) {
  const normalized = outputText.trim()
  const candidates = [
    normalized,
    stripMarkdownCodeFence(normalized),
    extractBracketedJson(normalized),
  ].filter(Boolean)

  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate)
    } catch {}
  }

  appendDebugLog({
    level: 'error',
    event: 'ark_parse_failed',
    outputPreview: normalized.slice(0, 4000),
    payloadSummary: summarizeValueShape(payload),
  })
  throw new Error(
    `Ark returned text, but it was not valid JSON. Check ${DEBUG_LOG_PATH} for the raw preview.`,
  )
}

function stripMarkdownCodeFence(value) {
  const match = value.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
  return match?.[1]?.trim() || ''
}

function extractBracketedJson(value) {
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

function safeJsonPreview(value, maxLength) {
  try {
    return JSON.stringify(value).slice(0, maxLength)
  } catch {
    return '[unserializable]'
  }
}

function summarizeValueShape(value, depth = 0) {
  if (value === null) {
    return 'null'
  }

  if (value === undefined) {
    return 'undefined'
  }

  if (typeof value === 'string') {
    return `string(${value.length})`
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return typeof value
  }

  if (Array.isArray(value)) {
    if (depth >= 2) {
      return `array(${value.length})`
    }

    return {
      type: 'array',
      length: value.length,
      items: value.slice(0, 3).map((item) => summarizeValueShape(item, depth + 1)),
    }
  }

  if (typeof value === 'object') {
    if (depth >= 2) {
      return `object(${Object.keys(value).length} keys)`
    }

    return Object.fromEntries(
      Object.entries(value)
        .slice(0, 12)
        .map(([key, entry]) => [key, summarizeValueShape(entry, depth + 1)]),
    )
  }

  return typeof value
}

function normalizeResume(resume) {
  return {
    ...resume,
    experience: resume.experience.map(normalizeEntry),
    projects: resume.projects.map(normalizeEntry),
    leadership: resume.leadership.map(normalizeEntry),
  }
}

function normalizeEntry(entry) {
  return {
    ...entry,
    bullets: entry.bullets.map((bullet) => ensureMetricPunctuation(bullet.trim())),
  }
}

function ensureMetricPunctuation(bullet) {
  return /[.!?]$/.test(bullet) ? bullet : `${bullet}.`
}

function findBulletsMissingMetrics(resume) {
  const entries = [...resume.experience, ...resume.projects, ...resume.leadership]
  const metricPattern =
    /(\d|\b\d+%|\b\d+x|\b\d+\.\d+%|\$\d|€\d|£\d|\bpercent\b|\bpercentage points?\b|\bminutes?\b|\bhours?\b|\bdays?\b|\bweeks?\b|\bmonths?\b|\byears?\b|\busers?\b|\bcustomers?\b|\bmembers?\b|\borders?\b|\brevenue\b|\bARR\b|\bMRR\b|\bGMV\b)/i

  return entries.flatMap((entry) =>
    entry.bullets.filter((bullet) => !metricPattern.test(bullet)),
  )
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (chunk) => {
      data += chunk
    })
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {})
      } catch {
        reject(new Error('Request body must be valid JSON.'))
      }
    })
    req.on('error', reject)
  })
}

function json(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(payload))
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
}

async function startServer() {
  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(PORT, () => {
      server.off('error', reject)
      console.log(`Resume API listening on http://localhost:${PORT}`)
      appendDebugLog({
        level: 'info',
        event: 'server_listen_success',
        port: PORT,
      })
      resolve()
    })
  }).catch(async (error) => {
    if (isAddrInUseError(error)) {
      const existingServerOk = await isExistingResumeApiHealthy(PORT)

      if (existingServerOk) {
        console.log(
          `Resume API port ${PORT} is already serving this app. Reusing the existing backend.`,
        )
        appendDebugLog({
          level: 'warn',
          event: 'server_reused_existing_instance',
          port: PORT,
        })
        return
      }

      appendDebugLog({
        level: 'error',
        event: 'server_port_conflict',
        port: PORT,
        errorName: error instanceof Error ? error.name : 'UnknownError',
        errorMessage: error instanceof Error ? error.message : String(error),
      })

      throw new Error(
        `Port ${PORT} is already in use by another process. Stop that process or set PORT to a different value before running npm run dev.`,
      )
    }

    throw error
  })
}

function isAddrInUseError(error) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'EADDRINUSE'
  )
}

async function isExistingResumeApiHealthy(port) {
  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/health`)
    if (!response.ok) {
      return false
    }

    const payload = await response.json()
    return payload?.ok === true
  } catch {
    return false
  }
}

