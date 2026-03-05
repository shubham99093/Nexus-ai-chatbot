import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "NexusChat — AI-Powered Conversations",
  description:
    "Production-grade AI chat platform with real-time streaming, secure authentication, and intelligent conversations powered by GPT-4o.",
  keywords: ["AI chat", "GPT-4", "SaaS", "chatbot", "NexusChat"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
