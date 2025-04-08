"use client";
import Link from "next/link";
import { Dumbbell } from "lucide-react";

import { MobileNav } from "@/components/mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { useUserStore } from "@/store/user-store";

export function MemberHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="relative">
            <Dumbbell className="h-6 w-6 text-primary group-hover:rotate-12 transition-transform duration-300" />
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <span className="font-bold text-lg">
            FitLife <span className="text-primary">Gym</span>
          </span>
        </Link>
        <div className="ml-8 space-x-4">
          <Link href={`/member/dashboard/${useUserStore.getState().username}`}>
            Dashboard
          </Link>

          <Link href={`/member/space/${useUserStore.getState().username}`}>
            Space
          </Link>
          <Link href={`/member/profile/${useUserStore.getState().username}`}>
            Profile
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <ThemeToggle />
            <div>Hey, {useUserStore.getState().name}</div>
          </nav>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
