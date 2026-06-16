<script setup lang="ts">
import type { ResumeData, ThemeConfig } from '../../types/resume'

defineProps<{
  resumeData: ResumeData
  theme: ThemeConfig
}>()

const levelColors: Record<string, string> = {
  beginner: '#9ca3af',
  intermediate: '#3b82f6',
  advanced: '#10b981',
  expert: '#f59e0b'
}

const levelWidths: Record<string, string> = {
  beginner: '25%',
  intermediate: '50%',
  advanced: '75%',
  expert: '100%'
}
</script>

<template>
  <div class="preview-container">
    <div class="resume-page professional" :style="{ '--primary-color': theme.primaryColor, '--secondary-color': theme.secondaryColor, '--accent-color': theme.accentColor }">
      <aside class="resume-sidebar">
        <div class="avatar-wrapper">
          <img v-if="resumeData.personalInfo.avatar" :src="resumeData.personalInfo.avatar" alt="头像" class="avatar" />
          <div v-else class="avatar-placeholder">
            <span>📷</span>
            <span>照片</span>
          </div>
        </div>
        <h1 class="name">{{ resumeData.personalInfo.name }}</h1>
        <h2 class="title">{{ resumeData.personalInfo.title }}</h2>

        <div class="contact-section">
          <h3 class="sidebar-title">联系方式</h3>
          <div class="contact-item">📧 {{ resumeData.personalInfo.email }}</div>
          <div class="contact-item">📱 {{ resumeData.personalInfo.phone }}</div>
          <div class="contact-item">📍 {{ resumeData.personalInfo.address }}</div>
        </div>

        <div class="detail-section">
          <h3 class="sidebar-title">个人详情</h3>
          <div v-if="resumeData.personalInfo.gender" class="detail-item">性别: {{ resumeData.personalInfo.gender }}</div>
          <div v-if="resumeData.personalInfo.birthDate" class="detail-item">出生: {{ resumeData.personalInfo.birthDate }}</div>
          <div v-if="resumeData.personalInfo.politicalStatus" class="detail-item">政治面貌: {{ resumeData.personalInfo.politicalStatus }}</div>
        </div>

        <section v-if="resumeData.skills.length" class="sidebar-section">
          <h3 class="sidebar-title">专业技能</h3>
          <div class="skills-list">
            <div v-for="skill in resumeData.skills" :key="skill.id" class="skill-item">
              <div class="skill-name">{{ skill.name }}</div>
              <div class="skill-bar">
                <div class="skill-progress" :style="{ width: levelWidths[skill.level], backgroundColor: levelColors[skill.level] }"></div>
              </div>
            </div>
          </div>
        </section>

        <section v-if="resumeData.awards.length" class="sidebar-section">
          <h3 class="sidebar-title">荣誉奖项</h3>
          <div class="awards-list">
            <div v-for="award in resumeData.awards" :key="award.id" class="award-item">
              <div class="award-icon">🏆</div>
              <div class="award-info">
                <div class="award-name">{{ award.name }}</div>
                <div class="award-meta">{{ award.issuer }} · {{ award.date }}</div>
              </div>
            </div>
          </div>
        </section>
      </aside>

      <main class="resume-main">
        <section v-if="resumeData.personalInfo.summary" class="section">
          <h3 class="section-title">个人简介</h3>
          <p class="summary">{{ resumeData.personalInfo.summary }}</p>
        </section>

        <section v-if="resumeData.experience.length" class="section">
          <h3 class="section-title">工作经历</h3>
          <div class="experience-list">
            <div v-for="exp in resumeData.experience" :key="exp.id" class="experience-item">
              <div class="item-header">
                <h4 class="company">{{ exp.company }}</h4>
                <span class="item-date">{{ exp.startDate }} - {{ exp.endDate }}</span>
              </div>
              <div class="position">{{ exp.position }}</div>
              <p class="item-desc">{{ exp.description }}</p>
            </div>
          </div>
        </section>

        <section v-if="resumeData.projects.length" class="section">
          <h3 class="section-title">项目经验</h3>
          <div class="projects-list">
            <div v-for="project in resumeData.projects" :key="project.id" class="project-item">
              <div class="item-header">
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

        <section v-if="resumeData.education.length" class="section">
          <h3 class="section-title">教育背景</h3>
          <div class="education-list">
            <div v-for="edu in resumeData.education" :key="edu.id" class="education-item">
              <div class="item-header">
                <h4 class="school">{{ edu.school }}</h4>
                <span class="item-date">{{ edu.startDate }} - {{ edu.endDate }}</span>
              </div>
              <div class="degree-major">{{ edu.degree }} · {{ edu.major }}</div>
              <p v-if="edu.description" class="item-desc">{{ edu.description }}</p>
            </div>
          </div>
        </section>
      </main>
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

.resume-page.professional {
  width: 210mm;
  min-height: 297mm;
  height: auto;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  display: flex;
  padding: 0;
}

.resume-sidebar {
  width: 35%;
  background: linear-gradient(180deg, #1e293b 0%, #334155 100%);
  color: white;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.avatar-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
}

.resume-page.professional .avatar {
  width: 140px;
  height: 170px;
  object-fit: cover;
  border-radius: 6px;
  border: 3px solid rgba(255,255,255,0.5);
}

.resume-page.professional .avatar-placeholder {
  width: 140px;
  height: 170px;
  border: 3px dashed rgba(255,255,255,0.5);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: rgba(255,255,255,0.8);
  font-size: 14px;
}

.resume-page.professional .avatar-placeholder span:first-child {
  font-size: 32px;
}

.name {
  font-size: 22px;
  font-weight: 700;
  text-align: center;
  margin: 0;
  color: white;
}

.title {
  font-size: 13px;
  text-align: center;
  color: rgba(255,255,255,0.8);
  margin: 0;
  font-weight: 400;
}

.contact-section,
.detail-section,
.sidebar-section {
  margin-top: 8px;
}

.sidebar-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--primary-color);
  border-bottom: 1px solid rgba(255,255,255,0.3);
  padding-bottom: 6px;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.contact-item {
  font-size: 12px;
  color: rgba(255,255,255,0.9);
  margin-bottom: 6px;
}

.detail-item {
  font-size: 12px;
  color: rgba(255,255,255,0.8);
  margin-bottom: 4px;
}

.skills-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skill-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.skill-name {
  font-size: 12px;
  color: rgba(255,255,255,0.9);
}

.skill-bar {
  height: 4px;
  background: rgba(255,255,255,0.2);
  border-radius: 2px;
  overflow: hidden;
}

.skill-progress {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s;
}

.awards-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.award-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.award-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.award-info {
  flex: 1;
}

.award-name {
  font-size: 12px;
  font-weight: 600;
  color: white;
  margin: 0;
}

.award-meta {
  font-size: 10px;
  color: rgba(255,255,255,0.7);
  margin-top: 2px;
}

.resume-main {
  flex: 1;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section {
  margin-bottom: 0;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--primary-color);
  border-bottom: 2px solid var(--primary-color);
  margin: 0 0 12px;
  padding-bottom: 6px;
}

.summary {
  font-size: 13px;
  line-height: 1.6;
  color: #555;
  margin: 0;
}

.experience-list,
.projects-list,
.education-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.experience-item,
.project-item,
.education-item {
  background: var(--accent-color);
  padding: 12px 14px;
  border-radius: 6px;
  border-left: 3px solid var(--primary-color);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.company,
.project-name,
.school {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.item-date,
.project-date {
  font-size: 11px;
  color: #999;
}

.position,
.degree-major,
.project-role {
  font-size: 12px;
  color: var(--primary-color);
  margin: 2px 0;
}

.item-desc,
.project-desc {
  font-size: 13px;
  line-height: 1.6;
  color: #666;
  margin: 6px 0 0;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
}

.tag {
  font-size: 10px;
  padding: 2px 8px;
  background: var(--primary-color);
  color: white;
  border-radius: 10px;
}
</style>
