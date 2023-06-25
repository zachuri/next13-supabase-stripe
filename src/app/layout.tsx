import "@/styles/globals.css"
import { Metadata } from "next"
import SupabaseProvider from "@/providers/supbase-provider"
import UserProvider from "@/providers/user-provider"
import { createSupabaseServerClient } from "@/utils/supabase-server"
import { SupabaseClient } from "@supabase/auth-helpers-nextjs"

import { siteConfig } from "@/config/site"
import { fontSans } from "@/lib/fonts"
import { getServerSession } from "@/lib/session"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"

export type TypedSupabaseClient = SupabaseClient

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
  // Function that get's current session
  const session = await getServerSession()

  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <SupabaseProvider session={session}>
            <UserProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
              >
                <div className="relative flex min-h-screen flex-col">
                  <div className="flex-1">{children}</div>
                </div>
                <Toaster />
                <TailwindIndicator />
              </ThemeProvider>
            </UserProvider>
          </SupabaseProvider>
        </body>
      </html>
    </>
  )
}

export const dynamic = "force-dynamic"
