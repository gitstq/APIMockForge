import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export interface Project {
  id: string
  name: string
  description: string
  created_at: string
  updated_at: string
}

export interface Endpoint {
  id: string
  project_id: string
  method: string
  path: string
  name: string
  status_code: number
  delay: number
  response_body: string
  headers: string
  created_at: string
  updated_at: string
}

export class DatabaseManager {
  private db: Database.Database

  constructor() {
    const dbPath = path.join(__dirname, '../data/apimockforge.db')
    this.db = new Database(dbPath)
    this.initializeTables()
  }

  private initializeTables() {
    // Projects table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Endpoints table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS endpoints (
        id TEXT PRIMARY KEY,
        project_id TEXT NOT NULL,
        method TEXT NOT NULL,
        path TEXT NOT NULL,
        name TEXT,
        status_code INTEGER DEFAULT 200,
        delay INTEGER DEFAULT 0,
        response_body TEXT,
        headers TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
      )
    `)

    // Request logs table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS request_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        endpoint_id TEXT,
        method TEXT,
        path TEXT,
        status_code INTEGER,
        response_time INTEGER,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Insert sample data if empty
    const projectCount = this.db.prepare('SELECT COUNT(*) as count FROM projects').get() as { count: number }
    if (projectCount.count === 0) {
      this.insertSampleData()
    }
  }

  private insertSampleData() {
    const projectId = 'proj_' + Date.now()
    
    this.db.prepare(`
      INSERT INTO projects (id, name, description) VALUES (?, ?, ?)
    `).run(projectId, '示例项目', '这是一个示例项目，包含一些常用的API Mock接口')

    const endpoints = [
      {
        id: 'ep_' + Date.now(),
        project_id: projectId,
        method: 'GET',
        path: '/api/users',
        name: '获取用户列表',
        status_code: 200,
        delay: 0,
        response_body: JSON.stringify({
          code: 200,
          data: [
            { id: 1, name: '张三', email: 'zhangsan@example.com' },
            { id: 2, name: '李四', email: 'lisi@example.com' },
          ],
          message: 'success',
        }),
        headers: JSON.stringify({ 'Content-Type': 'application/json' }),
      },
      {
        id: 'ep_' + (Date.now() + 1),
        project_id: projectId,
        method: 'POST',
        path: '/api/users',
        name: '创建用户',
        status_code: 201,
        delay: 100,
        response_body: JSON.stringify({
          code: 201,
          data: { id: 3, name: '王五', email: 'wangwu@example.com' },
          message: '创建成功',
        }),
        headers: JSON.stringify({ 'Content-Type': 'application/json' }),
      },
    ]

    const insertEndpoint = this.db.prepare(`
      INSERT INTO endpoints 
      (id, project_id, method, path, name, status_code, delay, response_body, headers)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    endpoints.forEach((ep) => {
      insertEndpoint.run(
        ep.id,
        ep.project_id,
        ep.method,
        ep.path,
        ep.name,
        ep.status_code,
        ep.delay,
        ep.response_body,
        ep.headers
      )
    })
  }

  // Project methods
  getProjects(): Project[] {
    return this.db.prepare('SELECT * FROM projects ORDER BY updated_at DESC').all() as Project[]
  }

  getProject(id: string): Project | undefined {
    return this.db.prepare('SELECT * FROM projects WHERE id = ?').get(id) as Project | undefined
  }

  createProject(project: Partial<Project>): Project {
    const id = 'proj_' + Date.now()
    const now = new Date().toISOString()
    
    this.db.prepare(`
      INSERT INTO projects (id, name, description, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, project.name || '未命名项目', project.description || '', now, now)

    return this.getProject(id)!
  }

  updateProject(id: string, updates: Partial<Project>): Project {
    const now = new Date().toISOString()
    
    this.db.prepare(`
      UPDATE projects 
      SET name = COALESCE(?, name),
          description = COALESCE(?, description),
          updated_at = ?
      WHERE id = ?
    `).run(updates.name, updates.description, now, id)

    return this.getProject(id)!
  }

  deleteProject(id: string): void {
    this.db.prepare('DELETE FROM projects WHERE id = ?').run(id)
  }

  // Endpoint methods
  getEndpoints(projectId: string): Endpoint[] {
    return this.db.prepare('SELECT * FROM endpoints WHERE project_id = ? ORDER BY created_at DESC')
      .all(projectId) as Endpoint[]
  }

  getAllEndpoints(): Endpoint[] {
    return this.db.prepare('SELECT * FROM endpoints').all() as Endpoint[]
  }

  getEndpoint(id: string): Endpoint | undefined {
    return this.db.prepare('SELECT * FROM endpoints WHERE id = ?').get(id) as Endpoint | undefined
  }

  createEndpoint(projectId: string, endpoint: Partial<Endpoint>): Endpoint {
    const id = 'ep_' + Date.now()
    const now = new Date().toISOString()
    
    this.db.prepare(`
      INSERT INTO endpoints 
      (id, project_id, method, path, name, status_code, delay, response_body, headers, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      projectId,
      endpoint.method || 'GET',
      endpoint.path || '/api/endpoint',
      endpoint.name || '未命名接口',
      endpoint.status_code || 200,
      endpoint.delay || 0,
      endpoint.response_body || '{}',
      endpoint.headers || '{}',
      now,
      now
    )

    return this.getEndpoint(id)!
  }

  updateEndpoint(id: string, updates: Partial<Endpoint>): Endpoint {
    const now = new Date().toISOString()
    
    this.db.prepare(`
      UPDATE endpoints 
      SET method = COALESCE(?, method),
          path = COALESCE(?, path),
          name = COALESCE(?, name),
          status_code = COALESCE(?, status_code),
          delay = COALESCE(?, delay),
          response_body = COALESCE(?, response_body),
          headers = COALESCE(?, headers),
          updated_at = ?
      WHERE id = ?
    `).run(
      updates.method,
      updates.path,
      updates.name,
      updates.status_code,
      updates.delay,
      updates.response_body,
      updates.headers,
      now,
      id
    )

    return this.getEndpoint(id)!
  }

  deleteEndpoint(id: string): void {
    this.db.prepare('DELETE FROM endpoints WHERE id = ?').run(id)
  }

  // Stats
  getStats() {
    const totalRequests = this.db.prepare('SELECT COUNT(*) as count FROM request_logs').get() as { count: number }
    const activeMocks = this.db.prepare('SELECT COUNT(*) as count FROM endpoints').get() as { count: number }
    
    return {
      totalRequests: totalRequests.count,
      activeMocks: activeMocks.count,
    }
  }

  // Request logging
  logRequest(endpointId: string | null, method: string, path: string, statusCode: number, responseTime: number) {
    this.db.prepare(`
      INSERT INTO request_logs (endpoint_id, method, path, status_code, response_time)
      VALUES (?, ?, ?, ?, ?)
    `).run(endpointId, method, path, statusCode, responseTime)
  }
}

export { DatabaseManager as Database }
