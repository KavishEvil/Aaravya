import type { Metadata } from "next";
import { Outfit, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Aaravya Hospital — Proctology & Colorectal Care, Ahmedabad",
    template: "%s | Aaravya Hospital",
  },
  description:
    "Aaravya Hospital, Chandkheda, Ahmedabad — dedicated proctology, general surgery, urology, and peripheral vascular care under Dr. Deep Prajapati and Dr. Dipti Prajapati.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body">{children}</body>
    </html>
  );
}
