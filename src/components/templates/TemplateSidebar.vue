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
</script>

<template>
  <article class="resume-preview">
    <aside class="resume-sidebar">
      <div class="sidebar-header">
        <h1 class="sidebar-main-title">PERSONAL RESUME</h1>
        <p class="sidebar-subtitle">
          {{ resumeData.education[0]?.school || '学校' }} {{ resumeData.education[0]?.degree || '学历' }}
        </p>
      </div>

      <div class="photo-frame">
        <div class="photo-placeholder">
          <img v-if="resumeData.personalInfo.avatar" :src="resumeData.personalInfo.avatar" alt="证件照" />
          <span v-else>证件照</span>
        </div>
      </div>

      <div class="sidebar-name">{{ resumeData.personalInfo.name || '姓名' }}</div>

      <div class="sidebar-section">
        <div class="sidebar-section-title">基本信息</div>
        <div class="sidebar-content">
          <div class="info-item">◆ 性别：{{ resumeData.personalInfo.gender || '未填写' }}</div>
          <div class="info-item">◆ 年龄：{{ resumeData.personalInfo.age || '未填写' }}</div>
          <div class="info-item">◆ 民族：{{ resumeData.personalInfo.ethnicity || '未填写' }}</div>
          <div class="info-item">◆ 籍贯：{{ resumeData.personalInfo.nativePlace || '未填写' }}</div>
          <div class="info-item">◆ 地址：{{ resumeData.personalInfo.location || '未填写' }}</div>
          <div class="info-item">◆ 手机：{{ resumeData.personalInfo.phone || '未填写' }}</div>
          <div class="info-item">◆ 邮箱：{{ resumeData.personalInfo.email || '未填写' }}</div>
        </div>
      </div>

      <div class="sidebar-section">
        <div class="sidebar-section-title">{{ useCase.value === 'job' ? '专业技能' : '研究能力' }}</div>
        <div class="sidebar-content">
          <div v-for="skill in resumeData.skills" :key="skill.id" class="skill-item">{{ skill.name }}</div>
          <div v-if="resumeData.education[0]?.englishLevel" class="skill-item">
            英语：{{ resumeData.education[0].englishLevel }}
          </div>
        </div>
      </div>

      <div class="sidebar-section">
        <div class="sidebar-section-title">自我评价</div>
        <div class="sidebar-content">
          <p class="self-eval-text">{{ resumeData.personalInfo.summary || useCase.editorHint }}</p>
        </div>
      </div>
    </aside>

    <main class="resume-main">
      <section class="main-section">
        <div class="section-header">
          <h2 class="section-title">
            {{ useCase.sectionLabels.education || '教育经历' }}
            <span class="section-title-en">Education</span>
          </h2>
          <div class="section-decoration"></div>
        </div>
        <div class="section-line"></div>
        <div class="section-list">
          <div v-for="edu in resumeData.education" :key="edu.id" class="content-item">
            <div class="item-row">
              <span class="item-date">{{ formatRange(edu.startDate, edu.endDate) }}</span>
              <span class="item-title">{{ edu.school }}</span>
              <span class="item-role">{{ edu.degree }} · {{ edu.major }}</span>
            </div>
            <div v-if="edu.gpa || edu.rank || edu.englishLevel" class="item-detail">
              ◆ {{ [edu.gpa && `GPA ${edu.gpa}`, edu.rank && `排名 ${edu.rank}`, edu.englishLevel && `英语 ${edu.englishLevel}`].filter(Boolean).join('；') }}
            </div>
            <div v-if="edu.coreCourses.length" class="course-strip">
              <span v-for="course in edu.coreCourses.slice(0, 6)" :key="course.id">
                {{ course.name }} {{ course.score }}
              </span>
            </div>
            <div v-if="edu.description" class="item-detail">◆ {{ edu.description }}</div>
          </div>
        </div>
      </section>

      <section class="main-section">
        <div class="section-header">
          <h2 class="section-title">
            {{ useCase.sectionLabels.experience || '实践经历' }}
            <span class="section-title-en">Practice</span>
          </h2>
          <div class="section-decoration"></div>
        </div>
        <div class="section-line"></div>
        <div class="section-list">
          <div v-for="exp in resumeData.experience" :key="exp.id" class="content-item">
            <div class="item-row">
              <span class="item-date">{{ formatRange(exp.startDate, exp.endDate) }}</span>
              <span class="item-title">{{ exp.company }}</span>
              <span class="item-role">{{ exp.position }}</span>
            </div>
            <div class="item-detail">◆ {{ exp.description }}</div>
          </div>
        </div>
      </section>

      <section class="main-section">
        <div class="section-header">
          <h2 class="section-title">
            {{ useCase.sectionLabels.projects || '项目科研' }}
            <span class="section-title-en">Research</span>
          </h2>
          <div class="section-decoration"></div>
        </div>
        <div class="section-line"></div>
        <div class="section-list">
          <div v-for="project in resumeData.projects" :key="project.id" class="content-item">
            <div class="item-row">
              <span class="item-date">{{ formatRange(project.startDate, project.endDate) }}</span>
              <span class="item-title">{{ project.name }}</span>
              <span class="item-role">{{ project.role }}</span>
            </div>
            <div class="item-detail">◆ {{ project.description }}</div>
            <div v-if="project.technologies.length" class="item-detail">◆ {{ project.technologies.join('、') }}</div>
          </div>
        </div>
      </section>

      <section class="main-section">
        <div class="section-header">
          <h2 class="section-title">
            {{ useCase.sectionLabels.awards || '活动荣誉' }}
            <span class="section-title-en">Awards</span>
          </h2>
          <div class="section-decoration"></div>
        </div>
        <div class="section-line"></div>
        <div class="award-list">
          <div v-for="award in resumeData.awards" :key="award.id" class="award-item">
            <span class="award-name">{{ award.name }}</span>
            <span class="award-date">{{ award.date || '未填写' }}</span>
          </div>
        </div>
      </section>
    </main>
  </article>
</template>

<style scoped>
.resume-preview {
  display: flex;
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  background: #ffffff;
  box-shadow: 0 16px 42px rgba(15, 23, 42, 0.18);
  font-family: "Microsoft YaHei", "PingFang SC", sans-serif;
  font-size: 13px;
  line-height: 1.6;
}

.resume-sidebar {
  display: flex;
  flex-direction: column;
  gap: 22px;
  width: 30%;
  padding: 30px 20px;
  background: #444950;
  color: #ffffff;
}

.sidebar-header,
.sidebar-name,
.photo-frame {
  text-align: center;
}

.sidebar-main-title {
  margin: 0;
  color: #ffffff;
  font-size: 20px;
  font-weight: 900;
  letter-spacing: 2px;
}

.sidebar-subtitle {
  margin: 8px 0 0;
  color: #d0d0d0;
  font-size: 11px;
  line-height: 1.4;
}

.photo-placeholder {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 120px;
  border: 2px solid #ffffff;
  background: #f5f5f5;
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

.sidebar-name {
  padding: 8px 0;
  color: #ffffff;
  font-size: 28px;
  font-weight: 900;
  letter-spacing: 4px;
}

.sidebar-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sidebar-section-title {
  padding: 6px 10px;
  background: #2563eb;
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 2px;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-left: 4px;
}

.info-item,
.skill-item,
.self-eval-text {
  margin: 0;
  color: #ffffff;
  font-size: 12px;
  line-height: 1.6;
}

.self-eval-text {
  text-align: justify;
}

.resume-main {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 20px;
  padding: 30px 24px;
  background: #ffffff;
}

.main-section {
  display: flex;
  flex-direction: column;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  color: #1a1a1a;
  font-size: 16px;
  font-weight: 900;
}

.section-title-en {
  color: #666666;
  font-size: 12px;
  font-style: italic;
  font-weight: 400;
}

.section-decoration {
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-left: 14px solid #1a1a1a;
}

.section-line {
  height: 1px;
  margin-bottom: 14px;
  background: #1a1a1a;
}

.section-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.content-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.item-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
}

.item-date {
  color: #666666;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.item-title {
  flex: 1;
  color: #1a1a1a;
  font-size: 14px;
  font-weight: 700;
}

.item-role {
  color: #333333;
  font-size: 13px;
  white-space: nowrap;
}

.item-detail {
  padding-left: 4px;
  color: #444444;
  font-size: 13px;
  line-height: 1.6;
}

.course-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.course-strip span {
  display: inline-flex;
  align-items: center;
  min-height: 22px;
  padding: 0 7px;
  border-radius: 6px;
  background: #eef2ff;
  color: #1d4ed8;
  font-size: 11px;
  font-weight: 800;
}

.award-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
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
  font-size: 13px;
  font-weight: 600;
}

.award-date {
  color: #888888;
  font-size: 12px;
  white-space: nowrap;
}

@media (max-width: 900px) {
  .resume-preview {
    flex-direction: column;
    width: 210mm;
  }

  .resume-sidebar {
    width: 100%;
    padding: 24px 20px;
  }
}
</style>
