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
    <div 
      class="resume-preview"
      :style="{ 
        '--primary-color': theme.primaryColor,
        '--secondary-color': theme.secondaryColor,
        '--font-family': theme.fontFamily
      }"
    >
      <!-- 装饰边框 -->
      <div class="page-border"></div>
      
      <!-- 头部：个人简介 -->
      <header class="resume-header">
        <div class="header-content">
          <h1 class="name">个人简历</h1>
          <p class="subtitle">细心<span class="dot">·</span>从每一个小细节开始。</p>
          <p class="subtitle-en">Personal resume</p>
        </div>
      </header>

      <div class="divider">
        <div class="divider-line"></div>
        <div class="divider-accent"></div>
        <div class="divider-dot"></div>
      </div>

      <!-- 基本信息 -->
      <section class="section">
        <div class="section-tab">
          <span class="tab-triangle">▶</span>
          <span class="tab-text">基本信息</span>
        </div>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">姓&emsp;&emsp;名：</span>
            <span class="info-value">{{ resumeData.personalInfo.name }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">出生年月：</span>
            <span class="info-value">未填写</span>
          </div>
          <div class="info-item">
            <span class="info-label">民&emsp;&emsp;族：</span>
            <span class="info-value">汉</span>
          </div>
          <div class="info-item">
            <span class="info-label">身&emsp;&emsp;高：</span>
            <span class="info-value">未填写</span>
          </div>
          <div class="info-item">
            <span class="info-label">电&emsp;&emsp;话：</span>
            <span class="info-value">{{ resumeData.personalInfo.phone }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">政治面貌：</span>
            <span class="info-value">未填写</span>
          </div>
          <div class="info-item">
            <span class="info-label">邮&emsp;&emsp;箱：</span>
            <span class="info-value">{{ resumeData.personalInfo.email }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">毕业院校：</span>
            <span class="info-value">未填写</span>
          </div>
          <div class="info-item">
            <span class="info-label">住&emsp;&emsp;址：</span>
            <span class="info-value">{{ resumeData.personalInfo.location }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">学&emsp;&emsp;历：</span>
            <span class="info-value">本科</span>
          </div>
        </div>
      </section>

      <!-- 教育背景 -->
      <section v-if="resumeData.education.length > 0" class="section">
        <div class="section-tab">
          <span class="tab-triangle">▶</span>
          <span class="tab-text">教育背景</span>
        </div>
        <div class="education-list">
          <div v-for="edu in resumeData.education" :key="edu.id" class="education-item">
            <div class="edu-top">
              <span class="edu-date">{{ edu.startDate }}-{{ edu.endDate }}</span>
              <span class="school">{{ edu.school }}</span>
              <span class="degree">{{ edu.degree }} · {{ edu.major }}</span>
            </div>
            <p v-if="edu.description" class="edu-desc">{{ edu.description }}</p>
          </div>
        </div>
      </section>

      <!-- 校园经历 -->
      <section class="section">
        <div class="section-tab">
          <span class="tab-triangle">▶</span>
          <span class="tab-text">校园经历</span>
        </div>
        <div class="experience-list">
          <div class="exp-item">
            <div class="exp-top">
              <span class="exp-date">2009.03-2011.06</span>
              <span class="exp-name">学生会</span>
              <span class="exp-role">干事</span>
            </div>
            <ul class="exp-details">
              <li>积极参与学生会的各项活动，与其他干事一起参与各类学生活动的策划；</li>
              <li>负责学院活动的赞助拉取，制作活动赞助方案，并上门拜访企业拉取赞助；</li>
              <li>完成其他学生会的工作任务，成功举办多次大型活动，如"迎新晚会"、"送毕业生晚会"等；</li>
              <li>利用寒暑假从事家教、勒工助学工作，利用课外周末时间打工进行社会调研，积极参加学校组织的公益活动等。</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- 技能证书 -->
      <section v-if="resumeData.skills.length > 0" class="section">
        <div class="section-tab">
          <span class="tab-triangle">▶</span>
          <span class="tab-text">技能证书</span>
        </div>
        <div class="skills-list">
          <div v-for="skill in resumeData.skills" :key="skill.id" class="skill-item">
            <span class="skill-name">{{ skill.name }}</span>
            <span class="skill-level" :style="{ color: levelColors[skill.level] }">
              {{ levelLabels[skill.level] }}
            </span>
          </div>
        </div>
      </section>

      <!-- 自我评价 -->
      <section v-if="resumeData.personalInfo.summary" class="section">
        <div class="section-tab">
          <span class="tab-triangle">▶</span>
          <span class="tab-text">自我评价</span>
        </div>
        <div class="summary-content">
          <p>{{ resumeData.personalInfo.summary }}</p>
        </div>
      </section>

      <!-- 实习经验 -->
      <section v-if="resumeData.experience.length > 0" class="section">
        <div class="section-tab">
          <span class="tab-triangle">▶</span>
          <span class="tab-text">实习经验</span>
        </div>
        <div class="experience-list">
          <div v-for="exp in resumeData.experience" :key="exp.id" class="exp-item">
            <div class="exp-top">
              <span class="exp-date">{{ exp.startDate }}-{{ exp.endDate || '至今' }}</span>
              <span class="exp-name">{{ exp.company }}</span>
              <span class="exp-role">{{ exp.position }}</span>
            </div>
            <p class="exp-desc">{{ exp.description }}</p>
          </div>
        </div>
      </section>

      <!-- 项目经验 -->
      <section v-if="resumeData.projects.length > 0" class="section">
        <div class="section-tab">
          <span class="tab-triangle">▶</span>
          <span class="tab-text">项目经验</span>
        </div>
        <div class="project-list">
          <div v-for="project in resumeData.projects" :key="project.id" class="project-item">
            <div class="project-top">
              <span class="project-date">{{ project.startDate }}-{{ project.endDate }}</span>
              <span class="project-name">{{ project.name }}</span>
              <span class="project-role">{{ project.role }}</span>
            </div>
            <div class="project-tags">
              <span v-for="tech in project.technologies" :key="tech" class="tag">{{ tech }}</span>
            </div>
            <p class="project-desc">{{ project.description }}</p>
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
  padding: 20px;
  background: #e8e8e8;
}

.resume-preview {
  position: relative;
  width: 210mm;
  min-height: 297mm;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  padding: 22mm 20mm;
  font-family: var(--font-family);
  color: #333;
}

/* 顶部装饰边角 */
.page-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(to right, #c9a962 0%, #c9a962 30%, #78909c 30%, #78909c 100%);
}

/* 头部 */
.resume-header {
  margin-bottom: 6px;
}

.name {
  font-size: 36px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
  letter-spacing: 3px;
  position: relative;
  display: inline-block;
}

.name::before {
  content: '';
  position: absolute;
  top: 50%;
  left: -18px;
  transform: translateY(-50%);
  width: 6px;
  height: 60%;
  background: linear-gradient(to bottom, #c9a962, #78909c);
  border-radius: 2px;
}

.subtitle {
  font-size: 13px;
  color: #666;
  margin: 6px 0 0;
  letter-spacing: 1px;
}

.dot {
  color: #c9a962;
  font-weight: bold;
  margin: 0 4px;
}

.subtitle-en {
  font-size: 12px;
  color: #999;
  margin: 2px 0 0;
  font-style: italic;
  letter-spacing: 1px;
}

/* 装饰分割线 */
.divider {
  position: relative;
  height: 8px;
  margin: 14px 0 22px;
}

.divider-line {
  position: absolute;
  top: 3px;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(to right, #c9a962 0%, #c9a962 25%, #d4d4d4 25%, #d4d4d4 100%);
}

.divider-accent {
  position: absolute;
  top: 0;
  left: 0;
  width: 60px;
  height: 6px;
  background: linear-gradient(135deg, #c9a962 0%, #e0c080 100%);
  border-radius: 1px;
  box-shadow: 0 1px 3px rgba(201, 169, 98, 0.3);
}

.divider-dot {
  position: absolute;
  top: -2px;
  left: 65px;
  width: 5px;
  height: 5px;
  background: #c9a962;
  border-radius: 50%;
  box-shadow: 0 0 0 2px rgba(201, 169, 98, 0.2);
}

/* 区块 */
.section {
  margin-bottom: 22px;
  position: relative;
}

/* 梯形标题标签 */
.section-tab {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: linear-gradient(135deg, #78909c 0%, #607d8b 100%);
  color: white;
  padding: 5px 22px 5px 12px;
  margin-bottom: 18px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 1px;
  clip-path: polygon(0 0, 100% 0, calc(100% - 12px) 100%, 0 100%);
  box-shadow: 2px 2px 4px rgba(96, 125, 139, 0.2);
}

.tab-triangle {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.9);
  margin-left: 2px;
}

.tab-text {
  position: relative;
  z-index: 1;
}

/* 基本信息网格 */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 30px;
  padding: 0 4px;
}

.info-item {
  font-size: 13px;
  display: flex;
  align-items: baseline;
}

.info-label {
  color: #888;
  white-space: nowrap;
  font-size: 12px;
}

.info-value {
  color: #333;
  font-weight: 500;
}

/* 教育背景 */
.education-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 0 4px;
}

.education-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;
  padding-left: 8px;
  border-left: 2px solid #f0f0f0;
}

.education-item::before {
  content: '';
  position: absolute;
  left: -4px;
  top: 6px;
  width: 6px;
  height: 6px;
  background: #78909c;
  border-radius: 50%;
  box-shadow: 0 0 0 2px white, 0 0 0 3px #78909c;
}

.edu-top {
  display: flex;
  align-items: baseline;
  gap: 12px;
  font-size: 13px;
}

.edu-date {
  color: #999;
  font-size: 12px;
  font-weight: 500;
}

.school {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.degree {
  color: #666;
  margin-left: auto;
  font-size: 12px;
}

.edu-desc {
  font-size: 12px;
  color: #666;
  line-height: 1.6;
  margin: 4px 0 0;
}

/* 经历列表 */
.experience-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0 4px;
}

.exp-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: relative;
  padding-left: 8px;
  border-left: 2px solid #f0f0f0;
}

.exp-item::before {
  content: '';
  position: absolute;
  left: -4px;
  top: 6px;
  width: 6px;
  height: 6px;
  background: #78909c;
  border-radius: 50%;
  box-shadow: 0 0 0 2px white, 0 0 0 3px #78909c;
}

.exp-top {
  display: flex;
  align-items: baseline;
  gap: 12px;
  font-size: 13px;
}

.exp-date {
  color: #999;
  font-size: 12px;
  font-weight: 500;
}

.exp-name {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.exp-role {
  color: #c9a962;
  margin-left: auto;
  font-size: 12px;
  font-weight: 500;
  background: rgba(201, 169, 98, 0.1);
  padding: 1px 8px;
  border-radius: 3px;
}

.exp-desc {
  font-size: 12px;
  color: #555;
  line-height: 1.7;
  margin: 0;
}

.exp-details {
  margin: 4px 0 0;
  padding-left: 18px;
  font-size: 12px;
  color: #555;
  line-height: 1.8;
}

.exp-details li {
  margin-bottom: 3px;
  position: relative;
}

.exp-details li::marker {
  color: #c9a962;
}

/* 技能 */
.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 14px 28px;
  padding: 0 4px;
}

.skill-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.skill-name {
  color: #333;
  font-weight: 500;
}

.skill-level {
  font-size: 12px;
  font-weight: 500;
  padding: 1px 6px;
  background: rgba(0, 0, 0, 0.03);
  border-radius: 3px;
}

/* 项目 */
.project-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0 4px;
}

.project-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;
  padding-left: 8px;
  border-left: 2px solid #f0f0f0;
}

.project-item::before {
  content: '';
  position: absolute;
  left: -4px;
  top: 6px;
  width: 6px;
  height: 6px;
  background: #c9a962;
  border-radius: 50%;
  box-shadow: 0 0 0 2px white, 0 0 0 3px #c9a962;
}

.project-top {
  display: flex;
  align-items: baseline;
  gap: 12px;
  font-size: 13px;
}

.project-date {
  color: #999;
  font-size: 12px;
  font-weight: 500;
}

.project-name {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.project-role {
  color: #c9a962;
  margin-left: auto;
  font-size: 12px;
  font-weight: 500;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 2px 0;
}

.tag {
  padding: 1px 8px;
  background: rgba(120, 144, 156, 0.1);
  color: #607d8b;
  font-size: 11px;
  border-radius: 3px;
  border: 1px solid rgba(120, 144, 156, 0.2);
}

.project-desc {
  font-size: 12px;
  color: #555;
  line-height: 1.6;
  margin: 0;
}

/* 自我评价 */
.summary-content {
  padding: 0 4px;
  background: linear-gradient(to right, rgba(201, 169, 98, 0.05), transparent);
  border-left: 3px solid #c9a962;
  padding: 8px 12px;
  border-radius: 0 4px 4px 0;
}

.summary-content p {
  font-size: 13px;
  color: #555;
  line-height: 1.8;
  margin: 0;
  text-indent: 2em;
}
</style>
