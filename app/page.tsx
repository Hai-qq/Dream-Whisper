'use client';

import { useState } from 'react';
import DreamInput from '@/components/DreamInput';
import AnalysisResult from '@/components/AnalysisResult';
import DreamMedia from '@/components/DreamMedia';

interface AnalysisData {
  symbols: { symbol: string; meaning: string }[];
  emotional_tone: string;
  psychological_insight: string;
  life_connection: string;
  suggestions: string[];
  image_prompt: string;
}

export default function Home() {
  const [dream, setDream] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState({
    analyze: false,
    image: false,
    video: false,
  });

  // 解析梦境
  const handleAnalyze = async () => {
    setError('');
    setLoading((prev) => ({ ...prev, analyze: true }));
    setAnalysis(null);
    setImageUrl('');
    setVideoUrl('');

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dream }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '分析失败');
      }

      setAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '分析过程中出现错误');
    } finally {
      setLoading((prev) => ({ ...prev, analyze: false }));
    }
  };

  // 生成图像
  const handleGenerateImage = async () => {
    if (!analysis?.image_prompt) return;

    setLoading((prev) => ({ ...prev, image: true }));
    setError('');

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: analysis.image_prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '图像生成失败');
      }

      setImageUrl(data.imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : '图像生成过程中出现错误');
    } finally {
      setLoading((prev) => ({ ...prev, image: false }));
    }
  };

  // 生成视频
  const handleGenerateVideo = async () => {
    if (!imageUrl) return;

    setLoading((prev) => ({ ...prev, video: true }));
    setError('');

    try {
      const res = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl,
          prompt: analysis?.image_prompt,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '视频生成失败');
      }

      setVideoUrl(data.videoUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : '视频生成过程中出现错误');
    } finally {
      setLoading((prev) => ({ ...prev, video: false }));
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* 星星装饰 - 使用固定位置避免 hydration 错误 */}
      <div className="absolute inset-0 pointer-events-none">
        {[
          { top: 5, left: 10 }, { top: 12, left: 85 }, { top: 8, left: 45 },
          { top: 18, left: 22 }, { top: 25, left: 78 }, { top: 32, left: 55 },
          { top: 15, left: 92 }, { top: 38, left: 8 }, { top: 42, left: 67 },
          { top: 48, left: 33 }, { top: 55, left: 88 }, { top: 62, left: 15 },
          { top: 68, left: 72 }, { top: 75, left: 40 }, { top: 82, left: 95 },
          { top: 88, left: 28 }, { top: 92, left: 60 }, { top: 3, left: 52 },
          { top: 28, left: 3 }, { top: 45, left: 98 }, { top: 72, left: 5 },
          { top: 85, left: 75 }, { top: 95, left: 42 }, { top: 22, left: 65 },
        ].map((pos, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
            style={{
              top: `${pos.top}%`,
              left: `${pos.left}%`,
              animationDelay: `${i * 0.12}s`,
              animationDuration: `${2 + (i % 3)}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {/* 标题 */}
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-orange-300 bg-clip-text text-transparent mb-4">
            🌙 Dreamer Analyst
          </h1>
          <p className="text-white/60 text-lg">
            AI 梦境分析师 · 解读你的潜意识密码
          </p>
        </header>

        {/* 错误提示 */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-center">
            ⚠️ {error}
          </div>
        )}

        {/* 梦境输入 */}
        <DreamInput
          value={dream}
          onChange={setDream}
          onSubmit={handleAnalyze}
          loading={loading.analyze}
        />

        {/* 分析结果 */}
        {analysis && <AnalysisResult analysis={analysis} />}

        {/* 媒体生成 */}
        {analysis && (
          <DreamMedia
            imageUrl={imageUrl}
            videoUrl={videoUrl}
            imagePrompt={analysis.image_prompt}
            onGenerateImage={handleGenerateImage}
            onGenerateVideo={handleGenerateVideo}
            loading={{ image: loading.image, video: loading.video }}
          />
        )}

        {/* 页脚 */}
        <footer className="mt-16 text-center text-white/30 text-sm">
          <p>Powered by GPT-4o · DALL-E 3 · Stable Video Diffusion</p>
          <p className="mt-2">© 2026 Dreamer Analyst</p>
        </footer>
      </div>
    </main>
  );
}
