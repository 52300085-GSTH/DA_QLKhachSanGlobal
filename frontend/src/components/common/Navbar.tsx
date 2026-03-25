"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">H</span>
              </div>
              <span className="text-xl font-black tracking-tight text-foreground">
                GLOBAL<span className="text-primary">HOTEL</span>
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/" ? "text-primary font-bold" : "text-muted-foreground"
              }`}
            >
              Phòng Trống
            </Link>
            
            <Link 
              href="/admin" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/admin" ? "text-primary font-bold" : "text-muted-foreground"
              }`}
            >
              Báo Cáo Admin
            </Link>
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-xs text-muted-foreground">Hệ thống SQL & NoSQL</p>
              <p className="text-sm font-semibold text-foreground">v1.0.0</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center border border-border cursor-pointer hover:bg-accent transition-colors">
              👤
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}