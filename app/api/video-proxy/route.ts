import { NextResponse } from 'next/server';

// 代理获取视频，解决 CORS 问题
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const videoUrl = searchParams.get('url');

    if (!videoUrl) {
        return NextResponse.json({ error: '缺少视频 URL' }, { status: 400 });
    }

    try {
        console.log('代理获取视频:', videoUrl.substring(0, 50) + '...');

        const response = await fetch(videoUrl);

        if (!response.ok) {
            return NextResponse.json(
                { error: '获取视频失败' },
                { status: response.status }
            );
        }

        const videoBuffer = await response.arrayBuffer();

        return new NextResponse(videoBuffer, {
            headers: {
                'Content-Type': 'video/mp4',
                'Content-Length': videoBuffer.byteLength.toString(),
                'Cache-Control': 'public, max-age=31536000',
            },
        });
    } catch (error) {
        console.error('视频代理错误:', error);
        return NextResponse.json(
            { error: '视频获取失败' },
            { status: 500 }
        );
    }
}
