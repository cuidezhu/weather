import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "七天天气预报",
  description: "查看全国各地未来七天天气情况",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
