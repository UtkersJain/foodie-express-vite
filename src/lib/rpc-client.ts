interface RPCRequest {
  jsonrpc: "2.0"
  method: string
  params: any
  id: string | number
}

interface RPCResponse {
  jsonrpc: "2.0"
  result?: any
  error?: {
    code: number
    message: string
    data?: any
  }
  id: string | number
}

class RPCClient {
  private baseUrl: string
  private timeout: number
  private mockMode: boolean

  constructor(baseUrl = "/api/rpc", timeout = 10000) {
    this.baseUrl = baseUrl
    this.timeout = timeout
    // Start with mock mode disabled to try real API first
    this.mockMode = false
  }

  private getMockData(method: string, params: any): any {
    console.log(`🔧 Using mock data for: ${method}`)

    switch (method) {
      case "getMenu":
        return [
          {
            id: "1",
            name: "Classic Burger",
            price: 1065,
            category: "mains",
            image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop",
          },
          {
            id: "2",
            name: "Grilled Chicken",
            price: 1311,
            category: "mains",
            image_url: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=300&h=200&fit=crop",
          },
          {
            id: "3",
            name: "Margherita Pizza",
            price: 1229,
            category: "mains",
            image_url: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=300&h=200&fit=crop",
          },
          {
            id: "4",
            name: "Fish & Chips",
            price: 1147,
            category: "mains",
            image_url: "https://images.unsplash.com/photo-1544982503-9f984c14501a?w=300&h=200&fit=crop",
          },
          {
            id: "5",
            name: "Pasta Carbonara",
            price: 1393,
            category: "mains",
            image_url: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300&h=200&fit=crop",
          },
          {
            id: "6",
            name: "BBQ Ribs",
            price: 1639,
            category: "mains",
            image_url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=300&h=200&fit=crop",
          },
          {
            id: "7",
            name: "Coca Cola",
            price: 245,
            category: "beverages",
            image_url: "https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=300&h=200&fit=crop",
          },
          {
            id: "8",
            name: "Fresh Orange Juice",
            price: 409,
            category: "beverages",
            image_url: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=300&h=200&fit=crop",
          },
          {
            id: "9",
            name: "Coffee",
            price: 327,
            category: "beverages",
            image_url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=200&fit=crop",
          },
          {
            id: "10",
            name: "Iced Tea",
            price: 245,
            category: "beverages",
            image_url: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&h=200&fit=crop",
          },
          {
            id: "11",
            name: "Smoothie",
            price: 491,
            category: "beverages",
            image_url: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=300&h=200&fit=crop",
          },
          {
            id: "12",
            name: "Sparkling Water",
            price: 204,
            category: "beverages",
            image_url: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=300&h=200&fit=crop",
          },
          {
            id: "13",
            name: "Chocolate Cake",
            price: 573,
            category: "desserts",
            image_url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=200&fit=crop",
          },
          {
            id: "14",
            name: "Ice Cream Sundae",
            price: 491,
            category: "desserts",
            image_url: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&h=200&fit=crop",
          },
          {
            id: "15",
            name: "Apple Pie",
            price: 409,
            category: "desserts",
            image_url: "https://images.unsplash.com/photo-1535920527002-b35e96722da9?w=300&h=200&fit=crop",
          },
          {
            id: "16",
            name: "Cheesecake",
            price: 655,
            category: "desserts",
            image_url: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=300&h=200&fit=crop",
          },
          {
            id: "17",
            name: "Tiramisu",
            price: 737,
            category: "desserts",
            image_url: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300&h=200&fit=crop",
          },
          {
            id: "18",
            name: "Brownie",
            price: 409,
            category: "desserts",
            image_url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&h=200&fit=crop",
          },
        ]
      case "placeOrder":
        return { orderId: "mock-order-" + Date.now() }
      case "getOrderStatus":
        return {
          id: params.orderId,
          customer_name: "Rajesh Kumar",
          customer_phone: "+91 98765 43210",
          customer_address: "123 MG Road, Mumbai",
          total_amount: 2130,
          status: "PREPARING",
          created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString(),
          items: [
            { name: "Classic Burger", qty: 2, price: 1065 },
            { name: "Coca Cola", qty: 1, price: 245 },
          ],
        }
      case "listOrders":
        return [
          {
            id: "mock-1",
            customer_name: "Rajesh Kumar",
            customer_phone: "+91 98765 43210",
            customer_address: "123 MG Road, Mumbai",
            total_amount: 2130,
            status: "PENDING",
            created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
            items: [{ name: "Classic Burger", qty: 2, price: 1065 }],
          },
          {
            id: "mock-2",
            customer_name: "Priya Sharma",
            customer_phone: "+91 87654 32109",
            customer_address: "456 Park Street, Kolkata",
            total_amount: 1558,
            status: "PREPARING",
            created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
            items: [{ name: "Grilled Chicken", qty: 1, price: 1311 }],
          },
          {
            id: "mock-3",
            customer_name: "Amit Singh",
            customer_phone: "+91 76543 21098",
            customer_address: "789 Brigade Road, Bangalore",
            total_amount: 2704,
            status: "READY",
            created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
            items: [
              { name: "Margherita Pizza", qty: 1, price: 1229 },
              { name: "Pasta Carbonara", qty: 1, price: 1393 },
            ],
          },
        ]
      case "acceptOrder":
      case "updateOrderStatus":
        return { status: params.status || "ACCEPTED" }
      default:
        return null
    }
  }

  async call(method: string, params: any = {}): Promise<RPCResponse> {
    // If already in mock mode, use mock data
    if (this.mockMode) {
      console.log(`🔧 Mock API call: ${method}`, params)
      return {
        jsonrpc: "2.0",
        result: this.getMockData(method, params),
        id: Date.now(),
      }
    }

    const request: RPCRequest = {
      jsonrpc: "2.0",
      method,
      params,
      id: Date.now(),
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      console.log(`🌐 Attempting API call: ${method}`, params)

      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: RPCResponse = await response.json()

      if (result.error) {
        throw new Error(`RPC Error: ${result.error.message}`)
      }

      console.log(`✅ API call successful: ${method}`, result)
      return result
    } catch (error) {
      clearTimeout(timeoutId)
      console.error(`❌ API call failed for ${method}:`, error)

      // Switch to mock mode on any error
      console.warn("🚧 Backend not available, switching to mock mode")
      this.mockMode = true
      return this.call(method, params)
    }
  }

  // Force enable mock mode for testing
  enableMockMode() {
    console.log("🔧 Mock mode enabled manually")
    this.mockMode = true
  }

  // Check if currently using mock mode
  isMockMode() {
    return this.mockMode
  }

  async batch(requests: Array<{ method: string; params: any }>): Promise<RPCResponse[]> {
    if (this.mockMode) {
      return Promise.all(
        requests.map((req, index) => ({
          jsonrpc: "2.0" as const,
          result: this.getMockData(req.method, req.params),
          id: index,
        })),
      )
    }

    const batchRequest = requests.map((req, index) => ({
      jsonrpc: "2.0" as const,
      method: req.method,
      params: req.params,
      id: index,
    }))

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(batchRequest),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      clearTimeout(timeoutId)
      console.warn("🚧 Backend not available for batch request, switching to mock mode")
      this.mockMode = true
      return this.batch(requests)
    }
  }
}

export const rpcClient = new RPCClient()


