import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/contexts/auth-context"
import { CartProvider } from "@/contexts/cart-context"
import { CartSidebar } from "@/components/cart/cart-sidebar"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "GameStore - Your Ultimate Gaming Destination",
  description: "Discover and purchase the latest video games with our comprehensive game store",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          <AuthProvider>
            <CartProvider>
              {children}
              <CartSidebar />
            </CartProvider>
          </AuthProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
