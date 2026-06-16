# AI Resume Generator

一个 Vue 3 + Vite 的简历生成与优化工具，配套 FastAPI 后端提供 AI 优化、JD 分析、职业建议和成绩单解析能力。

## 功能

- 简历信息编辑、实时预览和本地保存
- 多套简历模板切换，包含新增的蓝灰、经典、现代、极简、时间线、专业样式
- PDF 导出
- AI 内容优化、JD 匹配分析、职业规划建议
- 成绩单文件解析与课程信息导入

## 技术栈

- 前端：Vue 3、TypeScript、Vite
- 导出：html2canvas、jsPDF
- 文件解析：mammoth、pdfjs-dist、tesseract.js
- 后端：FastAPI、Python

## 快速开始

安装前端依赖：

```bash
npm install
```

启动前端：

```bash
npm run dev
```

构建前端：

```bash
npm run build
```

启动后端：

```bash
cd ai-resume-backend
pip install -r requirements.txt
copy .env.example .env
python main.py
```

前端默认请求 `http://127.0.0.1:8001`。如需修改后端地址，可在前端环境变量中设置 `VITE_API_BASE`。

## 目录

```text
.
├── ai-resume-backend/     # FastAPI 后端
├── src/                   # Vue 前端源码
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```
