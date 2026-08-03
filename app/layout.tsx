import type { Metadata } from "next";
import { Manrope, Space_Grotesk, IBM_Plex_Sans, IBM_Plex_Serif, JetBrains_Mono } from "next/font/google";
import { PwaInit } from "@/components/pwa/PwaInit";
import { AuthSessionProvider } from "@/components/providers/AuthSessionProvider";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const ibmPlexSerif = IBM_Plex_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "Site Time - Gestão de Times Esportivos",
  description: "Plataforma para gestão de times esportivos amadores",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Site Time",
  },
};

export const viewport = {
  themeColor: "#0d1117",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${manrope.variable} ${spaceGrotesk.variable} ${ibmPlexSans.variable} ${ibmPlexSerif.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <AuthSessionProvider>
          <ToastProvider>
            <PwaInit />
            {children}
          </ToastProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
