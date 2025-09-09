"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { VideoGame } from "@/lib/models/VideoGame"

export interface CartItem {
  game: VideoGame
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addToCart: (game: VideoGame) => void
  removeFromCart: (gameId: string) => void
  updateQuantity: (gameId: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("gamestore-cart")
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error("Failed to load cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("gamestore-cart", JSON.stringify(items))
  }, [items])

  const addToCart = (game: VideoGame) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.game._id === game._id)

      if (existingItem) {
        return prevItems.map((item) => (item.game._id === game._id ? { ...item, quantity: item.quantity + 1 } : item))
      } else {
        return [...prevItems, { game, quantity: 1 }]
      }
    })
  }

  const removeFromCart = (gameId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.game._id !== gameId))
  }

  const updateQuantity = (gameId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(gameId)
      return
    }

    setItems((prevItems) => prevItems.map((item) => (item.game._id === gameId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.game.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
