<script setup lang="ts">
import { ref } from 'vue'
import type { ThemeType, UseCaseConfig } from '../types/resume'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const props = defineProps<{
  currentTheme: ThemeType
  useCase: UseCaseConfig
}>()

const emit = defineEmits<{
  updateTheme: [theme: ThemeType]
  backToEntry: []
}>()

const themes: { value: ThemeType; label: string }[] = [
  { value: 'blue', label: '学术蓝' },
  { value: 'green', label: '研究绿' },
  { value: 'purple', label: '论文紫' }
]

const isExporting = ref(false)

const exportPDF = async () => {
  isExporting.value = true
  try {
    const resumeElement = document.querySelector<HTMLElement>('.resume-preview')
    if (!resumeElement) return

    const canvas = await html2canvas(resumeElement, {
      scale: 2,
      useCORS: true,
      logging: false
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height]
    })
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
    pdf.save(`${props.useCase.title}.pdf`)
  } catch (error) {
    console.error('Export PDF failed:', error)
    alert('导出 PDF 失败，请稍后重试。')
  } finally {
    isExporting.value = false
  }
}
</script>

<template>
  <header class="toolbar">
    <div class="brand-block">
      <button class="entry-btn" type="button" @click="emit('backToEntry')">总入口</button>
      <div>
        <h1 class="logo">AI 简历与申请材料工作台</h1>
        <p class="subtitle">{{ useCase.title }} · {{ useCase.editorHint }}</p>
      </div>
    </div>

    <div class="toolbar-actions">
      <div class="mode-chip" :style="{ borderColor: useCase.accent, color: useCase.accent }">
        {{ useCase.previewTitle }}
      </div>

      <label class="theme-selector">
        <span>页面主题</span>
        <select
          :value="currentTheme"
          @change="emit('updateTheme', ($event.target as HTMLSelectElement).value as ThemeType)"
        >
          <option v-for="theme in themes" :key="theme.value" :value="theme.value">
            {{ theme.label }}
          </option>
        </select>
      </label>

      <button class="export-btn" type="button" :disabled="isExporting" @click="exportPDF">
        {{ isExporting ? '导出中' : '导出 PDF' }}
      </button>
    </div>
  </header>
</template>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  min-height: 72px;
  padding: 12px 22px;
  background: var(--page-header);
  color: var(--page-header-text);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.brand-block {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.entry-btn {
  height: 36px;
  padding: 0 14px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.08);
  color: var(--page-header-text);
  font-weight: 700;
  cursor: pointer;
}

.entry-btn:hover {
  background: rgba(255, 255, 255, 0.14);
}

.logo {
  margin: 0;
  font-size: 18px;
  line-height: 1.2;
  font-weight: 800;
}

.subtitle {
  margin: 4px 0 0;
  color: var(--page-header-muted);
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.mode-chip {
  height: 34px;
  display: inline-flex;
  align-items: center;
  padding: 0 12px;
  border: 1px solid;
  border-radius: 8px;
  background: var(--page-surface);
  font-size: 13px;
  font-weight: 800;
}

.theme-selector {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--page-header-muted);
  font-size: 13px;
  font-weight: 700;
}

.theme-selector select {
  height: 34px;
  min-width: 92px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: var(--page-header-alt);
  color: var(--page-header-text);
  padding: 0 10px;
  font-size: 13px;
  cursor: pointer;
}

.export-btn {
  height: 36px;
  padding: 0 16px;
  border: 0;
  border-radius: 8px;
  background: var(--page-accent);
  color: #ffffff;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
}

.export-btn:hover:not(:disabled) {
  background: var(--page-accent-hover);
}

.export-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

@media (max-width: 900px) {
  .toolbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .brand-block {
    width: 100%;
    align-items: flex-start;
  }

  .brand-block > div {
    min-width: 0;
  }

  .toolbar-actions {
    width: 100%;
    flex-wrap: wrap;
  }

  .subtitle {
    white-space: normal;
    overflow: visible;
    text-overflow: clip;
  }
}

@media (max-width: 520px) {
  .toolbar {
    padding: 14px;
  }

  .brand-block {
    flex-direction: column;
    gap: 10px;
  }

  .logo {
    font-size: 17px;
  }

  .subtitle {
    max-width: 100%;
  }

  .toolbar-actions {
    gap: 10px;
  }

  .mode-chip,
  .theme-selector select,
  .export-btn {
    height: 42px;
  }
}
</style>
