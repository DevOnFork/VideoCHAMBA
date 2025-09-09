"use client"

import { useState } from "react"
import type { VideoGame } from "@/lib/models/VideoGame"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Plus } from "lucide-react"

interface GamesTableProps {
  games: VideoGame[]
  onEdit: (game: VideoGame) => void
  onDelete: (gameId: string) => void
  onAdd: () => void
}

export function GamesTable({ games, onEdit, onDelete, onAdd }: GamesTableProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const handleDelete = (gameId: string) => {
    if (deleteConfirm === gameId) {
      onDelete(gameId)
      setDeleteConfirm(null)
    } else {
      setDeleteConfirm(gameId)
      setTimeout(() => setDeleteConfirm(null), 3000)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Game Management</CardTitle>
        <Button onClick={onAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Game
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">Cover</th>
                <th className="text-left p-4">Title</th>
                <th className="text-left p-4">Genre</th>
                <th className="text-left p-4">Platform</th>
                <th className="text-left p-4">Price</th>
                <th className="text-left p-4">Stock</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game) => (
                <tr key={game._id} className="border-b hover:bg-muted/50">
                  <td className="p-4">
                    <img
                      src={game.coverImage || "/placeholder.svg?height=60&width=40"}
                      alt={game.title}
                      className="w-10 h-14 object-cover rounded"
                    />
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="font-medium">{game.title}</div>
                      <div className="text-sm text-muted-foreground">{game.developer}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant="secondary">{game.genre}</Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {game.platform.map((platform) => (
                        <Badge key={platform} variant="outline" className="text-xs">
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">${game.price.toFixed(2)}</td>
                  <td className="p-4">
                    <Badge variant={game.inStock ? "default" : "destructive"}>
                      {game.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => onEdit(game)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant={deleteConfirm === game._id ? "destructive" : "outline"}
                        onClick={() => handleDelete(game._id!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
