'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, ChevronDown, MessageCircle, Moon, Loader2, Sparkles, Command } from 'lucide-react';

interface DreamInputProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: (messages: { role: 'user' | 'assistant', content: string }[]) => void;
    loading: boolean;
}

export default function DreamInput({ value, onChange, onSubmit, loading }: DreamInputProps) {
    const [isDeepDive, setIsDeepDive] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
    const [qaInput, setQaInput] = useState('');
    const [askingQuestion, setAskingQuestion] = useState(false);
    const qaEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom of Q&A when messages change
    useEffect(() => {
        if (isDeepDive) {
            qaEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isDeepDive]);

    const handleStartDeepDive = async () => {
        if (!value.trim()) return;
        setIsDeepDive(true);
        setAskingQuestion(true);

        // Store the initial dream as the first user message
        const initialMessages = [{ role: 'user' as const, content: value }];
        setMessages(initialMessages);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: initialMessages }),
            });
            const data = await res.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        } catch (err) {
            console.error(err);
        } finally {
            setAskingQuestion(false);
        }
    };

    const handleQaSend = async () => {
        if (!qaInput.trim()) return;

        const newMessages = [...messages, { role: 'user' as const, content: qaInput }];
        setMessages(newMessages);
        setQaInput('');
        setAskingQuestion(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages }),
            });
            const data = await res.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        } catch (err) {
            console.error(err);
        } finally {
            setAskingQuestion(false);
        }
    };

    const handleSubmit = () => {
        // If Deep Dive was active, use full history. 
        // If not, just use the current text box value wrapped in a message.
        if (isDeepDive) {
            onSubmit(messages);
        } else {
            onSubmit([{ role: 'user', content: value }]);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            handleSubmit();
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Main Input Card */}
            <div className={`relative bg-indigo-950/30 backdrop-blur-xl rounded-3xl p-1 border border-indigo-500/20 shadow-2xl transition-all duration-500 ${isDeepDive ? 'rounded-b-none border-b-0' : ''}`}>
                <div className="bg-gradient-to-b from-white/5 to-transparent rounded-[22px] p-6">
                    <div className="flex items-center justify-between mb-4 opacity-80">
                        <div className="flex items-center gap-3">
                            <Moon className="w-5 h-5 text-indigo-300" />
                            <span className="text-sm font-medium text-indigo-200 uppercase tracking-widest">描述梦境</span>
                        </div>
                        <div className="hidden md:flex items-center gap-2 text-xs text-indigo-400/40 px-2 py-1 rounded bg-white/5 border border-white/5">
                            <Command className="w-3 h-3" />
                            <span>+ Enter</span>
                        </div>
                    </div>

                    <textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="我梦见自己在云层之上飞翔，周围是金色的阳光..."
                        className="w-full h-40 bg-transparent text-lg text-indigo-50 placeholder:text-indigo-400/30 
                                 focus:outline-none resize-none leading-relaxed selection:bg-purple-500/30"
                        disabled={loading || isDeepDive} // Lock main input during deep dive to avoid sync issues
                    />

                    {/* Action Bar */}
                    <div className="flex items-center justify-between mt-4 border-t border-indigo-500/10 pt-4">
                        {!isDeepDive ? (
                            <button
                                onClick={handleStartDeepDive}
                                disabled={!value.trim() || loading}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-indigo-300 hover:text-indigo-100 hover:bg-indigo-500/10 transition-colors text-sm font-medium disabled:opacity-50"
                            >
                                <MessageCircle className="w-4 h-4" />
                                补充更多细节
                                <ChevronDown className="w-3 h-3 opacity-50" />
                            </button>
                        ) : (
                            <span className="text-xs text-indigo-400/60 font-mono pl-2">对话模式已开启</span>
                        )}

                        <button
                            onClick={handleSubmit}
                            disabled={!value.trim() || loading}
                            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 
                                     rounded-xl text-white font-medium hover:from-violet-500 hover:to-indigo-500 
                                     transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]
                                     disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>解析中...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5 fill-indigo-200/20" />
                                    <span>立即解析梦境</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Dropdown Supplement Section */}
            <div className={`overflow-hidden transition-all duration-700 ease-out ${isDeepDive ? 'max-h-[600px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-4'}`}>
                <div className="bg-indigo-950/30 backdrop-blur-xl rounded-b-3xl border border-t-0 border-indigo-500/20 p-6 pt-0 shadow-2xl mx-1 relative top-[-4px]">
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent mb-6"></div>

                    <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-indigo-500/10 mb-4">
                        {messages.slice(1).map((m, i) => (
                            <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`p-3 rounded-2xl text-sm max-w-[85%] leading-relaxed ${m.role === 'assistant'
                                    ? 'bg-indigo-500/10 text-indigo-100 border border-indigo-500/5'
                                    : 'bg-purple-600/20 text-indigo-50 border border-purple-500/20'
                                    }`}>
                                    {m.content}
                                </div>
                            </div>
                        ))}
                        {askingQuestion && (
                            <div className="flex gap-3">
                                <span className="p-3 text-xs text-indigo-400/50 flex items-center gap-2">
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    梦语正在思考...
                                </span>
                            </div>
                        )}
                        <div ref={qaEndRef} />
                    </div>

                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={qaInput}
                            onChange={(e) => setQaInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleQaSend()}
                            placeholder="回答梦语的提问或补充更多细节..."
                            className="flex-1 bg-indigo-950/50 border border-indigo-500/20 rounded-xl px-4 py-3 text-sm text-indigo-100 placeholder:text-indigo-400/30 focus:outline-none focus:border-indigo-500/40"
                        />
                        <button
                            onClick={handleQaSend}
                            disabled={!qaInput.trim() || askingQuestion}
                            className="p-3 bg-indigo-500/20 border border-indigo-500/30 rounded-xl text-indigo-200 hover:bg-indigo-500/30 transition-colors disabled:opacity-50"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
