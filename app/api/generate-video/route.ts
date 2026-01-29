import { NextResponse } from 'next/server';

// 智谱 CogVideoX API 配置
const GLM_VIDEO_API_URL = 'https://open.bigmodel.cn/api/paas/v4/videos/generations';
const GLM_ASYNC_RESULT_URL = 'https://open.bigmodel.cn/api/paas/v4/async-result';

// 轮询等待视频生成完成
async function pollForResult(taskId: string, apiKey: string, maxAttempts = 60): Promise<string | null> {
    for (let i = 0; i < maxAttempts; i++) {
        console.log(`轮询视频结果... 尝试 ${i + 1}/${maxAttempts}`);

        const response = await fetch(`${GLM_ASYNC_RESULT_URL}/${taskId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
            },
        });

        const data = await response.json();
        console.log('轮询响应:', data.task_status);

        if (data.task_status === 'SUCCESS') {
            // 返回视频 URL
            return data.video_result?.[0]?.url || null;
        } else if (data.task_status === 'FAIL') {
            console.error('视频生成失败:', data);
            return null;
        }

        // 等待 3 秒后继续轮询
        await new Promise(resolve => setTimeout(resolve, 3000));
    }

    return null;
}

export async function POST(req: Request) {
    console.log('=== 视频生成 API 开始 (智谱 CogVideoX) ===');

    try {
        const { imageUrl, prompt } = await req.json();
        console.log('收到图像 URL:', imageUrl?.substring(0, 50) + '...');
        console.log('收到提示词:', prompt?.substring(0, 100) + '...');

        if (!imageUrl) {
            return NextResponse.json({ error: '请先生成图像' }, { status: 400 });
        }

        // 使用提示词生成视频（图生视频）
        const videoPrompt = prompt
            ? `${prompt}，梦幻流动的画面，缓慢的镜头移动，神秘的氛围`
            : '梦幻流动的画面，缓慢的镜头移动，神秘的氛围';

        console.log('开始调用智谱 CogVideoX API...');
        const startTime = Date.now();

        // 提交视频生成任务
        const response = await fetch(GLM_VIDEO_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.GLM_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'cogvideox',
                image_url: imageUrl,
                prompt: videoPrompt,
            }),
        });

        const data = await response.json();
        console.log('提交任务响应:', data);

        if (!response.ok) {
            console.error('API 错误:', data);
            return NextResponse.json(
                { error: data.error?.message || '视频生成任务提交失败' },
                { status: response.status }
            );
        }

        // 获取任务 ID
        const taskId = data.id;
        if (!taskId) {
            console.error('未获取到任务 ID:', data);
            return NextResponse.json({ error: '视频生成任务提交失败' }, { status: 500 });
        }

        console.log('任务 ID:', taskId);
        console.log('开始轮询等待视频生成...');

        // 轮询获取结果
        const videoUrl = await pollForResult(taskId, process.env.GLM_API_KEY || '');

        const duration = Date.now() - startTime;
        console.log(`视频生成完成，总耗时: ${duration}ms`);

        if (!videoUrl) {
            return NextResponse.json({ error: '视频生成超时或失败' }, { status: 500 });
        }

        console.log('视频生成成功:', videoUrl.substring(0, 50) + '...');

        // 返回代理 URL 以解决 CORS 问题
        const proxyUrl = `/api/video-proxy?url=${encodeURIComponent(videoUrl)}`;
        return NextResponse.json({ videoUrl: proxyUrl });
    } catch (error) {
        console.error('=== 视频生成错误 ===');
        console.error('错误详情:', error);
        return NextResponse.json(
            { error: '视频生成过程中出现错误，请稍后重试' },
            { status: 500 }
        );
    }
}
