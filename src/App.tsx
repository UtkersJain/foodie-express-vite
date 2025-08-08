"use client"

import { useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import { Toaster } from "sonner"
import { useAppDispatch } from "./lib/hooks"
import { loadCartFromStorage } from "./lib/features/cart/cartSlice"
import MenuPage from "./pages/MenuPage"
import CartPage from "./pages/CartPage"
import OrderTrackingPage from "./pages/OrderTrackingPage"
import KitchenDashboard from "./pages/KitchenDashboard"
import AnalyticsPage from "./pages/AnalyticsPage"

function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    // Load cart from localStorage on app start
    dispatch(loadCartFromStorage())
  }, [dispatch])

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MenuPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/order/:id" element={<OrderTrackingPage />} />
        <Route path="/kitchen" element={<KitchenDashboard />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
      </Routes>
      <Toaster position="top-right" />
    </div>
  )
}

export default App
