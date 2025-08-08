"use client"

import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { fetchMenu, selectMenuItems, selectMenuLoading } from "@/lib/features/menu/menuSlice"
import { addToCart, selectCartItems, selectCartTotal } from "@/lib/features/cart/cartSlice"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingCart, Plus, Utensils, Coffee, Cake } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { MenuItem } from "@/types"

const categories = [
  { id: "mains", name: "Main Dishes", icon: Utensils },
  { id: "beverages", name: "Beverages", icon: Coffee },
  { id: "desserts", name: "Desserts", icon: Cake },
]

export default function MenuPage() {
  const dispatch = useAppDispatch()
  const menuItems = useAppSelector(selectMenuItems)
  const loading = useAppSelector(selectMenuLoading)
  const cartItems = useAppSelector(selectCartItems)
  const cartTotal = useAppSelector(selectCartTotal)
  const [selectedCategory, setSelectedCategory] = useState("mains")

  useEffect(() => {
    dispatch(fetchMenu())
  }, [dispatch])

  const handleAddToCart = (item: MenuItem) => {
    dispatch(
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
      }),
    )
  }

  const filteredItems = menuItems.filter((item) => item.category === selectedCategory)
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Utensils className="h-8 w-8 text-orange-600" />
            <h1 className="text-2xl font-bold text-gray-900">FoodieExpress</h1>
          </div>
          <Link href="/cart">
            <Button variant="outline" className="relative bg-transparent">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cart
              {cartItemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                  {cartItemCount}
                </Badge>
              )}
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4">
        {/* Hero Section */}
        <div className="text-center py-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Delicious Food, Delivered Fast</h2>
          <p className="text-xl text-gray-600 mb-8">
            Order from our carefully curated menu of fresh, quality ingredients
          </p>
        </div>

        {/* Menu Categories */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center space-x-2">
                  <Icon className="h-4 w-4" />
                  <span>{category.name}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video relative">
                      <Image
                        src={
                          item.image_url ||
                          `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(item.name)}`
                        }
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <CardDescription className="text-sm text-gray-600">
                        Fresh and delicious {item.category}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-orange-600">${item.price.toFixed(2)}</span>
                      <Button onClick={() => handleAddToCart(item)} className="bg-orange-600 hover:bg-orange-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Cart Summary */}
        {cartItemCount > 0 && (
          <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 border">
            <div className="flex items-center justify-between space-x-4">
              <div>
                <p className="font-semibold">{cartItemCount} items</p>
                <p className="text-orange-600 font-bold">${cartTotal.toFixed(2)}</p>
              </div>
              <Link href="/cart">
                <Button className="bg-orange-600 hover:bg-orange-700">View Cart</Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
