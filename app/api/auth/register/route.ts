import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { User } from "@/lib/models/User"
import { hashPassword, generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("videogame_store")

    // Check if user already exists
    const existingUser = await db.collection<User>("users").findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password)
    const newUser: Omit<User, "_id"> = {
      email,
      password: hashedPassword,
      name,
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection<User>("users").insertOne(newUser as User)

    // Generate JWT token
    const userSession = {
      userId: result.insertedId.toString(),
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    }

    const token = generateToken(userSession)

    // Set HTTP-only cookie
    const response = NextResponse.json({
      message: "Registration successful",
      user: userSession,
    })

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
