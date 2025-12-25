'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useTheme } from '@/components/theme-provider'
import {
  Monitor,
  Server,
  Terminal,
  LayoutDashboard,
  FolderOpen,
  Settings,
  Plus,
  Search,
  MoreVertical,
  Play,
  Pause,
  X,
  Globe,
  Lock,
  User,
  Bell,
  Moon,
  Sun,
  LogOut,
  RefreshCw,
  FolderPlus,
  Edit,
  Trash2,
  Copy,
  Share2,
  Download,
  Upload,
  Maximize2,
  Minimize2,
  ExternalLink,
  History,
  Star,
  StarOff,
} from 'lucide-react'

type ConnectionType = 'rdp' | 'vnc' | 'ssh' | 'telnet'
type ConnectionStatus = 'online' | 'offline' | 'connecting' | 'error'

interface Connection {
  id: string
  name: string
  type: ConnectionType
  host: string
  port: number
  status: ConnectionStatus
  description?: string
  folder?: string
  lastUsed?: Date
  isFavorite?: boolean
}

interface Folder {
  id: string
  name: string
  connections: number
}

const mockConnections: Connection[] = [
  {
    id: '1',
    name: 'Production Server',
    type: 'rdp',
    host: '192.168.1.100',
    port: 3389,
    status: 'online',
    description: 'Main production Windows server',
    folder: 'Servers',
    lastUsed: new Date('2024-01-15'),
    isFavorite: true,
  },
  {
    id: '2',
    name: 'Database Server',
    type: 'ssh',
    host: '192.168.1.101',
    port: 22,
    status: 'online',
    description: 'PostgreSQL database server',
    folder: 'Servers',
    lastUsed: new Date('2024-01-14'),
  },
  {
    id: '3',
    name: 'Development VM',
    type: 'rdp',
    host: '192.168.1.200',
    port: 3389,
    status: 'offline',
    description: 'Development environment',
    folder: 'Development',
    lastUsed: new Date('2024-01-13'),
  },
  {
    id: '4',
    name: 'Network Switch',
    type: 'telnet',
    host: '192.168.1.1',
    port: 23,
    status: 'online',
    description: 'Main network switch',
    folder: 'Network',
    lastUsed: new Date('2024-01-12'),
  },
  {
    id: '5',
    name: 'Web Server',
    type: 'ssh',
    host: '192.168.1.50',
    port: 22,
    status: 'online',
    description: 'NGINX web server',
    folder: 'Servers',
    lastUsed: new Date('2024-01-11'),
    isFavorite: true,
  },
  {
    id: '6',
    name: 'Test Machine',
    type: 'vnc',
    host: '192.168.1.250',
    port: 5900,
    status: 'connecting',
    description: 'Testing environment',
    folder: 'Development',
  },
]

const mockFolders: Folder[] = [
  { id: '1', name: 'Servers', connections: 3 },
  { id: '2', name: 'Development', connections: 2 },
  { id: '3', name: 'Network', connections: 1 },
]

const connectionIcons: Record<ConnectionType, any> = {
  rdp: Monitor,
  vnc: Monitor,
  ssh: Terminal,
  telnet: Terminal,
}

const connectionColors: Record<ConnectionType, string> = {
  rdp: 'text-blue-500',
  vnc: 'text-purple-500',
  ssh: 'text-emerald-500',
  telnet: 'text-amber-500',
}

const statusColors: Record<ConnectionStatus, string> = {
  online: 'status-online',
  offline: 'status-offline',
  connecting: 'status-connecting',
  error: 'status-error',
}

export default function GuacamoleDashboard() {
  const { theme, setTheme } = useTheme()
  const [activeView, setActiveView] = useState<'dashboard' | 'connections' | 'sessions' | 'settings'>('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [showNewConnection, setShowNewConnection] = useState(false)
  const [showNewFolder, setShowNewFolder] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null)
  const [connections, setConnections] = useState<Connection[]>(mockConnections)

  const filteredConnections = connections.filter(conn => {
    const matchesSearch = conn.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conn.host.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFolder = !selectedFolder || conn.folder === selectedFolder
    return matchesSearch && matchesFolder
  })

  const getConnectionIcon = (type: ConnectionType) => {
    const Icon = connectionIcons[type]
    return <Icon className={`h-4 w-4 ${connectionColors[type]}`} />
  }

  const getStatusBadge = (status: ConnectionStatus) => (
    <div className="flex items-center gap-2">
      <span className={`h-2 w-2 rounded-full ${statusColors[status]}`} />
      <span className="text-xs text-muted-foreground capitalize">{status}</span>
    </div>
  )

  const handleConnect = (connectionId: string) => {
    setConnections(prev => prev.map(conn =>
      conn.id === connectionId ? { ...conn, status: 'connecting' } : conn
    ))
    // Simulate connection
    setTimeout(() => {
      setConnections(prev => prev.map(conn =>
        conn.id === connectionId ? { ...conn, status: 'online' } : conn
      ))
    }, 2000)
  }

  const handleDisconnect = (connectionId: string) => {
    setConnections(prev => prev.map(conn =>
      conn.id === connectionId ? { ...conn, status: 'offline' } : conn
    ))
  }

  const handleDelete = (connectionId: string) => {
    setConnections(prev => prev.filter(conn => conn.id !== connectionId))
    setDeleteDialog(null)
  }

  const handleToggleFavorite = (connectionId: string) => {
    setConnections(prev => prev.map(conn =>
      conn.id === connectionId ? { ...conn, isFavorite: !conn.isFavorite } : conn
    ))
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex h-16 items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Monitor className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Guacamole
              </span>
              <Badge variant="secondary" className="ml-2">Modern</Badge>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search connections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme('light')}>
                  <Sun className="mr-2 h-4 w-4" />
                  Light Mode
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                  <Moon className="mr-2 h-4 w-4" />
                  Dark Mode
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <History className="mr-2 h-4 w-4" />
                  Connection History
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border bg-card/30 hidden lg:block">
          <div className="flex h-full flex-col">
            <div className="p-4">
              <Button
                className="w-full"
                onClick={() => setShowNewConnection(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Connection
              </Button>
            </div>

            <Separator />

            <nav className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                <div
                  className={`nav-item ${activeView === 'dashboard' ? 'nav-item-active' : 'nav-item-inactive'}`}
                  onClick={() => setActiveView('dashboard')}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </div>
                <div
                  className={`nav-item ${activeView === 'connections' ? 'nav-item-active' : 'nav-item-inactive'}`}
                  onClick={() => setActiveView('connections')}
                >
                  <Server className="h-4 w-4" />
                  Connections
                </div>
                <div
                  className={`nav-item ${activeView === 'sessions' ? 'nav-item-active' : 'nav-item-inactive'}`}
                  onClick={() => setActiveView('sessions')}
                >
                  <Monitor className="h-4 w-4" />
                  Active Sessions
                </div>
                <div
                  className={`nav-item ${activeView === 'settings' ? 'nav-item-active' : 'nav-item-inactive'}`}
                  onClick={() => setActiveView('settings')}
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Folders
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setShowNewFolder(true)}
                >
                  <FolderPlus className="h-3 w-3" />
                </Button>
              </div>

              <div className="space-y-1">
                <div
                  className={`nav-item ${selectedFolder === null ? 'nav-item-active' : 'nav-item-inactive'}`}
                  onClick={() => setSelectedFolder(null)}
                >
                  <FolderOpen className="h-4 w-4" />
                  All Connections
                  <Badge variant="secondary" className="ml-auto">
                    {connections.length}
                  </Badge>
                </div>
                {mockFolders.map(folder => (
                  <div
                    key={folder.id}
                    className={`nav-item ${selectedFolder === folder.name ? 'nav-item-active' : 'nav-item-inactive'}`}
                    onClick={() => setSelectedFolder(folder.name)}
                  >
                    <FolderOpen className="h-4 w-4" />
                    {folder.name}
                    <Badge variant="secondary" className="ml-auto">
                      {folder.connections}
                    </Badge>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Quick Access
                </span>
              </div>

              <div className="space-y-1">
                <div className="nav-item nav-item-inactive">
                  <Star className="h-4 w-4" />
                  Favorites
                  <Badge variant="secondary" className="ml-auto">
                    {connections.filter(c => c.isFavorite).length}
                  </Badge>
                </div>
                <div className="nav-item nav-item-inactive">
                  <History className="h-4 w-4" />
                  Recent
                  <Badge variant="secondary" className="ml-auto">
                    {connections.filter(c => c.lastUsed).length}
                  </Badge>
                </div>
              </div>
            </nav>

            <Separator />

            <div className="p-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                  U
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground truncate">User Name</div>
                  <div className="text-xs">Administrator</div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <ScrollArea className="h-full">
            <div className="p-6 lg:p-8">
              {activeView === 'dashboard' && (
                <div className="space-y-6">
                  {/* Stats Cards */}
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Connections</CardTitle>
                        <Server className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{connections.length}</div>
                        <p className="text-xs text-muted-foreground">
                          {connections.filter(c => c.status === 'online').length} online
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                        <Monitor className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {connections.filter(c => c.status === 'online' || c.status === 'connecting').length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {connections.filter(c => c.status === 'connecting').length} connecting
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Favorites</CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {connections.filter(c => c.isFavorite).length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Quick access
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">System Status</CardTitle>
                        <RefreshCw className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-emerald-500">Healthy</div>
                        <p className="text-xs text-muted-foreground">
                          All services running
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Favorite Connections */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold">Favorite Connections</h2>
                      <Button variant="outline" size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Favorite
                      </Button>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {connections.filter(c => c.isFavorite).map(connection => (
                        <Card key={connection.id} className="connection-card cursor-pointer">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                {getConnectionIcon(connection.type)}
                                <CardTitle className="text-lg">{connection.name}</CardTitle>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleToggleFavorite(connection.id)}>
                                    <StarOff className="mr-2 h-4 w-4" />
                                    Remove from Favorites
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Copy className="mr-2 h-4 w-4" />
                                    Duplicate
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => setDeleteDialog(connection.id)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <CardDescription>{connection.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Host</span>
                                <span className="font-mono">{connection.host}:{connection.port}</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Type</span>
                                <Badge variant="outline">{connection.type.toUpperCase()}</Badge>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Status</span>
                                {getStatusBadge(connection.status)}
                              </div>
                              <Separator />
                              <div className="flex gap-2">
                                {connection.status === 'online' ? (
                                  <Button
                                    variant="destructive"
                                    className="flex-1"
                                    size="sm"
                                    onClick={() => handleDisconnect(connection.id)}
                                  >
                                    <Pause className="mr-2 h-4 w-4" />
                                    Disconnect
                                  </Button>
                                ) : (
                                  <Button
                                    className="flex-1"
                                    size="sm"
                                    onClick={() => handleConnect(connection.id)}
                                  >
                                    <Play className="mr-2 h-4 w-4" />
                                    Connect
                                  </Button>
                                )}
                                <Button variant="outline" size="sm">
                                  <Settings className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Recent Connections */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Recent Connections</h2>
                    <Card>
                      <CardContent className="p-0">
                        <div className="divide-y divide-border">
                          {connections.slice(0, 5).map(connection => (
                            <div key={connection.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                              <div className="flex items-center gap-4">
                                {getConnectionIcon(connection.type)}
                                <div>
                                  <div className="font-medium">{connection.name}</div>
                                  <div className="text-sm text-muted-foreground">{connection.host}:{connection.port}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                {getStatusBadge(connection.status)}
                                <Button variant="outline" size="sm">
                                  Connect
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {activeView === 'connections' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">Connections</h2>
                      <p className="text-muted-foreground">
                        Manage your remote desktop connections
                      </p>
                    </div>
                    <Button onClick={() => setShowNewConnection(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      New Connection
                    </Button>
                  </div>

                  <div className="session-grid">
                    {filteredConnections.map(connection => (
                      <Card key={connection.id} className="connection-card">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              {getConnectionIcon(connection.type)}
                              <CardTitle className="text-lg">{connection.name}</CardTitle>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleToggleFavorite(connection.id)}
                              >
                                {connection.isFavorite ? (
                                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                ) : (
                                  <Star className="h-4 w-4" />
                                )}
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Copy className="mr-2 h-4 w-4" />
                                    Duplicate
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Share2 className="mr-2 h-4 w-4" />
                                    Share
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => setDeleteDialog(connection.id)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          <CardDescription>{connection.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Host</span>
                              <span className="font-mono">{connection.host}:{connection.port}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Protocol</span>
                              <Badge variant="outline">{connection.type.toUpperCase()}</Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Status</span>
                              {getStatusBadge(connection.status)}
                            </div>
                            {connection.folder && (
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Folder</span>
                                <span className="flex items-center gap-1">
                                  <FolderOpen className="h-3 w-3" />
                                  {connection.folder}
                                </span>
                              </div>
                            )}
                            <Separator />
                            <div className="flex gap-2">
                              {connection.status === 'online' ? (
                                <>
                                  <Button
                                    className="flex-1"
                                    size="sm"
                                    onClick={() => {/* Open session */}}
                                  >
                                    <Maximize2 className="mr-2 h-4 w-4" />
                                    Open Session
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDisconnect(connection.id)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  className="flex-1"
                                  size="sm"
                                  onClick={() => handleConnect(connection.id)}
                                  disabled={connection.status === 'connecting'}
                                >
                                  {connection.status === 'connecting' ? (
                                    <>
                                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                      Connecting...
                                    </>
                                  ) : (
                                    <>
                                      <Play className="mr-2 h-4 w-4" />
                                      Connect
                                    </>
                                  )}
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {activeView === 'sessions' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold">Active Sessions</h2>
                    <p className="text-muted-foreground">
                      Manage your current remote desktop sessions
                    </p>
                  </div>

                  <div className="grid gap-4">
                    {connections.filter(c => c.status === 'online' || c.status === 'connecting').map(connection => (
                      <Card key={connection.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              {getConnectionIcon(connection.type)}
                              <div>
                                <CardTitle>{connection.name}</CardTitle>
                                <CardDescription>{connection.host}:{connection.port}</CardDescription>
                              </div>
                            </div>
                            {getStatusBadge(connection.status)}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="h-64 rounded-lg bg-black flex items-center justify-center">
                            <div className="text-muted-foreground text-center">
                              <Monitor className="h-12 w-12 mx-auto mb-2 opacity-50" />
                              <p>Session Viewer</p>
                              <p className="text-xs mt-1">Guacamole client will be rendered here</p>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Maximize2 className="mr-2 h-4 w-4" />
                              Fullscreen
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                              <Share2 className="mr-2 h-4 w-4" />
                              Share
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                              <Download className="mr-2 h-4 w-4" />
                              Files
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDisconnect(connection.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {connections.filter(c => c.status === 'online' || c.status === 'connecting').length === 0 && (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <Monitor className="h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Active Sessions</h3>
                        <p className="text-muted-foreground text-center max-w-md">
                          Connect to a server to start a remote desktop session
                        </p>
                        <Button className="mt-4" onClick={() => setActiveView('connections')}>
                          <Server className="mr-2 h-4 w-4" />
                          Browse Connections
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {activeView === 'settings' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold">Settings</h2>
                    <p className="text-muted-foreground">
                      Configure your Guacamole client
                    </p>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>General</CardTitle>
                        <CardDescription>Basic application settings</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">Dark Mode</div>
                            <div className="text-sm text-muted-foreground">Use dark theme</div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                          >
                            {theme === 'dark' ? 'Disable' : 'Enable'}
                          </Button>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">Auto-connect</div>
                            <div className="text-sm text-muted-foreground">Connect automatically on load</div>
                          </div>
                          <Button variant="outline" size="sm">
                            Configure
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Session Defaults</CardTitle>
                        <CardDescription>Default session settings</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Default Connection Type</Label>
                          <Select defaultValue="rdp">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="rdp">RDP</SelectItem>
                              <SelectItem value="vnc">VNC</SelectItem>
                              <SelectItem value="ssh">SSH</SelectItem>
                              <SelectItem value="telnet">Telnet</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Default Display Quality</Label>
                          <Select defaultValue="high">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="ultra">Ultra</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Security</CardTitle>
                        <CardDescription>Security and access control</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">Two-Factor Auth</div>
                            <div className="text-sm text-muted-foreground">Add extra security</div>
                          </div>
                          <Button variant="outline" size="sm">
                            Setup
                          </Button>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">Session Recording</div>
                            <div className="text-sm text-muted-foreground">Record all sessions</div>
                          </div>
                          <Button variant="outline" size="sm">
                            Configure
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Network</CardTitle>
                        <CardDescription>Network and connection settings</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Guacamole Server URL</Label>
                          <Input placeholder="ws://localhost:8080/guacamole/websocket" />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">Use WebSocket</div>
                            <div className="text-sm text-muted-foreground">Real-time communication</div>
                          </div>
                          <Button variant="outline" size="sm">
                            Enabled
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </main>
      </div>

      {/* New Connection Dialog */}
      <Dialog open={showNewConnection} onOpenChange={setShowNewConnection}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>New Connection</DialogTitle>
            <DialogDescription>
              Create a new remote desktop connection
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Connection Name</Label>
              <Input id="name" placeholder="My Server" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Connection Type</Label>
              <Select>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rdp">RDP (Windows)</SelectItem>
                  <SelectItem value="vnc">VNC</SelectItem>
                  <SelectItem value="ssh">SSH</SelectItem>
                  <SelectItem value="telnet">Telnet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="host">Host</Label>
                <Input id="host" placeholder="192.168.1.100" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="port">Port</Label>
                <Input id="port" placeholder="3389" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="folder">Folder</Label>
              <Select>
                <SelectTrigger id="folder">
                  <SelectValue placeholder="Select folder" />
                </SelectTrigger>
                <SelectContent>
                  {mockFolders.map(folder => (
                    <SelectItem key={folder.id} value={folder.id}>
                      {folder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Optional description" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowNewConnection(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowNewConnection(false)}>
              Create Connection
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Folder Dialog */}
      <Dialog open={showNewFolder} onOpenChange={setShowNewFolder}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Folder</DialogTitle>
            <DialogDescription>
              Create a new folder to organize connections
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="folder-name">Folder Name</Label>
              <Input id="folder-name" placeholder="My Folder" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowNewFolder(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowNewFolder(false)}>
              Create Folder
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Connection</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this connection? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteDialog && handleDelete(deleteDialog)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm py-4 px-6 mt-auto">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            Apache Guacamole Modern Interface • {new Date().getFullYear()}
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <Globe className="mr-2 h-4 w-4" />
              Documentation
            </Button>
            <Button variant="ghost" size="sm">
              <ExternalLink className="mr-2 h-4 w-4" />
              Apache Guacamole
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}
