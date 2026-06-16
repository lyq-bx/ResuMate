<script setup lang="ts">
import { computed } from 'vue'
import TranscriptImporter from './TranscriptImporter.vue'
import type { Award, CourseScore, Education, EditorTabId, Experience, Project, ResumeData, Skill, UseCaseConfig } from '../types/resume'

const props = defineProps<{
  resumeData: ResumeData
  activeTab: string
  useCase: UseCaseConfig
}>()

const emit = defineEmits<{
  update: [data: ResumeData]
  changeTab: [tab: EditorTabId]
}>()

const baseTabs: { id: EditorTabId; label: string; mark: string }[] = [
  { id: 'personal', label: '基本信息', mark: 'ID' },
  { id: 'education', label: '教育背景', mark: 'ED' },
  { id: 'experience', label: '实践经历', mark: 'EX' },
  { id: 'projects', label: '项目科研', mark: 'PR' },
  { id: 'skills', label: '技能能力', mark: 'SK' },
  { id: 'awards', label: '奖项证书', mark: 'AW' }
]

const isAcademicMode = computed(() => props.useCase.value !== 'job')

const tabs = computed(() =>
  props.useCase.tabOrder.map((id) => {
    const tab = baseTabs.find((item) => item.id === id)!
    return {
      ...tab,
      label: props.useCase.sectionLabels[id] || tab.label
    }
  })
)

const currentTab = computed(() => tabs.value.find((tab) => tab.id === props.activeTab) ?? tabs.value[0])
const currentHint = computed(() => props.useCase.sectionHints[currentTab.value.id] || props.useCase.editorHint)

const degreeOptions = ['高中', '专科', '本科', '硕士', '博士', '交换生']

const genderOptions = ['男', '女', '其他', '不展示']

const skillLevels: { value: Skill['level']; label: string }[] = [
  { value: 'beginner', label: '了解' },
  { value: 'intermediate', label: '熟练' },
  { value: 'advanced', label: '精通' },
  { value: 'expert', label: '专家' }
]

const cloneResume = () => JSON.parse(JSON.stringify(props.resumeData)) as ResumeData

const commit = (mutator: (data: ResumeData) => void) => {
  const data = cloneResume()
  mutator(data)
  emit('update', data)
}

const updatePersonalInfo = (field: keyof ResumeData['personalInfo'], value: string) => {
  commit((data) => {
    data.personalInfo[field] = value
  })
}

const uploadAvatar = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    const image = new Image()
    image.onload = () => {
      const maxWidth = 480
      const maxHeight = 640
      const ratio = Math.min(maxWidth / image.width, maxHeight / image.height, 1)
      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.round(image.width * ratio))
      canvas.height = Math.max(1, Math.round(image.height * ratio))
      const context = canvas.getContext('2d')
      if (!context) return

      context.drawImage(image, 0, 0, canvas.width, canvas.height)
      updatePersonalInfo('avatar', canvas.toDataURL('image/jpeg', 0.88))
      input.value = ''
    }
    image.src = typeof reader.result === 'string' ? reader.result : ''
  }
  reader.readAsDataURL(file)
}

const removeAvatar = () => {
  updatePersonalInfo('avatar', '')
}

const addEducation = () => {
  commit((data) => {
    data.education.push({
      id: Date.now().toString(),
      school: '',
      degree: '本科',
      major: '',
      startDate: '',
      endDate: '',
      gpa: '',
      rank: '',
      englishLevel: '',
      coreCourses: [],
      description: ''
    })
  })
}

const updateEducation = <K extends keyof Education>(index: number, field: K, value: Education[K]) => {
  commit((data) => {
    data.education[index][field] = value
  })
}

const removeEducation = (index: number) => {
  commit((data) => {
    data.education.splice(index, 1)
  })
}

const addCourseScore = (educationIndex: number) => {
  commit((data) => {
    data.education[educationIndex].coreCourses.push({
      id: Date.now().toString(),
      name: '',
      score: '',
      credit: ''
    })
  })
}

const appendImportedCourses = (educationIndex: number, courses: CourseScore[]) => {
  commit((data) => {
    const existing = data.education[educationIndex].coreCourses
    const existingKeys = new Set(existing.map((course) => `${course.name}-${course.score}`))
    const nextCourses = courses.filter((course) => !existingKeys.has(`${course.name}-${course.score}`))
    existing.push(...nextCourses)
  })
}

const updateCourseScore = <K extends keyof CourseScore>(
  educationIndex: number,
  courseIndex: number,
  field: K,
  value: CourseScore[K]
) => {
  commit((data) => {
    data.education[educationIndex].coreCourses[courseIndex][field] = value
  })
}

const removeCourseScore = (educationIndex: number, courseIndex: number) => {
  commit((data) => {
    data.education[educationIndex].coreCourses.splice(courseIndex, 1)
  })
}

const addExperience = () => {
  commit((data) => {
    data.experience.push({
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: ''
    })
  })
}

const updateExperience = <K extends keyof Experience>(index: number, field: K, value: Experience[K]) => {
  commit((data) => {
    data.experience[index][field] = value
  })
}

const removeExperience = (index: number) => {
  commit((data) => {
    data.experience.splice(index, 1)
  })
}

const addProject = () => {
  commit((data) => {
    data.projects.push({
      id: Date.now().toString(),
      name: '',
      role: '',
      startDate: '',
      endDate: '',
      description: '',
      technologies: []
    })
  })
}

const updateProject = <K extends keyof Project>(index: number, field: K, value: Project[K]) => {
  commit((data) => {
    data.projects[index][field] = value
  })
}

const removeProject = (index: number) => {
  commit((data) => {
    data.projects.splice(index, 1)
  })
}

const addSkill = () => {
  commit((data) => {
    data.skills.push({
      id: Date.now().toString(),
      name: '',
      level: 'intermediate'
    })
  })
}

const updateSkill = <K extends keyof Skill>(index: number, field: K, value: Skill[K]) => {
  commit((data) => {
    data.skills[index][field] = value
  })
}

const removeSkill = (index: number) => {
  commit((data) => {
    data.skills.splice(index, 1)
  })
}

const addAward = () => {
  commit((data) => {
    data.awards.push({
      id: Date.now().toString(),
      name: '',
      issuer: '',
      date: '',
      description: ''
    })
  })
}

const updateAward = <K extends keyof Award>(index: number, field: K, value: Award[K]) => {
  commit((data) => {
    data.awards[index][field] = value
  })
}

const removeAward = (index: number) => {
  commit((data) => {
    data.awards.splice(index, 1)
  })
}
</script>

<template>
  <div class="editor-container">
    <aside class="editor-sidebar">
      <div class="sidebar-heading">
        <span class="sidebar-kicker">内容模块</span>
        <strong>{{ useCase.label }}</strong>
      </div>
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        :class="['tab-btn', { active: activeTab === tab.id }]"
        @click="emit('changeTab', tab.id)"
      >
        <span class="tab-mark">{{ tab.mark }}</span>
        <span class="tab-label">{{ tab.label }}</span>
      </button>
    </aside>

    <section class="editor-content">
      <div class="content-title">
        <span>{{ useCase.title }}</span>
        <h2>{{ currentTab.label }}</h2>
        <p>{{ currentHint }}</p>
        <div class="focus-tags">
          <b v-for="tag in useCase.focusTags" :key="tag">{{ tag }}</b>
        </div>
      </div>

      <div v-if="activeTab === 'personal'" class="form-section">
        <div class="photo-uploader">
          <div class="photo-preview">
            <img v-if="resumeData.personalInfo.avatar" :src="resumeData.personalInfo.avatar" alt="证件照预览" />
            <span v-else>证件照</span>
          </div>
          <div class="photo-actions">
            <label class="upload-btn">
              上传照片
              <input type="file" accept="image/png,image/jpeg,image/webp" @change="uploadAvatar" />
            </label>
            <button
              v-if="resumeData.personalInfo.avatar"
              class="remove-btn"
              type="button"
              @click="removeAvatar"
            >
              移除
            </button>
          </div>
        </div>

        <div class="form-grid two">
          <label class="form-group">
            <span>姓名</span>
            <input
              type="text"
              :value="resumeData.personalInfo.name"
              placeholder="请输入姓名"
              @input="updatePersonalInfo('name', ($event.target as HTMLInputElement).value)"
            />
          </label>
          <label class="form-group">
            <span>定位</span>
            <input
              type="text"
              :value="resumeData.personalInfo.title"
              placeholder="目标岗位 / 申请方向"
              @input="updatePersonalInfo('title', ($event.target as HTMLInputElement).value)"
            />
          </label>
        </div>

        <div class="form-grid two">
          <label class="form-group">
            <span>邮箱</span>
            <input
              type="email"
              :value="resumeData.personalInfo.email"
              placeholder="name@example.com"
              @input="updatePersonalInfo('email', ($event.target as HTMLInputElement).value)"
            />
          </label>
          <label class="form-group">
            <span>电话</span>
            <input
              type="tel"
              :value="resumeData.personalInfo.phone"
              placeholder="请输入联系电话"
              @input="updatePersonalInfo('phone', ($event.target as HTMLInputElement).value)"
            />
          </label>
        </div>

        <label class="form-group">
          <span>所在地</span>
          <input
            type="text"
            :value="resumeData.personalInfo.location"
            placeholder="城市 / 地区"
            @input="updatePersonalInfo('location', ($event.target as HTMLInputElement).value)"
          />
        </label>

        <div class="form-grid three">
          <label class="form-group">
            <span>籍贯</span>
            <input
              type="text"
              :value="resumeData.personalInfo.nativePlace"
              placeholder="省市 / 地区"
              @input="updatePersonalInfo('nativePlace', ($event.target as HTMLInputElement).value)"
            />
          </label>
          <label class="form-group">
            <span>民族</span>
            <input
              type="text"
              :value="resumeData.personalInfo.ethnicity"
              placeholder="如 汉族"
              @input="updatePersonalInfo('ethnicity', ($event.target as HTMLInputElement).value)"
            />
          </label>
          <label class="form-group">
            <span>性别</span>
            <select
              :value="resumeData.personalInfo.gender"
              @change="updatePersonalInfo('gender', ($event.target as HTMLSelectElement).value)"
            >
              <option value="">请选择</option>
              <option v-for="gender in genderOptions" :key="gender" :value="gender">{{ gender }}</option>
            </select>
          </label>
          <label class="form-group">
            <span>年龄</span>
            <input
              type="text"
              :value="resumeData.personalInfo.age"
              placeholder="如 23"
              @input="updatePersonalInfo('age', ($event.target as HTMLInputElement).value)"
            />
          </label>
        </div>

        <label class="form-group">
          <span>个人简介</span>
          <textarea
            :value="resumeData.personalInfo.summary"
            placeholder="用 3-5 句话概括核心优势、经历亮点和目标方向"
            rows="5"
            @input="updatePersonalInfo('summary', ($event.target as HTMLTextAreaElement).value)"
          />
        </label>
      </div>

      <div v-if="activeTab === 'education'" class="form-section">
        <div class="section-header">
          <h3>教育背景</h3>
          <button class="add-btn" type="button" @click="addEducation">添加</button>
        </div>

        <article v-for="(item, index) in resumeData.education" :key="item.id" class="item-card">
          <div class="card-header">
            <strong>教育经历 {{ index + 1 }}</strong>
            <button class="remove-btn" type="button" @click="removeEducation(index)">删除</button>
          </div>
          <div class="form-grid two">
            <label class="form-group">
              <span>毕业院校 / 学校</span>
              <input
                type="text"
                :value="item.school"
                placeholder="学校名称"
                @input="updateEducation(index, 'school', ($event.target as HTMLInputElement).value)"
              />
            </label>
            <label class="form-group">
              <span>专业</span>
              <input
                type="text"
                :value="item.major"
                placeholder="专业方向"
                @input="updateEducation(index, 'major', ($event.target as HTMLInputElement).value)"
              />
            </label>
          </div>
          <div class="form-grid three">
            <label class="form-group">
              <span>学历</span>
              <select
                :value="item.degree"
                @change="updateEducation(index, 'degree', ($event.target as HTMLSelectElement).value)"
              >
                <option v-for="degree in degreeOptions" :key="degree" :value="degree">{{ degree }}</option>
              </select>
            </label>
            <label class="form-group">
              <span>开始时间</span>
              <input
                type="month"
                :value="item.startDate"
                @input="updateEducation(index, 'startDate', ($event.target as HTMLInputElement).value)"
              />
            </label>
            <label class="form-group">
              <span>结束时间</span>
              <input
                type="month"
                :value="item.endDate"
                @input="updateEducation(index, 'endDate', ($event.target as HTMLInputElement).value)"
              />
            </label>
          </div>

          <div v-if="isAcademicMode" class="academic-panel">
            <div class="academic-title">
              <strong>学术侧重点</strong>
              <span>绩点排名、英语水平、科研和竞赛会优先展示</span>
            </div>
            <div class="form-grid three">
              <label class="form-group">
                <span>绩点</span>
                <input
                  type="text"
                  :value="item.gpa"
                  placeholder="如 3.82/4.00"
                  @input="updateEducation(index, 'gpa', ($event.target as HTMLInputElement).value)"
                />
              </label>
              <label class="form-group">
                <span>排名</span>
                <input
                  type="text"
                  :value="item.rank"
                  placeholder="如 专业前 10%"
                  @input="updateEducation(index, 'rank', ($event.target as HTMLInputElement).value)"
                />
              </label>
              <label class="form-group">
                <span>英语水平</span>
                <input
                  type="text"
                  :value="item.englishLevel"
                  placeholder="CET-6 / IELTS / TOEFL"
                  @input="updateEducation(index, 'englishLevel', ($event.target as HTMLInputElement).value)"
                />
              </label>
            </div>

            <TranscriptImporter @addCourses="appendImportedCourses(index, $event)" />

            <div class="course-toolbar">
              <strong>重要专业课程成绩</strong>
              <button class="ghost-btn" type="button" @click="addCourseScore(index)">手动添加</button>
            </div>
            <div v-if="item.coreCourses.length > 0" class="course-list">
              <div v-for="(course, courseIndex) in item.coreCourses" :key="course.id" class="course-row">
                <input
                  type="text"
                  :value="course.name"
                  placeholder="课程名称"
                  @input="updateCourseScore(index, courseIndex, 'name', ($event.target as HTMLInputElement).value)"
                />
                <input
                  type="text"
                  :value="course.score"
                  placeholder="成绩"
                  @input="updateCourseScore(index, courseIndex, 'score', ($event.target as HTMLInputElement).value)"
                />
                <input
                  type="text"
                  :value="course.credit"
                  placeholder="学分"
                  @input="updateCourseScore(index, courseIndex, 'credit', ($event.target as HTMLInputElement).value)"
                />
                <button class="remove-btn" type="button" @click="removeCourseScore(index, courseIndex)">删除</button>
              </div>
            </div>
          </div>

          <label class="form-group">
            <span>说明</span>
            <textarea
              :value="item.description"
              placeholder="排名、核心课程、成绩、科研或校园经历"
              rows="3"
              @input="updateEducation(index, 'description', ($event.target as HTMLTextAreaElement).value)"
            />
          </label>
        </article>
      </div>

      <div v-if="activeTab === 'experience'" class="form-section">
        <div class="section-header">
          <h3>实践经历</h3>
          <button class="add-btn" type="button" @click="addExperience">添加</button>
        </div>

        <article v-for="(item, index) in resumeData.experience" :key="item.id" class="item-card">
          <div class="card-header">
            <strong>经历 {{ index + 1 }}</strong>
            <button class="remove-btn" type="button" @click="removeExperience(index)">删除</button>
          </div>
          <div class="form-grid two">
            <label class="form-group">
              <span>组织 / 公司</span>
              <input
                type="text"
                :value="item.company"
                placeholder="公司、实验室、社团或组织"
                @input="updateExperience(index, 'company', ($event.target as HTMLInputElement).value)"
              />
            </label>
            <label class="form-group">
              <span>角色</span>
              <input
                type="text"
                :value="item.position"
                placeholder="岗位、职位或身份"
                @input="updateExperience(index, 'position', ($event.target as HTMLInputElement).value)"
              />
            </label>
          </div>
          <div class="form-grid two">
            <label class="form-group">
              <span>开始时间</span>
              <input
                type="month"
                :value="item.startDate"
                @input="updateExperience(index, 'startDate', ($event.target as HTMLInputElement).value)"
              />
            </label>
            <label class="form-group">
              <span>结束时间</span>
              <input
                type="text"
                :value="item.endDate"
                placeholder="至今 / 2024-06"
                @input="updateExperience(index, 'endDate', ($event.target as HTMLInputElement).value)"
              />
            </label>
          </div>
          <label class="form-group">
            <span>经历描述</span>
            <textarea
              :value="item.description"
              placeholder="写清任务、行动、方法、结果，尽量加入数字"
              rows="4"
              @input="updateExperience(index, 'description', ($event.target as HTMLTextAreaElement).value)"
            />
          </label>
        </article>
      </div>

      <div v-if="activeTab === 'projects'" class="form-section">
        <div class="section-header">
          <h3>项目科研</h3>
          <button class="add-btn" type="button" @click="addProject">添加</button>
        </div>

        <article v-for="(item, index) in resumeData.projects" :key="item.id" class="item-card">
          <div class="card-header">
            <strong>项目 {{ index + 1 }}</strong>
            <button class="remove-btn" type="button" @click="removeProject(index)">删除</button>
          </div>
          <div class="form-grid two">
            <label class="form-group">
              <span>项目名称</span>
              <input
                type="text"
                :value="item.name"
                placeholder="项目、论文、作品或课题"
                @input="updateProject(index, 'name', ($event.target as HTMLInputElement).value)"
              />
            </label>
            <label class="form-group">
              <span>角色</span>
              <input
                type="text"
                :value="item.role"
                placeholder="负责人 / 核心成员 / 作者"
                @input="updateProject(index, 'role', ($event.target as HTMLInputElement).value)"
              />
            </label>
          </div>
          <div class="form-grid two">
            <label class="form-group">
              <span>开始时间</span>
              <input
                type="month"
                :value="item.startDate"
                @input="updateProject(index, 'startDate', ($event.target as HTMLInputElement).value)"
              />
            </label>
            <label class="form-group">
              <span>结束时间</span>
              <input
                type="month"
                :value="item.endDate"
                @input="updateProject(index, 'endDate', ($event.target as HTMLInputElement).value)"
              />
            </label>
          </div>
          <label class="form-group">
            <span>关键词</span>
            <input
              type="text"
              :value="item.technologies.join(', ')"
              placeholder="多个关键词用逗号分隔"
              @input="updateProject(index, 'technologies', ($event.target as HTMLInputElement).value.split(',').map((s) => s.trim()).filter(Boolean))"
            />
          </label>
          <label class="form-group">
            <span>项目描述</span>
            <textarea
              :value="item.description"
              placeholder="背景、职责、方法、成果或论文产出"
              rows="4"
              @input="updateProject(index, 'description', ($event.target as HTMLTextAreaElement).value)"
            />
          </label>
        </article>
      </div>

      <div v-if="activeTab === 'skills'" class="form-section">
        <div class="section-header">
          <h3>技能能力</h3>
          <button class="add-btn" type="button" @click="addSkill">添加</button>
        </div>

        <article v-for="(item, index) in resumeData.skills" :key="item.id" class="item-card compact">
          <div class="form-grid skill-row">
            <label class="form-group">
              <span>技能名称</span>
              <input
                type="text"
                :value="item.name"
                placeholder="技能、语言、工具或研究方法"
                @input="updateSkill(index, 'name', ($event.target as HTMLInputElement).value)"
              />
            </label>
            <label class="form-group">
              <span>熟练度</span>
              <select
                :value="item.level"
                @change="updateSkill(index, 'level', ($event.target as HTMLSelectElement).value as Skill['level'])"
              >
                <option v-for="level in skillLevels" :key="level.value" :value="level.value">{{ level.label }}</option>
              </select>
            </label>
            <button class="remove-btn align-end" type="button" @click="removeSkill(index)">删除</button>
          </div>
        </article>
      </div>

      <div v-if="activeTab === 'awards'" class="form-section">
        <div class="section-header">
          <h3>奖项证书</h3>
          <button class="add-btn" type="button" @click="addAward">添加</button>
        </div>

        <article v-for="(item, index) in resumeData.awards" :key="item.id" class="item-card">
          <div class="card-header">
            <strong>奖项 {{ index + 1 }}</strong>
            <button class="remove-btn" type="button" @click="removeAward(index)">删除</button>
          </div>
          <div class="form-grid two">
            <label class="form-group">
              <span>名称</span>
              <input
                type="text"
                :value="item.name"
                placeholder="奖项、证书或荣誉"
                @input="updateAward(index, 'name', ($event.target as HTMLInputElement).value)"
              />
            </label>
            <label class="form-group">
              <span>颁发机构</span>
              <input
                type="text"
                :value="item.issuer"
                placeholder="机构、学校或组织"
                @input="updateAward(index, 'issuer', ($event.target as HTMLInputElement).value)"
              />
            </label>
          </div>
          <label class="form-group">
            <span>获得时间</span>
            <input
              type="month"
              :value="item.date"
              @input="updateAward(index, 'date', ($event.target as HTMLInputElement).value)"
            />
          </label>
          <label class="form-group">
            <span>说明</span>
            <textarea
              :value="item.description"
              placeholder="含金量、排名、获奖原因或证书等级"
              rows="3"
              @input="updateAward(index, 'description', ($event.target as HTMLTextAreaElement).value)"
            />
          </label>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.editor-container {
  display: grid;
  grid-template-columns: 132px minmax(0, 1fr);
  height: 100%;
  min-height: 0;
  background: var(--page-surface);
  border-right: 1px solid var(--page-border);
  container-type: inline-size;
}

.editor-sidebar {
  min-width: 0;
  padding: 16px 10px;
  background: var(--page-surface-alt);
  border-right: 1px solid var(--page-border);
  overflow-y: auto;
}

.sidebar-heading {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 8px 14px;
  color: var(--page-text);
}

.sidebar-kicker {
  color: var(--page-muted);
  font-size: 12px;
  font-weight: 700;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 42px;
  margin-bottom: 6px;
  padding: 8px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: var(--page-text);
  cursor: pointer;
  text-align: left;
}

.tab-btn:hover {
  background: var(--page-primary-soft);
}

.tab-btn.active {
  border-color: var(--page-primary);
  background: var(--page-primary-soft);
  color: var(--page-primary);
  font-weight: 800;
}

.tab-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 26px;
  border-radius: 6px;
  background: #e5e7eb;
  color: #334155;
  font-size: 11px;
  font-weight: 800;
}

.tab-btn.active .tab-mark {
  background: var(--page-primary);
  color: #ffffff;
}

.tab-label {
  min-width: 0;
  font-size: 13px;
}

.editor-content {
  min-width: 0;
  min-height: 0;
  overflow-y: auto;
  padding: 18px;
}

.content-title {
  margin-bottom: 18px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--page-border);
}

.content-title span {
  display: block;
  color: var(--page-primary);
  font-size: 12px;
  font-weight: 800;
}

.content-title h2 {
  margin: 4px 0;
  color: var(--page-text);
  font-size: 22px;
  line-height: 1.25;
}

.content-title p {
  margin: 0;
  color: var(--page-muted);
  font-size: 13px;
  line-height: 1.5;
}

.focus-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.focus-tags b {
  display: inline-flex;
  align-items: center;
  min-height: 26px;
  padding: 0 9px;
  border-radius: 8px;
  background: var(--page-primary-soft);
  color: var(--page-primary);
  font-size: 12px;
  font-weight: 900;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.photo-uploader {
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr);
  align-items: center;
  gap: 14px;
  padding: 14px;
  border: 1px solid var(--page-border);
  border-radius: 8px;
  background: var(--page-panel);
}

.photo-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 82px;
  aspect-ratio: 3 / 4;
  border: 1px solid var(--page-border);
  border-radius: 6px;
  background: var(--page-surface-alt);
  overflow: hidden;
  color: #64748b;
  font-size: 12px;
  font-weight: 800;
}

.photo-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.section-header,
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.section-header h3 {
  margin: 0;
  color: var(--page-text);
  font-size: 16px;
}

.form-grid {
  display: grid;
  gap: 12px;
}

.form-grid.two {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.form-grid.three {
  grid-template-columns: 0.9fr 1fr 1fr;
}

.form-grid.skill-row {
  grid-template-columns: minmax(0, 1fr) 118px 58px;
  align-items: end;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 7px;
  min-width: 0;
  color: var(--page-text);
  font-size: 13px;
  font-weight: 700;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  border: 1px solid var(--page-border);
  border-radius: 8px;
  background: #ffffff;
  color: var(--page-text);
  font: inherit;
  font-weight: 500;
  padding: 10px 11px;
  outline: none;
  transition: border-color 0.16s ease, box-shadow 0.16s ease;
}

.form-group textarea {
  resize: vertical;
  line-height: 1.55;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: var(--page-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--page-primary) 18%, transparent);
}

.item-card {
  padding: 14px;
  border: 1px solid var(--page-border);
  border-radius: 8px;
  background: var(--page-panel);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item-card.compact {
  padding: 12px;
}

.academic-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 14px;
  border: 1px solid var(--page-border);
  border-radius: 8px;
  background: var(--page-primary-tint);
}

.academic-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.academic-title strong,
.course-toolbar strong {
  color: var(--page-text);
  font-size: 14px;
}

.academic-title span {
  color: var(--page-muted);
  font-size: 12px;
  line-height: 1.5;
}

.course-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.course-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.course-row {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) 82px 74px 58px;
  gap: 8px;
  align-items: center;
}

.course-row input {
  min-width: 0;
  height: 36px;
  border: 1px solid var(--page-border);
  border-radius: 8px;
  padding: 0 10px;
  color: var(--page-text);
  font: inherit;
  outline: none;
}

.course-row input:focus {
  border-color: var(--page-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--page-primary) 18%, transparent);
}

.card-header strong {
  color: var(--page-text);
  font-size: 14px;
}

.add-btn,
.remove-btn,
.ghost-btn,
.upload-btn {
  border: 0;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
}

.add-btn {
  height: 32px;
  padding: 0 14px;
  background: var(--page-primary);
  color: #ffffff;
}

.add-btn:hover {
  background: var(--page-primary-hover);
}

.remove-btn {
  height: 30px;
  padding: 0 10px;
  background: #fee2e2;
  color: #b91c1c;
}

.remove-btn:hover {
  background: #fecaca;
}

.ghost-btn {
  height: 30px;
  padding: 0 10px;
  border: 1px solid var(--page-primary);
  background: #ffffff;
  color: var(--page-primary);
}

.ghost-btn:hover {
  background: var(--page-primary-soft);
}

.upload-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  padding: 0 14px;
  background: var(--page-primary);
  color: #ffffff;
}

.upload-btn:hover {
  background: var(--page-primary-hover);
}

.upload-btn input {
  display: none;
}

.remove-btn.align-end {
  align-self: end;
  width: 58px;
}

@media (max-width: 820px) {
  .editor-container {
    grid-template-columns: 1fr;
  }

  .editor-sidebar {
    display: flex;
    gap: 8px;
    padding: 10px;
    overflow-x: auto;
    border-right: 0;
    border-bottom: 1px solid var(--page-border);
  }

  .sidebar-heading {
    display: none;
  }

  .tab-btn {
    width: auto;
    min-width: 118px;
    margin-bottom: 0;
  }

  .form-grid.two,
  .form-grid.three,
  .form-grid.skill-row,
  .photo-uploader,
  .course-row {
    grid-template-columns: 1fr;
  }

  .remove-btn.align-end {
    align-self: stretch;
    width: auto;
  }
}

@container (max-width: 620px) {
  .form-grid.two,
  .form-grid.three,
  .form-grid.skill-row,
  .photo-uploader,
  .course-row {
    grid-template-columns: 1fr;
  }

  .remove-btn.align-end {
    align-self: stretch;
    width: auto;
  }
}
</style>
