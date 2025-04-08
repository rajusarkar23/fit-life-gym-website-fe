"use client";
import { Label } from "@radix-ui/react-label";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { useUserStore } from "@/store/user-store";
import { useRouter } from "next/navigation";
import { Dumbbell, LoaderCircle } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useSpaceStore } from "@/store/space-home-store";

type Data = {
  email: string;
  password: string;
};

export default function SigninForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Data>();

  const router = useRouter();
  const [error, setError] = useState("");
  const { signin } = useUserStore();

  const onSubmit = async (data: Data) => {
    setError("");
    await signin({
      email: data.email,
      password: data.password,
    });

    if (useUserStore.getState().isError) {
      setError(useUserStore.getState().errorMessage!);
    }

    if (
      useUserStore.getState().isResponseOkay &&
      typeof useUserStore.getState().username === "string"
    ) {
      router.push(`/member/dashboard/${useUserStore.getState().username}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] flex-col">
      <div className="border p-16 shadow shadow-red-400/60 rounded">
        <div className="flex gap-2 justify-center">
          <div className="relative">
            <Dumbbell className="h-6 w-6 text-primary group-hover:rotate-12 transition-transform duration-300" />
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <span className="font-bold text-lg">
            FitLife <span className="text-primary">Gym</span>
          </span>
        </div>
        <div className="py-8">
          <h2 className="text-sm font-bold text-center">Signin</h2>
          <p className="text-sm font-light text-center">Please signin first to continue</p>
        </div>
        <div>
          <form className="w-96 space-y-2" onSubmit={handleSubmit(onSubmit)}>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: { value: true, message: "Email is required" },
                minLength: {
                  value: 4,
                  message: "Email should be atleast 4 characters",
                },
              })}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}

            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: { value: true, message: "Password is required" },
                minLength: {
                  value: 6,
                  message: "Email should be atleast 6 characters",
                },
              })}
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
            <p className="text-center text-sm text-red-500">{error}</p>
            {useUserStore.getState().isLoading ? (
              <Button
                variant={"outline"}
                disabled
                className="w-full"
                type="submit"
              >
                <LoaderCircle className="animate-spin" />
              </Button>
            ) : (
              <Button className="w-full" type="submit">
                Submit
              </Button>
            )}
          </form>

          <div className="flex justify-center mt-4">
            <Link href={"/auth/signup"} className="text-blue-600">New ? Create account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
