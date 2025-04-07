"use client";
import { useEffect } from "react";
import { useSpaceStore } from "@/store/space-home-store";

export default function SpacePage({ authCookie }: { authCookie: string }) {
  const { fetchPosts  } = useSpaceStore();

  useEffect(() => {
    fetchPosts({ authCookie });
  }, []);

  return (
    <div>
      space
    </div>
  )
}
