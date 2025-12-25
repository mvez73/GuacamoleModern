import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Apache Guacamole - Modern Frontend",
  description: "A modern, sleek frontend interface for Apache Guacamole with beautiful UI/UX. Built with Next.js 15, TypeScript, and shadcn/ui.",
  keywords: ["Guacamole", "Apache Guacamole", "Remote Desktop", "RDP", "VNC", "SSH", "Next.js", "TypeScript", "Tailwind CSS"],
  authors: [{ name: "Guacamole Modern Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Apache Guacamole Modern Frontend",
    description: "Modern interface for Apache Guacamole remote desktop gateway",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Apache Guacamole Modern Frontend",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@0..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider defaultTheme="light" storageKey="guacamole-theme">
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
