"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminStore } from "@/store/admin-store";
import { useEffect } from "react";
import { AdminActionDropDown } from "./admin-action-dropdown";
import { format } from "date-fns";

export function AdminDashboard({ authCookie }: { authCookie: string }) {
  const { fetchMembers } = useAdminStore();

  useEffect(() => {
    fetchMembers({ authCookie });
  }, []);
  return (
    <Table className="dark:bg-gray-900/80 max-w-7xl mx-auto">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Serial</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Selected plan</TableHead>
          <TableHead>Subscription Started</TableHead>
          <TableHead>Subscription Ends</TableHead>
          <TableHead>Plan Status</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {useAdminStore.getState().members.length === 0 ? (
          <TableRow>
            <TableCell>Loading...</TableCell>
          </TableRow>
        ) : (
          useAdminStore.getState().members.map((member, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{member.name}</TableCell>
              <TableCell>{member.email}</TableCell>
              <TableCell className="uppercase">{member.selectedPlan}</TableCell>
              <TableCell>{format(member.subscriptionStarted!, "PPP")}</TableCell>
              <TableCell>{format(member.subscriptionEnds!,"PPP")}</TableCell>
              <TableCell>
                {member.isActive ? <p>Active</p> : <p>Inactive</p>}
              </TableCell>
              <TableCell>
                <AdminActionDropDown />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
