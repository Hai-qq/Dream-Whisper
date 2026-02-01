# 梦语 (Dream Whisper) 技术文档

**作者: Yee**

## 1. 项目概述

**梦语 (Dream Whisper)** 是一款基于 AI 的梦境分析与可视化应用。它不仅能深度解析用户的梦境心理，还能通过生成式 AI 将梦境转化为高质量的图像和视频，并构建动态的“潜意识人格画像”。

- **版本**: 1.0.0
- **核心理念**: 倾听潜意识的低语，解读梦境密码。

## 2. 技术栈 (Tech Stack)

### 前端框架
- **Next.js 14-15+ (App Router)**: 使用 React 的最新服务器端渲染架构。
- **React**: 构建动态交互界面的核心库。
- **TypeScript**: 强类型语言，增强代码健壮性。

### 样式与 UI
- **Tailwind CSS**: 实用优先的 CSS 框架，快速构建响应式设计。
- **Lucide React**: 现代、轻量级的图标库。
- **Recharts**: 用于构建“人格画像”雷达图的数据可视化库。
- **Framer Motion / CSS Animations**: 实现平滑的页面过渡和微交互动画。

### AI 与 后端集成
- **Zhipu AI (GLM-4 Flash)**: 用于深度的文本分析、心理学解读和 Prompt 优化（兼容 OpenAI SDK）。
- **Replicate (Flux / Luma)**: 用于将文本 Prompt 转化为图像和视频（应用内根据 API 路由实现）。

### 数据存储
- **LocalStorage**: 用于 MVP 阶段的客户端数据持久化（梦境记录、分析结果、生成的媒体链接）。
- **DreamStorage Utility**: 自封装的存储管理工具类。

## 3. 系统架构与目录结构

项目位于 `dream-whisper/app` 目录下，采用 Next.js App Router 结构。

```
dream-whisper/
├── app/
│   ├── api/                  # 后端 API 路由
│   │   ├── analyze/          # 梦境文本分析接口
│   │   ├── generate-image/   # 图像生成接口
│   │   └── generate-video/   # 视频生成接口
│   ├── app/                  # 页面路由
│   │   ├── layout.tsx        # 全局布局
│   │   └── page.tsx          # 主页应用逻辑 (单页应用模式)
│   ├── components/           # UI 组件库
│   │   ├── DreamInput.tsx    # 梦境输入框组件
│   │   ├── AnalysisResult.tsx# 分析结果展示卡片
│   │   ├── DreamMedia.tsx    # 媒体生成与展示组件
│   │   ├── DreamHistory.tsx  # 历史记录侧边栏
│   │   ├── PersonaRadar.tsx  # 人格画像雷达图
│   │   └── StarField.tsx     # 星空背景动效
│   └── utils/
│       └── dreamStorage.ts   # 本地存储与数据逻辑封装
```

## 4. 核心功能实现

### 4.1 梦境解析 (Dream Analysis)
- **流程**: 用户输入 -> `/api/analyze` -> GLM-4 模型。
- **System Prompt**: 设定为专业的荣格/弗洛伊德流派解梦师，输出严格的 JSON 格式。
- **输出内容**: 
  - 关键符号 (Symbols)
  - 情绪基调 (Emotional Tone)
  - 心理学洞察 (Psychological Insight)
  - 生活链接 (Life Connection)
  - 建议 (Suggestions)
  - **人格维度评分 (Personality Traits)**
  - **图像生成提示词 (Image Prompt)**: 专门优化的英文 Prompt。

### 4.2 潜意识人格画像 (Persona Profile)
- **逻辑**: 每次梦境解析都会生成 5 个维度的分值（0-100）：
  - 想象力 (Creativity)
  - 逻辑性 (Logic)
  - 情感强度 (Emotion)
  - 灵性觉知 (Spirituality)
  - 现实连接 (Realism)
- **聚合算法**: `DreamStorage.calculatePersona` 会计算所有历史梦境的平均值，实时反映用户的潜意识倾向。
- **可视化**: 使用 Recharts 绘制雷达图，支持空状态展示。

### 4.3 历史记录与多媒体 (History & Media)
- **持久化**: 所有分析结果、生成的图片 URL、视频 URL 均通过 `DreamStorage` 保存于浏览器 LocalStorage。
- **回溯**: 从左侧边栏点击历史记录，可瞬间恢复当时的分析状态和媒体文件。

## 5. 环境变量配置

项目依赖以下环境变量（配置在 `.env.local`）：

```bash
# 智谱 AI (文本分析)
GLM_API_KEY=your_zhipu_api_key

# Replicate (图像/视频生成)
REPLICATE_API_TOKEN=your_replicate_token
```

## 6. 后续迭代计划 (Roadmap)
- [ ] **云端同步**: 接入 Supabase/PostgreSQL，实现多设备同步。
- [ ] **社交分享**: 生成精美的梦境分享卡片。
- [ ] **语音输入**: 支持语音转文字记录梦境。
- [ ] **多用户系统**: 完整的注册登录流程。

---
*文档生成时间: 2026-02-01*
