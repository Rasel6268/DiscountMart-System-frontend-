import { Toaster } from "react-hot-toast";
import "./globals.css";
import AuthProvider from "@/AuthProvider/AuthProvider";

import { DM_Sans } from "next/font/google";
import Providers from "./providers/QueryProvider";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata = {
  title: "Discount",
  description: "Authentication with Express and Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={dmSans.className}>
        <Providers>
          <AuthProvider>
            {children}
            <Toaster position="top-right" />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}