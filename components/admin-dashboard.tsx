"use client"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { useAdminStore } from "@/store/admin-store"
import { useEffect } from "react"
import { Button } from "./ui/button"
  
  const invoices = [
    {
      invoice: "INV001",
      paymentStatus: "Paid",
      totalAmount: "$250.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV002",
      paymentStatus: "Pending",
      totalAmount: "$150.00",
      paymentMethod: "PayPal",
    },
    {
      invoice: "INV003",
      paymentStatus: "Unpaid",
      totalAmount: "$350.00",
      paymentMethod: "Bank Transfer",
    },
    {
      invoice: "INV004",
      paymentStatus: "Paid",
      totalAmount: "$450.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV005",
      paymentStatus: "Paid",
      totalAmount: "$550.00",
      paymentMethod: "PayPal",
    },
    {
      invoice: "INV006",
      paymentStatus: "Pending",
      totalAmount: "$200.00",
      paymentMethod: "Bank Transfer",
    },
    {
      invoice: "INV007",
      paymentStatus: "Unpaid",
      totalAmount: "$300.00",
      paymentMethod: "Credit Card",
    },
  ]
  
  export function AdminDashboard({authCookie}: {authCookie: string}) {

    const {fetchMembers} = useAdminStore()

    useEffect(() => {
      fetchMembers({authCookie})
    }, [])
    return (
      <Table className="dark:bg-gray-900/80 max-w-7xl mx-auto">
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Serial</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Subscription Started</TableHead>
            <TableHead>Subscription Ends</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
       
          {
            useAdminStore.getState().members.map((member, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.subscriptionStarted}</TableCell>
                <TableCell>{member.subscriptionEnds}</TableCell>
                <TableCell>{member.isActive ? (<p>Active</p>) : (<p>Inactive</p>)}</TableCell>
                <TableCell>
                  <Button>Action</Button>
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
    
      </Table>
    )
  }
  