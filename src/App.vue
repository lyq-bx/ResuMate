<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { EditorTabId, PageThemeConfig, ResumeData, ResumeTemplateType, ThemeConfig, ThemeType, UseCaseType } from './types/resume'
import { defaultResumeData, pageThemes, themes, useCases } from './data/mockData'
import AIPanel from './components/AIPanel.vue'
import Editor from './components/Editor.vue'
import Preview from './components/Preview.vue'
import Toolbar from './components/Toolbar.vue'

const resumeData = ref<ResumeData>(JSON.parse(JSON.stringify(defaultResumeData)))
const currentTheme = ref<ThemeType>('green')
const currentUseCase = ref<UseCaseType>('job')
const currentTemplate = ref<ResumeTemplateType>('modern')
const activeTab = ref<EditorTabId>('personal')
const workspaceStarted = ref(false)
const editorWidth = ref(440)
const isResizing = ref(false)
const assistantOpen = ref(true)

const resumeThemeConfig = ref<ThemeConfig>(themes.modern)
const useCaseList = Object.values(useCases)
const resumeTemplates: ResumeTemplateType[] = [
  'modern',
  'blue-gold',
  'sidebar',
  'team-blue-gray',
  'team-classic',
  'team-modern',
  'team-minimal',
  'team-timeline',
  'team-professional'
]
const currentUseCaseConfig = computed(() => useCases[currentUseCase.value])
const pageTheme = computed(() => pageThemes[currentTheme.value])
const pageThemeVars = computed(() => {
  const theme: PageThemeConfig = pageTheme.value
  return {
    '--page-bg': theme.background,
    '--page-surface': theme.surface,
    '--page-surface-alt': theme.surfaceAlt,
    '--page-panel': theme.panel,
    '--page-border': theme.border,
    '--page-border-strong': theme.borderStrong,
    '--page-text': theme.text,
    '--page-muted': theme.muted,
    '--page-primary': theme.primary,
    '--page-primary-hover': theme.primaryHover,
    '--page-primary-soft': theme.primarySoft,
    '--page-primary-tint': theme.primaryTint,
    '--page-accent': theme.accent,
    '--page-accent-hover': theme.accentHover,
    '--page-header': theme.header,
    '--page-header-alt': theme.headerAlt,
    '--page-header-text': theme.headerText,
    '--page-header-muted': theme.headerMuted,
    '--page-preview-bg': theme.previewBg,
    '--page-shadow': theme.shadow
  }
})

const normalizeResume = (data: Partial<ResumeData>): ResumeData => {
  const defaults = JSON.parse(JSON.stringify(defaultResumeData)) as ResumeData
  const source = data || {}
  const educationSource = source.education?.length ? source.education : defaults.education

  return {
    personalInfo: {
      ...defaults.personalInfo,
      ...source.personalInfo,
      ethnicity: source.personalInfo?.ethnicity || defaults.personalInfo.ethnicity
    },
    education: educationSource.map((education, index) => ({
      ...defaults.education[0],
      ...education,
      id: education.id || `${index + 1}`,
      coreCourses: education.coreCourses || []
    })),
    experience: source.experience || defaults.experience,
    projects: source.projects || defaults.projects,
    skills: source.skills || defaults.skills,
    awards: source.awards || defaults.awards
  }
}

const persistResume = (data: ResumeData) => {
  localStorage.setItem('resume-data', JSON.stringify(data))
}

const updateTheme = (theme: ThemeType) => {
  currentTheme.value = theme
  localStorage.setItem('page-theme', theme)
}

const updateTemplate = (template: ResumeTemplateType) => {
  currentTemplate.value = template
  localStorage.setItem('resume-template', template)
}

const updateResumeData = (newData: ResumeData) => {
  resumeData.value = newData
  persistResume(newData)
}

const updateActiveTab = (tab: EditorTabId) => {
  activeTab.value = tab
  localStorage.setItem('resume-active-tab', tab)
}

const selectUseCase = (useCase: UseCaseType) => {
  currentUseCase.value = useCase
  activeTab.value = useCases[useCase].defaultTab
  assistantOpen.value = true
  workspaceStarted.value = true
  localStorage.setItem('resume-use-case', useCase)
  localStorage.setItem('resume-active-tab', activeTab.value)
  localStorage.setItem('workspace-started', 'true')
}

const backToEntry = () => {
  workspaceStarted.value = false
  localStorage.setItem('workspace-started', 'false')
}

const toggleAssistant = () => {
  assistantOpen.value = !assistantOpen.value
  localStorage.setItem('assistant-open', String(assistantOpen.value))
}

const applyOptimized = (field: string, value: string) => {
  const data = JSON.parse(JSON.stringify(resumeData.value)) as ResumeData
  const keys = field.split('.')

  if (keys[0] === 'personalInfo') {
    if (keys[1] === 'summary') data.personalInfo.summary = value
    if (keys[1] === 'title') data.personalInfo.title = value
  } else if (keys[0] === 'experience') {
    const index = Number(keys[1])
    if (data.experience[index]) data.experience[index].description = value
  } else if (keys[0] === 'projects') {
    const index = Number(keys[1])
    if (data.projects[index]) data.projects[index].description = value
  }

  updateResumeData(data)
}

const resizePreview = (event: PointerEvent) => {
  const shell = document.querySelector<HTMLElement>('.workspace-shell')
  if (!shell) return

  const rect = shell.getBoundingClientRect()
  const splitterWidth = 12
  const assistantWidth = assistantOpen.value ? 360 : 48
  const previewMinWidth = 520
  const minEditorWidth = 360
  const maxEditorWidth = Math.max(minEditorWidth, rect.width - assistantWidth - previewMinWidth - splitterWidth)
  const nextWidth = event.clientX - rect.left

  editorWidth.value = Math.min(Math.max(nextWidth, minEditorWidth), maxEditorWidth)
}

const stopResize = () => {
  isResizing.value = false
  document.body.classList.remove('resizing-preview')
  window.removeEventListener('pointermove', resizePreview)
  window.removeEventListener('pointerup', stopResize)
}

const startResize = (event: PointerEvent) => {
  event.preventDefault()
  isResizing.value = true
  document.body.classList.add('resizing-preview')
  window.addEventListener('pointermove', resizePreview)
  window.addEventListener('pointerup', stopResize)
}

onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  const modeParam = params.get('mode') as UseCaseType | null
  const tabParam = params.get('tab') as EditorTabId | null

  if (tabParam && ['personal', 'education', 'experience', 'projects', 'skills', 'awards'].includes(tabParam)) {
    activeTab.value = tabParam
  }

  if (modeParam && useCases[modeParam]) {
    currentUseCase.value = modeParam
    if (!tabParam) activeTab.value = useCases[modeParam].defaultTab
    workspaceStarted.value = true
    localStorage.setItem('resume-use-case', modeParam)
    localStorage.setItem('workspace-started', 'true')
  }

  const savedResume = localStorage.getItem('resume-data')
  if (savedResume) {
    try {
      resumeData.value = normalizeResume(JSON.parse(savedResume))
    } catch (e) {
      console.error('Failed to load saved resume data')
    }
  }

  const savedTheme = (localStorage.getItem('page-theme') || localStorage.getItem('resume-theme')) as ThemeType | null
  if (savedTheme && pageThemes[savedTheme]) {
    currentTheme.value = savedTheme
  }

  const savedTemplate = localStorage.getItem('resume-template') as ResumeTemplateType | null
  if (savedTemplate && resumeTemplates.includes(savedTemplate)) {
    currentTemplate.value = savedTemplate
  }

  const savedAssistantOpen = localStorage.getItem('assistant-open')
  if (savedAssistantOpen !== null) {
    assistantOpen.value = savedAssistantOpen === 'true'
  }

  if (!modeParam || !useCases[modeParam]) {
    const savedUseCase = localStorage.getItem('resume-use-case') as UseCaseType | null
    if (savedUseCase && useCases[savedUseCase]) {
      currentUseCase.value = savedUseCase
    }

    const savedActiveTab = localStorage.getItem('resume-active-tab') as EditorTabId | null
    if (savedActiveTab && useCases[currentUseCase.value].tabOrder.includes(savedActiveTab)) {
      activeTab.value = savedActiveTab
    } else {
      activeTab.value = useCases[currentUseCase.value].defaultTab
    }

    workspaceStarted.value = localStorage.getItem('workspace-started') === 'true'
  }
})

onBeforeUnmount(() => {
  stopResize()
})
</script>

<template>
  <div v-if="!workspaceStarted" class="entry-page" :style="pageThemeVars">
    <header class="entry-header">
      <div>
        <span class="eyebrow">总入口</span>
        <h1>选择这份材料的目标</h1>
      </div>
      <p>先确定场景，再进入编辑、预览和 AI 辅助工作台。</p>
    </header>

    <main class="entry-main">
      <section class="usecase-grid" aria-label="需求选择">
        <button
          v-for="item in useCaseList"
          :key="item.value"
          type="button"
          class="usecase-card"
          :style="{ '--case-accent': item.accent }"
          @click="selectUseCase(item.value)"
        >
          <span class="case-label">{{ item.label }}</span>
          <strong>{{ item.title }}</strong>
          <p>{{ item.description }}</p>
          <small>{{ item.editorHint }}</small>
        </button>
      </section>

      <aside class="entry-visual" aria-label="工作台预览">
        <div class="visual-toolbar">
          <span />
          <span />
          <span />
        </div>
        <div class="visual-body">
          <div class="visual-left">
            <i v-for="n in 6" :key="n" />
          </div>
          <div class="visual-paper">
            <b />
            <span />
            <span />
            <span class="short" />
            <em />
            <span />
            <span class="short" />
          </div>
          <div class="visual-ai">
            <strong>AI</strong>
            <span />
            <span />
            <button type="button">优化</button>
          </div>
        </div>
      </aside>
    </main>
  </div>

  <div v-else class="app-container" :style="pageThemeVars">
    <Toolbar
      :currentTheme="currentTheme"
      :useCase="currentUseCaseConfig"
      @updateTheme="updateTheme"
      @backToEntry="backToEntry"
    />

    <main
      class="workspace-shell"
      :class="{ resizing: isResizing, 'assistant-collapsed': !assistantOpen }"
      :style="{
        '--editor-width': `${editorWidth}px`,
        '--assistant-width': assistantOpen ? '360px' : '48px'
      }"
    >
      <section class="editor-pane" aria-label="编辑区">
        <Editor
          :resumeData="resumeData"
          :activeTab="activeTab"
          :useCase="currentUseCaseConfig"
          @update="updateResumeData"
          @changeTab="updateActiveTab"
        />
      </section>

      <button
        class="splitter"
        type="button"
        aria-label="调整编辑区和预览区宽度"
        title="调整宽度"
        @pointerdown="startResize"
      >
        <span />
      </button>

      <section class="preview-pane" aria-label="预览区">
        <Preview
          :resumeData="resumeData"
          :theme="resumeThemeConfig"
          :useCase="currentUseCaseConfig"
          :template="currentTemplate"
          @updateTemplate="updateTemplate"
        />
      </section>

      <section class="assistant-shell" :class="{ collapsed: !assistantOpen }" aria-label="AI 助手">
        <button
          class="assistant-toggle"
          type="button"
          :aria-expanded="assistantOpen"
          :title="assistantOpen ? '收起 AI 助手' : '展开 AI 助手'"
          @click="toggleAssistant"
        >
          <span>{{ assistantOpen ? '›' : '‹' }}</span>
        </button>
        <AIPanel
          v-show="assistantOpen"
          class="assistant-pane"
          :resumeData="resumeData"
          :useCase="currentUseCaseConfig"
          @applyOptimized="applyOptimized"
        />
      </section>
    </main>
  </div>
</template>

<style scoped>
.entry-page {
  min-height: 100vh;
  padding: 48px;
  background: var(--page-bg);
  color: var(--page-text);
  overflow-x: hidden;
}

.entry-header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 28px;
  max-width: 1180px;
  width: 100%;
  margin: 0 auto 32px;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 8px;
  background: var(--page-header);
  color: var(--page-header-text);
  font-size: 12px;
  font-weight: 900;
}

.entry-header h1 {
  margin: 14px 0 0;
  font-size: 42px;
  line-height: 1.08;
  letter-spacing: 0;
  overflow-wrap: anywhere;
}

.entry-header p {
  max-width: 420px;
  margin: 0;
  color: var(--page-muted);
  font-size: 15px;
  line-height: 1.7;
}

.entry-main {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 410px;
  gap: 28px;
  max-width: 1180px;
  width: 100%;
  margin: 0 auto;
  align-items: stretch;
}

.usecase-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  min-width: 0;
}

.usecase-card {
  width: 100%;
  min-width: 0;
  min-height: 208px;
  padding: 20px;
  border: 1px solid var(--page-border);
  border-radius: 8px;
  background: #ffffff;
  color: var(--page-text);
  text-align: left;
  cursor: pointer;
  box-shadow: 0 12px 28px var(--page-shadow);
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}

.usecase-card:hover {
  transform: translateY(-3px);
  border-color: var(--case-accent);
  box-shadow: 0 18px 36px var(--page-shadow);
}

.case-label {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  margin-bottom: 20px;
  padding: 0 10px;
  border: 1px solid var(--case-accent);
  border-radius: 8px;
  color: var(--case-accent);
  font-size: 13px;
  font-weight: 900;
}

.usecase-card strong {
  display: block;
  color: var(--page-text);
  font-size: 24px;
  line-height: 1.25;
}

.usecase-card p {
  margin: 10px 0 16px;
  color: var(--page-muted);
  font-size: 14px;
  line-height: 1.65;
}

.usecase-card small {
  display: block;
  color: var(--page-text);
  font-size: 13px;
  line-height: 1.55;
}

.entry-visual {
  min-width: 0;
  min-height: 432px;
  overflow: hidden;
  border: 1px solid var(--page-border);
  border-radius: 8px;
  background: var(--page-header);
  box-shadow: 0 18px 42px var(--page-shadow);
}

.visual-toolbar {
  display: flex;
  align-items: center;
  gap: 7px;
  height: 44px;
  padding: 0 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.visual-toolbar span {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: var(--page-accent);
}

.visual-toolbar span:nth-child(2) {
  background: var(--page-primary);
}

.visual-toolbar span:nth-child(3) {
  background: #be123c;
}

.visual-body {
  display: grid;
  grid-template-columns: 72px 1fr 104px;
  gap: 14px;
  height: calc(100% - 44px);
  padding: 18px;
}

.visual-left,
.visual-ai,
.visual-paper {
  border-radius: 8px;
}

.visual-left {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  background: var(--page-surface-alt);
}

.visual-left i {
  display: block;
  height: 24px;
  border-radius: 6px;
  background: var(--page-border);
}

.visual-left i:nth-child(2),
.visual-left i:nth-child(5) {
  background: var(--page-primary-soft);
}

.visual-paper {
  padding: 26px 22px;
  background: #ffffff;
}

.visual-paper b {
  display: block;
  width: 52%;
  height: 24px;
  margin-bottom: 18px;
  border-radius: 6px;
  background: var(--page-primary);
}

.visual-paper span,
.visual-paper em {
  display: block;
  height: 12px;
  margin-bottom: 12px;
  border-radius: 999px;
  background: var(--page-border);
}

.visual-paper em {
  width: 72%;
  margin: 20px 0 14px;
  background: var(--page-accent);
}

.visual-paper .short {
  width: 68%;
}

.visual-ai {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 14px;
  background: var(--page-surface-alt);
}

.visual-ai strong {
  color: var(--page-primary);
  font-size: 20px;
}

.visual-ai span {
  display: block;
  height: 10px;
  border-radius: 999px;
  background: var(--page-border);
}

.visual-ai button {
  height: 32px;
  border: 0;
  border-radius: 8px;
  background: var(--page-accent);
  color: #ffffff;
  font-weight: 900;
}

.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  min-height: 0;
  background: var(--page-bg);
}

.workspace-shell {
  display: grid;
  grid-template-columns: minmax(360px, var(--editor-width)) 12px minmax(520px, 1fr) var(--assistant-width);
  flex: 1;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
}

.editor-pane,
.preview-pane,
.assistant-shell {
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.assistant-shell {
  position: relative;
  border-left: 1px solid var(--page-border);
  background: #ffffff;
}

.assistant-shell.collapsed {
  background: var(--page-header);
}

.assistant-toggle {
  position: absolute;
  top: 10px;
  left: -16px;
  z-index: 3;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 34px;
  border: 1px solid var(--page-border);
  border-radius: 8px;
  background: #ffffff;
  color: var(--page-text);
  cursor: pointer;
  box-shadow: 0 10px 24px rgba(16, 42, 67, 0.16);
}

.assistant-shell.collapsed .assistant-toggle {
  left: 10px;
  border-color: rgba(255, 255, 255, 0.18);
  background: var(--page-header-alt);
  color: #ffffff;
  box-shadow: none;
}

.assistant-toggle span {
  font-size: 24px;
  line-height: 1;
  transform: translateY(-1px);
}

.splitter {
  position: relative;
  width: 12px;
  height: 100%;
  border: 0;
  border-left: 1px solid var(--page-border);
  border-right: 1px solid var(--page-border);
  background: var(--page-surface-alt);
  cursor: col-resize;
}

.splitter:hover,
.workspace-shell.resizing .splitter {
  background: var(--page-primary-soft);
}

.splitter span {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 3px;
  height: 54px;
  border-radius: 999px;
  background: #94a3b8;
  transform: translate(-50%, -50%);
}

.splitter:hover span,
.workspace-shell.resizing .splitter span {
  background: var(--page-primary);
}

@media (max-width: 1180px) {
  .entry-page {
    padding: 30px 20px;
  }

  .entry-header,
  .entry-main {
    grid-template-columns: 1fr;
  }

  .entry-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .workspace-shell {
    grid-template-columns: 1fr;
    overflow: auto;
  }

  .editor-pane,
  .preview-pane,
  .assistant-shell {
    min-height: 680px;
  }

  .assistant-shell.collapsed {
    min-height: 48px;
  }

  .splitter {
    display: none;
  }
}

@media (max-width: 720px) {
  .entry-header h1 {
    font-size: 34px;
  }

  .usecase-grid,
  .visual-body {
    grid-template-columns: 1fr;
  }

  .entry-visual {
    min-height: 560px;
  }
}
</style>
