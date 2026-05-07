import { Router, Request, Response } from 'express'
import { Database, Endpoint } from './database.js'

export class MockEngine {
  private router: Router
  private db: Database
  private routes: Map<string, Endpoint> = new Map()

  constructor(db: Database) {
    this.db = db
    this.router = Router()
    this.initializeRoutes()
  }

  getRouter(): Router {
    return this.router
  }

  reloadRoutes() {
    this.routes.clear()
    this.initializeRoutes()
  }

  private initializeRoutes() {
    const endpoints = this.db.getAllEndpoints()
    
    endpoints.forEach((endpoint) => {
      const routeKey = `${endpoint.method.toUpperCase()}:${endpoint.path}`
      this.routes.set(routeKey, endpoint)
      
      this.registerRoute(endpoint)
    })

    console.log(`✅ Loaded ${endpoints.length} mock endpoints`)
  }

  private registerRoute(endpoint: Endpoint) {
    const method = endpoint.method.toLowerCase()
    const path = endpoint.path

    const handler = async (req: Request, res: Response) => {
      const startTime = Date.now()
      
      try {
        // Apply delay if configured
        if (endpoint.delay > 0) {
          await this.delay(endpoint.delay)
        }

        // Parse headers
        const headers = JSON.parse(endpoint.headers || '{}')
        Object.entries(headers).forEach(([key, value]) => {
          res.setHeader(key, value as string)
        })

        // Parse and process response body
        let responseBody = endpoint.response_body
        
        // Replace template variables
        responseBody = this.processTemplate(responseBody, req)

        // Log request
        const responseTime = Date.now() - startTime
        this.db.logRequest(endpoint.id, req.method, req.path, endpoint.status_code, responseTime)

        // Send response
        res.status(endpoint.status_code)
        
        // Try to parse as JSON, otherwise send as text
        try {
          const jsonBody = JSON.parse(responseBody)
          res.json(jsonBody)
        } catch {
          res.send(responseBody)
        }

      } catch (error) {
        console.error('Mock handler error:', error)
        res.status(500).json({ error: 'Internal server error' })
      }
    }

    // Register route based on method
    switch (method) {
      case 'get':
        this.router.get(path, handler)
        break
      case 'post':
        this.router.post(path, handler)
        break
      case 'put':
        this.router.put(path, handler)
        break
      case 'patch':
        this.router.patch(path, handler)
        break
      case 'delete':
        this.router.delete(path, handler)
        break
      case 'head':
        this.router.head(path, handler)
        break
      case 'options':
        this.router.options(path, handler)
        break
      default:
        console.warn(`Unsupported method: ${method}`)
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  private processTemplate(body: string, req: Request): string {
    // Replace request path parameters
    Object.entries(req.params).forEach(([key, value]) => {
      body = body.replace(new RegExp(`{{${key}}}`, 'g'), value)
    })

    // Replace query parameters
    Object.entries(req.query).forEach(([key, value]) => {
      body = body.replace(new RegExp(`{{query.${key}}}`, 'g'), String(value))
    })

    // Replace request body fields
    if (req.body && typeof req.body === 'object') {
      Object.entries(req.body).forEach(([key, value]) => {
        body = body.replace(new RegExp(`{{body.${key}}}`, 'g'), String(value))
      })
    }

    // Replace special variables
    body = body.replace(/{{\$timestamp}}/g, Date.now().toString())
    body = body.replace(/{{\$randomInt}}/g, Math.floor(Math.random() * 1000).toString())
    body = body.replace(/{{\$uuid}}/g, this.generateUUID())

    return body
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }
}
