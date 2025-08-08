"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, DollarSign, ShoppingBag, Clock, ArrowLeft } from 'lucide-react'
import { Link } from "react-router-dom"
import { wsClient } from "@/lib/websocket-client"
import { rpcClient } from "@/lib/rpc-client"

interface AnalyticsData {
  todayOrders: number
  todayRevenue: number
  avgOrderValue: number
  pendingOrders: number
}

// Define an interface for the metric items to ensure 'value' is always a string
interface MetricItem {
  title: string;
  value: string; // Explicitly define value as string
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    todayOrders: 0,
    todayRevenue: 0,
    avgOrderValue: 0,
    pendingOrders: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const ordersResponse = await rpcClient.call("listOrders", { limit: 100 })
        if (ordersResponse.result) {
          const orders = ordersResponse.result
          const today = new Date().toDateString()

          const todayOrders = orders.filter((order: any) => new Date(order.created_at).toDateString() === today)

          // Ensure total_amount is parsed as a float before summing
          const todayRevenue = todayOrders.reduce((sum: number, order: any) => sum + parseFloat(order.total_amount), 0)
          const avgOrderValue = todayOrders.length > 0 ? todayRevenue / todayOrders.length : 0
          const pendingOrders = orders.filter((order: any) =>
            ["PENDING", "ACCEPTED", "PREPARING"].includes(order.status),
          ).length

          setAnalytics({
            todayOrders: todayOrders.length,
            todayRevenue,
            avgOrderValue,
            pendingOrders,
          })
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()

    const handleAnalyticsUpdate = (data: any) => {
      setAnalytics((prev) => ({
        ...prev,
        ...data,
      }))
    }

    const handleNewOrder = () => {
      setAnalytics((prev) => ({
        ...prev,
        todayOrders: prev.todayOrders + 1,
        pendingOrders: prev.pendingOrders + 1,
      }))
    }

    const handleOrderUpdate = (data: any) => {
      if (data.status === "COMPLETED") {
        setAnalytics((prev) => ({
          ...prev,
          pendingOrders: Math.max(0, prev.pendingOrders - 1),
        }))
      }
    }

    wsClient.on("analytics_update", handleAnalyticsUpdate)
    wsClient.on("order_created", handleNewOrder)
    wsClient.on("order_updated", handleOrderUpdate)

    return () => {
      wsClient.off("analytics_update", handleAnalyticsUpdate)
      wsClient.off("order_created", handleNewOrder)
      wsClient.off("order_updated", handleOrderUpdate)
    }
  }, [])

  // Apply the MetricItem interface to the metrics array and ensure values are strings
  const metrics: MetricItem[] = [
    {
      title: "Today's Orders",
      value: analytics.todayOrders.toString(), // Convert number to string
      icon: ShoppingBag,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Today's Revenue",
      value: `$${parseFloat(analytics.todayRevenue.toString()).toFixed(2)}`, // Convert to string before parseFloat, then toFixed
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Avg Order Value",
      value: `$${parseFloat(analytics.avgOrderValue.toString()).toFixed(2)}`, // Convert to string before parseFloat, then toFixed
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Pending Orders",
      value: analytics.pendingOrders.toString(), // Convert number to string
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
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
        <div className="flex items-center mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Menu
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Real-time insights into your restaurant performance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{metric.title}</CardTitle>
                  <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                    <Icon className={`h-4 w-4 ${metric.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${metric.color}`}>{metric.value}</div>
                  <Badge variant="secondary" className="mt-2">
                    Live Data
                  </Badge>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>Real-time analytics powered by WebSocket connections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-medium">Order Completion Rate</span>
                <Badge variant="outline">
                  {analytics.todayOrders > 0
                    ? `${(((analytics.todayOrders - analytics.pendingOrders) / analytics.todayOrders) * 100).toFixed(1)}%`
                    : "0%"}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-medium">Active Orders</span>
                <Badge variant={analytics.pendingOrders > 5 ? "destructive" : "default"}>
                  {analytics.pendingOrders} orders
                </Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-medium">Status</span>
                <Badge variant="default" className="bg-green-500">
                  <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                  Live Updates Active
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
