'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { 
  UserPlusIcon,
  MailIcon,
  PhoneIcon,
  EditIcon,
  TrashIcon,
  EyeIcon,
  EyeOffIcon,
  ShieldIcon,
  MessageSquareIcon,
  CalendarIcon,
  FileTextIcon,
  BellIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  UserIcon,
  SettingsIcon,
  SendIcon
} from 'lucide-react'

// Mock data - in real app, this would come from API
const mockFamilyMembers = [
  {
    id: 'fam_001',
    name: 'Emily Johnson',
    relationship: 'Daughter',
    email: 'emily.johnson@email.com',
    phone: '(757) 555-0167',
    role: 'primary_contact',
    status: 'active',
    permissions: {
      viewSchedule: true,
      viewCarePlan: true,
      viewBilling: true,
      viewDocuments: true,
      receiveNotifications: true,
      emergencyContact: true,
      makeChanges: true
    },
    lastLogin: '2024-01-18T14:30:00Z',
    invitedAt: '2024-01-10T09:00:00Z',
    invitedBy: 'Robert Johnson'
  },
  {
    id: 'fam_002',
    name: 'Michael Johnson',
    relationship: 'Son',
    email: 'michael.johnson@email.com',
    phone: '(757) 555-0198',
    role: 'family_member',
    status: 'active',
    permissions: {
      viewSchedule: true,
      viewCarePlan: true,
      viewBilling: false,
      viewDocuments: false,
      receiveNotifications: true,
      emergencyContact: true,
      makeChanges: false
    },
    lastLogin: '2024-01-16T10:15:00Z',
    invitedAt: '2024-01-12T11:30:00Z',
    invitedBy: 'Emily Johnson'
  },
  {
    id: 'fam_003',
    name: 'Sarah Thompson',
    relationship: 'Niece',
    email: 'sarah.thompson@email.com',
    phone: '(757) 555-0143',
    role: 'family_member',
    status: 'pending',
    permissions: {
      viewSchedule: true,
      viewCarePlan: false,
      viewBilling: false,
      viewDocuments: false,
      receiveNotifications: true,
      emergencyContact: false,
      makeChanges: false
    },
    lastLogin: null,
    invitedAt: '2024-01-17T16:45:00Z',
    invitedBy: 'Emily Johnson'
  }
]

const mockNotificationSettings = {
  visitReminders: true,
  visitUpdates: true,
  careplanChanges: true,
  emergencyAlerts: true,
  billingNotifications: false,
  weeklyReports: true,
  monthlyReports: true
}

const mockFamilyActivity = [
  {
    id: 'act_001',
    type: 'login',
    member: 'Emily Johnson',
    action: 'Logged in to view care plan',
    timestamp: '2024-01-18T14:30:00Z'
  },
  {
    id: 'act_002',
    type: 'message',
    member: 'Michael Johnson',
    action: 'Sent message to care coordinator',
    timestamp: '2024-01-17T09:15:00Z'
  },
  {
    id: 'act_003',
    type: 'schedule_view',
    member: 'Emily Johnson',
    action: 'Viewed upcoming visit schedule',
    timestamp: '2024-01-16T16:20:00Z'
  },
  {
    id: 'act_004',
    type: 'permission_change',
    member: 'Emily Johnson',
    action: 'Updated Michael\'s permissions',
    timestamp: '2024-01-15T11:45:00Z'
  }
]

const relationshipOptions = [
  'Spouse', 'Daughter', 'Son', 'Mother', 'Father', 'Sister', 'Brother',
  'Granddaughter', 'Grandson', 'Niece', 'Nephew', 'Friend', 'Other'
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800'
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    case 'inactive': return 'bg-gray-100 text-gray-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getRoleDisplay = (role: string) => {
  switch (role) {
    case 'primary_contact': return 'Primary Contact'
    case 'family_member': return 'Family Member'
    case 'emergency_contact': return 'Emergency Contact'
    default: return 'Family Member'
  }
}

const formatLastLogin = (timestamp: string | null) => {
  if (!timestamp) return 'Never'
  
  const date = new Date(timestamp)
  const now = new Date()
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  
  if (diffInHours < 1) {
    return 'Just now'
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h ago`
  } else if (diffInHours < 48) {
    return 'Yesterday'
  } else {
    return date.toLocaleDateString()
  }
}

const FamilyMemberCard = ({ member, onEdit, onRemove, canManage }: any) => {
  const [showPermissions, setShowPermissions] = useState(false)

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback>
                {member.name.split(' ').map((n: string) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-semibold">{member.name}</h3>
                <Badge className={getStatusColor(member.status)}>
                  {member.status}
                </Badge>
                {member.role === 'primary_contact' && (
                  <Badge variant="outline">
                    <ShieldIcon className="h-3 w-3 mr-1" />
                    Primary
                  </Badge>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-2">{member.relationship}</p>
              
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center">
                  <MailIcon className="h-4 w-4 mr-2" />
                  {member.email}
                </div>
                <div className="flex items-center">
                  <PhoneIcon className="h-4 w-4 mr-2" />
                  {member.phone}
                </div>
                <div className="flex items-center">
                  <UserIcon className="h-4 w-4 mr-2" />
                  Last login: {formatLastLogin(member.lastLogin)}
                </div>
              </div>
              
              <div className="mt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPermissions(!showPermissions)}
                >
                  {showPermissions ? <EyeOffIcon className="h-4 w-4 mr-1" /> : <EyeIcon className="h-4 w-4 mr-1" />}
                  {showPermissions ? 'Hide' : 'Show'} Permissions
                </Button>
              </div>
              
              {showPermissions && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(member.permissions).map(([permission, hasPermission]) => (
                      <div key={permission} className="flex items-center justify-between">
                        <span className="capitalize">{permission.replace(/([A-Z])/g, ' $1').trim()}</span>
                        {hasPermission ? (
                          <CheckCircleIcon className="h-4 w-4 text-green-500" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border border-gray-300" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {canManage && (
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(member)}>
                <EditIcon className="h-4 w-4" />
              </Button>
              
              {member.role !== 'primary_contact' && (
                <Button variant="outline" size="sm" onClick={() => onRemove(member)}>
                  <TrashIcon className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

const InviteFamilyDialog = ({ isOpen, onClose, onInvite }: any) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    relationship: '',
    role: 'family_member',
    permissions: {
      viewSchedule: true,
      viewCarePlan: false,
      viewBilling: false,
      viewDocuments: false,
      receiveNotifications: true,
      emergencyContact: false,
      makeChanges: false
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onInvite(formData)
    onClose()
    setFormData({
      name: '',
      email: '',
      phone: '',
      relationship: '',
      role: 'family_member',
      permissions: {
        viewSchedule: true,
        viewCarePlan: false,
        viewBilling: false,
        viewDocuments: false,
        receiveNotifications: true,
        emergencyContact: false,
        makeChanges: false
      }
    })
  }

  const updatePermission = (permission: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: value
      }
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Invite Family Member</DialogTitle>
          <DialogDescription>
            Give a family member access to view care information and communicate with the care team
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship *</Label>
              <Select value={formData.relationship} onValueChange={(value) => setFormData(prev => ({ ...prev, relationship: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  {relationshipOptions.map(rel => (
                    <SelectItem key={rel} value={rel}>{rel}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Access Level</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="family_member">Family Member</SelectItem>
                <SelectItem value="emergency_contact">Emergency Contact</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-4">
            <Label>Permissions</Label>
            <div className="grid grid-cols-1 gap-3">
              {Object.entries(formData.permissions).map(([permission, hasPermission]) => (
                <div key={permission} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium capitalize">
                      {permission.replace(/([A-Z])/g, ' $1').trim()}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {permission === 'viewSchedule' && 'View upcoming visits and care schedule'}
                      {permission === 'viewCarePlan' && 'Access care plan details and progress'}
                      {permission === 'viewBilling' && 'View invoices and payment information'}
                      {permission === 'viewDocuments' && 'Access care documents and agreements'}
                      {permission === 'receiveNotifications' && 'Get updates about care and visits'}
                      {permission === 'emergencyContact' && 'Receive emergency notifications'}
                      {permission === 'makeChanges' && 'Request changes to care plan or schedule'}
                    </p>
                  </div>
                  <Switch
                    checked={hasPermission}
                    onCheckedChange={(checked) => updatePermission(permission, checked)}
                  />
                </div>
              ))}
            </div>
          </div>
          
          <Alert>
            <AlertCircleIcon className="h-4 w-4" />
            <AlertDescription>
              An invitation email will be sent to the family member with instructions to create their account.
            </AlertDescription>
          </Alert>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              <SendIcon className="h-4 w-4 mr-2" />
              Send Invitation
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function FamilyPortalPage() {
  const [activeTab, setActiveTab] = useState('members')
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [notificationSettings, setNotificationSettings] = useState(mockNotificationSettings)

  const activeFamilyMembers = mockFamilyMembers.filter(member => member.status === 'active')
  const pendingInvitations = mockFamilyMembers.filter(member => member.status === 'pending')

  const handleInvite = (formData: any) => {
    console.log('Invite family member:', formData)
    // Implement invitation logic
  }

  const handleEdit = (member: any) => {
    console.log('Edit family member:', member)
    // Implement edit logic
  }

  const handleRemove = (member: any) => {
    console.log('Remove family member:', member)
    // Implement removal logic
  }

  const updateNotificationSetting = (setting: string, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: value
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Family Access</h1>
          <p className="text-gray-600 mt-1">
            Manage family member access to care information
          </p>
        </div>
        
        <Button onClick={() => setIsInviteOpen(true)}>
          <UserPlusIcon className="h-4 w-4 mr-2" />
          Invite Family Member
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <UserIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeFamilyMembers.length}</div>
            <p className="text-xs text-muted-foreground">
              family members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Invites</CardTitle>
            <MailIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingInvitations.length}</div>
            <p className="text-xs text-muted-foreground">
              awaiting response
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emergency Contacts</CardTitle>
            <PhoneIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockFamilyMembers.filter(m => m.permissions.emergencyContact).length}
            </div>
            <p className="text-xs text-muted-foreground">
              contacts registered
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockFamilyActivity.length}</div>
            <p className="text-xs text-muted-foreground">
              actions this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="members">Family Members</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-6">
          {pendingInvitations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Pending Invitations</CardTitle>
                <CardDescription>
                  Family members who haven&apos;t accepted their invitation yet
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingInvitations.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50 border-yellow-200">
                    <div>
                      <h3 className="font-medium">{member.name}</h3>
                      <p className="text-sm text-gray-600">{member.email}</p>
                      <p className="text-xs text-gray-500">Invited on {new Date(member.invitedAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Resend Invitation
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleRemove(member)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Active Family Members</CardTitle>
              <CardDescription>
                Family members with access to your care information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeFamilyMembers.map((member) => (
                <FamilyMemberCard
                  key={member.id}
                  member={member}
                  onEdit={handleEdit}
                  onRemove={handleRemove}
                  canManage={true}
                />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Permission Overview</CardTitle>
              <CardDescription>
                What family members can access with different permission levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center">
                      <CalendarIcon className="h-5 w-5 mr-2" />
                      Schedule Access
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p>• View upcoming visits and appointments</p>
                      <p>• See caregiver assignments</p>
                      <p>• Access visit history</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center">
                      <FileTextIcon className="h-5 w-5 mr-2" />
                      Care Plan Access
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p>• View care goals and progress</p>
                      <p>• See service details</p>
                      <p>• Access care notes</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center">
                      <MessageSquareIcon className="h-5 w-5 mr-2" />
                      Communication
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p>• Message care coordinators</p>
                      <p>• Receive care updates</p>
                      <p>• Emergency notifications</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center">
                      <SettingsIcon className="h-5 w-5 mr-2" />
                      Care Management
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p>• Request schedule changes</p>
                      <p>• Update preferences</p>
                      <p>• Manage other family access</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure what notifications family members receive
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(notificationSettings).map(([setting, enabled]) => (
                  <div key={setting} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium capitalize">
                        {setting.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {setting === 'visitReminders' && 'Get notified before scheduled visits'}
                        {setting === 'visitUpdates' && 'Updates when visits are completed or changed'}
                        {setting === 'careplanChanges' && 'Notifications when care plan is updated'}
                        {setting === 'emergencyAlerts' && 'Immediate alerts for emergency situations'}
                        {setting === 'billingNotifications' && 'Updates about invoices and payments'}
                        {setting === 'weeklyReports' && 'Weekly summary of care activities'}
                        {setting === 'monthlyReports' && 'Monthly care progress reports'}
                      </p>
                    </div>
                    <Switch
                      checked={enabled}
                      onCheckedChange={(checked) => updateNotificationSetting(setting, checked)}
                    />
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <Button className="w-full">
                  Save Notification Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Family Activity Log</CardTitle>
              <CardDescription>
                Recent actions taken by family members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockFamilyActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      {activity.type === 'login' && <UserIcon className="h-5 w-5 text-blue-500" />}
                      {activity.type === 'message' && <MessageSquareIcon className="h-5 w-5 text-green-500" />}
                      {activity.type === 'schedule_view' && <CalendarIcon className="h-5 w-5 text-purple-500" />}
                      {activity.type === 'permission_change' && <SettingsIcon className="h-5 w-5 text-orange-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.member}</p>
                      <p className="text-sm text-gray-600">{activity.action}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Invite Family Dialog */}
      <InviteFamilyDialog
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onInvite={handleInvite}
      />
    </div>
  )
}