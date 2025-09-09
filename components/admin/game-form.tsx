"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { VideoGame } from "@/lib/models/VideoGame"
import { Loader2 } from "lucide-react"

interface GameFormProps {
  game?: VideoGame
  onSubmit: (gameData: Omit<VideoGame, "_id" | "createdAt" | "updatedAt">) => Promise<void>
  onCancel: () => void
}

export function GameForm({ game, onSubmit, onCancel }: GameFormProps) {
  const [formData, setFormData] = useState({
    title: game?.title || "",
    description: game?.description || "",
    price: game?.price || 0,
    coverImage: game?.coverImage || "",
    genre: game?.genre || "",
    platform: game?.platform || [],
    developer: game?.developer || "",
    publisher: game?.publisher || "",
    releaseDate: game?.releaseDate ? new Date(game.releaseDate).toISOString().split("T")[0] : "",
    rating: game?.rating || 0,
    inStock: game?.inStock ?? true,
  })

  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const result = await response.json()
      handleInputChange("coverImage", result.filename)
    } catch (error) {
      console.error("Upload error:", error)
      alert("Failed to upload image")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await onSubmit({
        ...formData,
        price: Number(formData.price),
        rating: Number(formData.rating),
        releaseDate: new Date(formData.releaseDate),
        platform: Array.isArray(formData.platform) ? formData.platform : [formData.platform],
      })
    } catch (error) {
      console.error("Submit error:", error)
      alert("Failed to save game")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{game ? "Edit Game" : "Add New Game"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverImage">Cover Image</Label>
            <div className="flex items-center gap-4">
              <Input id="coverImage" type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
              {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
            </div>
            {formData.coverImage && (
              <div className="mt-2">
                <img
                  src={formData.coverImage || "/placeholder.svg"}
                  alt="Cover preview"
                  className="w-32 h-48 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="genre">Genre</Label>
              <Select value={formData.genre} onValueChange={(value) => handleInputChange("genre", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="action">Action</SelectItem>
                  <SelectItem value="adventure">Adventure</SelectItem>
                  <SelectItem value="rpg">RPG</SelectItem>
                  <SelectItem value="strategy">Strategy</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="racing">Racing</SelectItem>
                  <SelectItem value="puzzle">Puzzle</SelectItem>
                  <SelectItem value="horror">Horror</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select value={formData.platform[0]} onValueChange={(value) => handleInputChange("platform", [value])}>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PC">PC</SelectItem>
                  <SelectItem value="PlayStation 5">PlayStation 5</SelectItem>
                  <SelectItem value="Xbox Series X/S">Xbox Series X/S</SelectItem>
                  <SelectItem value="Nintendo Switch">Nintendo Switch</SelectItem>
                  <SelectItem value="Mobile">Mobile</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="developer">Developer</Label>
              <Input
                id="developer"
                value={formData.developer}
                onChange={(e) => handleInputChange("developer", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="publisher">Publisher</Label>
              <Input
                id="publisher"
                value={formData.publisher}
                onChange={(e) => handleInputChange("publisher", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="releaseDate">Release Date</Label>
              <Input
                id="releaseDate"
                type="date"
                value={formData.releaseDate}
                onChange={(e) => handleInputChange("releaseDate", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating">Rating (0-10)</Label>
              <Input
                id="rating"
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.rating}
                onChange={(e) => handleInputChange("rating", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="inStock"
              checked={formData.inStock}
              onChange={(e) => handleInputChange("inStock", e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="inStock">In Stock</Label>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {game ? "Update Game" : "Add Game"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
