import type { Metadata } from "next";
import { PwaInit } from "@/components/pwa/PwaInit";
import { AuthSessionProvider } from "@/components/providers/AuthSessionProvider";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

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
    <html lang="pt-BR" className="h-full antialiased">
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
