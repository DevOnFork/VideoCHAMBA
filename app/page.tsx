"use client"

import { useState, useEffect } from "react"
import type { VideoGame } from "@/lib/models/VideoGame"
import { GameCarousel } from "@/components/store/game-carousel"
import { FeaturedGames } from "@/components/store/featured-games"
import { StoreHeader } from "@/components/store/store-header"
import { GameGrid } from "@/components/store/game-grid"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

export default function HomePage() {
  const [games, setGames] = useState<VideoGame[]>([])
  const [filteredGames, setFilteredGames] = useState<VideoGame[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("all")
  const [selectedPlatform, setSelectedPlatform] = useState("all")

  useEffect(() => {
    fetchGames()
  }, [])

  useEffect(() => {
    filterGames()
  }, [games, searchTerm, selectedGenre, selectedPlatform])

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

  const filterGames = () => {
    let filtered = games

    if (searchTerm) {
      filtered = filtered.filter(
        (game) =>
          game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          game.developer.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedGenre !== "all") {
      filtered = filtered.filter((game) => game.genre === selectedGenre)
    }

    if (selectedPlatform !== "all") {
      filtered = filtered.filter((game) => game.platform.includes(selectedPlatform))
    }

    setFilteredGames(filtered)
  }

  const featuredGames = games.filter((game) => game.rating >= 8.0).slice(0, 6)
  const newReleases = games
    .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
    .slice(0, 8)

  const genres = [...new Set(games.map((game) => game.genre))]
  const platforms = [...new Set(games.flatMap((game) => game.platform))]

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
      <StoreHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section with Carousel */}
        <section className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-8 text-balance">Discover Amazing Games</h1>
          <p className="text-xl text-muted-foreground text-center mb-8 text-pretty">
            Explore our collection of the latest and greatest video games
          </p>
          {featuredGames.length > 0 && <GameCarousel games={featuredGames} />}
        </section>

        {/* Search and Filters */}
        <section className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search games..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genres</SelectItem>
                  {genres.map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  {platforms.map((platform) => (
                    <SelectItem key={platform} value={platform}>
                      {platform}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Featured Games Section */}
        {featuredGames.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Featured Games</h2>
            <FeaturedGames games={featuredGames} />
          </section>
        )}

        {/* New Releases Section */}
        {newReleases.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">New Releases</h2>
            <GameGrid games={newReleases} />
          </section>
        )}

        {/* All Games Section */}
        <section>
          <h2 className="text-3xl font-bold mb-6">
            All Games {filteredGames.length !== games.length && `(${filteredGames.length})`}
          </h2>
          <GameGrid games={filteredGames} />
        </section>
      </main>
    </div>
  )
}
