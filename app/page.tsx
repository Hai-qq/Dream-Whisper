'use client';

import { useState, useEffect } from 'react';
import { Moon, AlertCircle, CloudMoon, Sparkles as SparklesIcon } from 'lucide-react';
import Link from 'next/link';
import DreamInput from '@/components/DreamInput';
import AnalysisResult from '@/components/AnalysisResult';
import DreamMedia from '@/components/DreamMedia';
import StarField from '@/components/StarField';
import PersonaRadar from '@/components/PersonaRadar';
import DreamHistory from '@/components/DreamHistory';
import { DreamStorage, PersonalityTraits, DreamRecord } from '@/utils/dreamStorage';

interface AnalysisData {
  symbols: { symbol: string; meaning: string }[];
  emotional_tone: string;
  psychological_insight: string;
  life_connection: string;
  suggestions: string[];
  image_prompt: string;
  personality_traits?: PersonalityTraits;
}

type ViewState = 'home' | 'analyze' | 'persona';

export default function Home() {
  const [activeTab, setActiveTab] = useState<ViewState>('home');
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');
  const [dream, setDream] = useState('');
  const [persona, setPersona] = useState<PersonalityTraits | null>(null);

  // History State
  const [history, setHistory] = useState<DreamRecord[]>([]);
  const [currentRecordId, setCurrentRecordId] = useState<string | undefined>(undefined);

  const [loading, setLoading] = useState({
    analyze: false,
    image: false,
    video: false,
  });

  // Load data on mount
  useEffect(() => {
    const dreams = DreamStorage.getDreams();
    setHistory(dreams);
    setPersona(DreamStorage.calculatePersona(dreams));
  }, []);

  // Handle selecting a dream from history
  const handleSelectHistory = (record: DreamRecord) => {
    // Ensure compatibility with AnalysisData
    setAnalysis({
      ...record.analysis,
      image_prompt: record.analysis.image_prompt || ''
    });
    setCurrentRecordId(record.id);
    // Load persisted media URLs
    setImageUrl(record.imageUrl || '');
    setVideoUrl(record.videoUrl || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 解析梦境
  const handleAnalyze = async (messages: { role: 'user' | 'assistant', content: string }[]) => {
    setError('');
    setLoading((prev) => ({ ...prev, analyze: true }));
    setAnalysis(null);
    setImageUrl('');
    setVideoUrl('');
    setCurrentRecordId(undefined);

    // Switch to analyze view 
    setActiveTab('analyze');

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '分析失败');
      }

      setAnalysis({
        ...data,
        image_prompt: data.image_prompt || ''
      });

      if (data.personality_traits) {
        const record = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          dream: messages[messages.length - 1].content,
          analysis: data,
          // Initial media is empty
          imageUrl: '',
          videoUrl: ''
        };
        // Save and update local state
        const updatedDreams = DreamStorage.saveDream(record);
        setHistory(updatedDreams);
        setPersona(DreamStorage.calculatePersona(updatedDreams));
        setCurrentRecordId(record.id);
      }

    } catch (err) {
      console.error('分析错误:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === 'object' && err !== null) {
        setError(JSON.stringify(err));
      } else {
        setError('分析过程中出现错误');
      }
    } finally {
      setLoading((prev) => ({ ...prev, analyze: false }));
    }
  };

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
      if (!res.ok) throw new Error(data.error || '图像生成失败');

      const newImageUrl = data.imageUrl;
      setImageUrl(newImageUrl);

      // Update storage if we have a current record
      if (currentRecordId) {
        const updatedDreams = DreamStorage.updateDream(currentRecordId, { imageUrl: newImageUrl });
        setHistory(updatedDreams); // Sync history state
      }

    } catch (err) {
      console.error(err);
      setError('图像生成失败');
    } finally {
      setLoading((prev) => ({ ...prev, image: false }));
    }
  };

  const handleGenerateVideo = async () => {
    if (!imageUrl) return;
    setLoading((prev) => ({ ...prev, video: true }));
    setError('');
    try {
      const res = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl, prompt: analysis?.image_prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '视频生成失败');

      const newVideoUrl = data.videoUrl;
      setVideoUrl(newVideoUrl);

      // Update storage
      if (currentRecordId) {
        const updatedDreams = DreamStorage.updateDream(currentRecordId, { videoUrl: newVideoUrl });
        setHistory(updatedDreams);
      }

    } catch (err) {
      console.error(err);
      setError('视频生成失败');
    } finally {
      setLoading((prev) => ({ ...prev, video: false }));
    }
  };

  // Render Logic
  const renderContent = () => {
    // 1. Home View: Input Only
    if (activeTab === 'home') {
      return (
        <div className="animate-in fade-in slide-in-from-left duration-500 max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl text-indigo-200 font-light tracking-wide mb-4">记录新的梦境</h2>
            <p className="text-indigo-400/60 text-sm">每一个梦都是潜意识的来信，在这里写下它的内容...</p>
          </div>

          <DreamInput
            value={dream}
            onChange={setDream}
            onSubmit={handleAnalyze}
            loading={loading.analyze}
          />
        </div>
      );
    }

    // 2. Persona View
    if (activeTab === 'persona') {
      return (
        <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-right duration-500">
          {persona ? (
            <div className="space-y-8">
              <PersonaRadar traits={persona} />
              <div className="text-center">
                <p className="text-indigo-200/60 font-light">
                  这里记录了您所有梦境折射出的潜意识倾向。
                </p>
                <button
                  onClick={() => setActiveTab('home')}
                  className="mt-6 px-6 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-full text-sm transition-colors"
                >
                  去记录新的梦境
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center pt-20">
              <p className="text-indigo-300">正在读取数据...</p>
            </div>
          )}
        </div>
      );
    }

    // 3. Analyze View: Result + History
    // Layout: Left (History) - Right (Result) on Desktop
    return (
      <div className="flex flex-col md:flex-row gap-8 animate-in fade-in zoom-in-95 duration-500 items-start">
        {/* Sidebar: Dream History */}
        <div className="hidden md:block sticky top-32">
          <DreamHistory
            history={history}
            onSelect={handleSelectHistory}
            selectedId={currentRecordId}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 w-full min-w-0">

          {/* Loading State */}
          {loading.analyze && (
            <div className="p-12 bg-indigo-950/20 backdrop-blur-xl rounded-2xl border border-indigo-500/20 text-center animate-in fade-in">
              <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
              <h3 className="text-xl font-medium text-white mb-2">正在解析梦境旅程...</h3>
              <p className="text-indigo-300/60">梦语正在解码潜意识符号，构建心理画像</p>
            </div>
          )}

          {/* Analysis Result */}
          {!loading.analyze && analysis && (
            <div className="space-y-8">
              <AnalysisResult analysis={analysis} />
              <DreamMedia
                imageUrl={imageUrl}
                videoUrl={videoUrl}
                imagePrompt={analysis.image_prompt}
                onGenerateImage={handleGenerateImage}
                onGenerateVideo={handleGenerateVideo}
                loading={{ image: loading.image, video: loading.video }}
              />
            </div>
          )}

          {/* Empty State */}
          {!loading.analyze && !analysis && (
            <div className="text-center py-20 bg-indigo-950/10 rounded-3xl border border-indigo-500/5 border-dashed">
              <Moon className="w-12 h-12 text-indigo-500/30 mx-auto mb-4" />
              <h3 className="text-lg text-indigo-200/80 mb-2">暂无解析内容</h3>
              <p className="text-indigo-400/50 mb-6">
                {history.length > 0
                  ? "请从左侧列表选择一个历史梦境进行回顾"
                  : "您还没有解析过任何梦境"}
              </p>
              <button
                onClick={() => setActiveTab('home')}
                className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full transition-all shadow-lg shadow-indigo-500/20"
              >
                前往首页开始解析
              </button>
            </div>
          )}
        </div>

        {/* Mobile History (Stack below for now) */}
        <div className="md:hidden w-full mt-10">
          <h3 className="text-indigo-300/60 text-sm uppercase tracking-widest mb-4 text-center">历史记录</h3>
          <DreamHistory
            history={history}
            onSelect={handleSelectHistory}
            selectedId={currentRecordId}
          />
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen relative overflow-x-hidden selection:bg-purple-500/30 selection:text-purple-200">
      <StarField />

      {/* Top Right Navigation */}
      <nav className="absolute top-0 right-0 p-6 md:p-8 z-50 flex gap-2 md:gap-4 overflow-x-auto max-w-full">
        <button
          onClick={() => setActiveTab('home')}
          className={`px-4 py-2 rounded-full text-sm backdrop-blur-md transition-all duration-300 whitespace-nowrap ${activeTab === 'home'
            ? 'bg-indigo-500/30 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] ring-1 ring-indigo-400/50'
            : 'bg-indigo-950/20 text-indigo-300/60 hover:bg-indigo-900/40 hover:text-indigo-200'
            }`}
        >
          首页
        </button>
        <button
          onClick={() => setActiveTab('analyze')}
          className={`px-4 py-2 rounded-full text-sm backdrop-blur-md transition-all duration-300 whitespace-nowrap ${activeTab === 'analyze'
            ? 'bg-indigo-500/30 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] ring-1 ring-indigo-400/50'
            : 'bg-indigo-950/20 text-indigo-300/60 hover:bg-indigo-900/40 hover:text-indigo-200'
            }`}
        >
          解析
        </button>
        <button
          onClick={() => setActiveTab('persona')}
          className={`px-4 py-2 rounded-full text-sm backdrop-blur-md transition-all duration-300 whitespace-nowrap flex items-center gap-2 ${activeTab === 'persona'
            ? 'bg-purple-500/30 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)] ring-1 ring-purple-400/50'
            : 'bg-indigo-950/20 text-indigo-300/60 hover:bg-indigo-900/40 hover:text-indigo-200'
            }`}
        >
          <SparklesIcon className="w-3 h-3" />
          人格画像
        </button>
      </nav>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 pb-40">

        {/* Header - Compact on Layouts other than Home? Or keep consistent? 
            Let's keep consistent for brand identity. */}
        <header className="flex flex-col items-center justify-center mb-16 md:mb-24 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="relative mb-8 md:mb-12 group cursor-default">
            <div className="absolute -inset-6 bg-indigo-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative p-4 md:p-5 bg-indigo-950/30 rounded-2xl border border-indigo-500/20 shadow-2xl backdrop-blur-md ring-1 ring-white/10 transition-transform duration-500 hover:scale-110 hover:-rotate-12">
              <CloudMoon className="w-10 h-10 md:w-12 md:h-12 text-indigo-200" />
            </div>
          </div>
          <div className="text-center relative z-10 group">
            <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-indigo-100 to-indigo-300/50 tracking-[0.25em] select-none ml-[0.25em] drop-shadow-[0_0_40px_rgba(165,180,252,0.2)] mb-6 md:mb-8 transition-all duration-700 ease-out group-hover:scale-105 group-hover:drop-shadow-[0_0_60px_rgba(165,180,252,0.6)] cursor-default">
              梦语
            </h1>
            <div className="flex items-center justify-center gap-4 md:gap-6 text-indigo-300/50 text-[10px] md:text-sm font-light tracking-[0.6em] uppercase animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-200">
              <div className="w-10 md:w-16 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent"></div>
              <span>Dream Whisper</span>
              <div className="w-10 md:w-16 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent"></div>
            </div>
          </div>
        </header>

        {error && (
          <div className="mb-8 mx-auto max-w-2xl p-4 bg-red-950/40 border border-red-500/30 rounded-2xl text-red-200 flex items-center justify-center gap-3 backdrop-blur-md animate-in fade-in zoom-in-95 duration-300 shadow-xl">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {renderContent()}

        <footer className="mt-32 text-center text-indigo-400/30 text-sm space-y-4">
          <div className="flex items-center justify-center gap-6">
            <div className="h-px w-12 bg-indigo-500/20"></div>
            <span className="font-mono tracking-widest uppercase text-xs">Dream Whisper System</span>
            <div className="h-px w-12 bg-indigo-500/20"></div>
          </div>
          <p className="font-light">Designed & Built by YiHai</p>
          <p className="opacity-60">© 2026 梦语 Dream Whisper</p>
        </footer>
      </div>
    </main>
  );
}
