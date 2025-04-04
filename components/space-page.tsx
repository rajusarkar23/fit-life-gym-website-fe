"use client";

import { useUserStore } from "@/store/user-store";
import { useEffect } from "react";
import { Button } from "./ui/button";

export default function SpacePage({ authCookie }: { authCookie: string }) {
  const { fetchSpacePosts,  } = useUserStore();

  useEffect(() => {
    fetchSpacePosts({ authCookie });
  }, []);

  return (
    <div>
        {
           useUserStore.getState().spacePosts.map((post) => (
            <div>
                <p>{post.text}</p>
                {
                    useUserStore.getState().fetchFor === post.likeBy! ? (<Button>Hola</Button>): (<Button>Gola</Button>)
                }
                
            </div>
           )) 
        }
    </div>
  )
}
