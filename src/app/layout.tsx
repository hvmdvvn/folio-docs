import type { Metadata } from "next";
import { Manrope, Source_Serif_4, Syne } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Folio — shared writing without the weight",
  description:
    "A lightweight collaborative document editor for teams. Create, import, edit, and share drafts.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${manrope.variable} ${sourceSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full folio-noise">{children}</body>
    </html>
  );
}
