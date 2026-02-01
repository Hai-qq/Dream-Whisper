import { NextResponse } from 'next/server';

// 阿里云 DashScope 通义万相 API 配置
const DASHSCOPE_API_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis';
const DASHSCOPE_TASK_URL = 'https://dashscope.aliyuncs.com/api/v1/tasks';

// 轮询等待图像生成完成
async function pollForImage(taskId: string, apiKey: string, maxAttempts = 30): Promise<string | null> {
    for (let i = 0; i < maxAttempts; i++) {
        console.log(`轮询通义万相结果... 尝试 ${i + 1}/${maxAttempts}`);

        const response = await fetch(`${DASHSCOPE_TASK_URL}/${taskId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
            },
        });

        const data = await response.json();
        // console.log('轮询状态:', data.output?.task_status);

        if (data.output?.task_status === 'SUCCEEDED') {
            // 返回图像 URL
            return data.output.results?.[0]?.url || null;
        } else if (data.output?.task_status === 'FAILED' || data.output?.task_status === 'UNKNOWN') {
            console.error('图像生成失败:', data);
            return null;
        }

        // 等待 2 秒后继续轮询
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    return null;
}

export async function POST(req: Request) {
    console.log('=== 图像生成 API 开始 (通义万相 Wanx) ===');

    try {
        const { prompt } = await req.json();
        console.log('收到提示词:', prompt?.substring(0, 100) + '...');

        if (!prompt || prompt.trim().length === 0) {
            return NextResponse.json({ error: '请提供图像描述' }, { status: 400 });
        }

        const apiKey = process.env.DASHSCOPE_API_KEY;

        if (!apiKey) {
            console.error('缺少 DashScope API Key');
            return NextResponse.json({ error: '服务配置错误' }, { status: 500 });
        }

        // 增强提示词，简洁动漫风格
        const enhancedPrompt = `${prompt}, 动漫风格, 简洁线条, 柔和色彩, 吉卜力风格, 梦幻氛围, 极简背景, 柔光, 插画风格`;

        console.log('开始调用通义万相 API...');
        const startTime = Date.now();

        // 提交生成任务
        const response = await fetch(DASHSCOPE_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'X-DashScope-Async': 'enable',
            },
            body: JSON.stringify({
                model: 'wanx-v1',
                input: {
                    prompt: enhancedPrompt,
                },
                parameters: {
                    style: '<auto>',
                    size: '1024*1024',
                    n: 1,
                }
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('API 错误:', data);
            return NextResponse.json(
                { error: data.message || '图像生成失败' },
                { status: response.status }
            );
        }

        const taskId = data.output?.task_id;
        if (!taskId) {
            console.error('未获取到任务 ID:', data);
            return NextResponse.json({ error: '任务提交失败' }, { status: 500 });
        }

        console.log('任务 ID:', taskId);
        console.log('开始轮询等待图像生成...');

        const imageUrl = await pollForImage(taskId, apiKey);

        const duration = Date.now() - startTime;
        console.log(`通义万相响应完成，总耗时: ${duration}ms`);

        if (!imageUrl) {
            return NextResponse.json({ error: '图像生成超时或失败' }, { status: 500 });
        }

        console.log('图像生成成功:', imageUrl.substring(0, 50) + '...');
        return NextResponse.json({ imageUrl });

    } catch (error) {
        console.error('=== 图像生成错误 ===');
        console.error('错误详情:', error);
        return NextResponse.json(
            { error: '图像生成过程中出现错误，请稍后重试' },
            { status: 500 }
        );
    }
}
