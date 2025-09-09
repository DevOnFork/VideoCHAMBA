"use client"

import type { VideoGame } from "@/lib/models/VideoGame"
import { GameCard } from "./game-card"

interface FeaturedGamesProps {
  games: VideoGame[]
  onAddToCart?: (game: VideoGame) => void
}

export function FeaturedGames({ games, onAddToCart }: FeaturedGamesProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {games.slice(0, 6).map((game) => (
        <GameCard key={game._id} game={game} onAddToCart={onAddToCart} />
      ))}
    </div>
  )
}
