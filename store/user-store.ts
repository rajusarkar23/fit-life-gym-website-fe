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

interface User {
  isLoading: boolean;
  isUserLogedIn: boolean;
  isError: boolean;
  isResponseOkay: boolean;
  memberProfile: MemberProfile[] | null;
  errorMessage: string | null;
  username: string | null;
  signup: ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  signin: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<void>;
  verify: ({
    otp,
    authCookie,
  }: {
    otp: string;
    authCookie: string;
  }) => Promise<void>;
  getProfile: ({
    userName,
    authCookie,
  }: {
    userName: string;
    authCookie: string;
  }) => Promise<void>;
  updateUserName: ({newUserName, authCookie}: {newUserName: string, authCookie: string}) => Promise<void>
}

const useUserStore = create(
  persist<User>(
    (set) => ({
      isLoading: false,
      isError: false,
      isUserLogedIn: false,
      isResponseOkay: false,
      errorMessage: null,
      username: null,
      memberProfile: null,
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
          memberProfile: null,
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
                memberProfile: null,
                errorMessage: error.response.data.message,
              });
            });
        } catch (error) {
          console.log(error);
          set({
            isError: true,
            isResponseOkay: false,
            memberProfile: null,
            errorMessage: "Something went wrong",
          });
        }
      },
      // update username
      updateUserName: async ({authCookie, newUserName}) => {
          set({username: null, isLoading: true,isError: false, errorMessage: null,isResponseOkay: false})

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
                console.log(response.data);
                if (response.data.success) {
                  set({username: response.data.username, isLoading: false, isError: false, errorMessage: null, isResponseOkay: true})
                }
              })
              .catch((error) => {
                set({username: null, isLoading: false, isError: true, errorMessage: error.response.data.message, isResponseOkay: false})
              });
          } catch (error) {
            console.log(error);
            set({username: null, isLoading: false, isError: true, errorMessage: "Something went wrong", isResponseOkay: false})
          }
      }
    }),
    { name: "userStore" }
  )
);

export { useUserStore };
