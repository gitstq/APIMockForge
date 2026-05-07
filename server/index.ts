import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import path from 'path'
import { fileURLToPath } from 'url'
import { Database } from './database.js'
import { MockEngine } from './mock-engine.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

const PORT = process.env.PORT || 3001

// Initialize database and mock engine
const db = new Database()
const mockEngine = new MockEngine(db)

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// API Routes
app.use('/api', createApiRoutes(db, mockEngine))

// Mock endpoint handler - must be after API routes
app.use('/mock', mockEngine.getRouter())

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist/client')))
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/client/index.html'))
  })
}

// Socket.io for real-time collaboration
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)

  socket.on('join-project', (projectId: string) => {
    socket.join(projectId)
    console.log(`Socket ${socket.id} joined project ${projectId}`)
  })

  socket.on('leave-project', (projectId: string) => {
    socket.leave(projectId)
    console.log(`Socket ${socket.id} left project ${projectId}`)
  })

  socket.on('endpoint-update', (data) => {
    socket.to(data.projectId).emit('endpoint-updated', data)
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

// Create API routes
function createApiRoutes(db: Database, mockEngine: MockEngine) {
  const router = express.Router()

  // Projects
  router.get('/projects', (req, res) => {
    try {
      const projects = db.getProjects()
      res.json({ success: true, data: projects })
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to get projects' })
    }
  })

  router.post('/projects', (req, res) => {
    try {
      const project = db.createProject(req.body)
      res.json({ success: true, data: project })
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to create project' })
    }
  })

  router.get('/projects/:id', (req, res) => {
    try {
      const project = db.getProject(req.params.id)
      if (!project) {
        return res.status(404).json({ success: false, error: 'Project not found' })
      }
      res.json({ success: true, data: project })
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to get project' })
    }
  })

  router.put('/projects/:id', (req, res) => {
    try {
      const project = db.updateProject(req.params.id, req.body)
      res.json({ success: true, data: project })
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to update project' })
    }
  })

  router.delete('/projects/:id', (req, res) => {
    try {
      db.deleteProject(req.params.id)
      res.json({ success: true })
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to delete project' })
    }
  })

  // Endpoints
  router.get('/projects/:projectId/endpoints', (req, res) => {
    try {
      const endpoints = db.getEndpoints(req.params.projectId)
      res.json({ success: true, data: endpoints })
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to get endpoints' })
    }
  })

  router.post('/projects/:projectId/endpoints', (req, res) => {
    try {
      const endpoint = db.createEndpoint(req.params.projectId, req.body)
      mockEngine.reloadRoutes()
      res.json({ success: true, data: endpoint })
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to create endpoint' })
    }
  })

  router.put('/endpoints/:id', (req, res) => {
    try {
      const endpoint = db.updateEndpoint(req.params.id, req.body)
      mockEngine.reloadRoutes()
      res.json({ success: true, data: endpoint })
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to update endpoint' })
    }
  })

  router.delete('/endpoints/:id', (req, res) => {
    try {
      db.deleteEndpoint(req.params.id)
      mockEngine.reloadRoutes()
      res.json({ success: true })
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to delete endpoint' })
    }
  })

  // Stats
  router.get('/stats', (req, res) => {
    try {
      const stats = db.getStats()
      res.json({ success: true, data: stats })
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to get stats' })
    }
  })

  // Health check
  router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
  })

  return router
}

// Start server
httpServer.listen(PORT, () => {
  console.log(`
🚀 APIMockForge Server is running!

📡 API Server: http://localhost:${PORT}/api
🔌 Mock Server: http://localhost:${PORT}/mock
📊 Health Check: http://localhost:${PORT}/api/health

Press Ctrl+C to stop the server.
  `)
})
