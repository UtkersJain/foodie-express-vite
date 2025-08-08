const express = require("express")
const { Pool } = require("pg")
const cors = require("cors")

const app = express()
const port = process.env.PORT || 3001

// Database connection with better error handling
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/foodie_express",
  // Add connection timeout and retry logic
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
  max: 10,
})

// Middleware
app.use(cors())
app.use(express.json())

// Mock data fallback with INR prices and Indian customer names
const mockMenuItems = [
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

const mockOrders = [
  {
    id: "order-1",
    customer_name: "Rajesh Kumar",
    customer_phone: "+91 98765 43210",
    customer_address: "123 MG Road, Mumbai",
    total_amount: 2130,
    status: "PENDING",
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    items: [
      { name: "Classic Burger", qty: 2, price: 1065 },
      { name: "Coca Cola", qty: 1, price: 245 },
    ],
  },
  {
    id: "order-2",
    customer_name: "Priya Sharma",
    customer_phone: "+91 87654 32109",
    customer_address: "456 Park Street, Kolkata",
    total_amount: 1558,
    status: "PREPARING",
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    items: [
      { name: "Grilled Chicken", qty: 1, price: 1311 },
      { name: "Coffee", qty: 1, price: 327 },
    ],
  },
  {
    id: "order-3",
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

let dbConnected = false

// Test database connection
async function testDatabaseConnection() {
  try {
    const client = await pool.connect()
    await client.query("SELECT NOW()")
    client.release()
    dbConnected = true
    console.log("✅ Database connected successfully")
    return true
  } catch (err) {
    dbConnected = false
    console.error("❌ Database connection failed:", err.message)
    console.log("🔧 Server will use mock data instead")
    return false
  }
}

// Initialize database connection
testDatabaseConnection()

// JSON-RPC handler
app.post("/api/rpc", async (req, res) => {
  console.log("📥 RPC Request:", req.body.method, dbConnected ? "(DB)" : "(Mock)")

  try {
    const { method, params, id } = req.body
    let result

    if (dbConnected) {
      // Use database
      switch (method) {
        case "getMenu":
          const menuQuery = "SELECT * FROM menu_items ORDER BY category, name"
          const menuResult = await pool.query(menuQuery)
          result = menuResult.rows
          console.log(`✅ getMenu (DB): Returned ${result.length} items`)
          break

        case "listOrders":
          const limit = params?.limit || 50
          const ordersQuery = `
            SELECT o.*, 
                   json_agg(
                     json_build_object(
                       'name', mi.name,
                       'qty', oi.qty,
                       'price', oi.price
                     )
                   ) as items
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
            GROUP BY o.id 
            ORDER BY o.created_at DESC 
            LIMIT $1
          `
          const ordersResult = await pool.query(ordersQuery, [limit])
          result = ordersResult.rows
          console.log(`✅ listOrders (DB): Returned ${result.length} orders`)
          break

        case "placeOrder":
          const { items, customer } = params
          const client = await pool.connect()

          try {
            await client.query("BEGIN")

            const totalAmount = items.reduce((sum, item) => sum + item.price * item.qty, 0)

            const orderResult = await client.query(
              "INSERT INTO orders (customer_name, customer_phone, customer_address, total_amount, status) VALUES ($1, $2, $3, $4, $5) RETURNING id",
              [customer.name, customer.phone, customer.address, totalAmount, "PENDING"],
            )

            const orderId = orderResult.rows[0].id

            for (const item of items) {
              await client.query(
                "INSERT INTO order_items (order_id, menu_item_id, qty, price) VALUES ($1, $2, $3, $4)",
                [orderId, item.menu_item_id, item.qty, item.price],
              )
            }

            await client.query("COMMIT")
            result = { orderId }
            console.log(`✅ placeOrder (DB): Created order ${orderId}`)
          } catch (error) {
            await client.query("ROLLBACK")
            throw error
          } finally {
            client.release()
          }
          break

        case "getOrderStatus":
          const { orderId } = params
          const orderQuery = `
            SELECT o.*, 
                   json_agg(
                     json_build_object(
                       'name', mi.name,
                       'qty', oi.qty,
                       'price', oi.price
                     )
                   ) as items
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
            WHERE o.id = $1
            GROUP BY o.id
          `
          const orderResult = await pool.query(orderQuery, [orderId])
          result = orderResult.rows[0] || null
          console.log(`✅ getOrderStatus (DB): Found order ${orderId}`)
          break

        case "updateOrderStatus":
        case "acceptOrder":
          const { orderId: updateOrderId, status } = params
          const newStatus = method === "acceptOrder" ? "ACCEPTED" : status
          const updateResult = await pool.query(
            "UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING status",
            [newStatus, updateOrderId],
          )
          result = { status: updateResult.rows[0]?.status }
          console.log(`✅ ${method} (DB): Updated order ${updateOrderId} to ${newStatus}`)
          break

        default:
          throw new Error(`Method '${method}' not found`)
      }
    } else {
      // Use mock data
      switch (method) {
        case "getMenu":
          result = mockMenuItems
          console.log(`✅ getMenu (Mock): Returned ${result.length} items`)
          break

        case "listOrders":
          result = mockOrders.slice(0, params?.limit || 50)
          console.log(`✅ listOrders (Mock): Returned ${result.length} orders`)
          break

        case "placeOrder":
          const orderId = "mock-order-" + Date.now()
          const newOrder = {
            id: orderId,
            customer_name: params.customer.name,
            customer_phone: params.customer.phone,
            customer_address: params.customer.address,
            total_amount: params.items.reduce((sum, item) => sum + item.price * item.qty, 0),
            status: "PENDING",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            items: params.items.map((item) => ({
              name: mockMenuItems.find((m) => m.id === item.menu_item_id)?.name || "Unknown Item",
              qty: item.qty,
              price: item.price,
            })),
          }
          mockOrders.unshift(newOrder)
          result = { orderId }
          console.log(`✅ placeOrder (Mock): Created order ${orderId}`)
          break

        case "getOrderStatus":
          result = mockOrders.find((o) => o.id === params.orderId) || null
          console.log(`✅ getOrderStatus (Mock): Found order ${params.orderId}`)
          break

        case "updateOrderStatus":
        case "acceptOrder":
          const order = mockOrders.find((o) => o.id === params.orderId)
          if (order) {
            order.status = method === "acceptOrder" ? "ACCEPTED" : params.status
            order.updated_at = new Date().toISOString()
            result = { status: order.status }
            console.log(`✅ ${method} (Mock): Updated order ${params.orderId}`)
          } else {
            throw new Error("Order not found")
          }
          break

        default:
          throw new Error(`Method '${method}' not found`)
      }
    }

    res.json({
      jsonrpc: "2.0",
      result,
      id,
    })
  } catch (error) {
    console.error("❌ RPC Error:", error.message)
    res.json({
      jsonrpc: "2.0",
      error: {
        code: -32603,
        message: error.message,
      },
      id: req.body.id,
    })
  }
})

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    database: dbConnected ? "connected" : "disconnected",
    mode: dbConnected ? "database" : "mock",
    timestamp: new Date().toISOString(),
    currency: "INR"
  })
})

// Retry database connection every 30 seconds if disconnected
setInterval(() => {
  if (!dbConnected) {
    console.log("🔄 Retrying database connection...")
    testDatabaseConnection()
  }
}, 30000)

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`)
  console.log(`🔗 RPC endpoint: http://localhost:${port}/api/rpc`)
  console.log(`🏥 Health check: http://localhost:${port}/health`)
  console.log(`📊 Mode: ${dbConnected ? "Database" : "Mock Data"}`)
  console.log(`💰 Currency: Indian Rupees (₹)`)
})


