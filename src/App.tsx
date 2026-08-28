import { useState, type ReactNode } from 'react'
import './App.css'
import {
  generateIdealResume,
  sampleJobDescription,
  summarizeSignals,
} from './resume-generator'
import type { ResumeData, ResumeEntry } from './resume-types'

function App() {
  const [jobDescription, setJobDescription] = useState(sampleJobDescription)
  const [resume, setResume] = useState<ResumeData>(() =>
    generateIdealResume(sampleJobDescription),
  )
  const [statusMessage, setStatusMessage] = useState(
    'Sample mode is loaded. Fill the local .env file with your Volcengine Ark settings to generate model-tailored resumes.',
  )
  const [isGenerating, setIsGenerating] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [debugLogText, setDebugLogText] = useState('')
  const [debugLogPath, setDebugLogPath] = useState('')
  const [isLoadingLogs, setIsLoadingLogs] = useState(false)

  const matchedSignals = summarizeSignals(jobDescription)

  async function handleGenerate() {
    setIsGenerating(true)
    setErrorMessage('')
    setStatusMessage('Generating a quantified sample resume from the JD...')

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobDescription }),
      })

      const payload = (await response.json()) as {
        error?: string
        resume?: ResumeData
      }

      if (!response.ok || !payload.resume) {
        throw new Error(payload.error || 'Generation failed.')
      }

      setResume(payload.resume)
      setStatusMessage(
        'Generated with Volcengine Ark. Every bullet passed measurable-impact validation.',
      )
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Generation failed unexpectedly.'
      setResume(generateIdealResume(jobDescription))
      setErrorMessage(message)
      setStatusMessage(
        'Fell back to local sample mode. Check the local .env file to enable live model generation.',
      )
      void loadDebugLogs()
    } finally {
      setIsGenerating(false)
    }
  }

  async function loadDebugLogs() {
    setIsLoadingLogs(true)

    try {
      const response = await fetch('/api/debug-log')
      const payload = (await response.json()) as {
        logPath?: string
        lines?: string[]
      }

      setDebugLogPath(payload.logPath || '')
      setDebugLogText((payload.lines || []).join('\n'))
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to load debug logs.'
      setDebugLogText(`Unable to load debug logs: ${message}`)
    } finally {
      setIsLoadingLogs(false)
    }
  }

  return (
    <div className="app-shell">
      <section className="control-panel">
        <div className="panel-header">
          <p className="eyebrow">Ideal Resume Studio</p>
          <h1>Generate a sample “ideal resume” from any JD</h1>
          <p className="panel-copy">
            This app studies the uploaded resume’s structure and reuses its
            formatting pattern to produce a fictional, high-quality example
            resume for learning purposes.
          </p>
        </div>

        <label className="field">
          <span>Job description</span>
          <textarea
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
            placeholder="Paste a JD here"
            rows={18}
          />
        </label>

        <div className="button-row">
          <button
            type="button"
            className="primary-button"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate ideal resume'}
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              setJobDescription(sampleJobDescription)
              setResume(generateIdealResume(sampleJobDescription))
              setStatusMessage('Sample JD loaded in local fallback mode.')
              setErrorMessage('')
            }}
            disabled={isGenerating}
          >
            Load sample JD
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={() => window.print()}
            disabled={isGenerating}
          >
            Print / save as PDF
          </button>
        </div>

        <div className="status-card">
          <strong>Status</strong>
          <p>{statusMessage}</p>
          {errorMessage ? <p className="error-copy">{errorMessage}</p> : null}
          <div className="debug-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => void loadDebugLogs()}
              disabled={isGenerating || isLoadingLogs}
            >
              {isLoadingLogs ? 'Loading logs...' : 'Load latest debug logs'}
            </button>
          </div>
          {debugLogText ? (
            <div className="debug-log-card">
              <p className="debug-log-label">
                Recent server logs{debugLogPath ? ` · ${debugLogPath}` : ''}
              </p>
              <pre>{debugLogText}</pre>
            </div>
          ) : null}
        </div>

        <div className="insight-strip">
          <div>
            <p className="insight-label">Detected target role</p>
            <strong>{resume.targetRole}</strong>
          </div>
          <div>
            <p className="insight-label">Detected signals</p>
            <div className="tag-row">
              {matchedSignals.map((signal) => (
                <span key={signal} className="signal-tag">
                  {signal}
                </span>
              ))}
            </div>
          </div>
        </div>

        <p className="disclaimer">
          The generated person, contact details, and experiences are fictional.
          Use this output as a study reference for resume structure and level of
          detail, not as real applicant information.
        </p>
      </section>

      <section className="preview-panel">
        <ResumeDocument resume={resume} />
      </section>
    </div>
  )
}

function ResumeDocument({ resume }: { resume: ResumeData }) {
  return (
    <article className="resume-sheet">
      <header className="resume-header">
        <h2>{resume.name}</h2>
        <p>
          {resume.email} | {resume.phone} |{' '}
          <a href={`https://${resume.linkedinUrl}`} target="_blank" rel="noreferrer">
            LinkedIn
          </a>{' '}
          |{' '}
          <a href={`https://${resume.portfolioUrl}`} target="_blank" rel="noreferrer">
            Portfolio
          </a>
        </p>
      </header>

      <ResumeSection title="EDUCATION">
        <div className="resume-block">
          <div className="line-item">
            <strong>{resume.education.school}</strong>
            <strong>
              {resume.education.location} | {resume.education.dateRange}
            </strong>
          </div>
          <p className="role-line">{resume.education.degree}</p>
          <p className="detail-line">{resume.education.details}</p>
        </div>
      </ResumeSection>

      <ResumeSection title="SKILLS SUMMARY">
        <div className="skills-stack">
          {resume.skillCategories.map((category) => (
            <p key={category.label} className="skill-line">
              <strong>{category.label}: </strong>
              <span>{category.items.join(', ')}</span>
            </p>
          ))}
        </div>
      </ResumeSection>

      <ResumeSection title="PROFESSIONAL EXPERIENCE">
        {resume.experience.map((entry) => (
          <ResumeEntryBlock key={`${entry.organization}-${entry.role}`} entry={entry} />
        ))}
      </ResumeSection>

      <ResumeSection title="PROJECTS">
        {resume.projects.map((entry) => (
          <ResumeEntryBlock key={`${entry.organization}-${entry.role}`} entry={entry} />
        ))}
      </ResumeSection>

      <ResumeSection title="LEADERSHIP EXPERIENCE">
        {resume.leadership.map((entry) => (
          <ResumeEntryBlock key={`${entry.organization}-${entry.role}`} entry={entry} />
        ))}
      </ResumeSection>

      <ResumeSection title="HONOURS & AWARDS">
        <p className="awards-line">{resume.awards.join(', ')}</p>
      </ResumeSection>
    </article>
  )
}

function ResumeSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="resume-section">
      <h3>{title}</h3>
      {children}
    </section>
  )
}

function ResumeEntryBlock({ entry }: { entry: ResumeEntry }) {
  return (
    <div className="resume-block">
      <div className="line-item">
        <strong>
          {entry.organization} | {entry.location}
        </strong>
        <strong>{entry.dateRange}</strong>
      </div>
      <p className="role-line">{entry.role}</p>
      <ul className="bullet-list">
        {entry.bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
