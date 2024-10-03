import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Pomopilot | Classic Pomodoro Timer",
  description:
    "Pomopilot is a classic pomodoro timer that works on desktop and mobile browser. This app helps you to focus on any task you are working on!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
