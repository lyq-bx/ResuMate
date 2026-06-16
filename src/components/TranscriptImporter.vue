<script setup lang="ts">
import { computed, ref } from 'vue'
import type { CourseScore } from '../types/resume'
import { parseTranscriptFile } from '../services/api'

type CourseCandidate = CourseScore & { selected: boolean }

const emit = defineEmits<{
  addCourses: [courses: CourseScore[]]
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const busy = ref(false)
const status = ref('')
const rawText = ref('')
const candidates = ref<CourseCandidate[]>([])

const selectedCount = computed(() => candidates.value.filter((course) => course.selected).length)
const recommendedCount = computed(() => Math.min(candidates.value.length, 6))

const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`

const ensureUint8ArrayToHex = () => {
  const prototype = Uint8Array.prototype as Uint8Array & { toHex?: () => string }
  if (typeof prototype.toHex === 'function') return

  Object.defineProperty(prototype, 'toHex', {
    value(this: Uint8Array) {
      return Array.from(this as Uint8Array, (byte) => byte.toString(16).padStart(2, '0')).join('')
    },
    configurable: true,
    writable: true
  })
}

const openPicker = () => {
  fileInput.value?.click()
}

const recognizeImage = async (source: File | HTMLCanvasElement) => {
  const { createWorker } = await import('tesseract.js')
  const worker = await createWorker('chi_sim+eng')
  const result = await worker.recognize(source)
  await worker.terminate()
  return result.data.text || ''
}

const extractPdfText = async (file: File) => {
  ensureUint8ArrayToHex()
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs')
  const workerSrc = await import('pdfjs-dist/legacy/build/pdf.worker.mjs?url')
  ;(pdfjsLib as any).GlobalWorkerOptions.workerSrc = workerSrc.default

  const pdf = await (pdfjsLib as any).getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise
  const pagesToRead = pdf.numPages
  let text = ''

  for (let pageNumber = 1; pageNumber <= pagesToRead; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber)
    const content = await page.getTextContent()
    text += `${content.items.map((item: any) => item.str).join(' ')}\n`
  }

  if (text.trim().length > 80) return text

  status.value = 'PDF 文本较少，正在识别扫描页...'
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber)
    const viewport = page.getViewport({ scale: 1.6 })
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    if (!context) continue

    canvas.width = viewport.width
    canvas.height = viewport.height
    await page.render({ canvasContext: context, viewport }).promise
    text += `\n${await recognizeImage(canvas)}`
  }

  return text
}

const extractDocxText = async (file: File) => {
  const mammoth = (await import('mammoth')) as any
  const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() })
  return result.value || ''
}

const extractTextFromFile = async (file: File) => {
  const name = file.name.toLowerCase()
  if (file.type.startsWith('image/')) return recognizeImage(file)
  if (name.endsWith('.pdf')) return extractPdfText(file)
  if (name.endsWith('.docx')) return extractDocxText(file)
  if (name.endsWith('.doc')) throw new Error('暂不支持旧版 .doc，请先另存为 .docx。')
  throw new Error('仅支持 PDF、docx 和常见图片格式。')
}

const scoreRank = (score: string) => {
  const gradeScores: Record<string, number> = {
    优秀: 95,
    良好: 85,
    中等: 75,
    及格: 65,
    合格: 60,
    通过: 60
  }
  if (gradeScores[score] !== undefined) return gradeScores[score]
  const value = Number(score)
  return Number.isFinite(value) ? value : 0
}

const creditRank = (credit?: string) => {
  const value = Number(credit || 0)
  return Number.isFinite(value) ? value : 0
}

const sortCourses = (courses: CourseScore[]) => {
  return [...courses].sort((a, b) => {
    const byScore = scoreRank(b.score) - scoreRank(a.score)
    if (byScore !== 0) return byScore
    const byCredit = creditRank(b.credit) - creditRank(a.credit)
    if (byCredit !== 0) return byCredit
    return a.name.localeCompare(b.name, 'zh-Hans-CN')
  })
}

const setCourseCandidates = (courses: CourseScore[]) => {
  candidates.value = sortCourses(courses).map((course, index) => ({
    ...course,
    id: course.id || makeId(),
    selected: index < 6
  }))
}

const parseWithLocalFallback = async (file: File) => {
  const text = await extractTextFromFile(file)
  rawText.value = text.trim()
  const parsed = parseCourseScores(text)
  setCourseCandidates(parsed)
  status.value = parsed.length > 0 ? `本地兜底识别到 ${parsed.length} 门候选课程，已默认选中前 ${Math.min(parsed.length, 6)} 门。` : '没有识别到课程成绩，可换一份清晰文件再试。'
}

const parseCourseScores = (text: string): CourseScore[] => {
  const gradeWords = ['优秀', '良好', '中等', '及格', '合格']
  const lines = text
    .replace(/\r/g, '\n')
    .replace(/[|｜]/g, ' ')
    .split(/\n|；|;/)
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean)

  const results: CourseScore[] = []
  const seen = new Set<string>()

  for (const line of lines) {
    if (/姓名|学号|学院|学期|平均|绩点|排名|课程名称\s*成绩/.test(line)) continue

    const matches = [...line.matchAll(/(?:^|[^\d])((?:100|[1-9]?\d)(?:\.\d)?|优秀|良好|中等|及格|合格)(?=$|[^\d])/g)]
      .map((match) => ({
        value: match[1],
        index: (match.index || 0) + match[0].indexOf(match[1])
      }))
      .filter((match) => {
        if (gradeWords.includes(match.value)) return true
        const numeric = Number(match.value)
        return Number.isFinite(numeric) && numeric >= 50 && numeric <= 100
      })

    const score = matches[matches.length - 1]
    if (!score) continue

    const beforeScore = line.slice(0, score.index)
    const creditMatches = [...beforeScore.matchAll(/(?:^|[^\d])([1-6](?:\.\d)?)(?=$|[^\d])/g)]
    const credit = creditMatches.length > 0 ? creditMatches[creditMatches.length - 1][1] : ''
    const name = beforeScore
      .replace(/^\d+\s*/, '')
      .replace(/课程名称|课程|成绩|学分|绩点|必修|选修|考查|考试|专业课|公共课/g, ' ')
      .replace(/\b[A-Z]{1,4}\d{2,}\b/gi, ' ')
      .replace(/[0-9.]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    if (name.length < 2 || name.length > 32) continue
    if (!/[\u4e00-\u9fa5A-Za-z]/.test(name)) continue

    const key = `${name}-${score.value}`
    if (seen.has(key)) continue
    seen.add(key)

    results.push({
      id: makeId(),
      name,
      score: score.value,
      credit
    })
  }

  return results.slice(0, 40)
}

const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  busy.value = true
  status.value = '正在读取成绩文件...'
  rawText.value = ''
  candidates.value = []

  try {
    status.value = '正在调用阿里云表格识别...'
    const cloudResult = await parseTranscriptFile(file)
    rawText.value = cloudResult.rawText?.trim() || ''

    if (cloudResult.success && cloudResult.courses.length > 0) {
      setCourseCandidates(cloudResult.courses)
      status.value = `${cloudResult.message} 已默认选中前 ${Math.min(cloudResult.courses.length, 6)} 门，可自行调整。`
    } else {
      status.value = `${cloudResult.message || '阿里云未识别到课程成绩'}，正在尝试本地兜底...`
      await parseWithLocalFallback(file)
    }
  } catch (error) {
    const cloudMessage = error instanceof Error ? error.message : '云端识别失败'
    try {
      status.value = `${cloudMessage}，正在尝试本地兜底...`
      await parseWithLocalFallback(file)
    } catch (fallbackError) {
      const fallbackMessage = fallbackError instanceof Error ? fallbackError.message : '本地兜底失败'
      status.value = `${cloudMessage}；${fallbackMessage}`
    }
  } finally {
    busy.value = false
    input.value = ''
  }
}

const addSelectedCourses = () => {
  const selected = candidates.value
    .filter((course) => course.selected)
    .map(({ selected: _selected, ...course }) => course)

  emit('addCourses', selected)
  status.value = `已添加 ${selected.length} 门课程。`
  candidates.value = []
}

const selectRecommended = () => {
  candidates.value = candidates.value.map((course, index) => ({
    ...course,
    selected: index < 6
  }))
}

const selectAll = () => {
  candidates.value = candidates.value.map((course) => ({
    ...course,
    selected: true
  }))
}

const clearSelection = () => {
  candidates.value = candidates.value.map((course) => ({
    ...course,
    selected: false
  }))
}
</script>

<template>
  <div class="transcript-importer">
    <div class="importer-header">
      <div>
        <strong>成绩单导入</strong>
        <span>PDF / docx / 图片</span>
      </div>
      <button class="upload-btn" type="button" :disabled="busy" @click="openPicker">
        {{ busy ? '识别中' : '选择文件' }}
      </button>
      <input
        ref="fileInput"
        class="hidden-input"
        type="file"
        accept=".pdf,.doc,.docx,image/png,image/jpeg,image/webp"
        @change="handleFileChange"
      />
    </div>

    <p v-if="status" class="status-text">{{ status }}</p>

    <div v-if="candidates.length > 0" class="candidate-box">
      <div class="candidate-tools">
        <span>按成绩优先、同分按学分排序，建议放 {{ recommendedCount }} 门</span>
        <div>
          <button type="button" @click="selectRecommended">推荐 6 门</button>
          <button type="button" @click="selectAll">全选</button>
          <button type="button" @click="clearSelection">清空</button>
        </div>
      </div>
      <div class="candidate-head">
        <span></span>
        <span>课程</span>
        <span>成绩</span>
        <span>学分</span>
      </div>
      <label v-for="course in candidates" :key="course.id" class="candidate-row">
        <input v-model="course.selected" type="checkbox" />
        <span class="course-name">{{ course.name }}</span>
        <span class="course-score">{{ course.score }}</span>
        <span class="course-credit">{{ course.credit || '-' }}</span>
      </label>
      <button class="add-selected-btn" type="button" :disabled="selectedCount === 0" @click="addSelectedCourses">
        添加选中课程 {{ selectedCount }}
      </button>
    </div>

    <details v-if="rawText" class="raw-text">
      <summary>识别文本</summary>
      <pre>{{ rawText }}</pre>
    </details>
  </div>
</template>

<style scoped>
.transcript-importer {
  border: 1px dashed #94a3b8;
  border-radius: 8px;
  background: #ffffff;
  padding: 12px;
}

.importer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.importer-header div {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.importer-header strong {
  color: #102a43;
  font-size: 14px;
}

.importer-header span,
.status-text {
  color: #627d98;
  font-size: 12px;
}

.upload-btn,
.add-selected-btn {
  border: 0;
  border-radius: 8px;
  background: #0f766e;
  color: #ffffff;
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;
}

.upload-btn {
  min-height: 34px;
  padding: 0 12px;
  flex-shrink: 0;
}

.upload-btn:disabled,
.add-selected-btn:disabled {
  opacity: 0.62;
  cursor: not-allowed;
}

.hidden-input {
  display: none;
}

.status-text {
  margin: 10px 0 0;
  line-height: 1.5;
}

.candidate-box {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-top: 12px;
}

.candidate-tools {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  color: #52616b;
  font-size: 12px;
  line-height: 1.5;
}

.candidate-tools div {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.candidate-tools button {
  min-height: 28px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #ffffff;
  color: #334e68;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
}

.candidate-tools button:hover {
  border-color: #0f766e;
  color: #0f766e;
}

.candidate-head,
.candidate-row {
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr) 58px 48px;
  gap: 8px;
  align-items: center;
}

.candidate-head {
  min-height: 24px;
  padding: 0 8px;
  color: #627d98;
  font-size: 11px;
  font-weight: 900;
}

.candidate-row {
  min-height: 34px;
  padding: 6px 8px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #334e68;
  font-size: 13px;
}

.course-name {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.course-score,
.course-credit {
  font-weight: 900;
  text-align: right;
}

.add-selected-btn {
  min-height: 36px;
}

.raw-text {
  margin-top: 12px;
  color: #334e68;
  font-size: 12px;
}

.raw-text summary {
  cursor: pointer;
  font-weight: 800;
}

.raw-text pre {
  max-height: 180px;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-word;
  padding: 10px;
  border-radius: 8px;
  background: #f8fafc;
}

@media (max-width: 620px) {
  .candidate-tools {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
