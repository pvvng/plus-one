import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { paperlogy } from "./fonts/paperlogy";
import "./globals.css";
import Script from "next/script";
import Footer from "@/components/footer";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "플러스원! - 하루 한 번, 모두의 +1",
    template: "%s | 플러스원",
  },
  description:
    "하루에 한 번만 누를 수 있는 플러스원 버튼! 실시간으로 증가하는 숫자를 함께 만들어가요.",
  keywords: [
    "플러스원",
    "PlusOne",
    "Next.js",
    "Supabase",
    "realtime",
    "카운트",
    "하루 한 번",
  ],
  authors: [{ name: "pvvng", url: "https://github.com/pvvng" }],
  creator: "pvvng",
  verification: {
    google: "X8abBNxolxp2vkT2B7w1uCMZm9zkCEGLo0xpbL7Fw9U",
  },
  other: {
    "google-adsense-account": "ca-pub-7034464923554278",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src={`https://www.google.com/recaptcha/enterprise.js?render=${process.env.NEXT_PUBLIC_SITE_KEY}`}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${paperlogy.variable} antialiased`}
      >
        {children}
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
