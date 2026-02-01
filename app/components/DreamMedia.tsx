'use client';

import { useState } from 'react';
import { Image as ImageIcon, Video, RefreshCw, Sparkles, AlertCircle, Play } from 'lucide-react';

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
        <div className="bg-indigo-950/20 backdrop-blur-xl rounded-3xl p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-indigo-500/20 mt-8 order-3 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                    <ImageIcon className="w-6 h-6 text-purple-300" />
                </div>
                <h2 className="text-xl font-semibold text-indigo-50">梦境可视化</h2>
            </div>

            {/* 标签切换 */}
            <div className="flex gap-2 mb-6 p-1 bg-indigo-950/40 rounded-xl border border-indigo-500/10 w-fit">
                <button
                    onClick={() => setActiveTab('image')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all duration-300 ${activeTab === 'image'
                        ? 'bg-indigo-500/20 text-indigo-50 shadow-sm ring-1 ring-inset ring-indigo-500/20'
                        : 'text-indigo-300/60 hover:text-indigo-200'
                        }`}
                >
                    <ImageIcon className="w-4 h-4" />
                    <span>梦境图像</span>
                </button>
                <button
                    onClick={() => setActiveTab('video')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all duration-300 ${activeTab === 'video'
                        ? 'bg-indigo-500/20 text-indigo-50 shadow-sm ring-1 ring-inset ring-indigo-500/20'
                        : 'text-indigo-300/60 hover:text-indigo-200'
                        }`}
                >
                    <Video className="w-4 h-4" />
                    <span>梦境视频</span>
                </button>
            </div>

            {/* 图像面板 */}
            {activeTab === 'image' && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    {imageUrl ? (
                        <div className="relative rounded-2xl overflow-hidden group border border-indigo-500/20">
                            <img
                                src={imageUrl}
                                alt="梦境图像"
                                className="w-full h-auto rounded-2xl shadow-lg"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <button
                                onClick={onGenerateImage}
                                disabled={loading.image}
                                className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-indigo-950/80 backdrop-blur-md border border-indigo-500/30
                           rounded-lg text-indigo-100 text-sm hover:bg-indigo-900/90 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading.image ? 'animate-spin' : ''}`} />
                                重新生成
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-indigo-500/10 rounded-2xl bg-indigo-950/10">
                            {loading.image ? (
                                <div className="text-center">
                                    <div className="relative w-20 h-20 mx-auto mb-6">
                                        <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                                        <div className="absolute inset-0 border-4 border-t-purple-500 rounded-full animate-spin"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
                                        </div>
                                    </div>
                                    <p className="text-indigo-200/90 font-medium text-lg">正在绘制梦境...</p>
                                    <p className="text-indigo-400/50 text-sm mt-2">AI 正在捕捉潜意识的画面</p>
                                </div>
                            ) : (
                                <>
                                    <div className="w-20 h-20 bg-indigo-500/5 rounded-full flex items-center justify-center mb-6 ring-1 ring-indigo-500/20">
                                        <ImageIcon className="w-10 h-10 text-indigo-400/50" />
                                    </div>
                                    <p className="text-indigo-200/60 mb-6 text-lg">将你的梦境转化为超现实画作</p>
                                    <button
                                        onClick={onGenerateImage}
                                        className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 
                               rounded-xl text-white font-medium hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg hover:shadow-indigo-500/25"
                                    >
                                        <Sparkles className="w-5 h-5" />
                                        生成梦境图像
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* 视频面板 */}
            {activeTab === 'video' && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    {videoUrl ? (
                        <div className="relative rounded-2xl overflow-hidden group border border-indigo-500/20">
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
                                className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-indigo-950/80 backdrop-blur-md border border-indigo-500/30
                           rounded-lg text-indigo-100 text-sm hover:bg-indigo-900/90 transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading.video ? 'animate-spin' : ''}`} />
                                重新生成
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-indigo-500/10 rounded-2xl bg-indigo-950/10">
                            {loading.video ? (
                                <div className="text-center">
                                    <div className="relative w-20 h-20 mx-auto mb-6">
                                        <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                                        <div className="absolute inset-0 border-4 border-t-pink-500 rounded-full animate-spin"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Video className="w-8 h-8 text-pink-400 animate-pulse" />
                                        </div>
                                    </div>
                                    <p className="text-indigo-200/90 font-medium text-lg">正在编织梦境影像...</p>
                                    <p className="text-indigo-400/50 text-sm mt-2">这可能需要一点时间</p>
                                </div>
                            ) : (
                                <>
                                    <div className="w-20 h-20 bg-indigo-500/5 rounded-full flex items-center justify-center mb-6 ring-1 ring-indigo-500/20">
                                        <Video className="w-10 h-10 text-indigo-400/50" />
                                    </div>
                                    <p className="text-indigo-200/60 mb-2 text-lg">将你的梦境转化为动态短视频</p>
                                    {!imageUrl && (
                                        <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-lg mb-6">
                                            <AlertCircle className="w-4 h-4 text-orange-400" />
                                            <p className="text-orange-300/80 text-sm">请先生成梦境图像</p>
                                        </div>
                                    )}
                                    <button
                                        onClick={onGenerateVideo}
                                        disabled={!imageUrl}
                                        className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-pink-600 to-rose-600 
                               rounded-xl text-white font-medium 
                               hover:from-pink-500 hover:to-rose-500 transition-all shadow-lg hover:shadow-pink-500/25
                               disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none grayscale disabled:grayscale-0"
                                    >
                                        <Play className="w-5 h-5 fill-current" />
                                        生成梦境视频
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}


        </div>
    );
}
