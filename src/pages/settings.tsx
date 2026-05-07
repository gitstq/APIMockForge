import { useState } from 'react'
import { Save, Key, Globe, Bell, Shield, Database } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

export function Settings() {
  const [aiKey, setAiKey] = useState('')
  const [baseUrl, setBaseUrl] = useState('http://localhost:3001')
  const [enableNotifications, setEnableNotifications] = useState(true)
  const [enableAnalytics, setEnableAnalytics] = useState(false)

  const handleSave = () => {
    toast.success('设置已保存')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">设置</h1>
        <p className="text-muted-foreground">配置您的APIMockForge实例</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">常规</TabsTrigger>
          <TabsTrigger value="ai">AI配置</TabsTrigger>
          <TabsTrigger value="server">服务器</TabsTrigger>
          <TabsTrigger value="notifications">通知</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>常规设置</CardTitle>
              <CardDescription>管理应用的基本配置</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="app-name">应用名称</Label>
                <Input id="app-name" defaultValue="APIMockForge" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="base-url">基础URL</Label>
                <Input id="base-url" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} />
                <p className="text-xs text-muted-foreground">Mock服务的访问地址</p>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>启用分析</Label>
                  <p className="text-xs text-muted-foreground">收集匿名的使用统计</p>
                </div>
                <Switch checked={enableAnalytics} onCheckedChange={setEnableAnalytics} />
              </div>

              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                保存设置
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                AI配置
              </CardTitle>
              <CardDescription>配置AI服务用于智能Mock数据生成</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ai-provider">AI提供商</Label>
                <Input id="ai-provider" defaultValue="OpenAI" disabled />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ai-key">API密钥</Label>
                <Input
                  id="ai-key"
                  type="password"
                  placeholder="sk-..."
                  value={aiKey}
                  onChange={(e) => setAiKey(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  您的API密钥将被安全存储在本地
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ai-model">模型</Label>
                <Input id="ai-model" defaultValue="gpt-4o-mini" />
              </div>

              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                保存配置
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="server" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                服务器设置
              </CardTitle>
              <CardDescription>配置Mock服务器的运行参数</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="server-port">服务端口</Label>
                <Input id="server-port" type="number" defaultValue={3001} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cors-origin">CORS允许来源</Label>
                <Input id="cors-origin" defaultValue="*" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>启用请求日志</Label>
                  <p className="text-xs text-muted-foreground">记录所有Mock请求</p>
                </div>
                <Switch defaultChecked />
              </div>

              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                保存设置
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                通知设置
              </CardTitle>
              <CardDescription>配置应用通知偏好</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>启用通知</Label>
                  <p className="text-xs text-muted-foreground">接收应用内通知</p>
                </div>
                <Switch
                  checked={enableNotifications}
                  onCheckedChange={setEnableNotifications}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>请求警报</Label>
                  <p className="text-xs text-muted-foreground">高流量时发送警报</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>团队活动</Label>
                  <p className="text-xs text-muted-foreground">团队成员操作通知</p>
                </div>
                <Switch defaultChecked />
              </div>

              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                保存偏好
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
