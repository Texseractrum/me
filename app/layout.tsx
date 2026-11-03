import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const description =
  "CEO of Sparkles (YC W26). Backed by Y Combinator and angels from OpenAI, Anthropic, a16z, General Catalyst, Cloudflare, and more.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.aidaniil.com"),
  title: "Dan Bekirov",
  description,
  openGraph: {
    title: "Dan Bekirov",
    description,
    url: "https://www.aidaniil.com",
    siteName: "Dan Bekirov",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dan Bekirov",
    description,
    creator: "@aidaniil",
  },
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='black'/%3E%3Ccircle cx='50' cy='50' r='8' fill='white'/%3E%3C/svg%3E",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistMono.variable} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
