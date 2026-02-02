import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "梦语 - AI 梦境分析师",
  description: "基于 AI 的梦境记录与分析平台，解读你的潜意识密码",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
