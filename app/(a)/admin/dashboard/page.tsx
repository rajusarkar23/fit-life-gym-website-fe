"use client"

import { useAdminStore } from "@/store/admin-store"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const DashboardPage = () => {
  const router = useRouter()

  useEffect(() => {
    if (useAdminStore.getState().isAuthenticated && useAdminStore.getState().isSigninSuccess && typeof useAdminStore.getState().adminName === "string" && typeof useAdminStore.getState().adminUserName === "string") {
      router.push(`/admin/dashboard/${useAdminStore.getState().adminUserName}`)
    }
  }, [])

  return (
    <div>DashboardPage</div>
  )
}

export default DashboardPage