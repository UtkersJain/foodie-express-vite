import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface CartState {
  items: CartItem[]
}

const initialState: CartState = {
  items: [],
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id)
      if (existingItem) {
        existingItem.quantity += action.payload.quantity
      } else {
        state.items.push(action.payload)
      }
      // Persist to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(state.items))
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(state.items))
      }
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find((item) => item.id === action.payload.id)
      if (item) {
        item.quantity = action.payload.quantity
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(state.items))
      }
    },
    clearCart: (state) => {
      state.items = []
      if (typeof window !== "undefined") {
        localStorage.removeItem("cart")
      }
    },
    loadCartFromStorage: (state) => {
      if (typeof window !== "undefined") {
        const savedCart = localStorage.getItem("cart")
        if (savedCart) {
          state.items = JSON.parse(savedCart)
        }
      }
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart, loadCartFromStorage } = cartSlice.actions

export const selectCartItems = (state: { cart: CartState }) => state.cart.items
export const selectCartTotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0)

export default cartSlice.reducer
