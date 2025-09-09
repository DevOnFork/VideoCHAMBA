"use client"

import { useState, useEffect } from "react"
import type { VideoGame } from "@/lib/models/VideoGame"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Star, ShoppingCart } from "lucide-react"

interface GameCarouselProps {
  games: VideoGame[]
}

export function GameCarousel({ games }: GameCarouselProps) {
  const { addToCart } = useCart()
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % games.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [games.length])

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + games.length) % games.length)
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % games.length)
  }

  if (games.length === 0) return null

  const currentGame = games[currentIndex]

  const handleAddToCart = () => {
    addToCart(currentGame)
  }

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      <Card className="overflow-hidden bg-gradient-to-r from-card to-card/80">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 relative">
              <img
                src={currentGame.coverImage || "/placeholder.svg?height=600&width=400"}
                alt={currentGame.title}
                className="w-full h-96 md:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            <div className="md:w-1/2 p-8 flex flex-col justify-center">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{currentGame.genre}</Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{currentGame.rating}/10</span>
                  </div>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-balance">{currentGame.title}</h2>

                <p className="text-muted-foreground text-pretty line-clamp-3">{currentGame.description}</p>

                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Developer:</span> {currentGame.developer}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Platform:</span> {currentGame.platform.join(", ")}
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <span className="text-3xl font-bold text-primary">${currentGame.price}</span>
                  <Button
                    size="lg"
                    className="flex items-center gap-2"
                    onClick={handleAddToCart}
                    disabled={!currentGame.inStock}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm"
        onClick={goToNext}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {games.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? "bg-primary" : "bg-muted"}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}
