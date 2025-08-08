export interface MenuItem {
  id: string
  name: string
  price: number
  image_url?: string
  category: string
}

export interface OrderItem {
  id?: string
  menu_item_id: string
  name?: string
  qty: number
  price: number
}

export interface Order {
  id: string
  customer_name: string
  customer_phone: string
  customer_address?: string
  total_amount: number
  status: "PENDING" | "ACCEPTED" | "PREPARING" | "READY" | "COMPLETED"
  payment_ref?: string
  created_at: string
  updated_at: string
  items?: OrderItem[]
}

export interface Customer {
  name: string
  phone: string
  address: string
}
