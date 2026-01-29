'use client';

import { useState } from 'react';

interface DreamInputProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    loading: boolean;
}

export default function DreamInput({ value, onChange, onSubmit, loading }: DreamInputProps) {
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && e.metaKey && !loading && value.trim()) {
            onSubmit();
        }
    };

    return (
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🌙</span>
                <h2 className="text-xl font-semibold text-white/90">描述你的梦境</h2>
            </div>

            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="我梦见自己在云层之上飞翔，周围是金色的阳光，远处有一座悬浮的城堡，城堡周围环绕着彩虹色的光圈..."
                className="w-full h-44 bg-white/5 rounded-2xl p-5 text-white text-lg
                   placeholder:text-white/30 border border-white/10 
                   focus:border-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-400/20
                   resize-none transition-all duration-300"
                disabled={loading}
            />

            <div className="flex items-center justify-between mt-4">
                <span className="text-white/40 text-sm">
                    ⌘ + Enter 快速提交
                </span>
                <button
                    onClick={onSubmit}
                    disabled={loading || !value.trim()}
                    className="px-8 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 
                     rounded-xl text-white font-semibold text-lg
                     hover:opacity-90 hover:scale-105
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                     transition-all duration-300 shadow-lg shadow-purple-500/30"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            解析中...
                        </span>
                    ) : (
                        '✨ 解析梦境'
                    )}
                </button>
            </div>
        </div>
    );
}
