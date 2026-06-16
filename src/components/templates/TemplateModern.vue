<script setup lang="ts">
import { computed } from 'vue'
import type { ResumeData, ThemeConfig, UseCaseConfig } from '../../types/resume'

const props = defineProps<{
  resumeData: ResumeData
  theme: ThemeConfig
  useCase: UseCaseConfig
}>()

const levelLabels: Record<string, string> = {
  beginner: '了解',
  intermediate: '熟练',
  advanced: '精通',
  expert: '专家'
}

const levelColors: Record<string, string> = {
  beginner: '#64748b',
  intermediate: '#2563eb',
  advanced: '#0f766e',
  expert: '#b45309'
}

const levelWidths: Record<string, string> = {
  beginner: '35%',
  intermediate: '58%',
  advanced: '78%',
  expert: '100%'
}

const isAcademicMode = computed(() => props.useCase.value !== 'job')

const personalMeta = computed(() => {
  const info = props.resumeData.personalInfo
  return [
    info.gender && info.gender !== '不展示' ? `性别 ${info.gender}` : '',
    info.age ? `年龄 ${info.age}` : '',
    info.ethnicity ? `民族 ${info.ethnicity}` : '',
    info.nativePlace ? `籍贯 ${info.nativePlace}` : ''
  ].filter(Boolean)
})

const formatRange = (start: string, end: string) => {
  if (!start && !end) return ''
  return `${start || '未填写'} - ${end || '至今'}`
}

const educationMetrics = (edu: ResumeData['education'][number]) => {
  return [
    edu.gpa ? `绩点 ${edu.gpa}` : '',
    edu.rank ? `排名 ${edu.rank}` : '',
    edu.englishLevel ? `英语 ${edu.englishLevel}` : ''
  ].filter(Boolean)
}
</script>

<template>
  <article
    class="resume-preview"
    :style="{
      '--primary-color': theme.primaryColor,
      '--secondary-color': theme.secondaryColor,
      '--font-family': theme.fontFamily,
      '--accent-color': useCase.accent
    }"
  >
    <header class="resume-header">
      <div class="header-row">
        <div>
          <h1 class="name">{{ resumeData.personalInfo.name || '姓名' }}</h1>
          <h2 class="title">{{ resumeData.personalInfo.title || useCase.title }}</h2>
        </div>
        <div class="header-side">
          <div class="contact-info">
            <div v-if="resumeData.personalInfo.email">邮箱 {{ resumeData.personalInfo.email }}</div>
            <div v-if="resumeData.personalInfo.phone">电话 {{ resumeData.personalInfo.phone }}</div>
            <div v-if="resumeData.personalInfo.location">地点 {{ resumeData.personalInfo.location }}</div>
            <div v-for="meta in personalMeta" :key="meta">{{ meta }}</div>
          </div>
          <div v-if="resumeData.personalInfo.avatar" class="header-photo">
            <img :src="resumeData.personalInfo.avatar" alt="证件照" />
          </div>
        </div>
      </div>
      <p v-if="resumeData.personalInfo.summary" class="summary">
        {{ resumeData.personalInfo.summary }}
      </p>
    </header>

    <div class="resume-body" :class="theme.layout">
      <aside v-if="theme.layout === 'two-column'" class="resume-sidebar">
        <section v-if="resumeData.skills.length > 0" class="section sidebar-section">
          <h3 class="section-title">技能能力</h3>
          <div class="skills-list">
            <div v-for="skill in resumeData.skills" :key="skill.id" class="skill-item">
              <div class="skill-header">
                <span class="skill-name">{{ skill.name }}</span>
                <span class="skill-level" :style="{ color: levelColors[skill.level] }">
                  {{ levelLabels[skill.level] }}
                </span>
              </div>
              <div class="skill-bar-bg">
                <div
                  class="skill-bar"
                  :style="{
                    width: levelWidths[skill.level],
                    background: levelColors[skill.level]
                  }"
                />
              </div>
            </div>
          </div>
        </section>

        <section v-if="resumeData.awards.length > 0" class="section sidebar-section">
          <h3 class="section-title">奖项证书</h3>
          <ul class="awards-list">
            <li v-for="award in resumeData.awards" :key="award.id" class="award-item">
              <div class="award-name">{{ award.name }}</div>
              <div class="meta">{{ award.issuer }} · {{ award.date }}</div>
              <p v-if="award.description">{{ award.description }}</p>
            </li>
          </ul>
        </section>
      </aside>

      <main class="resume-main">
        <template v-if="isAcademicMode">
          <section v-if="resumeData.education.length > 0" class="section">
            <h3 class="section-title">教育背景</h3>
            <div v-for="edu in resumeData.education" :key="edu.id" class="timeline-card">
              <div class="item-heading">
                <div>
                  <h4>{{ edu.school }}</h4>
                  <span>{{ edu.degree }} · {{ edu.major }}</span>
                </div>
                <time>{{ formatRange(edu.startDate, edu.endDate) }}</time>
              </div>
              <div v-if="educationMetrics(edu).length > 0" class="metric-row">
                <span v-for="metric in educationMetrics(edu)" :key="metric">{{ metric }}</span>
              </div>
              <div v-if="edu.coreCourses.length > 0" class="course-score-grid">
                <span v-for="course in edu.coreCourses.slice(0, 8)" :key="course.id">
                  {{ course.name }} {{ course.score }}
                </span>
              </div>
              <p v-if="edu.description">{{ edu.description }}</p>
            </div>
          </section>

          <section v-if="resumeData.projects.length > 0" class="section">
            <h3 class="section-title">项目科研</h3>
            <div v-for="project in resumeData.projects" :key="project.id" class="timeline-card">
              <div class="item-heading">
                <div>
                  <h4>{{ project.name }}</h4>
                  <span>{{ project.role }}</span>
                </div>
                <time>{{ formatRange(project.startDate, project.endDate) }}</time>
              </div>
              <div class="tag-row">
                <span v-for="tech in project.technologies" :key="tech" class="tag">{{ tech }}</span>
              </div>
              <p>{{ project.description }}</p>
            </div>
          </section>

          <section v-if="resumeData.experience.length > 0" class="section">
            <h3 class="section-title">实践经历</h3>
            <div v-for="exp in resumeData.experience" :key="exp.id" class="timeline-card">
              <div class="item-heading">
                <div>
                  <h4>{{ exp.company }}</h4>
                  <span>{{ exp.position }}</span>
                </div>
                <time>{{ formatRange(exp.startDate, exp.endDate) }}</time>
              </div>
              <p>{{ exp.description }}</p>
            </div>
          </section>
        </template>

        <template v-else>
          <section v-if="resumeData.experience.length > 0" class="section">
            <h3 class="section-title">工作经历</h3>
            <div v-for="exp in resumeData.experience" :key="exp.id" class="timeline-card">
              <div class="item-heading">
                <div>
                  <h4>{{ exp.company }}</h4>
                  <span>{{ exp.position }}</span>
                </div>
                <time>{{ formatRange(exp.startDate, exp.endDate) }}</time>
              </div>
              <p>{{ exp.description }}</p>
            </div>
          </section>

          <section v-if="resumeData.projects.length > 0" class="section">
            <h3 class="section-title">项目经历</h3>
            <div v-for="project in resumeData.projects" :key="project.id" class="timeline-card">
              <div class="item-heading">
                <div>
                  <h4>{{ project.name }}</h4>
                  <span>{{ project.role }}</span>
                </div>
                <time>{{ formatRange(project.startDate, project.endDate) }}</time>
              </div>
              <div class="tag-row">
                <span v-for="tech in project.technologies" :key="tech" class="tag">{{ tech }}</span>
              </div>
              <p>{{ project.description }}</p>
            </div>
          </section>

          <section v-if="resumeData.education.length > 0" class="section">
            <h3 class="section-title">教育背景</h3>
            <div v-for="edu in resumeData.education" :key="edu.id" class="timeline-card">
              <div class="item-heading">
                <div>
                  <h4>{{ edu.school }}</h4>
                  <span>{{ edu.degree }} · {{ edu.major }}</span>
                </div>
                <time>{{ formatRange(edu.startDate, edu.endDate) }}</time>
              </div>
              <p v-if="edu.description">{{ edu.description }}</p>
            </div>
          </section>
        </template>

        <section v-if="theme.layout === 'single-column' && resumeData.skills.length > 0" class="section">
          <h3 class="section-title">技能能力</h3>
          <div class="skills-grid">
            <div v-for="skill in resumeData.skills" :key="skill.id" class="skill-badge">
              <span>{{ skill.name }}</span>
              <b :style="{ background: levelColors[skill.level] }">{{ levelLabels[skill.level] }}</b>
            </div>
          </div>
        </section>

        <section v-if="theme.layout === 'single-column' && resumeData.awards.length > 0" class="section">
          <h3 class="section-title">奖项证书</h3>
          <div class="award-grid">
            <div v-for="award in resumeData.awards" :key="award.id" class="award-card">
              <div class="award-name">{{ award.name }}</div>
              <div class="meta">{{ award.issuer }} · {{ award.date }}</div>
              <p v-if="award.description">{{ award.description }}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  </article>
</template>

<style scoped>
.resume-preview {
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  padding: 22mm;
  background: #ffffff;
  color: #1f2937;
  box-shadow: 0 16px 42px rgba(15, 23, 42, 0.18);
  font-family: var(--font-family);
}

.resume-header {
  padding-bottom: 18px;
  border-bottom: 3px solid var(--primary-color);
}

.header-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
}

.name {
  margin: 0;
  color: var(--primary-color);
  font-size: 30px;
  line-height: 1.2;
  letter-spacing: 0;
}

.title {
  margin: 7px 0 0;
  color: var(--secondary-color);
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
  color: var(--secondary-color);
  font-size: 12px;
  line-height: 1.45;
  text-align: right;
  white-space: nowrap;
}

.header-side {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.header-photo {
  width: 76px;
  aspect-ratio: 3 / 4;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  overflow: hidden;
  background: #f8fafc;
  flex-shrink: 0;
}

.header-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.summary {
  margin: 14px 0 0;
  color: #374151;
  font-size: 13px;
  line-height: 1.75;
}

.resume-body {
  display: flex;
  gap: 20px;
  padding-top: 20px;
}

.resume-body.single-column {
  display: block;
}

.resume-sidebar {
  width: 34%;
  padding-right: 16px;
  border-right: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.resume-main {
  flex: 1;
  min-width: 0;
}

.section {
  margin-bottom: 22px;
}

.section:last-child {
  margin-bottom: 0;
}

.section-title {
  margin: 0 0 12px;
  padding-bottom: 6px;
  color: var(--primary-color);
  border-bottom: 1px solid #e5e7eb;
  font-size: 15px;
  font-weight: 900;
  letter-spacing: 0;
}

.timeline-card {
  position: relative;
  padding-left: 16px;
  margin-bottom: 16px;
  border-left: 3px solid #b7d7d2;
}

.timeline-card:last-child {
  margin-bottom: 0;
}

.item-heading {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
}

.item-heading h4 {
  margin: 0;
  color: #111827;
  font-size: 14px;
  line-height: 1.4;
}

.item-heading span,
.item-heading time,
.meta {
  color: var(--secondary-color);
  font-size: 12px;
  line-height: 1.5;
}

.item-heading time {
  white-space: nowrap;
}

.timeline-card p,
.award-item p,
.award-card p {
  margin: 7px 0 0;
  color: #374151;
  font-size: 12.5px;
  line-height: 1.7;
}

.tag-row,
.metric-row,
.course-score-grid,
.skills-grid,
.award-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-row,
.metric-row,
.course-score-grid {
  margin-top: 8px;
}

.metric-row span,
.course-score-grid span,
.tag {
  display: inline-flex;
  align-items: center;
  min-height: 23px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 800;
}

.metric-row span {
  padding: 0 8px;
  background: #fff7ed;
  color: #9a3412;
}

.course-score-grid span,
.tag {
  padding: 0 7px;
  background: #edf5f3;
  color: #0f766e;
}

.skills-list {
  display: flex;
  flex-direction: column;
  gap: 11px;
}

.skill-header {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 5px;
  font-size: 12px;
}

.skill-name {
  color: #111827;
  font-weight: 700;
}

.skill-level {
  font-weight: 800;
}

.skill-bar-bg {
  height: 6px;
  border-radius: 999px;
  background: #e5e7eb;
  overflow: hidden;
}

.skill-bar {
  height: 100%;
  border-radius: inherit;
}

.awards-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.award-item {
  margin-bottom: 13px;
}

.award-name {
  color: #111827;
  font-size: 13px;
  font-weight: 900;
}

.skill-badge,
.award-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fafafa;
}

.skill-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  color: #111827;
  font-size: 12px;
  font-weight: 800;
}

.skill-badge b {
  display: inline-flex;
  align-items: center;
  min-height: 20px;
  padding: 0 7px;
  border-radius: 6px;
  color: #ffffff;
  font-size: 11px;
}

.award-card {
  width: calc(50% - 5px);
  padding: 10px 12px;
}

@media (max-width: 760px) {
  .resume-preview {
    width: 210mm;
    padding: 18mm;
  }
}
</style>
