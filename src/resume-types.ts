export type ResumeEntry = {
  organization: string
  location: string
  dateRange: string
  role: string
  bullets: string[]
}

export type EducationEntry = {
  school: string
  location: string
  dateRange: string
  degree: string
  details: string
}

export type SkillCategory = {
  label: string
  items: string[]
}

export type ResumeData = {
  name: string
  email: string
  phone: string
  linkedinUrl: string
  portfolioUrl: string
  targetRole: string
  targetLocation: string
  education: EducationEntry
  skillCategories: SkillCategory[]
  experience: ResumeEntry[]
  projects: ResumeEntry[]
  leadership: ResumeEntry[]
  awards: string[]
}

