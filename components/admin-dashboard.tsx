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
import { useEffect, useState } from "react";
import { AdminActionDropDown } from "./admin-action-dropdown";
import { format } from "date-fns";
import { Loader } from "lucide-react";
import { Button } from "./ui/button";

export function AdminDashboard({ authCookie }: { authCookie: string }) {
  const { fetchMembers } = useAdminStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchMembers({ authCookie });
  }, []);

  if (useAdminStore.getState().members.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[90vh]">
        <Loader className="animate-spin ml-1" />
      </div>
    );
  }

  const data = useAdminStore.getState().members;
  const newData = data.map((oldData, index) => ({
    ...oldData,
    index: index + 1,
  }));

  function PageNumber() {
    const pageNumber: number[] = [];
    const totalPage = Math.ceil(
      useAdminStore.getState().members.length / itemsPerPage
    );

    for (let i = 1; i <= totalPage; i++) {
      pageNumber.push(i);
    }

    return (
      <div className="flex">
        {pageNumber.map((page) => (
          <Button
            onClick={() => {
              console.log(page);
              setCurrentPage(page);
            }}
          >
            {page}
          </Button>
        ))}
      </div>
    );
  }

  function getCurrentPageMembers() {
    const indexOfLastItem = currentPage * itemsPerPage; // 1 * 10 => 10
    const indexOfFirstItem = indexOfLastItem - itemsPerPage; // 10 - 10 => 0
    const currentItems = newData.slice(indexOfFirstItem, indexOfLastItem);
    return currentItems;
  }

  return (
    <div>
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
          {useAdminStore.getState().members.length !== 0 &&
            getCurrentPageMembers().map((member, index) => (
              <TableRow key={index}>
                <TableCell>{member.index}</TableCell>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell className="uppercase">
                  {member.selectedPlan}
                </TableCell>
                <TableCell>
                  {format(member.subscriptionStarted!, "PPP")}
                </TableCell>
                <TableCell>{format(member.subscriptionEnds!, "PPP")}</TableCell>
                <TableCell>
                  {member.isActive ? <p>Active</p> : <p>Inactive</p>}
                </TableCell>
                <TableCell>
                  <AdminActionDropDown
                    memberId={member.memberId!}
                    planStatus={member.isActive ? "Active" : "Inactive"}
                    authCookie={authCookie}
                  />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <div>
        <PageNumber />
      </div>
    </div>
  );
}
