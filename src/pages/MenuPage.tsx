"use client"

import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { fetchMenu, selectMenuItems, selectMenuLoading } from "@/lib/features/menu/menuSlice"
import { addToCart, selectCartItems, selectCartTotal } from "@/lib/features/cart/cartSlice"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingCart, Plus, Utensils, Coffee, Cake } from 'lucide-react'
import { Link } from "react-router-dom"
import { toast } from "sonner"
import { rpcClient } from "@/lib/rpc-client"
import type { MenuItem } from "@/types"

const categories = [
  { id: "mains", name: "Main Dishes", icon: Utensils },
  { id: "beverages", name: "Beverages", icon: Coffee },
  { id: "desserts", name: "Desserts", icon: Cake },
]

// Helper function to format Indian currency
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export default function MenuPage() {
  const dispatch = useAppDispatch()
  const menuItems = useAppSelector(selectMenuItems)
  const loading = useAppSelector(selectMenuLoading)
  const cartItems = useAppSelector(selectCartItems)
  const cartTotal = useAppSelector(selectCartTotal)
  const [selectedCategory, setSelectedCategory] = useState("mains")

  useEffect(() => {
    console.log("🔄 MenuPage: Fetching menu data...")
    dispatch(fetchMenu())
  }, [dispatch])

  useEffect(() => {
    console.log("📊 MenuPage: Menu items loaded:", menuItems.length)
    if (rpcClient.isMockMode()) {
      toast.info("Using demo data - backend not connected", {
        description: "The app is running with sample data for demonstration",
      })
    }
  }, [menuItems])

  const handleAddToCart = (item: MenuItem) => {
    dispatch(
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
      }),
    )
    toast.success(`Added ${item.name} to cart`)
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
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show message if no menu items loaded
  if (!loading && menuItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
        <div className="max-w-7xl mx-auto text-center py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">No Menu Items Found</h1>
          <p className="text-gray-600 mb-8">Unable to load menu data. Please check your connection.</p>
          <Button
            onClick={() => {
              console.log("🔄 Manual refresh requested")
              dispatch(fetchMenu())
            }}
            className="bg-orange-600 hover:bg-orange-700"
          >
            Try Again
          </Button>
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
            {rpcClient.isMockMode() && (
              <Badge variant="secondary" className="ml-2">
                Demo Mode
              </Badge>
            )}
            <Badge variant="outline" className="ml-2">
              🇮🇳 India
            </Badge>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/kitchen">
              <Button variant="outline" className="bg-transparent">
                Kitchen
              </Button>
            </Link>
            <Link to="/analytics">
              <Button variant="outline" className="bg-transparent">
                Analytics
              </Button>
            </Link>
            <Link to="/cart">
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
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4">
        {/* Hero Section */}
        <div className="text-center py-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Delicious Food, Delivered Fast</h2>
          <p className="text-xl text-gray-600 mb-8">
            Order from our carefully curated menu of fresh, quality ingredients
          </p>
          <p className="text-sm text-gray-500">
            {menuItems.length} items available • {rpcClient.isMockMode() ? "Demo data" : "Live data"} • Prices in Indian Rupees (₹)
          </p>
        </div>

        {/* Menu Categories */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            {categories.map((category) => {
              const Icon = category.icon
              const itemCount = menuItems.filter((item) => item.category === category.id).length
              return (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center space-x-2">
                  <Icon className="h-4 w-4" />
                  <span>{category.name}</span>
                  <Badge variant="secondary" className="ml-1">
                    {itemCount}
                  </Badge>
                </TabsTrigger>
              )
            })}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video relative bg-gray-100">
                      <img
                        src={item.image_url || `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop`}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to a food-related image if the original fails
                          const fallbackImages = {
                            mains: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop",
                            beverages: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&h=200&fit=crop",
                            desserts: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&h=200&fit=crop"
                          }
                          e.currentTarget.src = fallbackImages[item.category as keyof typeof fallbackImages] || fallbackImages.mains
                        }}
                        loading="lazy"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <CardDescription className="text-sm text-gray-600">
                        Fresh and delicious {item.category.replace("s", "")}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-orange-600">{formatPrice(parseFloat(item.price.toString()))}</span>
                      <Button onClick={() => handleAddToCart(item)} className="bg-orange-600 hover:bg-orange-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {filteredItems.length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    No {category.name.toLowerCase()} available
                  </h3>
                  <p className="text-gray-500">Check back later for more options!</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Cart Summary */}
        {cartItemCount > 0 && (
          <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 border">
            <div className="flex items-center justify-between space-x-4">
              <div>
                <p className="font-semibold">{cartItemCount} items</p>
                <p className="text-orange-600 font-bold">{formatPrice(parseFloat(cartTotal.toString()))}</p>
              </div>
              <Link to="/cart">
                <Button className="bg-orange-600 hover:bg-orange-700">View Cart</Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

