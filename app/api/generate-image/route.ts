import { NextResponse } from 'next/server';

// 火山引擎方舟 (Volcengine Ark) API 配置
const ARK_API_URL = 'https://ark.cn-beijing.volces.com/api/v3/images/generations';
// const MODEL_ID = '0101fe84-eddc-4a08-9ef1-f72fc9cef348'; // 用户提供的 ID 未找到，使用可用模型
const MODEL_ID = 'doubao-seedream-4-5-251128';

export async function POST(req: Request) {
    console.log('=== 图像生成 API 开始 (火山引擎 Ark) ===');

    try {
        const { prompt } = await req.json();
        console.log('收到提示词:', prompt?.substring(0, 100) + '...');

        if (!prompt || prompt.trim().length === 0) {
            return NextResponse.json({ error: '请提供图像描述' }, { status: 400 });
        }

        const apiKey = process.env.ARK_API_KEY;

        if (!apiKey) {
            console.error('缺少 ARK API Key');
            return NextResponse.json({ error: '服务配置错误' }, { status: 500 });
        }

        // 增强提示词，简洁动漫风格
        const enhancedPrompt = `${prompt}, 动漫风格, 简洁线条, 柔和色彩, 吉卜力风格, 梦幻氛围, 极简背景, 柔光, 插画风格`;

        console.log('开始调用火山引擎 Ark API...');
        const startTime = Date.now();

        // 提交生成任务 (OpenAI 兼容接口通常是同步的，但有些模型耗时较长可能需要较长超时设置)
        // 参考用户提供的示例：
        // size: "2K", watermark: true, sequential_image_generation: "disabled"
        const response = await fetch(ARK_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: MODEL_ID,
                prompt: enhancedPrompt,
                sequential_image_generation: "disabled",
                response_format: "url",
                size: "2K",
                stream: false,
                watermark: true
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('API 错误:', data);
            return NextResponse.json(
                { error: data.error?.message || '图像生成失败' },
                { status: response.status }
            );
        }

        const duration = Date.now() - startTime;
        console.log(`火山引擎响应完成，总耗时: ${duration}ms`);

        const imageUrl = data.data?.[0]?.url;

        if (!imageUrl) {
            console.error('未收到图像 URL:', data);
            return NextResponse.json({ error: '图像生成失败，未返回 URL' }, { status: 500 });
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

