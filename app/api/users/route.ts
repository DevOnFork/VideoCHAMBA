import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { User } from "@/lib/models/User"
import bcrypt from "bcryptjs"

// POST - Create new user (registration)
export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("videogame_store")

    const { email, password, name } = await request.json()

    // Check if user already exists
    const existingUser = await db.collection<User>("users").findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    const newUser: Omit<User, "_id"> = {
      email,
      password: hashedPassword,
      name,
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection<User>("users").insertOne(newUser as User)

    // Don't return password in response
    const { password: _, ...userResponse } = newUser

    return NextResponse.json({ _id: result.insertedId, ...userResponse }, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
