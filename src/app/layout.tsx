import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono } from "next/font/google";
import ConditionalSiteChrome from "@/components/ConditionalSiteChrome";
import JsonLd from "@/components/seo/JsonLd";
import { brandImages } from "@/lib/brand";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { absoluteUrl, siteConfig } from "@/lib/siteConfig";
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
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Event crew & horecapersoneel inhuren`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: brandImages.favicon,
    apple: brandImages.favicon,
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: `${siteConfig.name} | Event crew & horecapersoneel inhuren`,
    description: siteConfig.description,
    url: siteConfig.url,
    images: [
      {
        url: absoluteUrl(siteConfig.defaultOgImage),
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Event crew & horecapersoneel inhuren`,
    description: siteConfig.description,
    images: [absoluteUrl(siteConfig.defaultOgImage)],
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
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <ConditionalSiteChrome>
          <main className="flex-1">{children}</main>
        </ConditionalSiteChrome>
        <Analytics />
      </body>
    </html>
  );
}
