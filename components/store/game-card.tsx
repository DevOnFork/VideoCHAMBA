"use client"

import type { VideoGame } from "@/lib/models/VideoGame"
import { useCart } from "@/contexts/cart-context"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Eye } from "lucide-react"
import Link from "next/link"

interface GameCardProps {
  game: VideoGame
}

export function GameCard({ game }: GameCardProps) {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart(game)
  }

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
      <div className="relative overflow-hidden">
        <img
          src={game.coverImage || "/placeholder.svg?height=300&width=200"}
          alt={game.title}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
            {game.genre}
          </Badge>
        </div>
        <div className="absolute bottom-2 left-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-white text-sm font-medium">{game.rating}/10</span>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-1">{game.title}</h3>
        <p className="text-sm text-muted-foreground mb-2">{game.developer}</p>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{game.description}</p>

        <div className="flex flex-wrap gap-1 mb-3">
          {game.platform.slice(0, 2).map((platform) => (
            <Badge key={platform} variant="outline" className="text-xs">
              {platform}
            </Badge>
          ))}
          {game.platform.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{game.platform.length - 2}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <span className="text-2xl font-bold text-primary">${game.price}</span>
        <div className="flex gap-2">
          <Link href={`/games/${game._id}`}>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          <Button size="sm" onClick={handleAddToCart} disabled={!game.inStock}>
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
