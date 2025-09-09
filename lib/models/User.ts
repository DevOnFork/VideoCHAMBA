export interface User {
  _id?: string
  email: string
  password: string
  name: string
  role: "user" | "admin"
  createdAt: Date
  updatedAt: Date
}

export interface UserSession {
  userId: string
  email: string
  name: string
  role: "user" | "admin"
}
