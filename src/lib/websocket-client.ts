type EventHandler = (data: any) => void

class WebSocketClient {
  private ws: WebSocket | null = null
  private url: string
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private eventHandlers: Map<string, EventHandler[]> = new Map()
  private pingInterval: NodeJS.Timeout | null = null
  private mockMode = false

  constructor(url = "ws://localhost:3002/ws") {
    this.url = url
    this.connect()
  }

  private connect() {
    try {
      this.ws = new WebSocket(this.url)

      this.ws.onopen = () => {
        console.log("✅ WebSocket connected")
        this.reconnectAttempts = 0
        this.mockMode = false
        this.startPing()
      }

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.type && data.type !== "pong") {
            const handlers = this.eventHandlers.get(data.type) || []
            handlers.forEach((handler) => handler(data.payload))
          }
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error)
        }
      }

      this.ws.onclose = () => {
        console.log("🔌 WebSocket disconnected")
        this.stopPing()
        this.reconnect()
      }

      this.ws.onerror = (error) => {
        console.error("❌ WebSocket error:", error)
      }
    } catch (error) {
      console.error("Failed to connect to WebSocket:", error)
      this.reconnect()
    }
  }

  private reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)
      console.log(`🔄 Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`)

      setTimeout(() => {
        this.connect()
      }, delay)
    } else {
      console.warn("🚧 Max reconnection attempts reached, WebSocket features disabled")
      this.mockMode = true
    }
  }

  private startPing() {
    this.pingInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: "ping" }))
      }
    }, 30000)
  }

  private stopPing() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval)
      this.pingInterval = null
    }
  }

  on(event: string, handler: EventHandler) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, [])
    }
    this.eventHandlers.get(event)!.push(handler)
  }

  off(event: string, handler: EventHandler) {
    const handlers = this.eventHandlers.get(event)
    if (handlers) {
      const index = handlers.indexOf(handler)
      if (index > -1) {
        handlers.splice(index, 1)
      }
    }
  }

  send(type: string, payload: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }))
    } else if (this.mockMode) {
      console.log(`🔧 Mock WebSocket send: ${type}`, payload)
    }
  }

  disconnect() {
    this.stopPing()
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }
}

export const wsClient = new WebSocketClient()
