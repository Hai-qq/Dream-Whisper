'use client';

import { DreamRecord } from '@/utils/dreamStorage';
import { Clock, ChevronRight, MessageSquareQuote } from 'lucide-react';

interface DreamHistoryProps {
    history: DreamRecord[];
    onSelect: (record: DreamRecord) => void;
    selectedId?: string;
}

export default function DreamHistory({ history, onSelect, selectedId }: DreamHistoryProps) {
    if (history.length === 0) return null;

    return (
        <div className="w-full md:w-80 flex-shrink-0 animate-in fade-in slide-in-from-left duration-700">
            <div className="bg-indigo-950/20 backdrop-blur-xl rounded-2xl border border-indigo-500/10 overflow-hidden flex flex-col max-h-[600px]">
                <div className="p-4 border-b border-indigo-500/10 bg-indigo-500/5">
                    <h3 className="text-indigo-200 font-medium flex items-center gap-2 text-sm uppercase tracking-wider">
                        <Clock className="w-4 h-4 text-indigo-400" />
                        梦境日志
                    </h3>
                </div>

                <div className="overflow-y-auto p-2 space-y-2 custom-scrollbar">
                    {history.map((record) => (
                        <button
                            key={record.id}
                            onClick={() => onSelect(record)}
                            className={`w-full text-left p-3 rounded-xl transition-all duration-200 group relative ${selectedId === record.id
                                    ? 'bg-indigo-500/20 shadow-inner'
                                    : 'hover:bg-indigo-500/10'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-xs font-mono mb-1 block ${selectedId === record.id ? 'text-indigo-300' : 'text-indigo-400/50'
                                    }`}>
                                    {new Date(record.date).toLocaleDateString()}
                                </span>
                                {selectedId === record.id && (
                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-purple-400 rounded-full shadow-[0_0_8px_rgba(192,132,252,0.8)]" />
                                )}
                            </div>

                            <p className={`text-sm line-clamp-2 ${selectedId === record.id ? 'text-indigo-100' : 'text-indigo-300/70'
                                }`}>
                                {record.dream}
                            </p>

                            {/* Mini tags for symbols */}
                            <div className="flex gap-1 mt-2 overflow-hidden">
                                {record.analysis.symbols.slice(0, 2).map((s, i) => (
                                    <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-md bg-indigo-950/40 text-indigo-400/60 whitespace-nowrap">
                                        #{s.symbol}
                                    </span>
                                ))}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
