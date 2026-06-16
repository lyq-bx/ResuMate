<script setup lang="ts">
import type { ResumeData, ThemeConfig } from '../../types/resume'

defineProps<{
  resumeData: ResumeData
  theme: ThemeConfig
}>()

const levelLabels: Record<string, string> = {
  beginner: '入门',
  intermediate: '熟练',
  advanced: '精通',
  expert: '专家'
}

const levelColors: Record<string, string> = {
  beginner: '#9ca3af',
  intermediate: '#3b82f6',
  advanced: '#10b981',
  expert: '#f59e0b'
}

</script>

<template>
  <div class="preview-container">
    <div class="resume-page" :style="{ '--primary-color': theme.primaryColor, '--secondary-color': theme.secondaryColor, '--accent-color': theme.accentColor }">
      <!-- Header -->
      <header class="resume-header">
        <div class="header-content">
          <div class="avatar-wrapper">
            <img v-if="resumeData.personalInfo.avatar" :src="resumeData.personalInfo.avatar" alt="头像" class="avatar" />
            <div v-else class="avatar-placeholder">
              <span>📷</span>
              <span>照片</span>
            </div>
          </div>
          <div class="personal-info">
            <h1 class="name">{{ resumeData.personalInfo.name }}</h1>
            <h2 class="title">{{ resumeData.personalInfo.title }}</h2>
            <div class="contact-info">
              <div class="contact-row">
                <span class="contact-item">📧 {{ resumeData.personalInfo.email }}</span>
                <span class="contact-item">📱 {{ resumeData.personalInfo.phone }}</span>
                <span class="contact-item">📍 {{ resumeData.personalInfo.address }}</span>
              </div>
              <div class="detail-row" v-if="resumeData.personalInfo.gender || resumeData.personalInfo.birthDate || resumeData.personalInfo.politicalStatus">
                <span v-if="resumeData.personalInfo.gender" class="detail-item">性别: {{ resumeData.personalInfo.gender }}</span>
                <span v-if="resumeData.personalInfo.birthDate" class="detail-item">出生: {{ resumeData.personalInfo.birthDate }}</span>
                <span v-if="resumeData.personalInfo.politicalStatus" class="detail-item">政治面貌: {{ resumeData.personalInfo.politicalStatus }}</span>
              </div>
            </div>
          </div>
        </div>
        <p v-if="resumeData.personalInfo.summary" class="summary">{{ resumeData.personalInfo.summary }}</p>
      </header>

      <!-- Experience -->
      <section v-if="resumeData.experience.length" class="section">
        <h3 class="section-title">工作经历</h3>
        <div class="timeline">
          <div v-for="exp in resumeData.experience" :key="exp.id" class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <div class="timeline-header">
                <h4 class="company">{{ exp.company }}</h4>
                <span class="timeline-date">{{ exp.startDate }} - {{ exp.endDate }}</span>
              </div>
              <div class="position">{{ exp.position }}</div>
              <p class="timeline-desc">{{ exp.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Projects -->
      <section v-if="resumeData.projects.length" class="section">
        <h3 class="section-title">项目经验</h3>
        <div class="projects">
          <div v-for="project in resumeData.projects" :key="project.id" class="project-item">
            <div class="project-header">
              <h4 class="project-name">{{ project.name }}</h4>
              <span class="project-date">{{ project.date }}</span>
            </div>
            <p class="project-role">{{ project.role }}</p>
            <p class="project-desc">{{ project.description }}</p>
            <div class="tags">
              <span v-for="tag in project.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Education -->
      <section v-if="resumeData.education.length" class="section">
        <h3 class="section-title">教育背景</h3>
        <div class="timeline">
          <div v-for="edu in resumeData.education" :key="edu.id" class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <div class="timeline-header">
                <h4 class="school">{{ edu.school }}</h4>
                <span class="education-date">{{ edu.startDate }} - {{ edu.endDate }}</span>
              </div>
              <div class="degree-major">{{ edu.degree }} · {{ edu.major }}</div>
              <p v-if="edu.description" class="education-desc">{{ edu.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Skills -->
      <section v-if="resumeData.skills.length" class="section">
        <h3 class="section-title">专业技能</h3>
        <div class="skills-grid">
          <div v-for="skill in resumeData.skills" :key="skill.id" class="skill-badge">
            <span class="badge-name">{{ skill.name }}</span>
            <span class="badge-level" :style="{ backgroundColor: levelColors[skill.level] }">{{ levelLabels[skill.level] }}</span>
          </div>
        </div>
      </section>

      <!-- Awards -->
      <section v-if="resumeData.awards.length" class="section">
        <h3 class="section-title">荣誉奖项</h3>
        <div class="awards-grid">
          <div v-for="award in resumeData.awards" :key="award.id" class="award-card">
            <div class="award-icon">🏆</div>
            <div class="award-content">
              <div class="award-name">{{ award.name }}</div>
              <div class="award-meta">{{ award.issuer }} · {{ award.date }}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.preview-container {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 15px;
  overflow-y: auto;
}

.resume-page {
  width: 210mm;
  min-height: 297mm;
  height: auto;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  padding: 16mm 18mm;
  box-sizing: border-box;
}

.resume-header {
  border-bottom: 3px solid var(--primary-color);
  padding-bottom: 18px;
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.avatar-wrapper {
  flex-shrink: 0;
}

.avatar {
  width: 120px;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
  border: 2px solid var(--primary-color);
}

.avatar-placeholder {
  width: 120px;
  height: 150px;
  border: 2px dashed var(--primary-color);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--primary-color);
  font-size: 14px;
}

.avatar-placeholder span:first-child {
  font-size: 28px;
}

.personal-info {
  flex: 1;
}

.name {
  font-size: 26px;
  font-weight: 700;
  color: var(--primary-color);
  margin: 0 0 4px;
}

.title {
  font-size: 14px;
  color: var(--secondary-color);
  margin: 0 0 8px;
  font-weight: 400;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.contact-row,
.detail-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.contact-item,
.detail-item {
  font-size: 12px;
  color: #666;
}

.detail-item {
  background: var(--accent-color);
  padding: 2px 8px;
  border-radius: 3px;
}

.summary {
  font-size: 13px;
  line-height: 1.6;
  color: #444;
  margin-top: 12px;
}

.section {
  margin-bottom: 18px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--primary-color);
  border-bottom: 2px solid var(--primary-color);
  margin: 0 0 12px;
  padding-bottom: 6px;
}

.timeline {
  position: relative;
  padding-left: 8px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 3px;
  top: 6px;
  bottom: 6px;
  width: 2px;
  background: var(--primary-color);
  opacity: 0.3;
}

.timeline-item {
  position: relative;
  padding-left: 24px;
  margin-bottom: 14px;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 6px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--primary-color);
}

.timeline-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.company,
.school {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.timeline-date,
.education-date {
  font-size: 12px;
  color: #999;
}

.position,
.degree-major {
  font-size: 13px;
  color: var(--secondary-color);
  margin: 2px 0;
}

.timeline-desc,
.education-desc {
  font-size: 13px;
  line-height: 1.6;
  color: #666;
  margin: 4px 0 0;
}

.projects {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.project-item {
  background: var(--accent-color);
  padding: 12px 14px;
  border-radius: 6px;
  border-left: 3px solid var(--primary-color);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.project-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.project-date {
  font-size: 12px;
  color: #999;
}

.project-role {
  font-size: 12px;
  color: var(--primary-color);
  margin: 2px 0;
  font-weight: 500;
}

.project-desc {
  font-size: 13px;
  line-height: 1.6;
  color: #666;
  margin: 6px 0;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
}

.tag {
  font-size: 11px;
  padding: 3px 10px;
  background: var(--primary-color);
  color: white;
  border-radius: 12px;
}

.skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.skill-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: var(--accent-color);
  border-radius: 20px;
  border: 1px solid var(--primary-color);
}

.badge-name {
  font-size: 13px;
  color: #333;
  font-weight: 500;
}

.badge-level {
  font-size: 11px;
  padding: 2px 8px;
  color: white;
  border-radius: 10px;
}

.awards-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.award-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: var(--accent-color);
  border-radius: 6px;
  border-left: 3px solid var(--primary-color);
}

.award-icon {
  font-size: 24px;
}

.award-content {
  flex: 1;
}

.award-name {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.award-meta {
  font-size: 11px;
  color: #999;
  margin-top: 2px;
}
</style>
