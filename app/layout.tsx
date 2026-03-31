import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import { PwaInit } from "@/components/pwa/PwaInit";
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
  title: "Site Time - Gestão de Times Esportivos",
  description: "Plataforma para gestão de times esportivos amadores",
  manifest: "/manifest.webmanifest",
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
      <body className="min-h-full flex flex-col">
        <PwaInit />
        {children}
      </body>
    </html>
  );
}
