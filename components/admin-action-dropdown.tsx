"use client";

import * as React from "react";
import {
  DropdownMenuCheckboxItemProps,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";

export function AdminActionDropDown() {
  const [isDropdownOpen, setIsDropDownOpen] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isDeleteAlertDialogOpen, setIsDeleteAlertDialogOpen] =
    React.useState(false);

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropDownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-center hover:cursor-pointer hover:shadow transition-all hover:bg-gray-200 ease-in-out hover:font-bold rounded"
          onSelect={(e) => {
            e.preventDefault();
            setIsDialogOpen(true);
          }}
        >
          Update status
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-center hover:cursor-pointer hover:font-bold transition-all hover:bg-red-300 rounded"
          onSelect={(e) => {
            e.preventDefault();
            setIsDeleteAlertDialogOpen(true);
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>

      {/* CHANGE STATUS DIALOG */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Make changes in active status</DialogTitle>
            <DialogDescription>
              Make changes here here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Current status
              </Label>
              <Input
                id="name"
                defaultValue="Pedro Duarte"
                disabled={true}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Change status
              </Label>
              <Select>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Active or Deactive this member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="notActive">Deactivate</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* DELETE ALERT DIALOG */}
      <AlertDialog
        open={isDeleteAlertDialogOpen}
        onOpenChange={setIsDeleteAlertDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              member's account and remove their data from servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DropdownMenu>
  );
}
