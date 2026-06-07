import { Toaster } from "react-hot-toast";
import "./globals.css";
import AuthProvider from "@/AuthProvider/AuthProvider";

import { DM_Sans } from "next/font/google";
import Providers from "./providers/QueryProvider";
import { ThemeProvider } from "@/AuthProvider/ThemeContext";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata = {
  title: {
    default: "Premium Leather Goods | Shoes, Bags & Accessories",
    template: "%s | Premium Leather Goods"
  },
  description: "Discover handcrafted premium leather products including stylish shoes, elegant money bags, wallets, and accessories. Quality craftsmanship with genuine leather.",
  keywords: ["leather shoes", "leather money bag", "leather wallet", "premium leather", "handcrafted leather", "leather accessories", "genuine leather products"],
  authors: [{ name: "Discount Leather" }],
  creator: "Discount Leather",
  publisher: "Discount Leather",
  openGraph: {
    title: "Premium Leather Goods | Shoes, Bags & Accessories",
    description: "Discover handcrafted premium leather products including stylish shoes, elegant money bags, wallets, and accessories.",
    type: "website",
    locale: "en_US",
    siteName: "Discount Leather",
    images: [
      {
        url: "/og-image.jpg", // Add your OG image path
        width: 1200,
        height: 630,
        alt: "Premium Leather Products Collection"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Premium Leather Goods | Shoes, Bags & Accessories",
    description: "Discover handcrafted premium leather products including stylish shoes, elegant money bags, wallets, and accessories.",
    images: ["/og-image.jpg"], // Same OG image path
    creator: "@discountleather" // Add your Twitter handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  alternates: {
    canonical: "http://discountstorebd.com", // Replace with your domain
  },
  category: "ecommerce",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  verification: {
    google: "your-google-verification-code", 
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={dmSans.className}>
        <ThemeProvider>
        <Providers>
          <AuthProvider>
            {children}
            <Toaster position="top-right" />
          </AuthProvider>
        </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}