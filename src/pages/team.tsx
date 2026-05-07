import { useState } from 'react'
import { Plus, Mail, MoreVertical, Shield, User } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

interface TeamMember {
  id: string
  name: string
  email: string
  role: 'owner' | 'admin' | 'editor' | 'viewer'
  avatar?: string
  joinedAt: string
}

const initialMembers: TeamMember[] = [
  {
    id: '1',
    name: '张三',
    email: 'zhangsan@example.com',
    role: 'owner',
    joinedAt: '2025-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: '李四',
    email: 'lisi@example.com',
    role: 'admin',
    joinedAt: '2025-02-20T14:30:00Z',
  },
  {
    id: '3',
    name: '王五',
    email: 'wangwu@example.com',
    role: 'editor',
    joinedAt: '2025-03-10T09:15:00Z',
  },
]

const roleLabels: Record<string, string> = {
  owner: '所有者',
  admin: '管理员',
  editor: '编辑者',
  viewer: '查看者',
}

const roleColors: Record<string, string> = {
  owner: 'bg-purple-500/10 text-purple-500',
  admin: 'bg-blue-500/10 text-blue-500',
  editor: 'bg-green-500/10 text-green-500',
  viewer: 'bg-gray-500/10 text-gray-500',
}

export function Team() {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('editor')
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleInvite = () => {
    if (!inviteEmail.trim()) {
      toast.error('请输入邮箱地址')
      return
    }

    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole as TeamMember['role'],
      joinedAt: new Date().toISOString(),
    }

    setMembers([...members, newMember])
    setInviteEmail('')
    setInviteRole('editor')
    setDialogOpen(false)
    toast.success('邀请已发送！')
  }

  const handleRemoveMember = (id: string) => {
    setMembers(members.filter((m) => m.id !== id))
    toast.success('成员已移除')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">团队</h1>
          <p className="text-muted-foreground">管理团队成员和权限</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              邀请成员
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>邀请团队成员</DialogTitle>
              <DialogDescription>邀请新成员加入您的团队</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">邮箱地址</Label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="colleague@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>角色权限</Label>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">管理员 - 可以管理项目和成员</SelectItem>
                    <SelectItem value="editor">编辑者 - 可以创建和编辑Mock</SelectItem>
                    <SelectItem value="viewer">查看者 - 只读访问</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleInvite}>发送邀请</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>团队成员</CardTitle>
          <CardDescription>共 {members.length} 位成员</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10">
                      {member.name[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{member.name}</span>
                      <Badge variant="outline" className={roleColors[member.role]}>
                        {roleLabels[member.role]}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {member.role === 'owner' ? (
                    <Shield className="h-4 w-4 text-purple-500" />
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>更改角色</DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleRemoveMember(member.id)}
                        >
                          移除成员
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">所有者</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-500" />
              <span className="text-2xl font-bold">
                {members.filter((m) => m.role === 'owner').length}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">拥有所有权限</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">管理员</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold">
                {members.filter((m) => m.role === 'admin').length}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">管理项目和成员</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">编辑者</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">
                {members.filter((m) => m.role === 'editor' || m.role === 'viewer').length}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">编辑和查看</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
