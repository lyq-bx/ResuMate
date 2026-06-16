export interface PersonalInfo {
  name: string
  title: string
  email: string
  phone: string
  location: string
  address?: string
  nativePlace: string
  ethnicity: string
  gender: string
  age: string
  birthDate?: string
  politicalStatus?: string
  avatar: string
  summary: string
}

export interface CourseScore {
  id: string
  name: string
  score: string
  credit?: string
  category?: string
}

export interface Education {
  id: string
  school: string
  degree: string
  major: string
  startDate: string
  endDate: string
  gpa: string
  rank: string
  englishLevel: string
  coreCourses: CourseScore[]
  description: string
}

export interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  description: string
}

export interface Project {
  id: string
  name: string
  role: string
  startDate: string
  endDate: string
  date?: string
  description: string
  technologies: string[]
  tags?: string[]
}

export interface Skill {
  id: string
  name: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
}

export interface Award {
  id: string
  name: string
  issuer: string
  date: string
  description: string
}

export interface ResumeData {
  personalInfo: PersonalInfo
  education: Education[]
  experience: Experience[]
  projects: Project[]
  skills: Skill[]
  awards: Award[]
}

export type ThemeType = 'blue' | 'green' | 'purple'

export type UseCaseType = 'job' | 'postgraduate' | 'recommendation' | 'admission'

export type EditorTabId = 'personal' | 'education' | 'experience' | 'projects' | 'skills' | 'awards'

export type ResumeTemplateType =
  | 'modern'
  | 'blue-gold'
  | 'sidebar'
  | 'team-blue-gray'
  | 'team-classic'
  | 'team-modern'
  | 'team-minimal'
  | 'team-timeline'
  | 'team-professional'

export interface ThemeConfig {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  fontFamily: string
  layout: 'single-column' | 'two-column'
}

export interface PageThemeConfig {
  label: string
  background: string
  surface: string
  surfaceAlt: string
  panel: string
  border: string
  borderStrong: string
  text: string
  muted: string
  primary: string
  primaryHover: string
  primarySoft: string
  primaryTint: string
  accent: string
  accentHover: string
  header: string
  headerAlt: string
  headerText: string
  headerMuted: string
  previewBg: string
  shadow: string
}

export interface UseCaseConfig {
  value: UseCaseType
  label: string
  title: string
  description: string
  accent: string
  editorHint: string
  previewTitle: string
  targetLabel: string
  focusTags: string[]
  defaultTab: EditorTabId
  tabOrder: EditorTabId[]
  sectionHints: Record<EditorTabId, string>
  sectionLabels: Partial<Record<EditorTabId, string>>
}
