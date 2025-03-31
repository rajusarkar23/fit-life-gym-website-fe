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
  name: string;
  email: string;
  password: string;
};

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Data>();

  const router = useRouter();

  const [error, setError] = useState("");

  const { signup } = useUserStore();

  const onSubmit = async (data: Data) => {
    setError("");
    await signup({
      email: data.email,
      name: data.name,
      password: data.password,
    });

    if (useUserStore.getState().isError) {
      setError(useUserStore.getState().errorMessage!);
    }

    if (useUserStore.getState().isResponseOkay) {
      router.push("/auth/verify");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] flex-col">
      <div className="py-8">
        <h2 className="text-sm font-bold text-center">Signup</h2>
        <p className="text-sm font-light">Please signup first to continue</p>
      </div>
      <div>
        <form className="w-96 space-y-2" onSubmit={handleSubmit(onSubmit)}>
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            placeholder="Enter your name"
            {...register("name", {
              required: { value: true, message: "Name is required" },
              minLength: {
                value: 3,
                message: "Name should be 3 character long",
              },
            })}
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
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
