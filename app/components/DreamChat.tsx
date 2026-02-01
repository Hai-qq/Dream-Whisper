'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Moon, Sparkles, User, StopCircle } from 'lucide-react';

interface DreamChatProps {
    onAnalyze: (messages: { role: 'user' | 'assistant', content: string }[]) => void;
}

export default function DreamChat({ onAnalyze }: DreamChatProps) {
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
        { role: 'assistant', content: '你好，我是你的梦境记录员。昨晚你做了什么梦？请告诉我一些细节，比如你记得的画面、颜色、或者那一刻的感受。' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage = { role: 'user' as const, content: input.trim() };
        const newMessages = [...messages, userMessage];

        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages.slice(1) }), // Skip the greeting
            });

            if (!res.ok) throw new Error('Failed to fetch');

            const data = await res.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        } catch (error) {
            console.error('Chat error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = () => {
        onAnalyze(messages);
    };

    return (
        <div className="flex flex-col h-[600px] bg-indigo-950/20 backdrop-blur-xl rounded-3xl border border-indigo-500/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-indigo-500/10 bg-indigo-950/40">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/10 rounded-lg">
                        <Moon className="w-5 h-5 text-purple-300" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-indigo-50">梦境采访者</h2>
                        <p className="text-xs text-indigo-300/60">通过对话挖掘深层细节</p>
                    </div>
                </div>
                <button
                    onClick={handleComplete}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 
                               rounded-xl text-white font-medium text-sm
                               hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg hover:shadow-indigo-500/25"
                >
                    <Sparkles className="w-4 h-4" />
                    立即解析
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-indigo-500/10 scrollbar-track-transparent">
                {messages.map((m, i) => (
                    <div
                        key={i}
                        className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 
                            ${m.role === 'assistant' ? 'bg-indigo-500/10' : 'bg-purple-500/10'}`}>
                            {m.role === 'assistant' ?
                                <Moon className="w-4 h-4 text-indigo-300" /> :
                                <User className="w-4 h-4 text-purple-300" />
                            }
                        </div>
                        <div
                            className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed
                                ${m.role === 'assistant'
                                    ? 'bg-indigo-950/40 text-indigo-100 rounded-tl-none border border-indigo-500/10'
                                    : 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-tr-none shadow-lg'
                                }`}
                        >
                            {m.content}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                            <Moon className="w-4 h-4 text-indigo-300" />
                        </div>
                        <div className="bg-indigo-950/40 p-4 rounded-2xl rounded-tl-none border border-indigo-500/10 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-indigo-950/40 border-t border-indigo-500/10">
                <form
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="relative flex items-center gap-2"
                >
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="描述你的梦境..."
                        className="flex-1 bg-indigo-950/50 border border-indigo-500/20 rounded-xl px-4 py-3 
                                   text-indigo-100 placeholder:text-indigo-400/30 focus:outline-none focus:border-indigo-500/50
                                   transition-colors"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className="p-3 bg-indigo-600 rounded-xl text-white hover:bg-indigo-500 
                                   disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
}
