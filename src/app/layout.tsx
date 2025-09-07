import type { Metadata } from "next";
import { Barlow, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const barlow = Barlow({
  weight: "500",                // Medium
  variable: "--font-barlow",
  subsets: ["latin","latin-ext"],
  display: "swap",
});

const poppins = Poppins({
  weight: "200",                // ExtraLight
  variable: "--font-poppins",
  subsets: ["latin","latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sencer Film",
  description: "Sencer Film projesi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${barlow.variable} ${poppins.variable} antialiased`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
