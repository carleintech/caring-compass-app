'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  Users, 
  UserPlus, 
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Lock,
  Unlock,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Eye,
  EyeOff,
  Settings,
  Key,
  AlertTriangle,
  CheckCircle,
  Clock,
  UserCheck,
  UserX
} from 'lucide-react'
import { trpc } from '@/lib/trpc'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: 'admin' | 'coordinator' | 'caregiver' | 'client' | 'family'
  status: 'active' | 'inactive' | 'suspended' | 'pending'
  lastLogin?: Date
  createdAt: Date
  avatar?: string
  permissions: string[]
  address?: string
  city?: string
  state?: string
  zipCode?: string
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
}

interface UserActivity {
  id: string
  userId: string
  action: string
  details: string
  timestamp: Date
  ipAddress: string
  userAgent: string
}

interface Permission {
  id: string
  name: string
  description: string
  category: 'clients' | 'caregivers' | 'scheduling' | 'billing' | 'reports' | 'system'
}

export default function UserManagement() {
  const [selectedTab, setSelectedTab] = useState('users')
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserDetails, setShowUserDetails] = useState(false)
  const [showCreateUser, setShowCreateUser] = useState(false)
  const [showEditPermissions, setShowEditPermissions] = useState(false)

  // Mock data - replace with actual tRPC calls
  const [users] = useState<User[]>([
    {
      id: '1',
      firstName: 'Sarah',
      lastName: 'Wilson',
      email: 'sarah.wilson@caringcompass.com',
      phone: '(757) 555-0123',
      role: 'coordinator',
      status: 'active',
      lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      avatar: '/avatars/sarah.jpg',
      permissions: ['clients.read', 'clients.write', 'caregivers.read', 'scheduling.write'],
      address: '123 Care Street',
      city: 'Virginia Beach',
      state: 'VA',
      zipCode: '23451',
      emergencyContact: {
        name: 'John Wilson',
        phone: '(757) 555-0124',
        relationship: 'Spouse'
      }
    },
    {
      id: '2',
      firstName: 'Michael',
      lastName: 'Davis',
      email: 'michael.davis@caringcompass.com',
      phone: '(757) 555-0456',
      role: 'caregiver',
      status: 'active',
      lastLogin: new Date(Date.now() - 1 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      avatar: '/avatars/michael.jpg',
      permissions: ['scheduling.read', 'visits.write'],
      address: '456 Helper Lane',
      city: 'Norfolk',
      state: 'VA',
      zipCode: '23504'
    },
    {
      id: '3',
      firstName: 'Margaret',
      lastName: 'Johnson',
      email: 'margaret.johnson@email.com',
      phone: '(757) 555-0789',
      role: 'client',
      status: 'active',
      lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      permissions: ['profile.read', 'visits.read', 'billing.read'],
      address: '789 Client Avenue',
      city: 'Chesapeake',
      state: 'VA',
      zipCode: '23320',
      emergencyContact: {
        name: 'Emily Johnson',
        phone: '(757) 555-0790',
        relationship: 'Daughter'
      }
    },
    {
      id: '4',
      firstName: 'David',
      lastName: 'Thompson',
      email: 'david.thompson@caringcompass.com',
      phone: '(757) 555-0321',
      role: 'caregiver',
      status: 'suspended',
      lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      permissions: ['scheduling.read'],
      address: '321 Caregiver Road',
      city: 'Portsmouth',
      state: 'VA',
      zipCode: '23707'
    },
    {
      id: '5',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@caringcompass.com',
      role: 'admin',
      status: 'active',
      lastLogin: new Date(Date.now() - 30 * 60 * 1000),
      createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
      permissions: ['*']
    }
  ])

  const [userActivities] = useState<UserActivity[]>([
    {
      id: '1',
      userId: '1',
      action: 'User Login',
      details: 'Successful login from coordinator dashboard',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
      id: '2',
      userId: '2',
      action: 'Visit Clock-In',
      details: 'Clocked in for visit with Margaret Johnson',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)'
    },
    {
      id: '3',
      userId: '4',
      action: 'Account Suspended',
      details: 'Account suspended due to policy violation',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (Android 13; Mobile; rv:109.0)'
    }
  ])

  const [permissions] = useState<Permission[]>([
    { id: '1', name: 'clients.read', description: 'View client information', category: 'clients' },
    { id: '2', name: 'clients.write', description: 'Create and edit client records', category: 'clients' },
    { id: '3', name: 'caregivers.read', description: 'View caregiver information', category: 'caregivers' },
    { id: '4', name: 'caregivers.write', description: 'Create and edit caregiver records', category: 'caregivers' },
    { id: '5', name: 'scheduling.read', description: 'View schedules and visits', category: 'scheduling' },
    { id: '6', name: 'scheduling.write', description: 'Create and modify schedules', category: 'scheduling' },
    { id: '7', name: 'billing.read', description: 'View billing information', category: 'billing' },
    { id: '8', name: 'billing.write', description: 'Process payments and invoices', category: 'billing' },
    { id: '9', name: 'reports.read', description: 'View reports and analytics', category: 'reports' },
    { id: '10', name: 'system.admin', description: 'Full system administration', category: 'system' }
  ])

  const getRoleColor = (role: User['role']) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200'
      case 'coordinator': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'caregiver': return 'bg-green-100 text-green-800 border-green-200'
      case 'client': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'family': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'suspended': return 'bg-red-100 text-red-800 border-red-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: User['status']) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'inactive': return <Clock className="h-4 w-4 text-gray-500" />
      case 'suspended': return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return `${Math.floor(diffInHours / 168)}w ago`
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const userStats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    suspended: users.filter(u => u.status === 'suspended').length,
    pending: users.filter(u => u.status === 'pending').length
  }

  const suspendUser = (userId: string) => {
    console.log('Suspending user:', userId)
    // Implementation for suspending user
  }

  const activateUser = (userId: string) => {
    console.log('Activating user:', userId)
    // Implementation for activating user
  }

  const resetPassword = (userId: string) => {
    console.log('Resetting password for user:', userId)
    // Implementation for password reset
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage users, roles, and permissions across the platform
          </p>
        </div>
        <Dialog open={showCreateUser} onOpenChange={setShowCreateUser}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Add a new user to the system with appropriate role and permissions
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="Enter first name" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Enter last name" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter email address" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="Enter phone number" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="coordinator">Care Coordinator</SelectItem>
                      <SelectItem value="caregiver">Caregiver</SelectItem>
                      <SelectItem value="client">Client</SelectItem>
                      <SelectItem value="family">Family Member</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select defaultValue="active">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="sendInvite" defaultChecked />
                <Label htmlFor="sendInvite">Send invitation email</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateUser(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowCreateUser(false)}>
                  Create User
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* User Statistics */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{userStats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive</CardTitle>
            <UserX className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{userStats.inactive}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspended</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{userStats.suspended}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{userStats.pending}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="coordinator">Coordinator</SelectItem>
                    <SelectItem value="caregiver">Caregiver</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="family">Family</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>
                            {user.firstName[0]}{user.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.firstName} {user.lastName}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleColor(user.role)} variant="outline">
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(user.status)}
                        <Badge className={getStatusColor(user.status)} variant="outline">
                          {user.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.lastLogin ? formatTimeAgo(user.lastLogin) : 'Never'}
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user)
                            setShowUserDetails(true)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        {user.status === 'active' ? (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => suspendUser(user.id)}
                          >
                            <Lock className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => activateUser(user.id)}
                          >
                            <Unlock className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Permissions Management</CardTitle>
              <CardDescription>
                Manage role-based permissions and access controls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {['clients', 'caregivers', 'scheduling', 'billing', 'reports', 'system'].map((category) => (
                  <div key={category}>
                    <h4 className="font-medium mb-3 capitalize">{category} Permissions</h4>
                    <div className="grid gap-2">
                      {permissions
                        .filter(p => p.category === category)
                        .map((permission) => (
                          <div key={permission.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">{permission.name}</p>
                              <p className="text-sm text-muted-foreground">{permission.description}</p>
                            </div>
                            <Button variant="outline" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Activity Log</CardTitle>
              <CardDescription>
                Recent user actions and system events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.details}</p>
                      <div className="flex items-center mt-2 space-x-2 text-xs text-muted-foreground">
                        <span>{formatTimeAgo(activity.timestamp)}</span>
                        <span>•</span>
                        <span>IP: {activity.ipAddress}</span>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {users.find(u => u.id === activity.userId)?.firstName} {users.find(u => u.id === activity.userId)?.lastName}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Password Policies</CardTitle>
                <CardDescription>
                  Configure password requirements and security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Minimum length: 8 characters</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Require uppercase letters</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Require numbers</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Require special characters</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Password expiry: 90 days</span>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Configure authentication and access controls
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Multi-factor authentication</span>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Session timeout: 24 hours</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Login attempt limit: 5</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">IP address restrictions</span>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Audit logging</span>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* User Details Dialog */}
      <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedUser && `${selectedUser.firstName} ${selectedUser.lastName}`}
            </DialogTitle>
            <DialogDescription>
              User account details and management options
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-6 py-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedUser.avatar} />
                  <AvatarFallback className="text-lg">
                    {selectedUser.firstName[0]}{selectedUser.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">{selectedUser.firstName} {selectedUser.lastName}</h3>
                  <div className="flex items-center space-x-2">
                    <Badge className={getRoleColor(selectedUser.role)} variant="outline">
                      {selectedUser.role}
                    </Badge>
                    <Badge className={getStatusColor(selectedUser.status)} variant="outline">
                      {selectedUser.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Contact Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span>{selectedUser.email}</span>
                      </div>
                      {selectedUser.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4" />
                          <span>{selectedUser.phone}</span>
                        </div>
                      )}
                      {selectedUser.address && (
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span>
                            {selectedUser.address}, {selectedUser.city}, {selectedUser.state} {selectedUser.zipCode}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Account Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>Created: {new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>
                          Last login: {selectedUser.lastLogin ? formatTimeAgo(selectedUser.lastLogin) : 'Never'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {selectedUser.emergencyContact && (
                <div>
                  <h4 className="font-medium mb-2">Emergency Contact</h4>
                  <div className="text-sm space-y-1">
                    <p>{selectedUser.emergencyContact.name} ({selectedUser.emergencyContact.relationship})</p>
                    <p>{selectedUser.emergencyContact.phone}</p>
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-medium mb-2">Permissions</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedUser.permissions.map((permission) => (
                    <Badge key={permission} variant="secondary">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button className="flex-1">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit User
                </Button>
                <Button variant="outline" onClick={() => resetPassword(selectedUser.id)}>
                  <Key className="h-4 w-4 mr-2" />
                  Reset Password
                </Button>
                {selectedUser.status === 'active' ? (
                  <Button variant="outline" onClick={() => suspendUser(selectedUser.id)}>
                    <Lock className="h-4 w-4 mr-2" />
                    Suspend
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => activateUser(selectedUser.id)}>
                    <Unlock className="h-4 w-4 mr-2" />
                    Activate
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}