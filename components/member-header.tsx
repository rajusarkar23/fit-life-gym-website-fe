"use client";
import Link from "next/link";
import { Dumbbell } from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "./theme-toggle";
import { useState } from "react";
import { MobileNav } from "./member-mobile-nav";

export function MemberHeader() {
    const [open, setOpen] = useState(false)
    const isMobile = useMobile()
  

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* LEFT BRAND SECTION  */}
        <div className="flex items-center space-x-2 group">
          <div className="relative">
            <Dumbbell className="h-6 w-6 text-primary group-hover:rotate-12 transition-transform duration-300" />
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <span className="font-bold text-lg flex gap-1">
            FitLife <span className="text-primary">Gym</span>
          </span>
        </div>
        {/* LEFT SIDE OF THE HEADER */}
        <div className="flex items-center">
          <ThemeToggle />
          {/* MOBILE MENU */}
          <div className="">
           <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
