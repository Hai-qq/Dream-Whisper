import { NextResponse } from 'next/server';

// 火山引擎 Ark 视频生成 API 配置
const ARK_VIDEO_API_URL = 'https://ark.cn-beijing.volces.com/api/v3/contents/generations/tasks';
// const MODEL_ID = '9825a1a6-df28-4ede-9ee2-36187cc34da9'; // 用户提供的 ID 未找到，使用可用模型
const MODEL_ID = 'doubao-seedance-1-5-pro-251215';

// 轮询等待视频生成完成
async function pollForVideo(taskId: string, apiKey: string, maxAttempts = 120): Promise<string | null> {
    for (let i = 0; i < maxAttempts; i++) {
        console.log(`轮询视频结果... 尝试 ${i + 1}/${maxAttempts}`);

        const response = await fetch(`${ARK_VIDEO_API_URL}/${taskId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
            },
        });

        const data = await response.json();
        console.log('轮询状态:', data.status);

        if (data.status === 'succeeded') {
            // 返回视频 URL
            // Ark 通常在 content.video_url 或 result.video_url 返回
            console.log('任务成功数据:', JSON.stringify(data.content));
            return data.content?.video_url || data.content?.url || data.result?.video_url || null;
        } else if (data.status === 'failed') {
            console.error('视频生成失败:', data);
            return null;
        }

        // 等待 5 秒后继续轮询
        await new Promise(resolve => setTimeout(resolve, 5000));
    }

    return null;
}

export async function POST(req: Request) {
    console.log('=== 视频生成 API 开始 (火山引擎 Ark) ===');

    try {
        const { imageUrl, prompt } = await req.json();
        console.log('收到图像 URL:', imageUrl?.substring(0, 80) + '...');

        if (!imageUrl) {
            return NextResponse.json({ error: '请先生成图像' }, { status: 400 });
        }

        const apiKey = process.env.ARK_API_KEY;

        if (!apiKey) {
            console.error('缺少 ARK API Key');
            return NextResponse.json({ error: '服务配置错误' }, { status: 500 });
        }

        console.log('开始调用火山引擎 Ark Video API...');
        const startTime = Date.now();

        // 提交视频生成任务
        // 使用 Content Generation API 格式
        // 参考用户提供的示例：
        // {
        //     "model": "doubao-seedance-1-5-pro-251215",
        //     "content": [
        //         {
        //             "type": "text",
        //             "text": "prompt --duration 5 --camerafixed false --watermark true"
        //         },
        //         {
        //             "type": "image_url",
        //             "image_url": {
        //                 "url": "https://..."
        //             }
        //         }
        //     ]
        // }
        const response = await fetch(ARK_VIDEO_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: MODEL_ID,
                generate_audio: false, // 禁用音频生成
                content: [
                    {
                        type: "text",
                        text: `${prompt || '让画面动起来，轻柔流动'} --duration 5 --camerafixed false --watermark true`
                    },
                    {
                        type: "image_url",
                        image_url: { url: imageUrl }
                    }
                ]
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

        // Ark 返回任务 ID usually in 'id'
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

        // 返回代理 URL 以解决 CORS 问题 (如果需要)
        // 假设 Ark 返回的 URL 是可以直接访问的 AWS S3 / TOS 链接
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
