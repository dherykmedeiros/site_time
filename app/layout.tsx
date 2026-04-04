import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import { PwaInit } from "@/components/pwa/PwaInit";
import { AuthSessionProvider } from "@/components/providers/AuthSessionProvider";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "VARzea - Gestao de Times Esportivos",
  description: "Plataforma para gestão de times esportivos amadores",
  manifest: "/manifest.webmanifest",
};

export const viewport = {
  themeColor: "#0a584b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${manrope.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <AuthSessionProvider>
          <PwaInit />
          {children}
        </AuthSessionProvider>
      </body>
    </html>
  );
}
