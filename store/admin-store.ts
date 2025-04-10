import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import z from "zod"
import { NEXT_PUBLIC_BACKEND_URL } from "@/lib/config";

//FINAL ADMIN STORE DATA TYPES
interface AdminStore {
    isLoading: boolean,
    isError: boolean,
    errorMessage: string | null,
    // auth states
    isAuthenticated: boolean,
    isSignupRegistrationSuccess: boolean,
    isOtpVerificationSuccess: boolean,
    isSigninSuccess: boolean,
    // admin details
    adminName: string | null,
    adminUserName: string | null,
    // functions
    // signin
    signin: ({email, password}: {email: string, password: string}) => Promise<void>,
    // signup
    signup: ({email, password, name}: {email: string, name: string, password: string}) => Promise<void>,
    // verify otp
    verifyOtp: ({authCookie, otp}: {authCookie: string, otp: string}) => Promise<void>
}

const useAdminStore = create(persist<AdminStore>((set) => ({
    isLoading: false,
    isError: false,
    errorMessage: null,
    isAuthenticated: false,
    isSignupRegistrationSuccess: false,
    isOtpVerificationSuccess: false,
    isSigninSuccess: false,
    adminName: null,
    adminUserName: null,

    // functions
    // signin
    signin: async ({email, password}) => {
        set({
            isLoading: true, 
            isError: false, 
            errorMessage: null, 
            isAuthenticated: false, 
            isSigninSuccess: false
        })

        // zod input fields validation
        const adminInputValidation = z.object({
            email: z.string().email({message: "Email is not valid"}),
            password: z.string().min(6, {message: "Password length should be minimum 6 character."})
        })
        // parse data
        const safeParsingData = adminInputValidation.safeParse({email, password})
        // check
        if (!safeParsingData.success) {
            const errorMessage = safeParsingData.error.errors.map(err => err.message).join(", ")
            set({
                isLoading: false,
                isError: true,
                errorMessage
            })
            return 
        }

        // send api req
        try {
            await axios.post(`${NEXT_PUBLIC_BACKEND_URL}/admin/auth/signin`, {
                email: safeParsingData.data.email,
                password: safeParsingData.data.password
            }, {
                withCredentials: true,
            }).then((res) => {
                if (res.data.success) {
                    set({
                        isLoading: false, 
                        isError: false, 
                        isAuthenticated: true, 
                        isSigninSuccess: true,
                        adminName: res.data.name,
                        adminUserName: res.data.username
                    })
                }
            }).catch((err) => {
                set({isLoading: false, isError: true, errorMessage: err.response.data.message})
            })
        } catch (error) {
            set({isLoading: false, isError: false, errorMessage: "Unknown error, try again"})
        }
    },
    // signup
    signup: async ({email, name, password}) => {
        set({
            isLoading: true, 
            isSignupRegistrationSuccess: false, 
            isError: false, 
            errorMessage: null
        })

        // parsing data
        const validateInputs = z.object({
           email: z.string().email({message: "Email is not valid"}),
           password: z.string().min(6, {message: "Password length."}),
           name: z.string().min(3, {message: "Name should be minimum 3 character long."})
        })
        // parse data
        const safeParsingData = validateInputs.safeParse({name, email, password})
        // check
        if (!safeParsingData.success) {
            const errorMessage  = safeParsingData.error.errors.map(err => err.message).join(", ")
            set({
                isLoading: false,
                isError: true,
                errorMessage
            })
            return
        }

        // send api req
        try {
            await axios.post(`${NEXT_PUBLIC_BACKEND_URL}/admin/auth/signup`, {
                email: safeParsingData.data.email,
                name: safeParsingData.data.name,
                password: safeParsingData.data.password
            }, {
                withCredentials: true
            }).then((res) => {
                if (res.data.success) {
                    set({
                        isLoading: false, 
                        isError: false, 
                        errorMessage: null, 
                        isSignupRegistrationSuccess: true
                    })
                } else{
                    set({
                        isLoading: false, 
                        isError: true, 
                        errorMessage: res.data.message, 
                        isSignupRegistrationSuccess: false
                    })
                }
            }).catch((err) => {
                set({isLoading: false, isError: true, errorMessage: err.response.data.message})
            })
        } catch (error) {
            console.log(error);
            set({isLoading: false, isError: true, errorMessage: "Unknown error try again."})
        }
    },
    // otp verify
    verifyOtp: async ({authCookie, otp}) => {
        set({
            isLoading: true, 
            isError: false, 
            isSigninSuccess: false, 
            isOtpVerificationSuccess: false,
            isAuthenticated: false,
            errorMessage: null
        })

        // validate
        const validateInput = z.object({
            otp: z.string().min(6, {message: "Otp should be 6 character long."})
        })
        // safe parse
        const safeParsingData = validateInput.safeParse({otp})
        // check
        if (!safeParsingData.success) {
            // get the error message
            const errorMessage = safeParsingData.error.errors.map((err => err.message)).join(", ")
            set({
                isLoading: false,
                isError: true,
                errorMessage
            })
            return
        }

        // send api req
        try {
            await axios.post(`${NEXT_PUBLIC_BACKEND_URL}/admin/auth/verify-otp`, {
                otp: safeParsingData.data.otp
            }, {
                headers: {
                    Authorization: authCookie
                },
                withCredentials: true
            },).then((res) => {
                if (res.data.success) {
                    set({
                        isLoading: false,
                        isError: false,
                        isOtpVerificationSuccess: true,
                        isAuthenticated: true,
                        isSigninSuccess: true,
                        adminName: res.data.name,
                        adminUserName: res.data.username
                    })
                } else{
                    set({
                        isLoading: false,
                        isError: true,
                        errorMessage: res.data.message,
                        isAuthenticated: false,
                        isSigninSuccess: false,
                        isOtpVerificationSuccess: false
                    })
                }
            }).catch((err) => {
                set({
                    isLoading: false,
                    isError: true,
                    errorMessage: err.response.data.message,
                    isAuthenticated: false,
                    isSigninSuccess: false,
                    isOtpVerificationSuccess: false
                })
            })
        } catch (error) {
            console.log(error);
            set({
                isLoading: false,
                isError: true,
                errorMessage: "Unknown error",
                isAuthenticated: false,
                isSigninSuccess: false,
                isOtpVerificationSuccess: false
            })
        }
    }
}),{name: "admin-store"}))

export {useAdminStore}