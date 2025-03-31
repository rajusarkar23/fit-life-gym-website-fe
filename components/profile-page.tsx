"use client";

import { useUserStore } from "@/store/user-store";
import { LoaderCircle, SquarePen } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

function EditUserNameDialog({
  currentUserName,
  cookie,
}: {
  currentUserName: string;
  cookie: string;
}) {

  const params = useParams()
  const router = useRouter()

  const [newUserName, setNewUserName] = useState("");
  const [loading, setLoadign] = useState(false)

  const { updateUserName, getProfile } = useUserStore();

  const handleClick = async () => {
    setLoadign(true)
    await updateUserName({authCookie: cookie!, newUserName: newUserName})
    
    if (useUserStore.getState().isResponseOkay) {
      router.push(`/space/profile/${useUserStore.getState().username}`) 
      setLoadign(false)
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <SquarePen
          size={18}
          className="ml-1 hover:scale-105 transition-all hover:cursor-pointer text-blue-400"
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit your username</DialogTitle>
          <DialogDescription>
            Make changes to your username here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Current
            </Label>
            <Input
              id="currentUserName"
              defaultValue={currentUserName}
              disabled
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              New
            </Label>
            <Input
              id="newUserName"
              placeholder="Enter new username"
              className="col-span-3"
              onChange={(e) => setNewUserName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleClick}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function ProfilePage({ cookie }: { cookie: string }) {

  const router = useRouter()

  if (useUserStore.getState().errorMessage === "No member found.") {
  
    router.push(`/member/${useUserStore.getState().username}`)
  }
  const params = useParams();

  const [loading, setLoadign] = useState(true)

  const { getProfile } = useUserStore();

  const getProfiledetails = async () => {
    setLoadign(true)
    await getProfile({
      authCookie: cookie,
      userName: params.username?.toString()!,
    });
    setLoadign(false)
  };

  useEffect(() => {
    getProfiledetails();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <LoaderCircle color="#873636" className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[30vh]">
      <div>
        {/* Profile image section */}
        <div className="flex justify-center items-center">
          <Image
            src={useUserStore.getState().memberProfile![0].imageUrl!}
            width={100}
            height={100}
            alt={useUserStore.getState().memberProfile![0].userName!}
            className="rounded-full"
          />
        </div>
        {/* Profile details section */}
        <div className="mt-4">
          <div className="flex items-center justify-center">
            <p className="font-semibold text-3xl">
              {useUserStore.getState().memberProfile![0].name}
            </p>
            <SquarePen
              onClick={() => {
                console.log("hola");
              }}
              size={18}
              className="ml-1 hover:scale-105 transition-all hover:cursor-pointer text-blue-400"
            />
          </div>
          <div className="flex items-center">
            <p className="font-semibold text-gray-300">
              {useUserStore.getState().memberProfile![0].userName}
            </p>
            <EditUserNameDialog
              cookie={cookie}
              currentUserName={
                useUserStore.getState().memberProfile![0].userName!
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
