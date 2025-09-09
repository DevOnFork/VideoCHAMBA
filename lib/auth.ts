import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import type { UserSession } from "./models/User"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export function generateToken(user: UserSession): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): UserSession | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserSession
  } catch (error) {
    return null
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}
