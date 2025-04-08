import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

// export const metadata = {
//   title: "FitLife Gym - Transform Your Body, Transform Your Life",
//   description:
//     "FitLife Gym offers state-of-the-art equipment, expert trainers, and a supportive community to help you achieve your fitness goals.",
//     generator: 'v0.dev'
// }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} gym-pattern min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="relative flex min-h-screen flex-col">
            {/* <SiteHeader /> */}
            <main className="flex-1">{children}</main>
            {/* <SiteFooter /> */}
          </div>
          {/* <Toaster /> */}
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'