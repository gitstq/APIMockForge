import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Play, Save, Plus, Trash2, Copy, Check } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { cn, getMethodColor, prettifyJson, isValidJson } from '@/lib/utils'
import { toast } from 'sonner'

interface MockEndpoint {
  id: string
  method: string
  path: string
  name: string
  statusCode: number
  delay: number
  responseBody: string
  headers: Record<string, string>
}

const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']

const sampleEndpoints: MockEndpoint[] = [
  {
    id: '1',
    method: 'GET',
    path: '/api/users',
    name: '获取用户列表',
    statusCode: 200,
    delay: 0,
    responseBody: JSON.stringify(
      {
        code: 200,
        data: [
          { id: 1, name: '张三', email: 'zhangsan@example.com' },
          { id: 2, name: '李四', email: 'lisi@example.com' },
        ],
        message: 'success',
      },
      null,
      2
    ),
    headers: { 'Content-Type': 'application/json' },
  },
  {
    id: '2',
    method: 'POST',
    path: '/api/users',
    name: '创建用户',
    statusCode: 201,
    delay: 100,
    responseBody: JSON.stringify(
      {
        code: 201,
        data: { id: 3, name: '王五', email: 'wangwu@example.com' },
        message: '创建成功',
      },
      null,
      2
    ),
    headers: { 'Content-Type': 'application/json' },
  },
]

export function MockEditor() {
  const { projectId } = useParams()
  const [endpoints, setEndpoints] = useState<MockEndpoint[]>(sampleEndpoints)
  const [selectedEndpoint, setSelectedEndpoint] = useState<MockEndpoint | null>(
    sampleEndpoints[0]
  )
  const [copied, setCopied] = useState(false)

  const handleAddEndpoint = () => {
    const newEndpoint: MockEndpoint = {
      id: Date.now().toString(),
      method: 'GET',
      path: '/api/new-endpoint',
      name: '新接口',
      statusCode: 200,
      delay: 0,
      responseBody: JSON.stringify({ message: 'Hello World' }, null, 2),
      headers: { 'Content-Type': 'application/json' },
    }
    setEndpoints([...endpoints, newEndpoint])
    setSelectedEndpoint(newEndpoint)
    toast.success('新接口已创建')
  }

  const handleDeleteEndpoint = (id: string) => {
    setEndpoints(endpoints.filter((e) => e.id !== id))
    if (selectedEndpoint?.id === id) {
      setSelectedEndpoint(null)
    }
    toast.success('接口已删除')
  }

  const handleUpdateEndpoint = (updates: Partial<MockEndpoint>) => {
    if (!selectedEndpoint) return

    const updated = { ...selectedEndpoint, ...updates }
    setSelectedEndpoint(updated)
    setEndpoints(endpoints.map((e) => (e.id === updated.id ? updated : e)))
  }

  const handleFormatJson = () => {
    if (!selectedEndpoint) return
    const formatted = prettifyJson(selectedEndpoint.responseBody)
    handleUpdateEndpoint({ responseBody: formatted })
    toast.success('JSON已格式化')
  }

  const handleCopyUrl = () => {
    if (!selectedEndpoint) return
    const url = `http://localhost:3001/mock${selectedEndpoint.path}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('URL已复制')
  }

  const handleTestEndpoint = () => {
    if (!selectedEndpoint) return
    toast.info('正在测试接口...')
    setTimeout(() => {
      toast.success('接口测试成功！')
    }, selectedEndpoint.delay + 500)
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4">
      {/* Sidebar */}
      <Card className="w-80 flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">接口列表</CardTitle>
            <Button size="icon" variant="ghost" onClick={handleAddEndpoint}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto space-y-2">
          {endpoints.map((endpoint) => (
            <div
              key={endpoint.id}
              onClick={() => setSelectedEndpoint(endpoint)}
              className={cn(
                'p-3 rounded-lg cursor-pointer transition-colors',
                selectedEndpoint?.id === endpoint.id
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              )}
            >
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    'text-xs',
                    selectedEndpoint?.id === endpoint.id
                      ? 'border-primary-foreground/30'
                      : getMethodColor(endpoint.method)
                  )}
                >
                  {endpoint.method}
                </Badge>
                <span className="text-sm font-medium truncate">{endpoint.name}</span>
              </div>
              <div className="mt-1 text-xs opacity-70 truncate">{endpoint.path}</div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Main Editor */}
      {selectedEndpoint ? (
        <Card className="flex-1 flex flex-col">
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Select
                  value={selectedEndpoint.method}
                  onValueChange={(v) => handleUpdateEndpoint({ method: v })}
                >
                  <SelectTrigger className="w-28">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {methods.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  value={selectedEndpoint.path}
                  onChange={(e) => handleUpdateEndpoint({ path: e.target.value })}
                  className="w-80 font-mono"
                  placeholder="/api/path"
                />
                <Input
                  value={selectedEndpoint.name}
                  onChange={(e) => handleUpdateEndpoint({ name: e.target.value })}
                  className="w-48"
                  placeholder="接口名称"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleCopyUrl}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="sm" onClick={handleTestEndpoint}>
                  <Play className="h-4 w-4 mr-1" />
                  测试
                </Button>
                <Button size="sm">
                  <Save className="h-4 w-4 mr-1" />
                  保存
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteEndpoint(selectedEndpoint.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 p-0">
            <Tabs defaultValue="response" className="h-full flex flex-col">
              <TabsList className="mx-4 mt-4">
                <TabsTrigger value="response">响应配置</TabsTrigger>
                <TabsTrigger value="headers">请求头</TabsTrigger>
                <TabsTrigger value="advanced">高级设置</TabsTrigger>
              </TabsList>

              <TabsContent value="response" className="flex-1 p-4 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="space-y-2">
                    <Label>状态码</Label>
                    <Input
                      type="number"
                      value={selectedEndpoint.statusCode}
                      onChange={(e) =>
                        handleUpdateEndpoint({ statusCode: parseInt(e.target.value) })
                      }
                      className="w-32"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>延迟 (ms)</Label>
                    <Input
                      type="number"
                      value={selectedEndpoint.delay}
                      onChange={(e) =>
                        handleUpdateEndpoint({ delay: parseInt(e.target.value) })
                      }
                      className="w-32"
                    />
                  </div>
                  <div className="flex-1" />
                  <Button variant="outline" size="sm" onClick={handleFormatJson}>
                    格式化JSON
                  </Button>
                </div>

                <div className="space-y-2 flex-1">
                  <Label>响应体</Label>
                  <Textarea
                    value={selectedEndpoint.responseBody}
                    onChange={(e) => handleUpdateEndpoint({ responseBody: e.target.value })}
                    className="font-mono text-sm min-h-[400px]"
                    placeholder="输入JSON响应..."
                  />
                  {!isValidJson(selectedEndpoint.responseBody) && (
                    <p className="text-xs text-destructive">JSON格式无效</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="headers" className="flex-1 p-4">
                <div className="space-y-4">
                  {Object.entries(selectedEndpoint.headers).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      <Input value={key} className="w-48" placeholder="Header名称" />
                      <Input value={value} className="flex-1" placeholder="Header值" />
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    添加Header
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="flex-1 p-4">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">AI 智能生成</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      使用AI根据接口描述自动生成Mock数据
                    </p>
                    <Button variant="outline">
                      <Play className="h-4 w-4 mr-2" />
                      生成Mock数据
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">性能模拟</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      模拟网络延迟、错误率和限流
                    </p>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>错误率 (%)</Label>
                        <Input type="number" defaultValue={0} min={0} max={100} />
                      </div>
                      <div className="space-y-2">
                        <Label>超时率 (%)</Label>
                        <Input type="number" defaultValue={0} min={0} max={100} />
                      </div>
                      <div className="space-y-2">
                        <Label>限流 (req/min)</Label>
                        <Input type="number" defaultValue={1000} />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ) : (
        <Card className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">选择一个接口进行编辑，或创建新接口</p>
            <Button className="mt-4" onClick={handleAddEndpoint}>
              <Plus className="h-4 w-4 mr-2" />
              创建接口
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
