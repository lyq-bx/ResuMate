<script setup lang="ts">
import type { ResumeData, ThemeConfig, UseCaseConfig } from '../../types/resume'

defineProps<{
  resumeData: ResumeData
  theme: ThemeConfig
  useCase: UseCaseConfig
}>()

const formatRange = (start: string, end: string) => {
  if (!start && !end) return '未填写'
  return `${start || '未填写'} - ${end || '至今'}`
}

const formatDate = (date: string) => date || '未填写'

const splitText = (text: string) => {
  return text
    .split(/[。；;\n]/)
    .map((line) => line.trim())
    .filter(Boolean)
}
</script>

<template>
  <article class="resume-preview" :style="{ '--case-accent': useCase.accent }">
    <header class="resume-header">
      <div class="header-top">
        <div class="header-left">
          <h1 class="main-title">个人简历</h1>
          <p class="subtitle">细心从每一个小细节开始。</p>
          <p class="subtitle-en">Personal resume</p>
        </div>
      </div>
      <div class="header-decoration">
        <div class="blue-bar"></div>
        <div class="gold-bar"></div>
      </div>
    </header>

    <section class="section-block">
      <div class="basic-info-with-photo">
        <div class="basic-info-main">
          <div class="section-title-bar">
            <div class="title-arrow"></div>
            <h2 class="section-title">基本信息</h2>
          </div>
          <div class="basic-info-layout">
            <div class="info-columns">
              <div class="info-row">
                <span class="info-label">姓名：</span>
                <span class="info-value">{{ resumeData.personalInfo.name || '未填写' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">性别：</span>
                <span class="info-value">{{ resumeData.personalInfo.gender || '未填写' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">电话：</span>
                <span class="info-value">{{ resumeData.personalInfo.phone || '未填写' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">邮箱：</span>
                <span class="info-value">{{ resumeData.personalInfo.email || '未填写' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">所在地：</span>
                <span class="info-value">{{ resumeData.personalInfo.location || '未填写' }}</span>
              </div>
            </div>
            <div class="info-columns">
              <div class="info-row">
                <span class="info-label">年龄：</span>
                <span class="info-value">{{ resumeData.personalInfo.age || '未填写' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">籍贯：</span>
                <span class="info-value">{{ resumeData.personalInfo.nativePlace || '未填写' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">民族：</span>
                <span class="info-value">{{ resumeData.personalInfo.ethnicity || '未填写' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">目标：</span>
                <span class="info-value">{{ resumeData.personalInfo.title || useCase.title }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">毕业院校：</span>
                <span class="info-value">{{ resumeData.education[0]?.school || '未填写' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">学历：</span>
                <span class="info-value">{{ resumeData.education[0]?.degree || '未填写' }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="photo-placeholder">
          <img v-if="resumeData.personalInfo.avatar" :src="resumeData.personalInfo.avatar" alt="证件照" />
          <span v-else>证件照</span>
        </div>
      </div>
    </section>

    <section class="section-block">
      <div class="section-title-bar">
        <div class="title-arrow"></div>
        <h2 class="section-title">教育背景</h2>
      </div>
      <div v-if="resumeData.education.length" class="timeline-list">
        <div v-for="edu in resumeData.education" :key="edu.id" class="timeline-item">
          <div class="item-header">
            <span class="item-date">{{ formatRange(edu.startDate, edu.endDate) }}</span>
            <span class="item-company">{{ edu.school }}</span>
            <span class="item-position">{{ edu.degree }} · {{ edu.major }}</span>
          </div>
          <div class="item-content">
            <p v-if="edu.gpa || edu.rank || edu.englishLevel">
              <strong>学业表现：</strong>
              {{ [edu.gpa && `GPA ${edu.gpa}`, edu.rank && `专业排名 ${edu.rank}`, edu.englishLevel && `英语 ${edu.englishLevel}`].filter(Boolean).join('；') }}
            </p>
            <p v-if="edu.coreCourses.length">
              <strong>核心课程：</strong>{{ edu.coreCourses.map((course) => `${course.name}${course.score ? ` ${course.score}` : ''}`).join('、') }}
            </p>
            <p v-if="edu.description">{{ edu.description }}</p>
          </div>
        </div>
      </div>
      <div v-else class="empty-text">暂无教育背景信息</div>
    </section>

    <section class="section-block">
      <div class="section-title-bar">
        <div class="title-arrow"></div>
        <h2 class="section-title">{{ useCase.value === 'job' ? '项目经历' : '项目科研' }}</h2>
      </div>
      <div v-if="resumeData.projects.length" class="timeline-list">
        <div v-for="project in resumeData.projects" :key="project.id" class="timeline-item">
          <div class="item-header">
            <span class="item-date">{{ formatRange(project.startDate, project.endDate) }}</span>
            <span class="item-company">{{ project.name }}</span>
            <span class="item-position">{{ project.role }}</span>
          </div>
          <div class="item-content diamond-list">
            <p v-for="(line, index) in splitText(project.description)" :key="index">◆ {{ line }}。</p>
            <p v-if="project.technologies.length">◆ 技术/方法：{{ project.technologies.join('、') }}</p>
          </div>
        </div>
      </div>
      <div v-else class="empty-text">暂无项目科研信息</div>
    </section>

    <section class="section-block">
      <div class="section-title-bar">
        <div class="title-arrow"></div>
        <h2 class="section-title">{{ useCase.value === 'job' ? '实践经历' : '实践经历' }}</h2>
      </div>
      <div v-if="resumeData.experience.length" class="timeline-list">
        <div v-for="exp in resumeData.experience" :key="exp.id" class="timeline-item">
          <div class="item-header">
            <span class="item-date">{{ formatRange(exp.startDate, exp.endDate) }}</span>
            <span class="item-company">{{ exp.company }}</span>
            <span class="item-position">{{ exp.position }}</span>
          </div>
          <div class="item-content diamond-list">
            <p v-for="(line, index) in splitText(exp.description)" :key="index">◆ {{ line }}。</p>
          </div>
        </div>
      </div>
      <div v-else class="empty-text">暂无实践经历信息</div>
    </section>

    <section class="section-block">
      <div class="section-title-bar">
        <div class="title-arrow"></div>
        <h2 class="section-title">获奖证书</h2>
      </div>
      <div v-if="resumeData.awards.length" class="awards-list">
        <div v-for="award in resumeData.awards" :key="award.id" class="award-item">
          <span class="award-name">{{ award.name }}</span>
          <span class="award-meta">{{ award.issuer }} · {{ formatDate(award.date) }}</span>
        </div>
      </div>
      <div v-else class="empty-text">暂无获奖证书信息</div>
    </section>

    <section class="section-block">
      <div class="section-title-bar">
        <div class="title-arrow"></div>
        <h2 class="section-title">技能能力</h2>
      </div>
      <div v-if="resumeData.skills.length" class="skills-layout">
        <div class="skill-section">
          <h4 class="skill-title">{{ useCase.value === 'job' ? '专业技能' : '专业能力' }}</h4>
          <p class="skill-content">{{ resumeData.skills.map((skill) => skill.name).join('、') }}</p>
        </div>
      </div>
      <div v-else class="empty-text">暂无技能能力信息</div>
    </section>
  </article>
</template>

<style scoped>
.resume-preview {
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  padding: 15mm 18mm;
  background: #ffffff;
  color: #333333;
  box-shadow: 0 16px 42px rgba(15, 23, 42, 0.18);
  font-family: SimSun, "Microsoft YaHei", serif;
  font-size: 13px;
  line-height: 1.8;
}

.resume-header {
  margin-bottom: 20px;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.main-title {
  margin: 0;
  color: #1e3a8a;
  font-size: 42px;
  font-weight: 900;
  line-height: 1.2;
  letter-spacing: 6px;
}

.subtitle {
  margin: 8px 0 0;
  padding-left: 4px;
  color: #666666;
  font-size: 14px;
}

.subtitle-en {
  margin: 2px 0 0;
  padding-left: 4px;
  color: #888888;
  font-size: 13px;
  font-style: italic;
}

.header-decoration {
  margin-top: 12px;
}

.blue-bar {
  height: 5px;
  background: linear-gradient(90deg, #1e3a8a 0%, #3b82f6 100%);
}

.gold-bar {
  height: 2px;
  background: linear-gradient(90deg, #d4af37 0%, #f5d77a 50%, #d4af37 100%);
}

.section-block {
  margin-bottom: 18px;
  page-break-inside: avoid;
}

.section-title-bar {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.title-arrow {
  width: 0;
  height: 0;
  margin-right: 10px;
  border-top: 11px solid transparent;
  border-bottom: 11px solid transparent;
  border-left: 14px solid #1e3a8a;
}

.section-title {
  margin: 0;
  padding: 6px 18px;
  background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 3px;
}

.basic-info-with-photo {
  display: flex;
  gap: 16px;
}

.basic-info-main {
  flex: 1;
  min-width: 0;
}

.basic-info-layout {
  display: flex;
  gap: 20px;
}

.info-columns {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
}

.info-row {
  display: flex;
  gap: 8px;
  line-height: 1.6;
}

.info-label {
  color: #333333;
  font-weight: 600;
  white-space: nowrap;
}

.info-value {
  min-width: 0;
  color: #555555;
  overflow-wrap: anywhere;
}

.photo-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90px;
  height: 110px;
  flex-shrink: 0;
  border: 2px solid #e5e7eb;
  background: #fafafa;
  overflow: hidden;
}

.photo-placeholder img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-placeholder span {
  color: #999999;
  font-size: 11px;
}

.timeline-list,
.skills-layout,
.awards-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.timeline-item {
  position: relative;
  padding-left: 16px;
}

.timeline-item::before {
  position: absolute;
  top: 6px;
  left: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #1e3a8a;
  content: "";
}

.item-header {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: baseline;
  margin-bottom: 8px;
}

.item-date {
  color: #666666;
  font-size: 12px;
  white-space: nowrap;
}

.item-company {
  flex: 1;
  color: #1e3a8a;
  font-size: 14px;
  font-weight: 700;
}

.item-position {
  color: #555555;
  font-size: 13px;
}

.item-content {
  padding-left: 4px;
}

.item-content p {
  margin: 0 0 4px;
  color: #444444;
  font-size: 13px;
  line-height: 1.7;
}

.item-content strong {
  color: #333333;
  font-weight: 600;
}

.diamond-list p {
  padding-left: 8px;
}

.award-item {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: baseline;
  padding: 4px 0;
  border-bottom: 1px dashed #e5e7eb;
}

.award-name {
  color: #333333;
  font-weight: 600;
}

.award-meta {
  color: #888888;
  font-size: 12px;
  white-space: nowrap;
}

.skill-section {
  padding: 8px 12px;
  border-left: 3px solid #1e3a8a;
  background: #f8fafc;
}

.skill-title {
  margin: 0 0 4px;
  color: #1e3a8a;
  font-size: 13px;
  font-weight: 700;
}

.skill-content {
  margin: 0;
  color: #555555;
  font-size: 13px;
  line-height: 1.6;
}

.empty-text {
  padding-left: 20px;
  color: #999999;
  font-size: 13px;
  font-style: italic;
}

@media (max-width: 760px) {
  .resume-preview {
    width: 210mm;
    padding: 12mm;
    font-size: 12px;
  }
}
</style>
