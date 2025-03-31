import { create } from "zustand";
import { persist } from "zustand/middleware";
import z from "zod";
import axios from "axios";
import { NEXT_PUBLIC_BACKEND_URL } from "@/lib/config";

interface User {
  isLoading: boolean;
  isUserLogedIn: boolean;
  isError: boolean;
  isResponseOkay: boolean;
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
  verify: ({ otp, authCookie }: { otp: string, authCookie: string }) => Promise<void>;
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
      verify: async ({otp, authCookie}) => {
        set({isError: false,isLoading: true, errorMessage: null, isResponseOkay: false,isUserLogedIn: false, username: null})

        try {
          await axios.post(`${NEXT_PUBLIC_BACKEND_URL}/member/auth/verify-otp`, {
            otp
          }, {
            withCredentials: true,
            headers: {
              "Authorization": authCookie
            }
          }).then((response) => {
            if (response.data.success) {
              set({isLoading: false, isError: false,errorMessage: null, isResponseOkay: true, isUserLogedIn: true, username: response.data.username})
            }
          }).catch((error) => {
            set({isLoading: false, isError: true, errorMessage:error.response.data.message, isResponseOkay: false, username: null})
          })
        } catch (error) {
          console.log(error);
        set({isLoading: false, isError: true, errorMessage: "Something went wrong", username: null})
        }
      },
      signin: async ({email, password}) => {
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
    }),
    { name: "userStore" }
  )
);

export { useUserStore };
