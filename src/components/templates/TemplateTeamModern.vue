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
            <div class="contact-row">
              <span class="contact-item">📧 {{ resumeData.personalInfo.email }}</span>
              <span class="contact-item">📱 {{ resumeData.personalInfo.phone }}</span>
              <span class="contact-item">📍 {{ resumeData.personalInfo.address }}</span>
            </div>
            <div class="detail-row" v-if="resumeData.personalInfo.gender || resumeData.personalInfo.birthDate || resumeData.personalInfo.politicalStatus">
              <span v-if="resumeData.personalInfo.gender" class="detail-item">{{ resumeData.personalInfo.gender }}</span>
              <span v-if="resumeData.personalInfo.birthDate" class="detail-item">{{ resumeData.personalInfo.birthDate }}</span>
              <span v-if="resumeData.personalInfo.politicalStatus" class="detail-item">{{ resumeData.personalInfo.politicalStatus }}</span>
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
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 16px;
  margin-bottom: 20px;
}

.header-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.avatar-wrapper {
  flex-shrink: 0;
}

.avatar {
  width: 120px;
  height: 150px;
  object-fit: cover;
  border-radius: 6px;
  border: 3px solid var(--primary-color);
}

.avatar-placeholder {
  width: 120px;
  height: 150px;
  border: 3px dashed var(--primary-color);
  border-radius: 6px;
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
  font-weight: 500;
}

.contact-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 6px;
}

.contact-item {
  font-size: 12px;
  color: #666;
}

.detail-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.detail-item {
  font-size: 11px;
  color: white;
  background: var(--primary-color);
  padding: 3px 10px;
  border-radius: 12px;
}

.summary {
  font-size: 12px;
  line-height: 1.6;
  color: #555;
  margin-top: 10px;
  padding: 8px;
  background: var(--accent-color);
  border-radius: 6px;
  border-left: 3px solid var(--primary-color);
}

.section {
  margin-bottom: 16px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--primary-color);
  margin: 0 0 10px;
  padding-bottom: 4px;
  border-bottom: 1px solid var(--accent-color);
}

.timeline {
  position: relative;
  padding-left: 6px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 2px;
  top: 6px;
  bottom: 6px;
  width: 2px;
  background: linear-gradient(to bottom, var(--primary-color), var(--accent-color));
}

.timeline-item {
  position: relative;
  padding-left: 22px;
  margin-bottom: 12px;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 4px;
  width: 8px;
  height: 8px;
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
  font-size: 13px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.timeline-date,
.education-date {
  font-size: 11px;
  color: #999;
}

.position,
.degree-major {
  font-size: 12px;
  color: var(--primary-color);
  margin: 2px 0;
}

.timeline-desc,
.education-desc {
  font-size: 12px;
  line-height: 1.5;
  color: #666;
  margin: 4px 0 0;
}

.projects {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.project-item {
  background: var(--accent-color);
  padding: 10px 12px;
  border-radius: 6px;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3px;
}

.project-name {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.project-date {
  font-size: 11px;
  color: #999;
}

.project-role {
  font-size: 11px;
  color: var(--primary-color);
  margin: 2px 0;
}

.project-desc {
  font-size: 12px;
  line-height: 1.5;
  color: #666;
  margin: 4px 0;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 5px;
}

.tag {
  font-size: 10px;
  padding: 2px 8px;
  background: var(--primary-color);
  color: white;
  border-radius: 10px;
}

.skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  background: var(--accent-color);
  border-radius: 16px;
}

.badge-name {
  font-size: 12px;
  color: #333;
  font-weight: 500;
}

.badge-level {
  font-size: 10px;
  padding: 1px 6px;
  color: white;
  border-radius: 8px;
}

.awards-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.award-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: var(--accent-color);
  border-radius: 6px;
}

.award-icon {
  font-size: 22px;
}

.award-content {
  flex: 1;
}

.award-name {
  font-size: 12px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.award-meta {
  font-size: 10px;
  color: #999;
  margin-top: 1px;
}
</style>
