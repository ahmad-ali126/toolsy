import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Inter, Poetsen_One } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const poetsen = Poetsen_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-poetsen",
});

export const metadata: Metadata = {
  title: "Free tools website",
  description: "This is free tool website for seo, pdf, images, text",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poetsen+One&display=swap"
          rel="stylesheet"
        ></link>
      </head>

      <body className={`${inter.className} ${poetsen.variable}`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
