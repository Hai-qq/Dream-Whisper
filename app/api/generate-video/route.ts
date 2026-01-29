import { NextResponse } from 'next/server';

// 阿里云 DashScope 通义万相 API 配置
const DASHSCOPE_VIDEO_API_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/image2video/video-synthesis';
const DASHSCOPE_TASK_URL = 'https://dashscope.aliyuncs.com/api/v1/tasks';

// 轮询等待视频生成完成
async function pollForVideo(taskId: string, apiKey: string, maxAttempts = 60): Promise<string | null> {
    for (let i = 0; i < maxAttempts; i++) {
        console.log(`轮询通义万相视频结果... 尝试 ${i + 1}/${maxAttempts}`);

        const response = await fetch(`${DASHSCOPE_TASK_URL}/${taskId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
            },
        });

        const data = await response.json();
        // console.log('轮询状态:', data.output?.task_status);

        if (data.output?.task_status === 'SUCCEEDED') {
            // 返回视频 URL
            return data.output.results?.[0]?.url || null;
        } else if (data.output?.task_status === 'FAILED' || data.output?.task_status === 'UNKNOWN') {
            console.error('视频生成失败:', data);
            return null;
        }

        // 等待 5 秒后继续轮询 (视频生成较慢)
        await new Promise(resolve => setTimeout(resolve, 5000));
    }

    return null;
}

export async function POST(req: Request) {
    console.log('=== 视频生成 API 开始 (通义万相 Wanx) ===');

    try {
        const { imageUrl, prompt } = await req.json();
        console.log('收到图像 URL:', imageUrl?.substring(0, 50) + '...');

        if (!imageUrl) {
            return NextResponse.json({ error: '请先生成图像' }, { status: 400 });
        }

        const apiKey = process.env.DASHSCOPE_API_KEY;

        if (!apiKey) {
            console.error('缺少 DashScope API Key');
            return NextResponse.json({ error: '服务配置错误' }, { status: 500 });
        }

        console.log('开始调用通义万相视频 API...');
        const startTime = Date.now();

        // 提交视频生成任务
        const response = await fetch(DASHSCOPE_VIDEO_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'X-DashScope-Async': 'enable',
            },
            body: JSON.stringify({
                model: 'wanx-v1',
                input: {
                    image_url: imageUrl,
                    prompt: prompt, // 可选提示词辅助生成
                },
                parameters: {
                    style: '<auto>'
                }
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('API 错误:', data);
            return NextResponse.json(
                { error: data.message || '视频生成任务提交失败' },
                { status: response.status }
            );
        }

        const taskId = data.output?.task_id;
        if (!taskId) {
            console.error('未获取到任务 ID:', data);
            return NextResponse.json({ error: '视频生成任务提交失败' }, { status: 500 });
        }

        console.log('任务 ID:', taskId);
        console.log('开始轮询等待视频生成...');

        // 轮询获取结果
        const videoUrl = await pollForVideo(taskId, apiKey);

        const duration = Date.now() - startTime;
        console.log(`通义万相视频生成完成，总耗时: ${duration}ms`);

        if (!videoUrl) {
            return NextResponse.json({ error: '视频生成超时或失败' }, { status: 500 });
        }

        console.log('视频生成成功:', videoUrl.substring(0, 50) + '...');

        // 返回代理 URL 以解决 CORS 问题 (DashScope URL 可能也会有 CORS)
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
