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

  constructor(baseUrl = "/api/rpc", timeout = 10000) {
    this.baseUrl = baseUrl
    this.timeout = timeout
  }

  async call(method: string, params: any = {}): Promise<RPCResponse> {
    const request: RPCRequest = {
      jsonrpc: "2.0",
      method,
      params,
      id: Date.now(),
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
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

      return result
    } catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Request timeout")
      }
      throw error
    }
  }

  async batch(requests: Array<{ method: string; params: any }>): Promise<RPCResponse[]> {
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
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Request timeout")
      }
      throw error
    }
  }
}

export const rpcClient = new RPCClient()
