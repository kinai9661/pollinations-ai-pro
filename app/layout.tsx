import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pollinations Pro Studio",
  description: "Professional AI Image Generator powered by Flux",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
