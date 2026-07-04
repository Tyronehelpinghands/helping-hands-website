import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Footer from "@/components/Footer";
import SiteChromeExtras from "@/components/SiteChromeExtras";
import Header from "@/components/Header";
import { brandImages } from "@/lib/brand";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Helping Hands Agency | Crew voor evenementen, horeca en productie",
  description:
    "Helping Hands Agency levert eventcrew, stagehands, horeca support en productieondersteuning voor festivals, stadions, beurzen, concerten en horecalocaties.",
  icons: {
    icon: brandImages.favicon,
    apple: brandImages.favicon,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nl"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#F5F7FA] pb-20 text-[#101828] lg:pb-0">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <SiteChromeExtras />
      </body>
    </html>
  );
}
