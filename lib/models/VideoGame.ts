export interface VideoGame {
  _id?: string
  title: string
  description: string
  price: number
  coverImage: string
  genre: string
  platform: string[]
  developer: string
  publisher: string
  releaseDate: Date
  rating: number
  inStock: boolean
  createdAt: Date
  updatedAt: Date
}
