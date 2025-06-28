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
import { CreditsProvider } from "../contexts/CreditsContext";

// SEO Constants
const siteConfig = {
  title: "Aplikasi AI untuk Desain Interior",
  description:
    "Ubah tampilan ruangan Anda dengan Ide Interior, aplikasi AI untuk desain interior yang mudah dan terjangkau. Unggah foto, pilih tema, dan lihat transformasi ruangan dalam hitungan detik. Coba sekarang!",
  ogImage: "https://ideinteriorai.com/og-ideinteriorai.png",
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
    "ide interior",
    "ide interior ai",
    "ide interior ai app",
    "ide interior ai website",
    "ide interior ai website design",
    "ide interior ai website design app",
    "ide interior ai website design app",
    "aplikasi desain interior",
    "aplikasi ide desain interior",
    "aplikasi ide interior",
    "aplikasi ide interior ai",
  ],
  authors: [{ name: "Ide Interior AI" }],
  creator: "Ide Interior AI",
  icons: {
    icon: "/ideinteriorlogo.svg",
    shortcut: "/ideinteriorlogo.svg",
    apple: "/ideinteriorlogo.svg",
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
    google: "wac0TQpbCmDsE2geC6_W8kYANCfjooZf0BcBcCgsd5E"
  },
};

const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

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

          <meta name="msvalidate.01" content="0AA0BF0DAA3606B94D4549A3755748DC" />
          
          {/* START Facebook Pixel */}
          {FB_PIXEL_ID && ( // Pastikan Pixel ID ada sebelum merender script
              <>
                  <script
                      dangerouslySetInnerHTML={{
                          __html: `
                              !function(f,b,e,v,n,t,s)
                              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                              n.queue=[];t=b.createElement(e);t.async=!0;
                              t.src=v;s=b.getElementsByTagName(e)[0];
                              s.parentNode.insertBefore(t,s)}(window, document,'script',
                              'https://connect.facebook.net/en_US/fbevents.js');
                              fbq('init', '${FB_PIXEL_ID}');
                              fbq('track', 'PageView');
                          `,
                      }}
                  />
                  <noscript>
                      <img
                          height="1"
                          width="1"
                          style={{ display: 'none' }}
                          src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
                      />
                  </noscript>
              </>
          )}
          {/* END Facebook Pixel */}
        </head>
        <body className="bg-[#17181C] text-white">
          <CreditsProvider>{children}</CreditsProvider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
