'use client';

import { Sparkles, Brain, Zap, Heart, CheckCircle2 } from 'lucide-react';

interface Symbol {
    symbol: string;
    meaning: string;
}

interface AnalysisData {
    symbols: Symbol[];
    emotional_tone: string;
    psychological_insight: string;
    life_connection: string;
    suggestions: string[];
    image_prompt: string;
}

interface AnalysisResultProps {
    analysis: AnalysisData;
}

export default function AnalysisResult({ analysis }: AnalysisResultProps) {
    return (
        <div className="bg-indigo-950/20 backdrop-blur-xl rounded-3xl p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-indigo-500/20 mt-8 order-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                    <Brain className="w-6 h-6 text-purple-300" />
                </div>
                <h2 className="text-xl font-semibold text-indigo-50">梦境解析报告</h2>
            </div>

            {/* 情绪基调 */}
            <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-full border border-purple-500/30 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
                    <Sparkles className="w-4 h-4 text-purple-300" />
                    <span className="text-indigo-100 font-medium">情绪基调：</span>
                    <span className="text-purple-200 font-semibold">{analysis.emotional_tone}</span>
                </div>
            </div>

            {/* 符号解析 */}
            <div className="mb-8">
                <h3 className="text-indigo-300/60 text-xs uppercase tracking-wider font-bold mb-4 flex items-center gap-2">
                    <Zap className="w-3 h-3" />
                    梦境符号
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analysis.symbols.map((item, index) => (
                        <div
                            key={index}
                            className="group bg-indigo-950/30 rounded-xl p-5 border border-indigo-500/10 hover:border-purple-500/30 transition-all duration-300 hover:bg-indigo-900/30 hover:transform hover:-translate-y-1"
                        >
                            <div className="flex items-start gap-3">
                                <div className="mt-1 p-1.5 bg-indigo-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                                    <Sparkles className="w-4 h-4 text-purple-300" />
                                </div>
                                <div>
                                    <h4 className="text-indigo-50 font-medium mb-1">{item.symbol}</h4>
                                    <p className="text-indigo-200/60 text-sm leading-relaxed">{item.meaning}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 心理洞察 */}
            <div className="mb-8">
                <h3 className="text-indigo-300/60 text-xs uppercase tracking-wider font-bold mb-4 flex items-center gap-2">
                    <Brain className="w-3 h-3" />
                    心理洞察
                </h3>
                <div className="group bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-xl p-6 border border-indigo-500/20 relative overflow-hidden transition-all duration-300 hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] hover:-translate-y-1 hover:from-indigo-900/40 hover:to-purple-900/40">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 transition-opacity duration-300 group-hover:bg-purple-500/10" />
                    <p className="text-indigo-100/90 leading-relaxed relaitve z-10">{analysis.psychological_insight}</p>
                </div>
            </div>

            {/* 现实关联 */}
            <div className="mb-8">
                <h3 className="text-indigo-300/60 text-xs uppercase tracking-wider font-bold mb-4 flex items-center gap-2">
                    <Heart className="w-3 h-3" />
                    现实关联
                </h3>
                <div className="group bg-gradient-to-br from-indigo-900/30 to-blue-900/30 rounded-xl p-6 border border-indigo-500/20 relative overflow-hidden transition-all duration-300 hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] hover:-translate-y-1 hover:from-indigo-900/40 hover:to-blue-900/40">
                    <p className="text-indigo-100/90 leading-relaxed relative z-10">{analysis.life_connection}</p>
                </div>
            </div>

            {/* 建议 */}
            <div>
                <h3 className="text-indigo-300/60 text-xs uppercase tracking-wider font-bold mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3" />
                    成长建议
                </h3>
                <div className="space-y-3">
                    {analysis.suggestions.map((suggestion, index) => (
                        <div
                            key={index}
                            className="flex items-start gap-4 bg-indigo-950/20 rounded-xl p-4 border border-indigo-500/10 hover:border-emerald-500/20 transition-colors"
                        >
                            <div className="mt-0.5 min-w-[1.25rem]">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400/80" />
                            </div>
                            <p className="text-indigo-200/80 leading-relaxed">{suggestion}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
