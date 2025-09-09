import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { VideoGame } from "@/lib/models/VideoGame"

// GET - Fetch all games
export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("videogame_store")

    const games = await db.collection<VideoGame>("videogames").find({}).toArray()

    return NextResponse.json(games)
  } catch (error) {
    console.error("Error fetching games:", error)
    return NextResponse.json({ error: "Failed to fetch games" }, { status: 500 })
  }
}

// POST - Create new game
export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("videogame_store")

    const gameData: Omit<VideoGame, "_id" | "createdAt" | "updatedAt"> = await request.json()

    const newGame: Omit<VideoGame, "_id"> = {
      ...gameData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection<VideoGame>("videogames").insertOne(newGame as VideoGame)

    return NextResponse.json({ _id: result.insertedId, ...newGame }, { status: 201 })
  } catch (error) {
    console.error("Error creating game:", error)
    return NextResponse.json({ error: "Failed to create game" }, { status: 500 })
  }
}
