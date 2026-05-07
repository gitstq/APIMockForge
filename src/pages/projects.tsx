import { useState } from 'react'
import { Plus, Search, MoreVertical, Folder, Clock, Users } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { formatDate, generateId } from '@/lib/utils'
import { toast } from 'sonner'

interface Project {
  id: string
  name: string
  description: string
  mockCount: number
  lastModified: string
  members: number
}

const initialProjects: Project[] = [
  {
    id: '1',
    name: '电商API项目',
    description: '包含商品、订单、用户等模块的API Mock',
    mockCount: 24,
    lastModified: '2025-05-06T10:30:00Z',
    members: 4,
  },
  {
    id: '2',
    name: '支付系统',
    description: '支付网关和交易处理的Mock接口',
    mockCount: 12,
    lastModified: '2025-05-05T14:20:00Z',
    members: 3,
  },
  {
    id: '3',
    name: '用户中心',
    description: '用户认证、权限管理的API Mock',
    mockCount: 8,
    lastModified: '2025-05-04T09:15:00Z',
    members: 2,
  },
]

export function Projects() {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [searchQuery, setSearchQuery] = useState('')
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectDesc, setNewProjectDesc] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateProject = () => {
    if (!newProjectName.trim()) {
      toast.error('请输入项目名称')
      return
    }

    const newProject: Project = {
      id: generateId(),
      name: newProjectName,
      description: newProjectDesc || '暂无描述',
      mockCount: 0,
      lastModified: new Date().toISOString(),
      members: 1,
    }

    setProjects([newProject, ...projects])
    setNewProjectName('')
    setNewProjectDesc('')
    setDialogOpen(false)
    toast.success('项目创建成功！')
  }

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id))
    toast.success('项目已删除')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">项目</h1>
          <p className="text-muted-foreground">管理您的API Mock项目</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              新建项目
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>创建新项目</DialogTitle>
              <DialogDescription>创建一个新的API Mock项目来组织您的接口</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">项目名称</Label>
                <Input
                  id="name"
                  placeholder="输入项目名称"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">项目描述</Label>
                <Input
                  id="description"
                  placeholder="输入项目描述（可选）"
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleCreateProject}>创建</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索项目..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Folder className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <CardDescription className="line-clamp-1">
                      {project.description}
                    </CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>编辑</DropdownMenuItem>
                    <DropdownMenuItem>复制</DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDeleteProject(project.id)}
                    >
                      删除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Folder className="h-4 w-4" />
                  {project.mockCount} 个Mock
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {project.members} 成员
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                更新于 {formatDate(project.lastModified)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Folder className="h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">暂无项目</h3>
          <p className="text-muted-foreground">创建您的第一个API Mock项目</p>
        </div>
      )}
    </div>
  )
}
