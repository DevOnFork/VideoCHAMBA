import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { Purchase } from "@/lib/models/Purchase"

// GET - Fetch user purchases
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("videogame_store")

    const purchases = await db.collection<Purchase>("purchases").find({ userId }).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(purchases)
  } catch (error) {
    console.error("Error fetching purchases:", error)
    return NextResponse.json({ error: "Failed to fetch purchases" }, { status: 500 })
  }
}

// POST - Create new purchase
export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("videogame_store")

    const purchaseData: Omit<Purchase, "_id" | "createdAt" | "updatedAt"> = await request.json()

    const newPurchase: Omit<Purchase, "_id"> = {
      ...purchaseData,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection<Purchase>("purchases").insertOne(newPurchase as Purchase)

    return NextResponse.json({ _id: result.insertedId, ...newPurchase }, { status: 201 })
  } catch (error) {
    console.error("Error creating purchase:", error)
    return NextResponse.json({ error: "Failed to create purchase" }, { status: 500 })
  }
}
