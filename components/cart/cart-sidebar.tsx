"use client"

import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CartItem } from "./cart-item"
import { CheckoutForm } from "./checkout-form"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ShoppingCart } from "lucide-react"
import { useState } from "react"

export function CartSidebar() {
  const { items, isOpen, setIsOpen, getTotalPrice, getTotalItems, clearCart } = useCart()
  const { user } = useAuth()
  const [showCheckout, setShowCheckout] = useState(false)

  const handleCheckout = () => {
    if (!user) {
      // Could trigger auth modal here
      alert("Please sign in to checkout")
      return
    }
    setShowCheckout(true)
  }

  const handleCheckoutSuccess = () => {
    setShowCheckout(false)
    clearCart()
    setIsOpen(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Shopping Cart
            {getTotalItems() > 0 && <Badge variant="secondary">{getTotalItems()}</Badge>}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {showCheckout ? (
            <CheckoutForm onSuccess={handleCheckoutSuccess} onCancel={() => setShowCheckout(false)} />
          ) : (
            <>
              <div className="flex-1 overflow-y-auto py-4">
                {items.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <CartItem key={item.game._id} item={item} />
                    ))}
                  </div>
                )}
              </div>

              {items.length > 0 && (
                <div className="border-t pt-4 space-y-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total:</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>

                  <div className="space-y-2">
                    <Button onClick={handleCheckout} className="w-full" size="lg" disabled={!user}>
                      {user ? "Proceed to Checkout" : "Sign In to Checkout"}
                    </Button>
                    <Button variant="outline" onClick={clearCart} className="w-full bg-transparent">
                      Clear Cart
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
