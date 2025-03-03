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
  title: "Aplikasi AI untuk Desain Interior",
  description:
    "Ubah tampilan ruangan Anda dengan Ide Interior, aplikasi AI untuk desain interior yang mudah dan terjangkau. Unggah foto, pilih tema, dan lihat transformasi ruangan dalam hitungan detik. Coba sekarang!",
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

          {/* Add Midtrans Snap */}
          <Script
            src={`${process.env.MIDTRANS_HOST_URL}/snap/snap.js`}
            data-client-key={process.env.MIDTRANS_CLIENT_KEY}
            strategy="beforeInteractive"
          />

          {/* Google Analytics and Ads */}
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-SVVJJV1SPD"
          ></script>
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=AW-16905274859"
          ></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-SVVJJV1SPD');
                gtag('config', 'AW-16905274859');
              `,
            }}
          />
        </head>
        <body className="bg-[#17181C] text-white">
          {children}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
