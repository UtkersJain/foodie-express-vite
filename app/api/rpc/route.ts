import { type NextRequest, NextResponse } from "next/server"
import { Pool } from "pg"

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://localhost:5432/foodie_express",
})

// JSON-RPC error codes
const RPC_ERRORS = {
  PARSE_ERROR: -32700,
  INVALID_REQUEST: -32600,
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS: -32602,
  INTERNAL_ERROR: -32603,
}

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

// RPC Method handlers
const rpcMethods = {
  async getMenu(params: { since?: string }) {
    const client = await pool.connect()
    try {
      const query = "SELECT * FROM menu_items ORDER BY category, name"
      const result = await client.query(query)
      return result.rows
    } finally {
      client.release()
    }
  },

  async placeOrder(params: { items: any[]; customer: any; paymentMethod: string }) {
    const client = await pool.connect()
    try {
      await client.query("BEGIN")

      // Calculate total amount
      const totalAmount = params.items.reduce((sum, item) => sum + item.price * item.qty, 0)

      // Insert order
      const orderResult = await client.query(
        "INSERT INTO orders (customer_name, customer_phone, customer_address, total_amount, status) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        [params.customer.name, params.customer.phone, params.customer.address, totalAmount, "PENDING"],
      )

      const orderId = orderResult.rows[0].id

      // Insert order items
      for (const item of params.items) {
        await client.query("INSERT INTO order_items (order_id, menu_item_id, qty, price) VALUES ($1, $2, $3, $4)", [
          orderId,
          item.menu_item_id,
          item.qty,
          item.price,
        ])
      }

      await client.query("COMMIT")

      // Broadcast new order via WebSocket (would be implemented in real WebSocket server)
      // wsServer.broadcast('order_created', { orderId, ...orderData })

      return { orderId }
    } catch (error) {
      await client.query("ROLLBACK")
      throw error
    } finally {
      client.release()
    }
  },

  async getOrderStatus(params: { orderId: string }) {
    const client = await pool.connect()
    try {
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
      const result = await client.query(orderQuery, [params.orderId])
      return result.rows[0] || null
    } finally {
      client.release()
    }
  },

  async listOrders(params: { status?: string; limit?: number }) {
    const client = await pool.connect()
    try {
      let query = `
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
      `
      const queryParams: any[] = []

      if (params.status) {
        query += " WHERE o.status = $1"
        queryParams.push(params.status)
      }

      query += " GROUP BY o.id ORDER BY o.created_at DESC"

      if (params.limit) {
        query += ` LIMIT $${queryParams.length + 1}`
        queryParams.push(params.limit)
      }

      const result = await client.query(query, queryParams)
      return result.rows
    } finally {
      client.release()
    }
  },

  async acceptOrder(params: { orderId: string }) {
    const client = await pool.connect()
    try {
      const result = await client.query(
        "UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING status",
        ["ACCEPTED", params.orderId],
      )

      if (result.rows.length === 0) {
        throw new Error("Order not found")
      }

      // Broadcast order update via WebSocket
      // wsServer.broadcast('order_updated', { orderId: params.orderId, status: 'ACCEPTED' })

      return { status: result.rows[0].status }
    } finally {
      client.release()
    }
  },

  async updateOrderStatus(params: { orderId: string; status: string }) {
    const client = await pool.connect()
    try {
      // Validate status transition
      const validStatuses = ["PENDING", "ACCEPTED", "PREPARING", "READY", "COMPLETED"]
      if (!validStatuses.includes(params.status)) {
        throw new Error("Invalid status")
      }

      const result = await client.query(
        "UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING status",
        [params.status, params.orderId],
      )

      if (result.rows.length === 0) {
        throw new Error("Order not found")
      }

      // Broadcast order update via WebSocket
      // wsServer.broadcast('order_updated', { orderId: params.orderId, status: params.status })

      return { status: result.rows[0].status }
    } finally {
      client.release()
    }
  },

  async confirmPayment(params: { orderId: string; paymentRef: string }) {
    const client = await pool.connect()
    try {
      const result = await client.query(
        "UPDATE orders SET payment_ref = $1, updated_at = NOW() WHERE id = $2 RETURNING status",
        [params.paymentRef, params.orderId],
      )

      if (result.rows.length === 0) {
        throw new Error("Order not found")
      }

      return { status: "paid" }
    } finally {
      client.release()
    }
  },
}

async function handleRPCRequest(request: RPCRequest): Promise<RPCResponse> {
  try {
    const method = rpcMethods[request.method as keyof typeof rpcMethods]
    if (!method) {
      return {
        jsonrpc: "2.0",
        error: {
          code: RPC_ERRORS.METHOD_NOT_FOUND,
          message: `Method '${request.method}' not found`,
        },
        id: request.id,
      }
    }

    const result = await method(request.params)
    return {
      jsonrpc: "2.0",
      result,
      id: request.id,
    }
  } catch (error) {
    return {
      jsonrpc: "2.0",
      error: {
        code: RPC_ERRORS.INTERNAL_ERROR,
        message: error instanceof Error ? error.message : "Internal error",
      },
      id: request.id,
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Handle batch requests
    if (Array.isArray(body)) {
      const responses = await Promise.all(body.map((request) => handleRPCRequest(request)))
      return NextResponse.json(responses)
    }

    // Handle single request
    if (!body.jsonrpc || body.jsonrpc !== "2.0") {
      return NextResponse.json({
        jsonrpc: "2.0",
        error: {
          code: RPC_ERRORS.INVALID_REQUEST,
          message: "Invalid JSON-RPC request",
        },
        id: body.id || null,
      })
    }

    const response = await handleRPCRequest(body)
    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json({
      jsonrpc: "2.0",
      error: {
        code: RPC_ERRORS.PARSE_ERROR,
        message: "Parse error",
      },
      id: null,
    })
  }
}
