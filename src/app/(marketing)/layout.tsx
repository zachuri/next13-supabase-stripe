import Link from "next/link"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { ThemeToggle } from "@/components/theme-toggle"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar mainNav={siteConfig.mainNav}>
        <ThemeToggle />
        <Link
          href="/login"
          className={cn(
            buttonVariants({ variant: "secondary", size: "sm" }),
            "px-4"
          )}
        >
          Login
        </Link>
      </Navbar>
      {children}
    </>
  )
}
