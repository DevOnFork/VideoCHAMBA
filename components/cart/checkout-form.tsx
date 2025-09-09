"use client"

import type React from "react"

import { useState } from "react"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CreditCard, ArrowLeft } from "lucide-react"

interface CheckoutFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export function CheckoutForm({ onSuccess, onCancel }: CheckoutFormProps) {
  const { items, getTotalPrice } = useCart()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    billingAddress: "",
    city: "",
    zipCode: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate purchase API call
      const purchaseData = {
        userId: user?.userId,
        items: items.map((item) => ({
          gameId: item.game._id,
          title: item.game.title,
          price: item.game.price,
          quantity: item.quantity,
        })),
        totalAmount: getTotalPrice(),
      }

      const response = await fetch("/api/purchases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(purchaseData),
      })

      if (response.ok) {
        // Simulate processing delay
        await new Promise((resolve) => setTimeout(resolve, 2000))
        onSuccess()
      } else {
        throw new Error("Purchase failed")
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Purchase failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-semibold">Checkout</h3>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {items.map((item) => (
            <div key={item.game._id} className="flex justify-between text-sm">
              <span>
                {item.game.title} x{item.quantity}
              </span>
              <span>${(item.game.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t pt-2 flex justify-between font-semibold">
            <span>Total:</span>
            <span>${getTotalPrice().toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardName">Cardholder Name</Label>
              <Input
                id="cardName"
                value={formData.cardName}
                onChange={(e) => setFormData((prev) => ({ ...prev, cardName: e.target.value }))}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={(e) => setFormData((prev) => ({ ...prev, cardNumber: e.target.value }))}
                required
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, expiryDate: e.target.value }))}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={formData.cvv}
                  onChange={(e) => setFormData((prev) => ({ ...prev, cvv: e.target.value }))}
                  required
                  disabled={loading}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Billing Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="billingAddress">Address</Label>
              <Input
                id="billingAddress"
                value={formData.billingAddress}
                onChange={(e) => setFormData((prev) => ({ ...prev, billingAddress: e.target.value }))}
                required
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => setFormData((prev) => ({ ...prev, zipCode: e.target.value }))}
                  required
                  disabled={loading}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? "Processing..." : `Complete Purchase - $${getTotalPrice().toFixed(2)}`}
        </Button>
      </form>
    </div>
  )
}
