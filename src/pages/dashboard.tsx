import { useEffect, useState } from 'react'
import {
  Activity,
  TrendingUp,
  Users,
  Server,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { formatNumber } from '@/lib/utils'

interface Stats {
  totalRequests: number
  activeMocks: number
  teamMembers: number
  avgResponseTime: number
}

interface RecentActivity {
  id: string
  type: 'create' | 'update' | 'delete' | 'request'
  message: string
  timestamp: string
}

export function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalRequests: 15234,
    activeMocks: 48,
    teamMembers: 6,
    avgResponseTime: 45,
  })

  const [activities] = useState<RecentActivity[]>([
    { id: '1', type: 'create', message: '创建了新的Mock接口 /api/users', timestamp: '2分钟前' },
    { id: '2', type: 'request', message: '收到 1,234 次请求', timestamp: '5分钟前' },
    { id: '3', type: 'update', message: '更新了项目配置', timestamp: '10分钟前' },
    { id: '4', type: 'create', message: '导入 OpenAPI 规范', timestamp: '1小时前' },
    { id: '5', type: 'request', message: '收到 856 次请求', timestamp: '2小时前' },
  ])

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalRequests: prev.totalRequests + Math.floor(Math.random() * 10),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">仪表盘</h1>
        <p className="text-muted-foreground">欢迎回来！这是您的API Mock服务概览。</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总请求数</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.totalRequests)}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+12.5%</span> 较上周
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">活跃Mock</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeMocks}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+3</span> 今日新增
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">团队成员</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.teamMembers}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+1</span> 本周加入
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均响应时间</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgResponseTime}ms</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <ArrowDownRight className="h-3 w-3 text-green-500" />
              <span className="text-green-500">-5ms</span> 较昨日
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activity */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>最近活动</CardTitle>
            <CardDescription>您的项目和Mock接口的最新动态</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4">
                  <div className={`
                    h-2 w-2 rounded-full
                    ${activity.type === 'create' ? 'bg-green-500' : ''}
                    ${activity.type === 'update' ? 'bg-blue-500' : ''}
                    ${activity.type === 'delete' ? 'bg-red-500' : ''}
                    ${activity.type === 'request' ? 'bg-purple-500' : ''}
                  `} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>快速操作</CardTitle>
            <CardDescription>常用功能的快捷入口</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start" variant="outline">
              <Server className="mr-2 h-4 w-4" />
              创建新的Mock接口
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <TrendingUp className="mr-2 h-4 w-4" />
              导入OpenAPI规范
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              邀请团队成员
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Activity className="mr-2 h-4 w-4" />
              查看请求日志
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Usage Stats */}
      <Card>
        <CardHeader>
          <CardTitle>资源使用</CardTitle>
          <CardDescription>您的项目资源使用情况</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Mock接口数量</span>
              <span className="text-muted-foreground">48 / 100</span>
            </div>
            <Progress value={48} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>存储空间</span>
              <span className="text-muted-foreground">256 MB / 1 GB</span>
            </div>
            <Progress value={25} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>API请求配额</span>
              <span className="text-muted-foreground">15,234 / 100,000</span>
            </div>
            <Progress value={15} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
