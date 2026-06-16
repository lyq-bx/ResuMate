<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { ResumeData, UseCaseConfig } from '../types/resume'
import {
  analyzeJD,
  calculateResumeScore,
  generateSummary,
  getCareerAdvice,
  matchResume,
  optimizeSection
} from '../services/api'

type AITab = 'optimize' | 'target' | 'career' | 'score'

const props = defineProps<{
  resumeData: ResumeData
  useCase: UseCaseConfig
}>()

const emit = defineEmits<{
  applyOptimized: [field: string, value: string]
}>()

const activeTab = ref<AITab>('optimize')
const loading = ref(false)
const result = ref('')
const explanation = ref('')
const targetInput = ref('')
const careerResult = ref('')
const scoreResult = ref<{ score: number; level: string; suggestions: string[] } | null>(null)

const tabs: { id: AITab; label: string }[] = [
  { id: 'optimize', label: '智能优化' },
  { id: 'target', label: '目标匹配' },
  { id: 'career', label: '发展建议' },
  { id: 'score', label: '材料评分' }
]

const optimizeFields = computed(() => {
  const fields = [
    { key: 'summary', label: '个人简介', section: '个人简介', content: () => props.resumeData.personalInfo.summary },
    { key: 'title', label: '定位标题', section: '定位标题', content: () => props.resumeData.personalInfo.title }
  ]

  props.resumeData.experience.forEach((_, index) => {
    fields.push({
      key: `exp_${index}`,
      label: `实践经历 ${index + 1}`,
      section: '实践经历',
      content: () => props.resumeData.experience[index]?.description || ''
    })
  })

  props.resumeData.projects.forEach((_, index) => {
    fields.push({
      key: `proj_${index}`,
      label: `项目科研 ${index + 1}`,
      section: '项目科研',
      content: () => props.resumeData.projects[index]?.description || ''
    })
  })

  return fields
})

const selectedField = ref('summary')

watch(
  optimizeFields,
  (fields) => {
    if (!fields.some((field) => field.key === selectedField.value)) {
      selectedField.value = fields[0]?.key || 'summary'
    }
  },
  { immediate: true }
)

const selectedOptimizeField = computed(() => optimizeFields.value.find((field) => field.key === selectedField.value))

const resetResult = () => {
  result.value = ''
  explanation.value = ''
}

const runOptimize = async () => {
  const field = selectedOptimizeField.value
  if (!field || !field.content().trim()) {
    alert('请先填写要优化的内容。')
    return
  }

  loading.value = true
  resetResult()
  try {
    const res = await optimizeSection(field.content(), `${props.useCase.title} - ${field.section}`)
    result.value = res.optimized
    explanation.value = res.explanation
  } catch (e) {
    result.value = '优化失败，请确认后端服务已启动。'
  } finally {
    loading.value = false
  }
}

const runGenerateSummary = async () => {
  loading.value = true
  selectedField.value = 'summary'
  resetResult()
  try {
    const summary = await generateSummary(props.resumeData.personalInfo, props.resumeData.experience)
    result.value = summary || '生成失败，请确认后端服务已启动。'
  } catch (e) {
    result.value = '生成失败，请确认后端服务已启动。'
  } finally {
    loading.value = false
  }
}

const applyOptimized = () => {
  if (!result.value) return
  if (selectedField.value === 'summary') {
    emit('applyOptimized', 'personalInfo.summary', result.value)
  } else if (selectedField.value === 'title') {
    emit('applyOptimized', 'personalInfo.title', result.value)
  } else if (selectedField.value.startsWith('exp_')) {
    const index = Number(selectedField.value.split('_')[1])
    emit('applyOptimized', `experience.${index}.description`, result.value)
  } else if (selectedField.value.startsWith('proj_')) {
    const index = Number(selectedField.value.split('_')[1])
    emit('applyOptimized', `projects.${index}.description`, result.value)
  }
}

const runTargetAnalyze = async () => {
  if (!targetInput.value.trim()) {
    alert(`请先粘贴${props.useCase.targetLabel}。`)
    return
  }

  loading.value = true
  result.value = ''
  try {
    const res = await analyzeJD(targetInput.value)
    result.value = res || '分析失败，请确认后端服务已启动。'
  } catch (e) {
    result.value = '分析失败，请稍后重试。'
  } finally {
    loading.value = false
  }
}

const runTargetMatch = async () => {
  if (!targetInput.value.trim()) {
    alert(`请先粘贴${props.useCase.targetLabel}。`)
    return
  }

  loading.value = true
  result.value = ''
  try {
    const res = await matchResume(props.resumeData, targetInput.value)
    result.value = res || '匹配失败，请确认后端服务已启动。'
  } catch (e) {
    result.value = '匹配失败，请稍后重试。'
  } finally {
    loading.value = false
  }
}

const runCareer = async () => {
  loading.value = true
  careerResult.value = ''
  try {
    const res = await getCareerAdvice(props.resumeData)
    careerResult.value = res || '获取建议失败，请确认后端服务已启动。'
  } catch (e) {
    careerResult.value = '获取建议失败，请稍后重试。'
  } finally {
    loading.value = false
  }
}

const runScore = () => {
  const score = calculateResumeScore(props.resumeData)
  const firstEducation = props.resumeData.education[0]

  if (props.useCase.value === 'job') {
    if (props.resumeData.skills.length < 4) score.suggestions.push('求职简历建议补充 4 个以上岗位相关技能。')
    if (props.resumeData.experience.length === 0) score.suggestions.push('求职简历需要突出实习、工作或校园实践经历。')
  } else {
    if (!firstEducation?.gpa) score.suggestions.push('学术申请建议补充绩点。')
    if (!firstEducation?.rank) score.suggestions.push('学术申请建议补充专业排名。')
    if (!firstEducation?.englishLevel) score.suggestions.push('学术申请建议补充英语水平。')
    if (!firstEducation?.coreCourses?.length) score.suggestions.push('学术申请建议补充重要专业课程成绩。')
    if (props.resumeData.projects.length === 0) score.suggestions.push('学术申请需要突出科研项目、论文或课程项目。')
  }

  scoreResult.value = score
}
</script>

<template>
  <aside class="ai-panel">
    <div class="ai-header">
      <span>AI 助手</span>
      <strong>{{ useCase.label }}</strong>
    </div>

    <div class="ai-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        :class="['ai-tab', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <div v-if="activeTab === 'optimize'" class="ai-content">
      <label class="form-group">
        <span>优化位置</span>
        <select v-model="selectedField">
          <option v-for="field in optimizeFields" :key="field.key" :value="field.key">{{ field.label }}</option>
        </select>
      </label>

      <div class="btn-row">
        <button class="ai-btn primary" type="button" :disabled="loading" @click="runOptimize">
          {{ loading ? '优化中' : '优化文本' }}
        </button>
        <button class="ai-btn secondary" type="button" :disabled="loading" @click="runGenerateSummary">
          生成简介
        </button>
      </div>

      <div v-if="result" class="result-box">
        <div class="result-label">结果</div>
        <div class="result-content">{{ result }}</div>
        <button class="apply-btn" type="button" @click="applyOptimized">应用到材料</button>
      </div>

      <div v-if="explanation" class="note-box">{{ explanation }}</div>
    </div>

    <div v-if="activeTab === 'target'" class="ai-content">
      <label class="form-group">
        <span>{{ useCase.targetLabel }}</span>
        <textarea v-model="targetInput" rows="8" placeholder="粘贴目标岗位、院校项目、导师方向或申请要求" />
      </label>

      <div class="btn-row">
        <button class="ai-btn primary" type="button" :disabled="loading" @click="runTargetAnalyze">
          {{ loading ? '分析中' : '分析目标' }}
        </button>
        <button class="ai-btn secondary" type="button" :disabled="loading" @click="runTargetMatch">
          匹配材料
        </button>
      </div>

      <div v-if="result" class="result-box">
        <pre class="result-pre">{{ result }}</pre>
      </div>
    </div>

    <div v-if="activeTab === 'career'" class="ai-content">
      <button class="ai-btn primary wide" type="button" :disabled="loading" @click="runCareer">
        {{ loading ? '分析中' : '生成发展建议' }}
      </button>
      <div v-if="careerResult" class="result-box">
        <pre class="result-pre">{{ careerResult }}</pre>
      </div>
    </div>

    <div v-if="activeTab === 'score'" class="ai-content">
      <button class="ai-btn primary wide" type="button" @click="runScore">开始评分</button>
      <div v-if="scoreResult" class="score-box">
        <div class="score-number">
          <span>{{ scoreResult.score }}</span>
          <small>/100</small>
        </div>
        <div class="score-level" :class="'level-' + scoreResult.level">{{ scoreResult.level }}</div>
        <div v-if="scoreResult.suggestions.length > 0" class="suggestions">
          <strong>改进建议</strong>
          <ul>
            <li v-for="(suggestion, index) in scoreResult.suggestions" :key="index">{{ suggestion }}</li>
          </ul>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.ai-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  background: var(--page-surface);
  border-left: 1px solid var(--page-border);
}

.ai-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 52px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--page-border);
  color: var(--page-text);
}

.ai-header span {
  color: var(--page-muted);
  font-size: 12px;
  font-weight: 900;
}

.ai-header strong {
  color: var(--page-primary);
  font-size: 15px;
}

.ai-tabs {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  padding: 12px;
  background: var(--page-surface-alt);
  border-bottom: 1px solid var(--page-border);
}

.ai-tab {
  min-height: 34px;
  border: 1px solid var(--page-border);
  border-radius: 8px;
  background: var(--page-surface);
  color: var(--page-text);
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
}

.ai-tab:hover {
  background: var(--page-primary-soft);
}

.ai-tab.active {
  border-color: var(--page-primary);
  background: var(--page-primary);
  color: #ffffff;
}

.ai-content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 14px;
  color: var(--page-text);
  font-size: 13px;
  font-weight: 800;
}

.form-group select,
.form-group textarea {
  width: 100%;
  border: 1px solid var(--page-border);
  border-radius: 8px;
  color: var(--page-text);
  background: var(--page-surface);
  font: inherit;
  font-weight: 500;
  padding: 10px;
  outline: none;
}

.form-group textarea {
  resize: vertical;
  line-height: 1.55;
}

.form-group select:focus,
.form-group textarea:focus {
  border-color: var(--page-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--page-primary) 18%, transparent);
}

.btn-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.ai-btn {
  min-height: 38px;
  border: 0;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;
}

.ai-btn.primary {
  background: var(--page-primary);
  color: #ffffff;
}

.ai-btn.secondary {
  background: var(--page-accent);
  color: #ffffff;
}

.ai-btn.wide {
  width: 100%;
}

.ai-btn:hover:not(:disabled) {
  filter: brightness(0.96);
}

.ai-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.result-box,
.note-box,
.score-box {
  margin-top: 14px;
  border: 1px solid var(--page-border);
  border-radius: 8px;
  background: var(--page-panel);
}

.result-box {
  padding: 12px;
}

.result-label {
  margin-bottom: 8px;
  color: var(--page-text);
  font-size: 13px;
  font-weight: 900;
}

.result-content,
.result-pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  color: var(--page-text);
  font-size: 13px;
  line-height: 1.65;
}

.note-box {
  padding: 11px 12px;
  color: #7c2d12;
  background: #fff7ed;
  border-color: #fed7aa;
  font-size: 13px;
  line-height: 1.55;
}

.apply-btn {
  width: 100%;
  min-height: 34px;
  margin-top: 12px;
  border: 0;
  border-radius: 8px;
  background: var(--page-header);
  color: #ffffff;
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;
}

.score-box {
  padding: 16px;
  text-align: center;
}

.score-number {
  display: inline-flex;
  align-items: flex-end;
  gap: 4px;
}

.score-number span {
  color: var(--page-primary);
  font-size: 58px;
  line-height: 0.95;
  font-weight: 900;
}

.score-number small {
  margin-bottom: 8px;
  color: var(--page-muted);
  font-size: 18px;
  font-weight: 800;
}

.score-level {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  margin-top: 12px;
  padding: 0 12px;
  border-radius: 8px;
  color: #ffffff;
  font-size: 13px;
  font-weight: 900;
}

.score-level.level-优秀 {
  background: var(--page-primary);
}

.score-level.level-良好 {
  background: #2563eb;
}

.score-level.level-一般 {
  background: #b45309;
}

.score-level.level-待完善 {
  background: #be123c;
}

.suggestions {
  margin-top: 16px;
  text-align: left;
}

.suggestions strong {
  color: var(--page-text);
  font-size: 13px;
}

.suggestions ul {
  margin: 8px 0 0;
  padding-left: 18px;
}

.suggestions li {
  color: var(--page-muted);
  font-size: 13px;
  line-height: 1.55;
  margin-bottom: 6px;
}
</style>
