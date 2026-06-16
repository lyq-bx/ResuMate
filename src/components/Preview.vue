<script setup lang="ts">
import { computed } from 'vue'
import type { ResumeData, ResumeTemplateType, ThemeConfig, UseCaseConfig } from '../types/resume'
import TemplateBlueGold from './templates/TemplateBlueGold.vue'
import TemplateModern from './templates/TemplateModern.vue'
import TemplateSidebar from './templates/TemplateSidebar.vue'
import TemplateTeamBlueGray from './templates/TemplateTeamBlueGray.vue'
import TemplateTeamClassic from './templates/TemplateTeamClassic.vue'
import TemplateTeamMinimal from './templates/TemplateTeamMinimal.vue'
import TemplateTeamModern from './templates/TemplateTeamModern.vue'
import TemplateTeamProfessional from './templates/TemplateTeamProfessional.vue'
import TemplateTeamTimeline from './templates/TemplateTeamTimeline.vue'

const props = defineProps<{
  resumeData: ResumeData
  theme: ThemeConfig
  useCase: UseCaseConfig
  template: ResumeTemplateType
}>()

const emit = defineEmits<{
  updateTemplate: [template: ResumeTemplateType]
}>()

const templates: { value: ResumeTemplateType; label: string }[] = [
  { value: 'modern', label: '现代通用' },
  { value: 'blue-gold', label: '蓝金正式' },
  { value: 'sidebar', label: '深色侧栏' },
  { value: 'team-blue-gray', label: '蓝灰' },
  { value: 'team-classic', label: '经典' },
  { value: 'team-modern', label: '现代' },
  { value: 'team-minimal', label: '极简' },
  { value: 'team-timeline', label: '时间线' },
  { value: 'team-professional', label: '专业' }
]

const compatibleResumeData = computed<ResumeData>(() => ({
  ...props.resumeData,
  personalInfo: {
    ...props.resumeData.personalInfo,
    address: props.resumeData.personalInfo.address || props.resumeData.personalInfo.location,
    birthDate: props.resumeData.personalInfo.birthDate || (props.resumeData.personalInfo.age ? `${props.resumeData.personalInfo.age} 岁` : ''),
    politicalStatus: props.resumeData.personalInfo.politicalStatus || ''
  },
  projects: props.resumeData.projects.map((project) => ({
    ...project,
    date: project.date || [project.startDate, project.endDate].filter(Boolean).join(' - '),
    tags: project.tags?.length ? project.tags : project.technologies
  }))
}))

const compatibleTheme = computed<ThemeConfig>(() => ({
  ...props.theme,
  accentColor: props.theme.accentColor || '#f3f4f6'
}))

const currentTemplate = computed(() => {
  if (props.template === 'blue-gold') return TemplateBlueGold
  if (props.template === 'sidebar') return TemplateSidebar
  if (props.template === 'team-blue-gray') return TemplateTeamBlueGray
  if (props.template === 'team-classic') return TemplateTeamClassic
  if (props.template === 'team-modern') return TemplateTeamModern
  if (props.template === 'team-minimal') return TemplateTeamMinimal
  if (props.template === 'team-timeline') return TemplateTeamTimeline
  if (props.template === 'team-professional') return TemplateTeamProfessional
  return TemplateModern
})
</script>

<template>
  <div class="preview-container">
    <div class="preview-topbar">
      <div class="preview-heading">
        <span class="preview-kicker">实时预览</span>
        <strong>{{ useCase.previewTitle }}</strong>
        <div class="preview-focus">
          <span v-for="tag in useCase.focusTags" :key="tag">{{ tag }}</span>
        </div>
      </div>

      <div class="preview-actions">
        <label class="template-selector">
          <span>模板</span>
          <select
            :value="template"
            @change="emit('updateTemplate', ($event.target as HTMLSelectElement).value as ResumeTemplateType)"
          >
            <option v-for="item in templates" :key="item.value" :value="item.value">
              {{ item.label }}
            </option>
          </select>
        </label>
        <span class="paper-size">A4</span>
      </div>
    </div>

    <div class="paper-stage">
      <component :is="currentTemplate" :resumeData="compatibleResumeData" :theme="compatibleTheme" :useCase="useCase" />
    </div>
  </div>
</template>

<style scoped>
.preview-container {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  height: 100%;
  background: var(--page-preview-bg);
}

.preview-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 58px;
  padding: 10px 18px;
  border-bottom: 1px solid var(--page-border);
  background: var(--page-surface-alt);
  color: var(--page-text);
}

.preview-heading {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.preview-focus {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
}

.preview-focus span {
  display: inline-flex;
  align-items: center;
  min-height: 22px;
  padding: 0 7px;
  border-radius: 6px;
  background: var(--page-primary-soft);
  color: var(--page-primary);
  font-size: 11px;
  font-weight: 900;
}

.preview-kicker,
.template-selector span {
  color: var(--page-muted);
  font-size: 12px;
  font-weight: 800;
}

.preview-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.template-selector {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.template-selector select {
  height: 34px;
  min-width: 118px;
  border: 1px solid var(--page-border);
  border-radius: 8px;
  background: #ffffff;
  color: var(--page-text);
  padding: 0 9px;
  font-size: 13px;
  font-weight: 700;
  outline: none;
}

.paper-size {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 30px;
  border-radius: 8px;
  background: var(--page-header);
  color: #ffffff;
  font-size: 12px;
  font-weight: 900;
}

.paper-stage {
  min-width: 0;
  min-height: 0;
  flex: 1;
  overflow: auto;
  padding: 28px;
}

@media (max-width: 760px) {
  .preview-topbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .preview-actions {
    width: 100%;
    justify-content: space-between;
  }

  .paper-stage {
    padding: 16px;
  }
}
</style>
