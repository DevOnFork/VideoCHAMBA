"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import type { VideoGame } from "@/lib/models/VideoGame"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StoreHeader } from "@/components/store/store-header"
import { ArrowLeft, Star, ShoppingCart, Calendar, Users, Gamepad } from "lucide-react"
import Link from "next/link"

export default function GameDetailPage() {
  const params = useParams()
  const [game, setGame] = useState<VideoGame | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchGame(params.id as string)
    }
  }, [params.id])

  const fetchGame = async (id: string) => {
    try {
      const response = await fetch(`/api/games/${id}`)
      if (response.ok) {
        const gameData = await response.json()
        setGame(gameData)
      }
    } catch (error) {
      console.error("Error fetching game:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <StoreHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading game details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-background">
        <StoreHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Game not found</h1>
            <Link href="/">
              <Button>Back to Store</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
              <ArrowLeft className="h-4 w-4" />
              Back to Store
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <img
              src={game.coverImage || "/placeholder.svg?height=600&width=400"}
              alt={game.title}
              className="w-full max-w-md mx-auto rounded-lg shadow-lg"
            />
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{game.genre}</Badge>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{game.rating}/10</span>
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-4 text-balance">{game.title}</h1>
              <p className="text-muted-foreground text-lg text-pretty">{game.description}</p>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Developer</p>
                      <p className="font-medium">{game.developer}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Publisher</p>
                      <p className="font-medium">{game.publisher}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Release Date</p>
                      <p className="font-medium">{new Date(game.releaseDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gamepad className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Platforms</p>
                      <div className="flex flex-wrap gap-1">
                        {game.platform.map((platform) => (
                          <Badge key={platform} variant="outline" className="text-xs">
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-primary">${game.price}</span>
              <Button size="lg" className="flex items-center gap-2" disabled={!game.inStock}>
                <ShoppingCart className="h-4 w-4" />
                {game.inStock ? "Add to Cart" : "Out of Stock"}
              </Button>
            </div>

            {!game.inStock && <p className="text-destructive font-medium">This game is currently out of stock.</p>}
          </div>
        </div>
      </main>
    </div>
  )
}
