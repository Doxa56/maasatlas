import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Salary Transparency",
  description: "Modern salary transparency app",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body className={`${manrope.variable} min-h-screen`}>
        <div className="relative min-h-screen">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}
