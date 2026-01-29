'use client';

import { useState } from 'react';

interface DreamMediaProps {
    imageUrl: string;
    videoUrl: string;
    imagePrompt: string;
    onGenerateImage: () => void;
    onGenerateVideo: () => void;
    loading: {
        image: boolean;
        video: boolean;
    };
}

export default function DreamMedia({
    imageUrl,
    videoUrl,
    imagePrompt,
    onGenerateImage,
    onGenerateVideo,
    loading,
}: DreamMediaProps) {
    const [activeTab, setActiveTab] = useState<'image' | 'video'>('image');

    return (
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 mt-8">
            <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">🎨</span>
                <h2 className="text-xl font-semibold text-white/90">梦境可视化</h2>
            </div>

            {/* 标签切换 */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setActiveTab('image')}
                    className={`px-6 py-2 rounded-xl font-medium transition-all ${activeTab === 'image'
                            ? 'bg-purple-500 text-white'
                            : 'bg-white/10 text-white/60 hover:bg-white/20'
                        }`}
                >
                    🖼️ 梦境图像
                </button>
                <button
                    onClick={() => setActiveTab('video')}
                    className={`px-6 py-2 rounded-xl font-medium transition-all ${activeTab === 'video'
                            ? 'bg-purple-500 text-white'
                            : 'bg-white/10 text-white/60 hover:bg-white/20'
                        }`}
                >
                    🎬 梦境视频
                </button>
            </div>

            {/* 图像面板 */}
            {activeTab === 'image' && (
                <div>
                    {imageUrl ? (
                        <div className="relative rounded-2xl overflow-hidden">
                            <img
                                src={imageUrl}
                                alt="梦境图像"
                                className="w-full h-auto rounded-2xl shadow-lg"
                            />
                            <button
                                onClick={onGenerateImage}
                                disabled={loading.image}
                                className="absolute bottom-4 right-4 px-4 py-2 bg-black/50 backdrop-blur-sm 
                           rounded-lg text-white text-sm hover:bg-black/70 transition-colors"
                            >
                                🔄 重新生成
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-white/20 rounded-2xl">
                            {loading.image ? (
                                <div className="text-center">
                                    <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                    <p className="text-white/60">正在生成梦境图像...</p>
                                    <p className="text-white/40 text-sm mt-2">这可能需要 10-20 秒</p>
                                </div>
                            ) : (
                                <>
                                    <span className="text-6xl mb-4">🌌</span>
                                    <p className="text-white/60 mb-4">将你的梦境转化为超现实画作</p>
                                    <button
                                        onClick={onGenerateImage}
                                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 
                               rounded-xl text-white font-medium hover:opacity-90 transition-opacity"
                                    >
                                        ✨ 生成梦境图像
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* 视频面板 */}
            {activeTab === 'video' && (
                <div>
                    {videoUrl ? (
                        <div className="relative rounded-2xl overflow-hidden">
                            <video
                                src={videoUrl}
                                controls
                                autoPlay
                                loop
                                className="w-full h-auto rounded-2xl shadow-lg"
                            />
                            <button
                                onClick={onGenerateVideo}
                                disabled={loading.video}
                                className="absolute bottom-4 right-4 px-4 py-2 bg-black/50 backdrop-blur-sm 
                           rounded-lg text-white text-sm hover:bg-black/70 transition-colors"
                            >
                                🔄 重新生成
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-white/20 rounded-2xl">
                            {loading.video ? (
                                <div className="text-center">
                                    <div className="w-16 h-16 border-4 border-pink-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                    <p className="text-white/60">正在生成梦境视频...</p>
                                    <p className="text-white/40 text-sm mt-2">这可能需要 30-60 秒</p>
                                </div>
                            ) : (
                                <>
                                    <span className="text-6xl mb-4">🎬</span>
                                    <p className="text-white/60 mb-2">将你的梦境转化为动态短视频</p>
                                    {!imageUrl && (
                                        <p className="text-orange-400/80 text-sm mb-4">⚠️ 请先生成梦境图像</p>
                                    )}
                                    <button
                                        onClick={onGenerateVideo}
                                        disabled={!imageUrl}
                                        className="px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 
                               rounded-xl text-white font-medium 
                               hover:opacity-90 transition-opacity
                               disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        🎥 生成梦境视频
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* 提示词预览 */}
            {imagePrompt && (
                <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-2">图像生成提示词</p>
                    <p className="text-white/60 text-sm italic">{imagePrompt}</p>
                </div>
            )}
        </div>
    );
}
