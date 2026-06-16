import type { CourseScore, ResumeData } from '../types/resume'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000'

export function resumeToText(resume: ResumeData): string {
  const info = resume.personalInfo
  const education = resume.education
    .map((item) => {
      const courses = item.coreCourses?.map((course) => `${course.name} ${course.score}`).join('，') || ''
      return [
        `${item.school} ${item.degree} ${item.major}`,
        item.gpa ? `绩点：${item.gpa}` : '',
        item.rank ? `排名：${item.rank}` : '',
        item.englishLevel ? `英语：${item.englishLevel}` : '',
        courses ? `核心课程：${courses}` : '',
        item.description
      ].filter(Boolean).join('；')
    })
    .join('\n')

  const experience = resume.experience
    .map((item) => `${item.company} ${item.position} ${item.startDate}-${item.endDate}：${item.description}`)
    .join('\n')

  const projects = resume.projects
    .map((item) => `${item.name} ${item.role} ${item.startDate}-${item.endDate}：${item.description} 技术/关键词：${item.technologies.join('，')}`)
    .join('\n')

  const skills = resume.skills.map((item) => `${item.name}（${item.level}）`).join('，')
  const awards = resume.awards.map((item) => `${item.name} ${item.issuer} ${item.date}：${item.description}`).join('\n')

  return [
    `姓名：${info.name}`,
    `定位：${info.title}`,
    `邮箱：${info.email}`,
    `电话：${info.phone}`,
    `所在地：${info.location}`,
    info.nativePlace ? `籍贯：${info.nativePlace}` : '',
    info.gender ? `性别：${info.gender}` : '',
    info.age ? `年龄：${info.age}` : '',
    `个人简介：${info.summary}`,
    education ? `教育背景：\n${education}` : '',
    experience ? `实践/工作经历：\n${experience}` : '',
    projects ? `项目/科研经历：\n${projects}` : '',
    skills ? `技能能力：${skills}` : '',
    awards ? `奖项证书：\n${awards}` : ''
  ].filter(Boolean).join('\n')
}

async function postJson<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`API ${path} failed: ${res.status} ${text}`)
  }

  return await res.json()
}

export async function optimizeSection(content: string, section: string): Promise<{ optimized: string; explanation: string }> {
  try {
    const data = await postJson<{ success?: boolean; optimized?: string; content?: string; explanation?: string }>(
      '/api/optimize/',
      { content, section }
    )
    return {
      optimized: data.optimized || data.content || content,
      explanation: data.explanation || ''
    }
  } catch (e) {
    console.error('Optimize failed:', e)
    return { optimized: content, explanation: '优化失败，请确认后端服务已启动。' }
  }
}

export async function analyzeJD(jd: string): Promise<string | null> {
  try {
    const data = await postJson<{ success: boolean; result: string }>('/api/jd/analyze', { jd_text: jd })
    return data.result
  } catch (e) {
    console.error('JD analyze failed:', e)
    return null
  }
}

export async function matchResume(resume: ResumeData, jd: string): Promise<string | null> {
  try {
    const data = await postJson<{ success: boolean; result: string }>('/api/jd/match', {
      resume_text: resumeToText(resume),
      jd_text: jd
    })
    return data.result
  } catch (e) {
    console.error('Match failed:', e)
    return null
  }
}

export async function getCareerAdvice(resume: ResumeData): Promise<string | null> {
  try {
    const data = await postJson<{ success: boolean; result: string }>('/api/career/', {
      resume_text: resumeToText(resume)
    })
    return data.result
  } catch (e) {
    console.error('Career failed:', e)
    return null
  }
}

export async function generateSummary(personalInfo: ResumeData['personalInfo'], experience: ResumeData['experience']): Promise<string> {
  try {
    const resumeText = [
      `姓名：${personalInfo.name}`,
      `定位：${personalInfo.title}`,
      `个人简介：${personalInfo.summary}`,
      `经历：${experience.map((item) => `${item.company} ${item.position}：${item.description}`).join('；')}`
    ].join('\n')
    const data = await postJson<{ success: boolean; summary: string }>('/api/summary/', { resume_text: resumeText })
    return data.summary || ''
  } catch (e) {
    console.error('Summary failed:', e)
    return ''
  }
}

export async function parseTranscriptFile(file: File): Promise<{ success: boolean; message: string; courses: CourseScore[]; rawText: string; source: string }> {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(`${API_BASE}/api/transcript/parse`, {
    method: 'POST',
    body: formData
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`成绩单识别接口失败：${res.status} ${text}`)
  }

  return await res.json()
}

export function calculateResumeScore(resume: ResumeData): { score: number; level: string; suggestions: string[] } {
  let score = 0
  const suggestions: string[] = []

  if (resume.personalInfo?.name) score += 5
  if (resume.personalInfo?.title) score += 10
  if (resume.personalInfo?.email) score += 5
  if (resume.personalInfo?.phone) score += 5

  if (resume.personalInfo?.summary) {
    score += 15
    if (resume.personalInfo.summary.length < 50) suggestions.push('个人简介偏短，建议补充到 100-150 字。')
  } else {
    suggestions.push('建议补充个人简介。')
  }

  if (resume.education?.length > 0) {
    score += 20
    if (!resume.education[0].description) suggestions.push('教育背景建议补充排名、课程、成绩或科研经历。')
  } else {
    suggestions.push('建议补充教育背景。')
  }

  if (resume.experience?.length > 0) {
    score += 20
    const hasDesc = resume.experience.some((item) => item.description && item.description.length > 50)
    if (!hasDesc) suggestions.push('经历描述建议加入具体职责、方法和量化结果。')
  } else {
    suggestions.push('建议补充实习、工作或校园实践经历。')
  }

  if (resume.projects?.length > 0) {
    score += 15
    const hasTech = resume.projects.some((item) => item.technologies?.length > 0)
    if (!hasTech) suggestions.push('项目经历建议补充技术栈或方法关键词。')
  } else {
    suggestions.push('建议补充项目、科研或作品经历。')
  }

  if (resume.skills?.length >= 3) score += 10
  else if (resume.skills?.length > 0) {
    score += 5
    suggestions.push('建议补充更多可验证的技能关键词。')
  } else {
    suggestions.push('建议补充技能特长。')
  }

  if (resume.awards?.length > 0) score += 5

  const level = score >= 80 ? '优秀' : score >= 60 ? '良好' : score >= 40 ? '一般' : '待完善'

  return { score: Math.min(score, 100), level, suggestions }
}
