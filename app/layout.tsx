import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import Script from "next/script";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import "../styles/globals.css";

// SEO Constants
const siteConfig = {
  title: "Desain Interior - AI Interior Design",
  description:
    "Ciptakan ruangan impian Anda dalam beberapa detik dengan bantuan AI. Desain interior profesional untuk rumah dan kantor Anda.",
  ogImage: "https://ideinteriorai.com/favicon.ico",
  siteName: "ideinteriorai.com",
  siteUrl: "https://ideinteriorai.com",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.siteName}`,
  },
  description: siteConfig.description,
  keywords: [
    "desain interior",
    "interior design",
    "AI interior",
    "desain rumah",
    "interior minimalis",
    "interior modern",
    "dekorasi rumah",
  ],
  authors: [{ name: "Your Name" }],
  creator: "Your Name",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteConfig.siteUrl,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.siteName,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    // Add your bing verification if needed
    // bing: 'your-bing-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="id">
        <head>
          {/* Google AdSense Script */}
          <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
            strategy="afterInteractive"
            data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
            crossOrigin="anonymous"
          />

          {/* Structured Data for Website */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: siteConfig.siteName,
                url: siteConfig.siteUrl,
                description: siteConfig.description,
                potentialAction: {
                  "@type": "SearchAction",
                  target: `${siteConfig.siteUrl}/search?q={search_term_string}`,
                  "query-input": "required name=search_term_string",
                },
              }),
            }}
          />

          {/* Preconnect to important third-party domains */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />

          {/* PWA meta tags */}
          <meta name="application-name" content={siteConfig.siteName} />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta
            name="apple-mobile-web-app-title"
            content={siteConfig.siteName}
          />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="theme-color" content="#17181C" />
        </head>
        <body className="bg-[#17181C] text-white">
          {children}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
