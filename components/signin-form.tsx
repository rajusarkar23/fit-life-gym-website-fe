"use client";
import { Label } from "@radix-ui/react-label";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { useUserStore } from "@/store/user-store";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";

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

    if (useUserStore.getState().isResponseOkay && typeof useUserStore.getState().username === "string") {
      router.push(`/member/${useUserStore.getState().username}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] flex-col">
      <div className="py-8">
        <h2 className="text-sm font-bold text-center">Signin</h2>
        <p className="text-sm font-light">Please signin first to continue</p>
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
      </div>
    </div>
  );
}
