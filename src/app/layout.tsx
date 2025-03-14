import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { MetadataProvider } from './context/MetadataContext';

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dataset Publishing Platform",
  description: "Upload, process, and publish datasets in CSV and Excel formats",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased`}
      >
        <MetadataProvider>
          {children}
          <Toaster position="top-right" />
        </MetadataProvider>
      </body>
    </html>
  );
}
