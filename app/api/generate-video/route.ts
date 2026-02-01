import { NextResponse } from 'next/server';

// 智谱 CogVideoX API 配置
const GLM_VIDEO_API_URL = 'https://open.bigmodel.cn/api/paas/v4/videos/generations';

// 下载图片并转换为 Base64 data URI
async function imageUrlToDataUri(imageUrl: string): Promise<string> {
    console.log('正在下载图片转 Base64...');
    const response = await fetch(imageUrl);

    if (!response.ok) {
        throw new Error(`下载图片失败: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');

    const contentType = response.headers.get('content-type') || 'image/png';
    console.log(`图片类型: ${contentType}, Base64 长度: ${base64.length}`);

    // 返回 data URI 格式
    return `data:${contentType};base64,${base64}`;
}

// 轮询等待视频生成完成
async function pollForVideo(taskId: string, apiKey: string, maxAttempts = 120): Promise<string | null> {
    for (let i = 0; i < maxAttempts; i++) {
        console.log(`轮询视频结果... 尝试 ${i + 1}/${maxAttempts}`);

        const response = await fetch(`https://open.bigmodel.cn/api/paas/v4/async-result/${taskId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
            },
        });

        const data = await response.json();
        console.log('轮询状态:', data.task_status);

        if (data.task_status === 'SUCCESS') {
            // 返回视频 URL
            const videoResult = data.video_result?.[0];
            return videoResult?.url || videoResult?.cover_image_url || null;
        } else if (data.task_status === 'FAIL') {
            console.error('视频生成失败:', data);
            return null;
        }

        // 等待 5 秒后继续轮询
        await new Promise(resolve => setTimeout(resolve, 5000));
    }

    return null;
}

export async function POST(req: Request) {
    console.log('=== 视频生成 API 开始 (智谱 CogVideoX) ===');

    try {
        const { imageUrl, prompt } = await req.json();
        console.log('收到图像 URL:', imageUrl?.substring(0, 80) + '...');

        if (!imageUrl) {
            return NextResponse.json({ error: '请先生成图像' }, { status: 400 });
        }

        const apiKey = process.env.GLM_API_KEY;

        if (!apiKey) {
            console.error('缺少 GLM API Key');
            return NextResponse.json({ error: '服务配置错误' }, { status: 500 });
        }

        // 将图片 URL 转换为 Base64 data URI
        let imageDataUri: string;
        try {
            imageDataUri = await imageUrlToDataUri(imageUrl);
        } catch (e) {
            console.error('图片转 Base64 失败:', e);
            return NextResponse.json({ error: '图片处理失败，请重试' }, { status: 500 });
        }

        console.log('开始调用智谱 CogVideoX API...');
        const startTime = Date.now();

        // 提交视频生成任务
        const response = await fetch(GLM_VIDEO_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'cogvideox',
                image_url: imageDataUri,
                prompt: prompt || '轻柔流动，梦幻氛围，缓慢移动的光影效果，电影级画面',
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('API 错误:', data);
            return NextResponse.json(
                { error: data.error?.message || '视频生成任务提交失败' },
                { status: response.status }
            );
        }

        // CogVideoX 返回异步任务 ID
        const taskId = data.id;
        if (!taskId) {
            console.error('未获取到任务 ID:', data);
            return NextResponse.json({ error: '视频生成任务提交失败' }, { status: 500 });
        }

        console.log('任务 ID:', taskId);
        console.log('开始轮询等待视频生成...');

        // 轮询获取结果
        const videoUrl = await pollForVideo(taskId, apiKey);

        const duration = Date.now() - startTime;
        console.log(`视频生成完成，总耗时: ${duration}ms`);

        if (!videoUrl) {
            return NextResponse.json({ error: '视频生成超时或失败' }, { status: 500 });
        }

        console.log('视频生成成功:', videoUrl.substring(0, 80) + '...');

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
