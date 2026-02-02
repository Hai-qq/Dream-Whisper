---
title: Dream Whisper
sdk: docker
app_port: 7860
license: mit
---

# 梦语 (Dream Whisper)

**梦语 (Dream Whisper)** 是一款基于 AI 的梦境分析与可视化应用。它不仅能深度解析用户的梦境心理，还能通过生成式 AI 将梦境转化为高质量的图像和视频，并构建动态的“潜意识人格画像”。

## 功能亮点

- **梦境解析**: 基于 GLM-4 模型的深度心理学解读（荣格/弗洛伊德流派）。
- **影像生成**: 利用字节跳动 Volcengine Ark (Doubao 模型) 将梦境转化为动漫风格的图像与视频。
- **人格画像**: 动态分析梦境数据，生成五维潜意识人格雷达图。
- **沉浸体验**: 星空背景与流媒体交互体验。

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/Hai-qq/dreamer-analyst.git
cd dreamer-analyst
```

### 2. 安装依赖

```bash
npm install
# 或者
yarn install
# 或者
pnpm install
```

### 3. 配置环境变量

在项目根目录创建 `.env.local` 文件，并添加以下 API 密钥：

```bash
# 智谱 AI (用于文本分析)
GLM_API_KEY=your_zhipu_api_key

# 火山引擎方舟 (Volcengine Ark) (用于图像/视频生成)
ARK_API_KEY=your_volcengine_ark_api_key
```

### 4. 运行开发服务器

```bash
npm run dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000) 即可开始体验。

## 部署

本项目支持一键部署到 [Vercel](https://vercel.com)。

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FHai-qq%2Fdreamer-analyst)

确保在 Vercel 项目设置中配置上述环境变量。

## 技术栈

- **框架**: Next.js 15 (App Router)
- **UI**: Tailwind CSS, Lucide React, Framer Motion
- **AI**: Zhipu AI (GLM-4), Volcengine Ark (Doubao)
- **图表**: Recharts

## 许可证

MIT License
