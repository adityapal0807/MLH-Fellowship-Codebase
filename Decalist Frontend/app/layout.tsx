import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./Navbar";

export const metadata: Metadata = {
  title: "Decalist-AI Clothing Price Predictor",
  description: "Predict clothing prices using AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
