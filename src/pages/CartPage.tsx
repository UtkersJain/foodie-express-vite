"use client"

import { useState } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import {
  selectCartItems,
  selectCartTotal,
  updateQuantity,
  removeFromCart,
  clearCart,
} from "@/lib/features/cart/cartSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Minus, Plus, Trash2 } from 'lucide-react'
import { Link, useNavigate } from "react-router-dom"
import { rpcClient } from "@/lib/rpc-client"
import { toast } from "sonner"

// Helper function to format Indian currency
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export default function CartPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const cartItems = useAppSelector(selectCartItems)
  const cartTotal = useAppSelector(selectCartTotal)

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
  })
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  // Delivery fee in INR
  const deliveryFee = 50 // ₹50 delivery fee

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      dispatch(removeFromCart(id))
    } else {
      dispatch(updateQuantity({ id, quantity: newQuantity }))
    }
  }

  const handlePlaceOrder = async () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      toast.error("Please fill in all customer information")
      return
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    setIsPlacingOrder(true)
    try {
      const orderItems = cartItems.map((item) => ({
        menu_item_id: item.id,
        qty: item.quantity,
        price: item.price,
      }))

      const response = await rpcClient.call("placeOrder", {
        items: orderItems,
        customer: customerInfo,
        paymentMethod: "card",
      })

      if (response.result) {
        dispatch(clearCart())
        toast.success("Order placed successfully!")
        navigate(`/order/${response.result.orderId}`)
      }
    } catch (error) {
      console.error("Failed to place order:", error)
      toast.error("Failed to place order. Please try again.")
    } finally {
      setIsPlacingOrder(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Add some delicious items to get started!</p>
            <Link to="/">
              <Button className="bg-orange-600 hover:bg-orange-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Menu
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Menu
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Order</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-orange-600 font-bold">{formatPrice(parseFloat(item.price.toString()))} each</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Checkout Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter your phone (e.g., +91 98765 43210)"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Delivery Address</Label>
                  <Input
                    id="address"
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo((prev) => ({ ...prev, address: e.target.value }))}
                    placeholder="Enter your address"
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatPrice(parseFloat(cartTotal.toString()))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee:</span>
                    <span>{formatPrice(deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-orange-600">{formatPrice(parseFloat(cartTotal.toString()) + deliveryFee)}</span>
                  </div>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  {isPlacingOrder ? "Placing Order..." : "Place Order"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

