'use client';

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, PolarRadiusAxis } from 'recharts';
import { PersonalityTraits } from '@/utils/dreamStorage';
import { Sparkles } from 'lucide-react';

interface PersonaRadarProps {
    traits: PersonalityTraits;
}

export default function PersonaRadar({ traits }: PersonaRadarProps) {
    const data = [
        { subject: '想象力', A: traits.creativity, fullMark: 100 },
        { subject: '逻辑性', A: traits.logic, fullMark: 100 },
        { subject: '情感强度', A: traits.emotion, fullMark: 100 },
        { subject: '灵性觉知', A: traits.spirituality, fullMark: 100 },
        { subject: '现实连接', A: traits.realism, fullMark: 100 },
    ];

    // Check if all scores are 0 (indicates no data)
    const isExample = data.every(d => d.A === 0);

    return (
        <div className="w-full bg-indigo-950/20 backdrop-blur-xl rounded-3xl border border-indigo-500/20 p-8 flex flex-col items-center animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-2 mb-6 text-indigo-200 z-10">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h3 className="font-medium tracking-wider">潜意识人格画像</h3>
            </div>

            {isExample && (
                <div className="absolute inset-0 z-0 flex items-center justify-center bg-indigo-950/50 backdrop-blur-[2px]">
                    <div className="text-center p-4">
                        <p className="text-indigo-200 font-light mb-2">人格画像尚未生成</p>
                        <p className="text-xs text-indigo-400/60">解析您的第一个梦境后点亮</p>
                    </div>
                </div>
            )}

            <div className="w-full h-[300px] -ml-2 z-10 opacity-80">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={isExample ? data.map(d => ({ ...d, A: 100 })) : data}>
                        <PolarGrid stroke="#6366f1" strokeOpacity={0.2} />
                        <PolarAngleAxis
                            dataKey="subject"
                            tick={{ fill: '#a5b4fc', fontSize: 13, fontWeight: 300 }}
                        />
                        <PolarRadiusAxis
                            angle={30}
                            domain={[0, 100]}
                            tick={false}
                            axisLine={false}
                        />
                        <Radar
                            name="My Persona"
                            dataKey="A"
                            stroke={isExample ? "#6366f1" : "#818cf8"}
                            strokeWidth={isExample ? 1 : 2}
                            strokeDasharray={isExample ? "4 4" : "0"}
                            fill="#6366f1"
                            fillOpacity={isExample ? 0.05 : 0.3}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            <div className="text-center text-xs text-indigo-400/40 mt-4 max-w-sm">
                *基于您过去{/* We could pass count here later */}积累的梦境分析生成，随着记录增加将越发精准。
            </div>
        </div>
    );
}
