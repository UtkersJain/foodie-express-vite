"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, CheckCircle, Truck, ChefHat } from "lucide-react"
import Link from "next/link"
import { rpcClient } from "@/lib/rpc-client"
import { wsClient } from "@/lib/websocket-client"
import type { Order } from "@/types"

const statusConfig = {
  PENDING: { label: "Order Received", icon: Clock, color: "bg-yellow-500" },
  ACCEPTED: { label: "Accepted", icon: CheckCircle, color: "bg-blue-500" },
  PREPARING: { label: "Preparing", icon: ChefHat, color: "bg-orange-500" },
  READY: { label: "Ready for Pickup", icon: Truck, color: "bg-green-500" },
  COMPLETED: { label: "Completed", icon: CheckCircle, color: "bg-gray-500" },
}

export default function OrderTrackingPage() {
  const params = useParams()
  const orderId = params.id as string
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await rpcClient.call("getOrderStatus", { orderId })
        if (response.result) {
          setOrder(response.result)
        }
      } catch (error) {
        console.error("Failed to fetch order:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()

    // Subscribe to order updates via WebSocket
    const handleOrderUpdate = (data: any) => {
      if (data.orderId === orderId) {
        setOrder((prev) => (prev ? { ...prev, ...data } : null))
      }
    }

    wsClient.on("order_updated", handleOrderUpdate)

    return () => {
      wsClient.off("order_updated", handleOrderUpdate)
    }
  }, [orderId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
        <div className="max-w-2xl mx-auto text-center py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-8">The order you're looking for doesn't exist.</p>
          <Link href="/">
            <Button className="bg-orange-600 hover:bg-orange-700">Back to Menu</Button>
          </Link>
        </div>
      </div>
    )
  }

  const currentStatus = statusConfig[order.status as keyof typeof statusConfig]
  const StatusIcon = currentStatus.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Menu
            </Button>
          </Link>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Order #{order.id}</CardTitle>
              <Badge className={`${currentStatus.color} text-white`}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {currentStatus.label}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Customer Information</h3>
                <p className="text-gray-600">{order.customer_name}</p>
                <p className="text-gray-600">{order.customer_phone}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Order Details</h3>
                <div className="space-y-2">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span>
                        {item.qty}x {item.name}
                      </span>
                      <span>${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span className="text-orange-600">${order.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Order Timeline</h3>
                <div className="space-y-2">
                  {Object.entries(statusConfig).map(([status, config]) => {
                    const Icon = config.icon
                    const isCompleted =
                      Object.keys(statusConfig).indexOf(order.status) >= Object.keys(statusConfig).indexOf(status)
                    const isCurrent = order.status === status

                    return (
                      <div
                        key={status}
                        className={`flex items-center space-x-3 ${isCompleted ? "text-gray-900" : "text-gray-400"}`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isCurrent ? config.color : isCompleted ? "bg-green-500" : "bg-gray-200"
                          } text-white`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className={isCurrent ? "font-semibold" : ""}>{config.label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="text-sm text-gray-500">
                <p>Order placed: {new Date(order.created_at).toLocaleString()}</p>
                {order.updated_at && <p>Last updated: {new Date(order.updated_at).toLocaleString()}</p>}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
