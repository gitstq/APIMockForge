import { useState } from 'react'
import { Upload, FileJson, FileCode, Download, Check, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn, isValidJson } from '@/lib/utils'
import { toast } from 'sonner'

export function ApiDocs() {
  const [openApiContent, setOpenApiContent] = useState('')
  const [imported, setImported] = useState(false)
  const [parsedEndpoints, setParsedEndpoints] = useState<any[]>([])

  const handleImport = () => {
    if (!openApiContent.trim()) {
      toast.error('请输入OpenAPI规范内容')
      return
    }

    if (!isValidJson(openApiContent)) {
      toast.error('JSON格式无效')
      return
    }

    try {
      const spec = JSON.parse(openApiContent)
      const endpoints: any[] = []

      // Parse OpenAPI paths
      if (spec.paths) {
        Object.entries(spec.paths).forEach(([path, methods]: [string, any]) => {
          Object.entries(methods).forEach(([method, details]: [string, any]) => {
            if (['get', 'post', 'put', 'patch', 'delete'].includes(method)) {
              endpoints.push({
                path,
                method: method.toUpperCase(),
                summary: details.summary || details.operationId || '未命名接口',
                description: details.description || '',
                parameters: details.parameters || [],
                responses: details.responses || {},
              })
            }
          })
        })
      }

      setParsedEndpoints(endpoints)
      setImported(true)
      toast.success(`成功导入 ${endpoints.length} 个接口`)
    } catch (error) {
      toast.error('解析OpenAPI规范失败')
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      setOpenApiContent(content)
      toast.success(`已加载文件: ${file.name}`)
    }
    reader.readAsText(file)
  }

  const sampleOpenApi = {
    openapi: '3.0.0',
    info: {
      title: '示例API',
      version: '1.0.0',
    },
    paths: {
      '/users': {
        get: {
          summary: '获取用户列表',
          responses: {
            '200': {
              description: '成功',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'integer' },
                        name: { type: 'string' },
                        email: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: '创建用户',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    email: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">API文档</h1>
        <p className="text-muted-foreground">导入OpenAPI/Swagger规范自动生成Mock接口</p>
      </div>

      <Tabs defaultValue="import" className="space-y-4">
        <TabsList>
          <TabsTrigger value="import">导入规范</TabsTrigger>
          <TabsTrigger value="preview" disabled={!imported}>
            接口预览
          </TabsTrigger>
          <TabsTrigger value="export">导出文档</TabsTrigger>
        </TabsList>

        <TabsContent value="import" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>导入OpenAPI规范</CardTitle>
              <CardDescription>
                粘贴OpenAPI 3.0 JSON/YAML内容或上传文件
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    type="file"
                    accept=".json,.yaml,.yml"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    上传文件
                  </Button>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setOpenApiContent(JSON.stringify(sampleOpenApi, null, 2))}
                >
                  <FileJson className="h-4 w-4 mr-2" />
                  加载示例
                </Button>
              </div>

              <Textarea
                value={openApiContent}
                onChange={(e) => setOpenApiContent(e.target.value)}
                placeholder="粘贴OpenAPI 3.0规范JSON内容..."
                className="font-mono text-sm min-h-[300px]"
              />

              {openApiContent && !isValidJson(openApiContent) && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>JSON格式无效，请检查语法</AlertDescription>
                </Alert>
              )}

              <Button onClick={handleImport} className="w-full">
                <Check className="h-4 w-4 mr-2" />
                解析并导入
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>接口列表</CardTitle>
              <CardDescription>从OpenAPI规范解析出的接口</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {parsedEndpoints.map((endpoint, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <span
                      className={cn(
                        'px-2 py-1 rounded text-xs font-medium',
                        endpoint.method === 'GET' && 'bg-blue-500/10 text-blue-500',
                        endpoint.method === 'POST' && 'bg-green-500/10 text-green-500',
                        endpoint.method === 'PUT' && 'bg-yellow-500/10 text-yellow-500',
                        endpoint.method === 'PATCH' && 'bg-orange-500/10 text-orange-500',
                        endpoint.method === 'DELETE' && 'bg-red-500/10 text-red-500'
                      )}
                    >
                      {endpoint.method}
                    </span>
                    <code className="text-sm font-mono">{endpoint.path}</code>
                    <span className="flex-1 text-sm text-muted-foreground">
                      {endpoint.summary}
                    </span>
                    <Button variant="outline" size="sm">
                      生成Mock
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export">
          <Card>
            <CardHeader>
              <CardTitle>导出文档</CardTitle>
              <CardDescription>导出项目API文档</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="cursor-pointer hover:border-primary transition-colors">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileJson className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">OpenAPI JSON</h4>
                      <p className="text-sm text-muted-foreground">导出OpenAPI 3.0规范</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:border-primary transition-colors">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileCode className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Markdown</h4>
                      <p className="text-sm text-muted-foreground">导出Markdown格式文档</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Button className="w-full">
                <Download className="h-4 w-4 mr-2" />
                导出所有文档
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
