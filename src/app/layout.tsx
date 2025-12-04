import type { Metadata } from "next";
import { Karla } from "next/font/google";

import '@/styles/globals.css';
import '@/styles/colors.css';
import '@/styles/clicks.css';

const karla = Karla({
  subsets: ["latin"],
  variable: "--karla",
  weight: ["200", "300", "400", "500", "600", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "le fog",
  description: "website for le fog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${karla.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
