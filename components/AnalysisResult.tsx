'use client';

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
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 mt-8">
            <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">🔮</span>
                <h2 className="text-xl font-semibold text-white/90">梦境解析报告</h2>
            </div>

            {/* 情绪基调 */}
            <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full border border-purple-400/30">
                    <span className="text-lg">💫</span>
                    <span className="text-white/90 font-medium">情绪基调：{analysis.emotional_tone}</span>
                </div>
            </div>

            {/* 符号解析 */}
            <div className="mb-6">
                <h3 className="text-white/70 text-sm uppercase tracking-wider mb-3">梦境符号</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {analysis.symbols.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-purple-400/30 transition-colors"
                        >
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">🌟</span>
                                <div>
                                    <h4 className="text-white font-medium">{item.symbol}</h4>
                                    <p className="text-white/60 text-sm mt-1">{item.meaning}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 心理洞察 */}
            <div className="mb-6">
                <h3 className="text-white/70 text-sm uppercase tracking-wider mb-3">心理洞察</h3>
                <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl p-5 border border-indigo-400/20">
                    <p className="text-white/80 leading-relaxed">{analysis.psychological_insight}</p>
                </div>
            </div>

            {/* 现实关联 */}
            <div className="mb-6">
                <h3 className="text-white/70 text-sm uppercase tracking-wider mb-3">现实关联</h3>
                <div className="bg-gradient-to-r from-pink-500/10 to-orange-500/10 rounded-xl p-5 border border-pink-400/20">
                    <p className="text-white/80 leading-relaxed">{analysis.life_connection}</p>
                </div>
            </div>

            {/* 建议 */}
            <div>
                <h3 className="text-white/70 text-sm uppercase tracking-wider mb-3">成长建议</h3>
                <div className="space-y-2">
                    {analysis.suggestions.map((suggestion, index) => (
                        <div
                            key={index}
                            className="flex items-start gap-3 bg-white/5 rounded-xl p-4 border border-white/10"
                        >
                            <span className="text-green-400">✓</span>
                            <p className="text-white/80">{suggestion}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
