"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, ChefHat, Truck, AlertCircle } from "lucide-react"
import { rpcClient } from "@/lib/rpc-client"
import { wsClient } from "@/lib/websocket-client"
import type { Order } from "@/types"
import { toast } from "sonner"

const statusConfig = {
  PENDING: { label: "New Orders", icon: AlertCircle, color: "bg-red-500", next: "ACCEPTED" },
  ACCEPTED: { label: "Accepted", icon: CheckCircle, color: "bg-blue-500", next: "PREPARING" },
  PREPARING: { label: "Preparing", icon: ChefHat, color: "bg-orange-500", next: "READY" },
  READY: { label: "Ready", icon: Truck, color: "bg-green-500", next: "COMPLETED" },
  COMPLETED: { label: "Completed", icon: CheckCircle, color: "bg-gray-500", next: null },
}

export default function KitchenDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("PENDING")

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await rpcClient.call("listOrders", { limit: 50 })
        if (response.result) {
          setOrders(response.result)
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()

    // Subscribe to real-time order updates
    const handleNewOrder = (data: any) => {
      setOrders((prev) => [data, ...prev])
      toast.success(`New order #${data.id} received!`)
    }

    const handleOrderUpdate = (data: any) => {
      setOrders((prev) => prev.map((order) => (order.id === data.orderId ? { ...order, ...data } : order)))
    }

    wsClient.on("order_created", handleNewOrder)
    wsClient.on("order_updated", handleOrderUpdate)

    return () => {
      wsClient.off("order_created", handleNewOrder)
      wsClient.off("order_updated", handleOrderUpdate)
    }
  }, [])

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      if (newStatus === "ACCEPTED") {
        await rpcClient.call("acceptOrder", { orderId })
      } else {
        await rpcClient.call("updateOrderStatus", { orderId, status: newStatus })
      }
      toast.success(`Order #${orderId} updated to ${newStatus}`)
    } catch (error) {
      console.error("Failed to update order:", error)
      toast.error("Failed to update order status")
    }
  }

  const getOrdersByStatus = (status: string) => {
    return orders.filter((order) => order.status === status)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Kitchen Dashboard</h1>
          <p className="text-gray-600">Manage incoming orders and track preparation status</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            {Object.entries(statusConfig).map(([status, config]) => {
              const Icon = config.icon
              const count = getOrdersByStatus(status).length
              return (
                <TabsTrigger key={status} value={status} className="flex items-center space-x-2">
                  <Icon className="h-4 w-4" />
                  <span>{config.label}</span>
                  {count > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {count}
                    </Badge>
                  )}
                </TabsTrigger>
              )
            })}
          </TabsList>

          {Object.entries(statusConfig).map(([status, config]) => (
            <TabsContent key={status} value={status}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getOrdersByStatus(status).map((order) => (
                  <Card key={order.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                        <Badge className={`${config.color} text-white`}>{config.label}</Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>{order.customer_name}</p>
                        <p>{order.customer_phone}</p>
                        <p className="text-xs">{new Date(order.created_at).toLocaleString()}</p>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        {order.items?.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>
                              {item.qty}x {item.name}
                            </span>
                            <span>${(item.price * item.qty).toFixed(2)}</span>
                          </div>
                        ))}
                        <div className="border-t pt-2 font-bold">
                          <div className="flex justify-between">
                            <span>Total:</span>
                            <span className="text-orange-600">${order.total_amount.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {config.next && (
                        <Button
                          onClick={() => handleStatusUpdate(order.id, config.next!)}
                          className="w-full"
                          variant={status === "PENDING" ? "default" : "outline"}
                        >
                          {status === "PENDING" && "Accept Order"}
                          {status === "ACCEPTED" && "Start Preparing"}
                          {status === "PREPARING" && "Mark Ready"}
                          {status === "READY" && "Complete Order"}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {getOrdersByStatus(status).length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <config.icon className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No {config.label.toLowerCase()} orders</h3>
                  <p className="text-gray-500">Orders will appear here when they reach this status</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
