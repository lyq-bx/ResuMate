import type { EditorTabId, PageThemeConfig, ResumeData, ThemeConfig, ThemeType, UseCaseConfig, UseCaseType } from '../types/resume'

const academicOrder: EditorTabId[] = ['personal', 'education', 'projects', 'awards', 'skills', 'experience']

export const useCases: Record<UseCaseType, UseCaseConfig> = {
  job: {
    value: 'job',
    label: '求职',
    title: '求职简历',
    description: '面向岗位投递、JD 匹配和经历量化表达。',
    accent: '#0f766e',
    editorHint: '优先写清岗位关键词、专业技能、实习实践、项目成果和可量化贡献。',
    previewTitle: '岗位投递版',
    targetLabel: '目标岗位 JD',
    focusTags: ['专业技能', '实践经历', '项目成果', '岗位匹配'],
    defaultTab: 'skills',
    tabOrder: ['personal', 'skills', 'experience', 'projects', 'education', 'awards'],
    sectionLabels: {
      skills: '专业技能',
      experience: '实习/工作经历',
      projects: '项目成果',
      education: '教育背景',
      awards: '证书奖项'
    },
    sectionHints: {
      personal: '一句话定位目标岗位，用 3-5 句话说明能力、经历和结果。',
      education: '求职版教育经历保持精炼，保留学校、专业、学历和与岗位相关课程。',
      experience: '按 STAR 写职责、行动、工具和结果，尽量加入百分比、规模、效率等数字。',
      projects: '突出项目目标、你的角色、技术栈、难点和业务/用户结果。',
      skills: '把技能按岗位关键词组织，优先放 JD 高频词和可验证工具。',
      awards: '保留含金量高、与岗位相关的奖项和证书。'
    }
  },
  postgraduate: {
    value: 'postgraduate',
    label: '考研',
    title: '考研复试材料',
    description: '面向复试、自我陈述和研究兴趣梳理。',
    accent: '#b45309',
    editorHint: '突出专业基础、核心课程成绩、英语水平、科研兴趣和复试表达。',
    previewTitle: '考研复试版',
    targetLabel: '目标院校/专业要求',
    focusTags: ['专业课程', '绩点排名', '英语水平', '科研潜力'],
    defaultTab: 'education',
    tabOrder: academicOrder,
    sectionLabels: {
      education: '学业基础',
      projects: '科研/课程项目',
      awards: '竞赛获奖',
      skills: '专业能力',
      experience: '校园实践'
    },
    sectionHints: {
      personal: '定位目标专业方向，简介里要说明专业兴趣、基础能力和读研动机。',
      education: '优先填写绩点、排名、英语和 6 门左右高分核心课程。',
      experience: '保留能体现组织能力、表达能力或专业相关的实践。',
      projects: '写课程论文、实验、科研训练和与报考方向相关的项目。',
      skills: '强调专业工具、实验方法、文献阅读和英语能力。',
      awards: '竞赛、奖学金和专业相关荣誉优先。'
    }
  },
  recommendation: {
    value: 'recommendation',
    label: '保研',
    title: '保研申请材料',
    description: '面向夏令营、预推免和导师联系材料。',
    accent: '#be123c',
    editorHint: '突出成绩排名、科研项目、竞赛获奖、英语水平和导师方向匹配度。',
    previewTitle: '保研申请版',
    targetLabel: '夏令营/导师要求',
    focusTags: ['绩点排名', '科研能力', '竞赛获奖', '导师匹配'],
    defaultTab: 'education',
    tabOrder: academicOrder,
    sectionLabels: {
      education: '学业排名',
      projects: '科研经历',
      awards: '竞赛荣誉',
      skills: '研究能力',
      experience: '学术实践'
    },
    sectionHints: {
      personal: '简介里直接呈现排名、研究方向、代表项目和申请目标。',
      education: '成绩排名、英语、核心课程成绩是保研首屏重点，课程建议精选 6 门。',
      experience: '保留助研、实验室、学术服务、学生工作中能证明可靠性的经历。',
      projects: '按研究问题、方法、贡献、产出写，优先放论文、专利、竞赛项目。',
      skills: '突出研究方法、数据分析、实验技能、论文阅读和写作能力。',
      awards: '奖学金、学科竞赛、科研竞赛和校级以上荣誉优先。'
    }
  },
  admission: {
    value: 'admission',
    label: '升学',
    title: '升学申请材料',
    description: '面向留学、交换、奖学金和综合申请场景。',
    accent: '#4338ca',
    editorHint: '突出学术经历、语言能力、项目作品、成长轨迹和申请项目契合度。',
    previewTitle: '升学申请版',
    targetLabel: '项目/学校申请要求',
    focusTags: ['学术经历', '核心课程', '语言能力', '项目作品'],
    defaultTab: 'education',
    tabOrder: ['personal', 'education', 'projects', 'skills', 'awards', 'experience'],
    sectionLabels: {
      education: 'Academic Background',
      projects: 'Projects & Research',
      skills: 'Languages & Skills',
      experience: 'Activities',
      awards: 'Honors'
    },
    sectionHints: {
      personal: '简介要说明申请方向、学术兴趣、语言能力和长期目标。',
      education: '保留 GPA、排名、语言成绩和与项目匹配的核心课程。',
      experience: '活动经历突出领导力、跨文化协作、公益或国际化经历。',
      projects: '写研究、作品集、课程项目和可展示产出。',
      skills: '语言成绩、研究工具、软件能力和写作展示要清晰。',
      awards: '奖学金、学术荣誉、竞赛和项目资助优先。'
    }
  }
}

export const defaultResumeData: ResumeData = {
  personalInfo: {
    name: '张三',
    title: '前端工程师 / 计算机方向申请者',
    email: 'zhangsan@example.com',
    phone: '138-0000-0000',
    location: '北京',
    nativePlace: '山东济南',
    ethnicity: '汉族',
    gender: '男',
    age: '23',
    avatar: '',
    summary:
      '具备扎实的计算机基础和完整项目交付经验，熟悉 Vue、React、TypeScript 与工程化实践。曾主导组件库与数据可视化项目，关注用户体验、性能优化和团队协作，能够将复杂问题拆解为可执行方案。'
  },
  education: [
    {
      id: '1',
      school: '北京大学',
      degree: '本科',
      major: '计算机科学与技术',
      startDate: '2019-09',
      endDate: '2023-06',
      gpa: '3.82/4.00',
      rank: '专业前 15%',
      englishLevel: 'CET-6 548',
      coreCourses: [
        { id: 'c1', name: '数据结构', score: '92', credit: '4' },
        { id: 'c2', name: '算法设计与分析', score: '90', credit: '3' },
        { id: 'c3', name: '操作系统', score: '88', credit: '4' },
        { id: 'c4', name: '计算机网络', score: '91', credit: '3' }
      ],
      description: '主修数据结构、算法设计、操作系统、计算机网络、数据库系统；专业排名前 15%，多次获得校级奖学金。'
    }
  ],
  experience: [
    {
      id: '1',
      company: '字节跳动',
      position: '前端工程师',
      startDate: '2023-07',
      endDate: '至今',
      description:
        '负责业务后台核心模块开发，推进页面性能优化和组件复用方案，将关键页面首屏加载时间降低 28%，并沉淀表单、图表、权限等通用能力。'
    },
    {
      id: '2',
      company: '阿里巴巴',
      position: '前端开发实习生',
      startDate: '2022-07',
      endDate: '2022-10',
      description:
        '参与电商活动页与商品详情页开发，配合设计和后端完成需求交付，优化移动端兼容问题并补充组件文档。'
    }
  ],
  projects: [
    {
      id: '1',
      name: '企业级组件库',
      role: '技术负责人',
      startDate: '2022-11',
      endDate: '2023-05',
      description:
        '从 0 到 1 搭建企业级 UI 组件库，覆盖 50+ 高频组件，支持主题定制、按需加载和自动化文档，服务 8 条业务线。',
      technologies: ['Vue 3', 'TypeScript', 'Vite', 'Vitest']
    },
    {
      id: '2',
      name: '科研数据可视化平台',
      role: '核心开发',
      startDate: '2021-09',
      endDate: '2022-06',
      description:
        '构建实验数据采集与可视化分析平台，支持实时图表、筛选联动和报告导出，帮助课题组提升数据复盘效率。',
      technologies: ['React', 'ECharts', 'WebSocket']
    }
  ],
  skills: [
    { id: '1', name: 'Vue / React', level: 'expert' },
    { id: '2', name: 'TypeScript', level: 'expert' },
    { id: '3', name: '数据结构与算法', level: 'advanced' },
    { id: '4', name: 'Node.js', level: 'advanced' },
    { id: '5', name: 'Vite / 工程化', level: 'advanced' },
    { id: '6', name: '数据可视化', level: 'intermediate' }
  ],
  awards: [
    {
      id: '1',
      name: '国家励志奖学金',
      issuer: '教育部',
      date: '2022-12',
      description: '综合成绩和社会实践表现突出，获得国家励志奖学金。'
    },
    {
      id: '2',
      name: '程序设计竞赛校级一等奖',
      issuer: '北京大学',
      date: '2021-11',
      description: '负责算法设计与代码实现，在校级程序设计竞赛中获得一等奖。'
    }
  ]
}

export const themes: Record<string, ThemeConfig> = {
  classic: {
    primaryColor: '#2f3437',
    secondaryColor: '#6b7280',
    accentColor: '#f3f4f6',
    fontFamily: 'SimSun, "Songti SC", serif',
    layout: 'two-column'
  },
  modern: {
    primaryColor: '#0f766e',
    secondaryColor: '#64748b',
    accentColor: '#ecfdf5',
    fontFamily: '"Microsoft YaHei", "PingFang SC", sans-serif',
    layout: 'single-column'
  },
  professional: {
    primaryColor: '#243b53',
    secondaryColor: '#52616b',
    accentColor: '#eef2f7',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    layout: 'two-column'
  }
}

export const pageThemes: Record<ThemeType, PageThemeConfig> = {
  blue: {
    label: '学术蓝',
    background: '#edf3f8',
    surface: '#ffffff',
    surfaceAlt: '#f5f8fb',
    panel: '#fbfdff',
    border: '#cbd9e6',
    borderStrong: '#9eb4c8',
    text: '#16283a',
    muted: '#5f7285',
    primary: '#1f5f8b',
    primaryHover: '#174c70',
    primarySoft: '#e2eef7',
    primaryTint: '#f0f6fb',
    accent: '#b7791f',
    accentHover: '#d99a2b',
    header: '#0f2740',
    headerAlt: '#183a5a',
    headerText: '#f8fbff',
    headerMuted: '#c7d8e8',
    previewBg: '#dfe9f2',
    shadow: 'rgba(15, 39, 64, 0.16)'
  },
  green: {
    label: '研究绿',
    background: '#eef4f1',
    surface: '#ffffff',
    surfaceAlt: '#f6faf8',
    panel: '#fbfdfc',
    border: '#cbded7',
    borderStrong: '#9cbdb2',
    text: '#142c2a',
    muted: '#5d736d',
    primary: '#1f7a68',
    primaryHover: '#185f52',
    primarySoft: '#e2f1ed',
    primaryTint: '#f0f8f5',
    accent: '#b7791f',
    accentHover: '#d99a2b',
    header: '#12332f',
    headerAlt: '#1d4b44',
    headerText: '#f8fffc',
    headerMuted: '#c8ded8',
    previewBg: '#e0ece8',
    shadow: 'rgba(18, 51, 47, 0.15)'
  },
  purple: {
    label: '论文紫',
    background: '#f2f0f7',
    surface: '#ffffff',
    surfaceAlt: '#f8f6fb',
    panel: '#fdfcff',
    border: '#d8cfe6',
    borderStrong: '#b6a6cf',
    text: '#2a223d',
    muted: '#716684',
    primary: '#66509a',
    primaryHover: '#51407e',
    primarySoft: '#ebe5f6',
    primaryTint: '#f6f2fb',
    accent: '#9f6b2f',
    accentHover: '#bf843d',
    header: '#261f3d',
    headerAlt: '#3a2f5c',
    headerText: '#fbf9ff',
    headerMuted: '#d9d0ec',
    previewBg: '#e7e1ef',
    shadow: 'rgba(38, 31, 61, 0.16)'
  }
}
