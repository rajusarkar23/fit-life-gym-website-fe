"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useMobile } from "@/hooks/use-mobile";
import { useUserStore } from "@/store/user-store";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const isMobile = useMobile();

  if (!isMobile) return null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <SheetTitle>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTitle>
      </SheetTrigger>
      <SheetContent side="right">
        <div className="flex flex-col space-y-4 py-4">
          <Link
            href={`/member/dashboard/${useUserStore.getState().username}`}
            className="text-lg font-medium hover:text-primary"
            onClick={() => setOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href={`/member/space/${useUserStore.getState().username}`}
            className="text-lg font-medium hover:text-primary"
            onClick={() => setOpen(false)}
          >
            Space
          </Link>
          <Link
            href={`/member/profile/${useUserStore.getState().username}`}
            className="text-lg font-medium hover:text-primary"
            onClick={() => setOpen(false)}
          >
            Profile
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
