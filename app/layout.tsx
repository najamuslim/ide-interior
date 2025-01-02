import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import "../styles/globals.css";

let title = "Desain Interior";
let description = "Ciptakan ruangan impian Anda dalam beberapa detik.";
let ogimage = "https://roomgpt-demo.vercel.app/og-image.png";
let sitename = "DesainInterior.net";

export const metadata: Metadata = {
  title,
  description,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    images: [ogimage],
    title,
    description,
    url: "https://roomgpt-demo.vercel.app",
    siteName: sitename,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: [ogimage],
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-[#17181C] text-white">
          {children}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
