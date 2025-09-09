"use client"

import type { VideoGame } from "@/lib/models/VideoGame"
import { GameCard } from "./game-card"

interface GameGridProps {
  games: VideoGame[]
  onAddToCart?: (game: VideoGame) => void
}

export function GameGrid({ games, onAddToCart }: GameGridProps) {
  if (games.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No games found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {games.map((game) => (
        <GameCard key={game._id} game={game} onAddToCart={onAddToCart} />
      ))}
    </div>
  )
}
