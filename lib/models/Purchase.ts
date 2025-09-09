export interface Purchase {
  _id?: string
  userId: string
  items: PurchaseItem[]
  totalAmount: number
  status: "pending" | "completed" | "cancelled"
  createdAt: Date
  updatedAt: Date
}

export interface PurchaseItem {
  gameId: string
  title: string
  price: number
  quantity: number
}
