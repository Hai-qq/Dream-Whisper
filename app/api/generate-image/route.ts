import { NextResponse } from 'next/server';

// 智谱 CogView API 配置
const GLM_API_URL = 'https://open.bigmodel.cn/api/paas/v4/images/generations';

export async function POST(req: Request) {
    console.log('=== 图像生成 API 开始 (智谱 CogView) ===');

    try {
        const { prompt } = await req.json();
        console.log('收到提示词:', prompt?.substring(0, 100) + '...');

        if (!prompt || prompt.trim().length === 0) {
            return NextResponse.json({ error: '请提供图像描述' }, { status: 400 });
        }

        // 增强提示词，确保梦境超现实风格
        const enhancedPrompt = `${prompt}，超现实主义梦境风格，神秘空灵的光线，柔和梦幻的氛围，丰富的紫色和金色色调，高质量，细节丰富`;

        console.log('开始调用智谱 CogView API...');
        const startTime = Date.now();

        const response = await fetch(GLM_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.GLM_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'cogview-3-plus',
                prompt: enhancedPrompt,
                size: '1024x1024',
            }),
        });

        const data = await response.json();

        const duration = Date.now() - startTime;
        console.log(`智谱 CogView 响应完成，耗时: ${duration}ms`);
        console.log('响应状态:', response.status);

        if (!response.ok) {
            console.error('API 错误:', data);
            return NextResponse.json(
                { error: data.error?.message || '图像生成失败' },
                { status: response.status }
            );
        }

        // CogView 返回格式: { data: [{ url: "..." }] }
        const imageUrl = data.data?.[0]?.url;

        if (!imageUrl) {
            console.error('未获取到图像 URL:', data);
            return NextResponse.json({ error: '图像生成失败' }, { status: 500 });
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
