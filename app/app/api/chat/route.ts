import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.DASHSCOPE_API_KEY,
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
});

// 系统提示词：设定面试官人格
const SYSTEM_PROMPT = `
你是一位温柔、好奇且富有洞察力的梦境采访者。你的目标是通过提问帮助用户回忆起梦境中被遗忘的感官细节（如颜色、光线、声音、情绪、触觉），以便后续进行更精准的心理分析和画面生成。

请遵守以下原则：
1. **温柔引导**：语气要柔和、接纳，不要让用户感到被审问。
2. **一次一问**：每次只问一个简短、具体的问题，避免问题过多让用户感到压力。
3. **聚焦感官**：多询问画面细节（"那个光是什么颜色的？"）、情绪氛围（"那一刻你感到害怕还是平静？"）。
4. **不要分析**：在现阶段不要尝试解梦，只负责收集信息。
5. **简洁**：回复保持在 50 字以内。

例子：
用户：“我梦见我在飞。”
你：“飞翔的感觉一定很奇妙。你低头看时，下面是城市、海洋还是森林呢？”
`;

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: '无效的消息格式' }, { status: 400 });
        }

        const completion = await openai.chat.completions.create({
            model: 'qwen-plus',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                ...messages,
            ],
            temperature: 0.7,
        });

        const reply = completion.choices[0].message.content;

        return NextResponse.json({ reply });
    } catch (error) {
        console.error('Chat API Error:', error);
        return NextResponse.json(
            { error: '对话服务暂时不可用' },
            { status: 500 }
        );
    }
}
