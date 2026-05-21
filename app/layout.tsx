import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Es Teh Solo — Authentic Javanese Iced Tea",
  description:
    "Racikan es teh melati asli Solo yang wangi, sepet, legit, dan kental. Crafted from the heart of Java since 2026.",
  keywords: ["es teh", "solo", "teh melati", "minuman tradisional", "iced tea indonesia"],
  openGraph: {
    title: "Es Teh Solo",
    description: "Authentic Javanese iced tea. Wangi, sepet, legit, kental.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${outfit.variable} font-[family-name:var(--font-outfit)] noise`}>
        {children}
      </body>
    </html>
  );
}