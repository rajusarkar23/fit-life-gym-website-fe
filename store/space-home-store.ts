import { NEXT_PUBLIC_BACKEND_URL } from "@/lib/config";
import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// "id": 38,
// "textContent": "hey all hope your weekend is going well.",
// "postImageUrl": "",
// "postBelongTo": 28,
// "createdAt": "2025-04-02T19:30:10.405Z",
// "updatedAt": "2025-04-02T19:30:05.400Z"

interface Post {
    id: number,
    textContent: string,
    postImageUrl: string,
    postBelongTo: number, // current user
}

// FINAL STORE TYPES
interface SpaceStore {
    isLoading: boolean,
    isError: boolean,
    errorMessage: string | null,
    //Post
    posts: Post[],
    // fetch
    fetchPosts: ({authCookie}: {authCookie: string}) => Promise<void>
}
// STORE LOGICS
const useSpaceStore = create(persist<SpaceStore>((set) => ({
    isLoading: false,
    isError: false,
    errorMessage: null,
    posts: [],
    fetchPosts: async ({authCookie}) => {
        set({isLoading: true, isError: false, errorMessage: null, posts: []})

        try {
            await axios.get(`${NEXT_PUBLIC_BACKEND_URL}/member/post/get-home-posts`, {
                headers: {
                    Authorization: authCookie
                }
            }).then((res) => {
                console.log(res.data);
            }).catch((err) => {
                console.log(err);
            })
        } catch (error) {
            console.log(error);
            set({isLoading: false, isError: true, errorMessage: "Something went wrong, try again"})
        }
    }
}), {name: "space-store"}))

export {useSpaceStore}