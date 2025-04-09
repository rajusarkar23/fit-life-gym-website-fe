"use client";

import {
  ChartNoAxesColumn,
  Heart,
  LoaderCircle,
  MessageCircleMore,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useSpaceStore } from "@/store/space-home-store";
import { useMobile } from "@/hooks/use-mobile";

// comment types
interface Comment {
  id: number;
  comment: string;
  commentFor: number;
  commentByName: string;
  commentByUserId: number;
  userProfileUrl: string;
}

// add comment
function AddComment({
  authToken,
  postId,
}: {
  authToken: string;
  postId: number;
}) {
  const [comment, setComment] = useState("");
  const [commentArray, setCommentArray] = useState<Comment[]>([]);
  const { addComment } = useSpaceStore();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <MessageCircleMore
          onClick={() => {
            const isCommentAvailable = useSpaceStore
              .getState()
              .postComments.filter((comm) => comm.commentFor === postId);
            setCommentArray(isCommentAvailable);
          }}
          className="text-red-400 hover:scale-125 transition-all hover:cursor-pointer"
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-w-[350px] rounded">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 ">
            Comments <MessageCircleMore size={20} />
          </DialogTitle>
          {/* SHOW COMMENTS OF PEOPLE */}
          <div>
            {commentArray.length === 0 ? (
              <p>This post has no comments yet</p>
            ) : (
              commentArray.map((comm, index) => (
                <div key={index} className="flex items-center space-y-2 gap-1">
                  <div className="mt-1.5">
                    <Image
                      src={comm.userProfileUrl}
                      alt="profile_image"
                      width={40}
                      height={35}
                      className="rounded-full"
                    />
                  </div>
                  <div className="bg-gray-200 dark:bg-slate-800 h-auto sm:w-96 w-60 rounded-full px-4 flex items-center">
                    <p>
                      <span className="text-blue-600">
                        {comm.commentByName}
                      </span>
                      <span> {comm.comment}</span>
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogHeader>

        {/* COMMENT TEXT AREA AND BUTTON SECTION */}
        <div className="space-y-2">
          <Textarea
            placeholder="Comment..."
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            className="dark:bg-slate-800"
          />

          <Button
            onClick={() => {
              addComment({
                authCookie: authToken,
                comment,
                commentFor: postId,
                commentByName: useSpaceStore.getState().memberProfile[0].name!,
                commentByUserId: 0,
                id: 0,
                userProfileUrl:
                useSpaceStore.getState().memberProfile[0].imageUrl!,
              });
              const isCommentAvailable = useSpaceStore
                .getState()
                .postComments.filter((comm) => comm.commentFor === postId);

              setCommentArray(isCommentAvailable);
              setComment("");
            }}
            className="w-full"
          >
            Comment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function SpacePage({ authCookie }: { authCookie: string }) {
  const { fetchPosts, getProfile, fetchComments, fetchLikes } = useSpaceStore();
  const isMobile = useMobile()


  const params = useParams();
  const [loading, setLoadign] = useState(false);

  const getProfiledetailsAndFetchPosts = async () => {
    setLoadign(true);
    await getProfile({
      authCookie: authCookie,
      userName: params.username?.toString()!,
    });
    await fetchPosts({ authCookie });
    const ids: any[] = useSpaceStore.getState().posts.map((post) => post.id);
    await fetchLikes({ ids });
    await fetchComments({ ids, authCookie });
    setLoadign(false);
  };

  useEffect(() => {
    getProfiledetailsAndFetchPosts();
  }, []);

  // GET LIKE AND COMMENT LENGTH
  function GetLikeLengthAndCommentLength({ id }: { id: number }) {
    const findForLike = useSpaceStore
      .getState()
      .likes.filter((like) => like.likeFor === id);
    const findComment = useSpaceStore
      .getState()
      .postComments.filter((comm) => comm.commentFor === id);

    return (
      <div className="flex items-center gap-2">
        {`${findForLike.length} likes ${findComment.length} comments`}
        <ChartNoAxesColumn className="text-red-400 hover:scale-125 transition-all hover:cursor-pointer" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <LoaderCircle color="#873636" className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="">
      {/* show posts */}
      <div className="flex flex-col items-center space-y-2">
        {useSpaceStore.getState().posts.length > 0 &&
          useSpaceStore.getState().posts.map((post) => (
            <div
              key={post.id!}
              className={isMobile ? "border w-[360px] px-4 rounded py-4 dark:bg-slate-900 shadow-lg" : "border w-[500px] px-4 rounded py-4 dark:bg-slate-900 shadow-lg"}
            >
              {/* show creator profile image,name and timestamp */}
              <div className="flex flex-row items-center gap-1">
                {/* creator image */}
                <div>
                  {post.postCreatorImageUrl.length > 0 && (
                    <Image
                      src={post.postCreatorImageUrl}
                      alt="creator_image"
                      width={60}
                      height={60}
                      className="rounded-full"
                    />
                  )}
                </div>
                {/* name plus time */}
                <div>
                  <p className="text-sm font-semibold">{post.postCreatorName}</p>
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              {/* Post image url */}
              <div className="px-2 space-y-2">
                <div className="text-xl">
                  <p className="font-extralight">{post.textContent}</p>
                </div>
                <div>
                  {post.postImageUrl?.length! > 0 && (
                    <Image
                      src={post.postImageUrl!}
                      alt="post_image"
                      width={500}
                      height={500}
                      className="rounded"
                    />
                  )}
                </div>
              </div>

              <div className="justify-between flex mt-4 pl-2 border rounded-full h-10 items-center px-5 shadow-sm">
                <div className="">
                  {/* NEW CODE */}
                  {
                    <Heart 
                      className={useSpaceStore.getState().likes.some((like) => like.likeFor === post.id)
                        ? "fill-red-400 text-red-400 hover:scale-125 hover:cursor-pointer transition-all" : "text-red-400 hover:scale-125 hover:cursor-pointer transition-all" 
                      }

                      onClick={async () => {
                        useSpaceStore.getState().manageLike({postId: post.id, userId: 28, authCookie})
                      }}
                    />
                  }
                </div>
                <div>
                  <AddComment authToken={authCookie} postId={post.id!} />
                </div>
                <div>
                  <GetLikeLengthAndCommentLength id={post.id!} />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
