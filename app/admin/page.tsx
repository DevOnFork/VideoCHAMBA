"use client"

import { useState, useEffect } from "react"
import type { VideoGame } from "@/lib/models/VideoGame"
import { GameForm } from "@/components/admin/game-form"
import { GamesTable } from "@/components/admin/games-table"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function AdminPage() {
  const [games, setGames] = useState<VideoGame[]>([])
  const [editingGame, setEditingGame] = useState<VideoGame | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGames()
  }, [])

  const fetchGames = async () => {
    try {
      const response = await fetch("/api/games")
      if (response.ok) {
        const gamesData = await response.json()
        setGames(gamesData)
      }
    } catch (error) {
      console.error("Error fetching games:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (gameData: Omit<VideoGame, "_id" | "createdAt" | "updatedAt">) => {
    try {
      const url = editingGame ? `/api/games/${editingGame._id}` : "/api/games"
      const method = editingGame ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gameData),
      })

      if (response.ok) {
        await fetchGames()
        setShowForm(false)
        setEditingGame(null)
      } else {
        throw new Error("Failed to save game")
      }
    } catch (error) {
      console.error("Error saving game:", error)
      throw error
    }
  }

  const handleEdit = (game: VideoGame) => {
    setEditingGame(game)
    setShowForm(true)
  }

  const handleDelete = async (gameId: string) => {
    try {
      const response = await fetch(`/api/games/${gameId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchGames()
      } else {
        throw new Error("Failed to delete game")
      }
    } catch (error) {
      console.error("Error deleting game:", error)
      alert("Failed to delete game")
    }
  }

  const handleAdd = () => {
    setEditingGame(null)
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingGame(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading games...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Game Store Admin</h1>
        </div>

        {showForm ? (
          <GameForm game={editingGame || undefined} onSubmit={handleSubmit} onCancel={handleCancel} />
        ) : (
          <GamesTable games={games} onEdit={handleEdit} onDelete={handleDelete} onAdd={handleAdd} />
        )}
      </div>
    </div>
  )
}
