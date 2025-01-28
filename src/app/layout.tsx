import type { Metadata } from "next";
import { Zen_Maru_Gothic } from "next/font/google";
import "./globals.css";

const zenMaruGothic = Zen_Maru_Gothic({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-zen-maru-gothic',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "昼ごはんガチャ",
  description: "昼ごはんを決めるのに迷ったときに使えるかもしれないガチャアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" data-theme="cupcake">
      <body className={zenMaruGothic.className}>
        {children}
      </body>
    </html>
  );
}