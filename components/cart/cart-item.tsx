"use client"

import { useCart, type CartItem as CartItemType } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, Trash2 } from "lucide-react"

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart()

  return (
    <div className="flex gap-3 p-3 border rounded-lg">
      <img
        src={item.game.coverImage || "/placeholder.svg?height=80&width=60"}
        alt={item.game.title}
        className="w-15 h-20 object-cover rounded"
      />

      <div className="flex-1 space-y-2">
        <div>
          <h4 className="font-medium line-clamp-1">{item.game.title}</h4>
          <p className="text-sm text-muted-foreground">{item.game.developer}</p>
          <Badge variant="outline" className="text-xs mt-1">
            {item.game.platform[0]}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={() => updateQuantity(item.game._id!, item.quantity - 1)}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={() => updateQuantity(item.game._id!, item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <div className="text-right">
            <p className="font-medium">${(item.game.price * item.quantity).toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">${item.game.price} each</p>
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-destructive"
        onClick={() => removeFromCart(item.game._id!)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
