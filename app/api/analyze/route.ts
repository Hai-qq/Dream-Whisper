import OpenAI from 'openai';
import { NextResponse } from 'next/server';

// 使用智谱 GLM API（兼容 OpenAI 格式）
// OpenAI client initialized lazily

const SYSTEM_PROMPT = `You are a professional dream analyst, integrating Jungian and Freudian psychoanalytic theories.
Your task is to conduct an in-depth psychological analysis of the dream description (which may include multi-turn conversations) and provide a prompt for image generation.

Please output in JSON format, ensuring **ALL fields (including symbol names) are in Simplified Chinese** (except image_prompt).
1. symbols: An array of key symbols and their symbolic meanings (symbol: Chinese, meaning: Chinese). Example: [{"symbol": "树", "meaning": "..."}] NOT [{"symbol": "tree", ...}]
2. emotional_tone: The overall emotional tone of the dream (Chinese).
3. psychological_insight: In-depth psychological insights (approx. 100-150 words, Chinese).
4. life_connection: Potential connections to real-life situations (approx. 100 words, Chinese).
5. suggestions: 3 constructive psychological or life advice points (Chinese).
6. image_prompt: A detailed English prompt for DALL-E 3 image generation. Requirements:
   - Include specific scene environment descriptions.
   - Describe the appearance of characters or creatures.
   - Detail key object forms.
   - Specify lighting and color atmosphere (e.g., golden sunset light, misty blue fog).
   - Visually represent emotional feelings.
   - Style: Surrealism, Ethereal atmosphere, Cinematic Lighting, highly detailed digital painting, trending on Artstation.
7. personality_traits: An object containing score (0-100) for these 5 dimensions used to build a persona radar chart:
   - creativity (Imagine power, novelty)
   - logic (Rationality, coherence)
   - emotion (Emotional intensity)
   - spirituality (Connection to self/universe)
   - realism (Connection to reality)
   Example: {"creativity": 80, "logic": 40, "emotion": 90, "spirituality": 60, "realism": 30}
`;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { dream, messages } = body;

        if (!dream && (!messages || messages.length === 0)) {
            return NextResponse.json({ error: '请输入梦境描述' }, { status: 400 });
        }

        // 构建 Prompt Context
        let userContent = "";
        if (messages && Array.isArray(messages)) {
            // 将对话历史转换为叙述文本
            userContent = "以下是用户关于梦境的描述对话：\n" +
                messages.map((m: any) => `${m.role === 'user' ? '用户' : '采访者'}: ${m.content}`).join('\n');
        } else {
            userContent = `用户的梦境描述：${dream}`;
        }


        const openai = new OpenAI({
            apiKey: process.env.GLM_API_KEY,
            baseURL: 'https://open.bigmodel.cn/api/paas/v4',
        });

        const response = await openai.chat.completions.create({
            model: 'glm-4-flash',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: userContent }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.7
        });

        const content = response.choices[0].message.content;
        if (!content) {
            return NextResponse.json({ error: '分析失败，请重试' }, { status: 500 });
        }

        const analysis = JSON.parse(content);
        return NextResponse.json(analysis);
    } catch (error) {
        console.error('Dream analysis error:', error);
        return NextResponse.json(
            { error: '分析过程中出现错误，请稍后重试' },
            { status: 500 }
        );
    }
}
