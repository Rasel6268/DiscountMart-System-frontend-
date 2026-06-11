import { Toaster } from "react-hot-toast";
import "./globals.css";

import AuthProvider from "@/AuthProvider/AuthProvider";
import Providers from "./providers/QueryProvider";
import { ThemeProvider } from "@/AuthProvider/ThemeContext";

import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

// ✅ SEO Metadata (Optimized)
export const metadata = {
  metadataBase: new URL("https://discountstorebd.com"),

  title: {
    default: "Premium Leather Goods | Shoes, Bags & Accessories",
    template: "%s | Premium Leather Goods",
  },

  description:
    "Discover handcrafted premium leather shoes, bags, wallets, and accessories with premium craftsmanship and modern design.",

  keywords: [
    "leather shoes",
    "leather bags",
    "leather wallet",
    "premium leather",
    "handcrafted leather",
    "genuine leather products",
  ],

  authors: [{ name: "Discount Leather" }],
  creator: "Discount Leather",
  publisher: "Discount Leather",

  openGraph: {
    title: "Premium Leather Goods | Shoes, Bags & Accessories",
    description:
      "Explore handcrafted premium leather shoes, bags, wallets, and accessories.",
    type: "website",
    locale: "en_US",
    siteName: "Discount Leather",
    images: [
      {
        url: "https://discountstorebd.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Premium Leather Products Collection",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Premium Leather Goods | Shoes, Bags & Accessories",
    description:
      "Discover premium handcrafted leather shoes, bags, wallets, and accessories.",
    images: ["https://discountstorebd.com/og-image.jpg"],
    creator: "@discountleather",
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

  alternates: {
    canonical: "https://discountstorebd.com",
  },

  category: "ecommerce",

  verification: {
    google: "your-google-verification-code",
  },

  themeColor: "#000000",
};

// ✅ Recommended viewport export (Next.js 14+ best practice)
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={dmSans.className}>
        
        {/* Providers (optimized nesting order) */}
        <AuthProvider>
          <ThemeProvider>
            <Providers>
              
              {children}

            
              <Toaster position="top-right" />

            </Providers>
          </ThemeProvider>
        </AuthProvider>

      </body>
    </html>
  );
}