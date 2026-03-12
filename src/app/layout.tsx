import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { CheckoutProvider } from "@/context/CheckoutContext";
import Header from "@/components/Header";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "Ecoyaan Checkout",
  description: "Sustainability made easy — checkout flow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geist.variable} font-sans antialiased bg-gray-50`}>
        <CheckoutProvider>
          <Header />
          <main>{children}</main>
        </CheckoutProvider>
      </body>
    </html>
  );
}
