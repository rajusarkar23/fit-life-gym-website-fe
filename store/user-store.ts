import { create } from "zustand";
import { persist } from "zustand/middleware";
import z from "zod";
import axios from "axios";
import { NEXT_PUBLIC_BACKEND_URL } from "@/lib/config";

interface MemberProfile {
  imageUrl: string | null;
  userName: string | null;
  name: string | null;
  gender: string | null;
  profession: string | null;
  dob: string | null;
}

interface LikeArray {
  id: number;
}

interface FetchLike {
  id: number;
  likeFor: number;
  likeBy: number;
}

interface FetchComment {
  id: number;
  comment: string;
  commentFor: number;
  commentByName: string;
  commentByUserId: number;
}

interface Comment {
  commentFor: number;
  commentByUserId: number;
  commentByUserName: string;
  comment: string;
}

interface Post {
  id: number | null;
  textContent: string | null;
  postImageUrl: string | null;
  createdAt: string;
  postCreator: string;
  createImageUrl: string;
  likeBy: number;
  likeFor: number;
}

interface SpacePosts {
  id: number;
  text: string;
  image: string;
  likeBy: number;
  likeFor: number;
}

interface User {
  isLoading: boolean;
  isUserLogedIn: boolean;
  isError: boolean;
  isResponseOkay: boolean;
  fetchFor: number | null;
  memberProfile: MemberProfile[];
  postsCreatedByLogedinMember: Post[];
  spacePosts: SpacePosts[];
  likeArr: LikeArray[];
  comment: Comment[];
  fetchLike: FetchLike[];
  fetchComment: FetchComment[];
  errorMessage: string | null;
  username: string | null;
  // signup func
  signup: ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  // signin func
  signin: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<void>;
  // verify func
  verify: ({
    otp,
    authCookie,
  }: {
    otp: string;
    authCookie: string;
  }) => Promise<void>;
  // get profile func
  getProfile: ({
    userName,
    authCookie,
  }: {
    userName: string;
    authCookie: string;
  }) => Promise<void>;
  // upate user name func
  updateUserName: ({
    newUserName,
    authCookie,
  }: {
    newUserName: string;
    authCookie: string;
  }) => Promise<void>;
  updateName: ({
    authCookie,
    newName,
  }: {
    authCookie: string;
    newName: string;
  }) => Promise<void>;
  // fetch post func
  fetchPosts: ({ authCookie }: { authCookie: string }) => Promise<void>;
  // fetch posts in space
  fetchSpacePosts: ({ authCookie }: { authCookie: string }) => Promise<void>;
  // add comment
  addComment: ({
    authCookie,
    commentByName,
    commentFor,
    comment,
    commentByUserId,
    id,
  }: {
    authCookie: string;
    commentFor: number;
    comment: string;
    commentByName: string;
    commentByUserId: number;
    id: number;
  }) => Promise<void>;
  fetchLikes: ({ ids }: { ids: number[] }) => Promise<void>;
  // manage likes
  manageLike: ({
    postId,
    userId,
  }: {
    postId: number;
    userId: number;
  }) => Promise<void>;
  // fetch comments
  fetchComments: ({ ids }: { ids: number[] }) => Promise<void>;
}

const useUserStore = create(
  persist<User>(
    (set) => ({
      isLoading: false,
      isError: false,
      isUserLogedIn: false,
      isResponseOkay: false,
      fetchFor: null,
      errorMessage: null,
      username: null,
      memberProfile: [],
      likeArr: [],
      spacePosts: [],
      comment: [],
      fetchLike: [],
      fetchComment: [],
      postsCreatedByLogedinMember: [],
      // signinup
      signup: async ({ email, name, password }) => {
        set({
          isLoading: true,
          isError: false,
          isResponseOkay: false,
          errorMessage: null,
          isUserLogedIn: false,
        });
        // zod schema validation
        const userDataSchema = z.object({
          email: z.string().email().min(4),
          name: z.string().min(3),
          password: z.string().min(6),
        });
        const data = {
          email,
          name,
          password,
        };
        // safeparse data
        const signupData = userDataSchema.safeParse(data);
        // if not success
        if (!signupData.success) {
          set({
            isLoading: false,
            isError: true,
            errorMessage:
              "Form field validation failed, please check all inputs",
          });
          return;
        }

        try {
          await axios
            .post(
              `${NEXT_PUBLIC_BACKEND_URL}/member/auth/signup`,
              {
                signupData,
              },
              {
                withCredentials: true,
              }
            )
            .then((response) => {
              if (response.data.success) {
                set({ isLoading: false, isError: false, isResponseOkay: true });
              }
            })
            .catch((error) => {
              set({
                isLoading: false,
                isError: true,
                isResponseOkay: false,
                errorMessage: error.response.data.message,
              });
            });
        } catch (error) {
          set({
            isLoading: false,
            isError: true,
            errorMessage: "Something went wrong, try again",
          });
        }
      },
      // verify
      verify: async ({ otp, authCookie }) => {
        set({
          isError: false,
          isLoading: true,
          errorMessage: null,
          isResponseOkay: false,
          isUserLogedIn: false,
          username: null,
        });

        try {
          await axios
            .post(
              `${NEXT_PUBLIC_BACKEND_URL}/member/auth/verify-otp`,
              {
                otp,
              },
              {
                withCredentials: true,
                headers: {
                  Authorization: authCookie,
                },
              }
            )
            .then((response) => {
              if (response.data.success) {
                set({
                  isLoading: false,
                  isError: false,
                  errorMessage: null,
                  isResponseOkay: true,
                  isUserLogedIn: true,
                  username: response.data.username,
                });
              }
            })
            .catch((error) => {
              set({
                isLoading: false,
                isError: true,
                errorMessage: error.response.data.message,
                isResponseOkay: false,
                username: null,
              });
            });
        } catch (error) {
          console.log(error);
          set({
            isLoading: false,
            isError: true,
            errorMessage: "Something went wrong",
            username: null,
          });
        }
      },
      //signin
      signin: async ({ email, password }) => {
        set({
          isLoading: true,
          isError: false,
          isResponseOkay: false,
          errorMessage: null,
          isUserLogedIn: false,
          username: null,
        });
        // zod schema validation
        const userDataSchema = z.object({
          email: z.string().email().min(4),
          password: z.string().min(6),
        });
        const data = {
          email,
          password,
        };
        // safeparse data
        const signinData = userDataSchema.safeParse(data);
        // if not success
        if (!signinData.success) {
          set({
            isLoading: false,
            isError: true,
            errorMessage:
              "Form field validation failed, please check all inputs",
          });
          return;
        }

        try {
          await axios
            .post(
              `${NEXT_PUBLIC_BACKEND_URL}/member/auth/signin`,
              {
                signinData,
              },
              {
                withCredentials: true,
              }
            )
            .then((response) => {
              if (response.data.success) {
                set({
                  isLoading: false,
                  isError: false,
                  isResponseOkay: true,
                  isUserLogedIn: true,
                  username: response.data.username,
                });
              }
            })
            .catch((error) => {
              set({
                isLoading: false,
                isError: true,
                isResponseOkay: false,
                errorMessage: error.response.data.message,
                username: null,
              });
            });
        } catch (error) {
          set({
            isLoading: false,
            isError: true,
            errorMessage: "Something went wrong, try again",
            username: null,
          });
        }
      },
      // get profile details
      getProfile: async ({ authCookie, userName }) => {
        set({
          isLoading: true,
          isError: false,
          errorMessage: null,
          isResponseOkay: false,
          memberProfile: [],
        });

        try {
          await axios
            .get(
              `${NEXT_PUBLIC_BACKEND_URL}/member/profile/get-profile?userName=${userName}`,
              {
                headers: {
                  Authorization: authCookie,
                },
              }
            )
            .then((response) => {
              if (response.data.success) {
                set({
                  memberProfile: response.data.memberProfile,
                  isLoading: false,
                  isResponseOkay: true,
                });
              }
            })
            .catch((error) => {
              set({
                isError: true,
                isResponseOkay: false,
                memberProfile: [],
                errorMessage: error.response.data.message,
              });
            });
        } catch (error) {
          console.log(error);
          set({
            isError: true,
            isResponseOkay: false,
            memberProfile: [],
            errorMessage: "Something went wrong",
          });
        }
      },
      // update username
      updateUserName: async ({ authCookie, newUserName }) => {
        set({
          username: null,
          isLoading: true,
          isError: false,
          errorMessage: null,
          isResponseOkay: false,
        });

        try {
          await axios
            .put(
              `${NEXT_PUBLIC_BACKEND_URL}/member/profile/update-username`,
              {
                newUserName,
              },
              {
                headers: {
                  Authorization: authCookie,
                },
              }
            )
            .then((response) => {
              if (response.data.success) {
                set({
                  username: response.data.username,
                  isLoading: false,
                  isError: false,
                  errorMessage: null,
                  isResponseOkay: true,
                });
              }
            })
            .catch((error) => {
              set({
                username: null,
                isLoading: false,
                isError: true,
                errorMessage: error.response.data.message,
                isResponseOkay: false,
              });
            });
        } catch (error) {
          console.log(error);
          set({
            username: null,
            isLoading: false,
            isError: true,
            errorMessage: "Something went wrong",
            isResponseOkay: false,
          });
        }
      },
      // update name
      updateName: async ({ authCookie, newName }) => {
        set({
          isLoading: true,
          isError: false,
          errorMessage: null,
          isResponseOkay: false,
        });

        try {
          await axios
            .put(
              `${NEXT_PUBLIC_BACKEND_URL}/member/profile/update-name`,
              {
                newName,
              },
              {
                headers: {
                  Authorization: authCookie,
                },
              }
            )
            .then((response) => {
              if (response.data.success) {
                set({
                  isLoading: false,
                  isError: false,
                  errorMessage: null,
                  isResponseOkay: true,
                });
              }
            })
            .catch((error) => {
              set({
                memberProfile: [],
                isLoading: false,
                isError: true,
                errorMessage: error.response.data.message,
                isResponseOkay: false,
              });
            });
        } catch (error) {
          console.log(error);
          set({
            memberProfile: [],
            isLoading: false,
            isError: true,
            errorMessage: "Something went wrong",
            isResponseOkay: false,
          });
        }
      },
      // fetch post for particular user
      fetchPosts: async ({ authCookie }) => {
        set({
          isLoading: true,
          postsCreatedByLogedinMember: [],
          fetchFor: null,
        });

        try {
          await axios
            .get(`${NEXT_PUBLIC_BACKEND_URL}/member/post/get-posts`, {
              headers: {
                Authorization: authCookie,
              },
            })
            .then((res) => {
              set({
                isLoading: false,
                postsCreatedByLogedinMember: res.data.posts,
                fetchFor: res.data.fetchFor,
              });
            });
        } catch (error) {}
      },
      // fetch post for home/space
      fetchSpacePosts: async ({ authCookie }) => {
        set({ fetchFor: null });

        try {
          await axios
            .get(`${NEXT_PUBLIC_BACKEND_URL}/member/post/get-home-posts`, {
              headers: {
                Authorization: authCookie,
              },
            })
            .then((res) => {
              if (res.data.success) {
                set({
                  fetchFor: res.data.fetchFor,
                  spacePosts: res.data.posts,
                });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } catch (error) {
          console.log(error);
        }
      },

      // add comment
      addComment: async ({
        authCookie,
        commentFor,
        commentByName,
        commentByUserId,
        comment,
        id,
      }) => {
        //set comment to the local storage
        set((state) => {
          return {
            fetchComment: [
              ...state.fetchComment,
              {
                id,
                comment,
                commentFor,
                commentByName,
                commentByUserId,
              },
            ],
          };
        });
        // send backend req
        try {
          await axios.post(
            `${NEXT_PUBLIC_BACKEND_URL}/member/post/comment/add-comment`,
            {
              comment,
              userName: commentByName,
              commentFor,
            },
            {
              headers: {
                Authorization: authCookie,
              },
            }
          );
        } catch (error) {}
      },
      // fetch likes
      fetchLikes: async ({ ids }) => {
        set({ fetchLike: [] });
        try {
          await axios
            .post(`${NEXT_PUBLIC_BACKEND_URL}/member/post/like/fetch`, {
              ids,
            })
            .then((res) => {
              console.log(res);

              set({ fetchLike: res.data.likes });
            })
            .catch((err) => {
              console.log(err);
            });
        } catch (error) {}
      },
      // manage likes
      manageLike: async ({ postId, userId }) => {
        set((state) => {
          const isLiked = state.fetchLike.some(
            (like) => like.likeFor === postId
          );
          console.log("ran managelike");

          if (isLiked) {
            console.log("ran isliked");

            return {
              fetchLike: state.fetchLike.filter(
                (like) => like.likeFor !== postId
              ),
            };
          } else {
            return {
              fetchLike: [
                ...state.fetchLike,
                { id: 0, likeFor: postId, likeBy: userId },
              ],
            };
          }
        });
      },
      fetchComments: async ({ ids }) => {
        set({ fetchComment: [] });
        try {
          await axios
            .post(
              `${NEXT_PUBLIC_BACKEND_URL}/member/post/comment/fetch-comments`,
              {
                ids,
              }
            )
            .then((res) => {
              if (res.data.success) {
                set({ fetchComment: res.data.comments });
              } else {
                set({ fetchComment: [] });
              }
            });
        } catch (error) {}
      },
    }),
    { name: "userStore" }
  )
);

export { useUserStore };
