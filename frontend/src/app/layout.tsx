import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/common/Navbar";
const geistSans = Geist({
  variable: "--font-sans", // Đổi tên biến này để khớp với globals.css của bạn
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Global Hotel Engine",
  description: "Hệ thống quản lý khách sạn tích hợp SQL & NoSQL",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans bg-background text-foreground`}
      >
        <Navbar /> {/*Navbar sẽ luôn hiện ở trên cùng */}
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}