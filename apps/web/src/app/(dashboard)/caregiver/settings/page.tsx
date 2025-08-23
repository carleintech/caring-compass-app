'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Bell, 
  Shield, 
  Smartphone, 
  Mail, 
  Eye, 
  EyeOff, 
  Key,
  Download,
  Trash2,
  AlertTriangle,
  Save,
  Moon,
  Sun,
  Globe,
  Clock
} from 'lucide-react'

interface NotificationSettings {
  emailNotifications: boolean
  smsNotifications: boolean
  pushNotifications: boolean
  newShiftAlerts: boolean
  scheduleChanges: boolean
  paymentUpdates: boolean
  messageAlerts: boolean
  systemUpdates: boolean
}

interface PrivacySettings {
  profileVisibility: 'public' | 'clients-only' | 'private'
  showPhoneNumber: boolean
  showEmail: boolean
  allowDirectMessages: boolean
  sharePerformanceStats: boolean
}

interface AppSettings {
  theme: 'light' | 'dark' | 'system'
  language: string
  timezone: string
  dateFormat: string
  timeFormat: '12h' | '24h'
}

export default function CaregiverSettings() {
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    newShiftAlerts: true,
    scheduleChanges: true,
    paymentUpdates: true,
    messageAlerts: true,
    systemUpdates: false
  })

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: 'clients-only',
    showPhoneNumber: false,
    showEmail: false,
    allowDirectMessages: true,
    sharePerformanceStats: true
  })

  const [appSettings, setAppSettings] = useState<AppSettings>({
    theme: 'system',
    language: 'en',
    timezone: 'America/Chicago',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h'
  })

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  })

  const handleSaveSettings = () => {
    // Save settings logic
    console.log('Saving settings...')
  }

  const handleChangePassword = () => {
    // Change password logic
    console.log('Changing password...')
  }

  const handleExportData = () => {
    // Export data logic
    console.log('Exporting data...')
  }

  const handleDeleteAccount = () => {
    // Delete account logic
    console.log('Deleting account...')
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account preferences and security settings
          </p>
        </div>
        <Button onClick={handleSaveSettings}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="notifications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how you want to be notified about important updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Communication Methods */}
              <div className="space-y-4">
                <h4 className="font-medium">Communication Methods</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, emailNotifications: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <Label htmlFor="sms-notifications">SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications via text message</p>
                      </div>
                    </div>
                    <Switch
                      id="sms-notifications"
                      checked={notifications.smsNotifications}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, smsNotifications: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <Label htmlFor="push-notifications">Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications in the app</p>
                      </div>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={notifications.pushNotifications}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, pushNotifications: checked})
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Notification Types */}
              <div className="space-y-4">
                <h4 className="font-medium">Notification Types</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="new-shift-alerts">New Shift Alerts</Label>
                      <p className="text-sm text-muted-foreground">When new shifts become available</p>
                    </div>
                    <Switch
                      id="new-shift-alerts"
                      checked={notifications.newShiftAlerts}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, newShiftAlerts: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="schedule-changes">Schedule Changes</Label>
                      <p className="text-sm text-muted-foreground">When your schedule is modified</p>
                    </div>
                    <Switch
                      id="schedule-changes"
                      checked={notifications.scheduleChanges}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, scheduleChanges: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="payment-updates">Payment Updates</Label>
                      <p className="text-sm text-muted-foreground">When payments are processed</p>
                    </div>
                    <Switch
                      id="payment-updates"
                      checked={notifications.paymentUpdates}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, paymentUpdates: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="message-alerts">Message Alerts</Label>
                      <p className="text-sm text-muted-foreground">When you receive new messages</p>
                    </div>
                    <Switch
                      id="message-alerts"
                      checked={notifications.messageAlerts}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, messageAlerts: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="system-updates">System Updates</Label>
                      <p className="text-sm text-muted-foreground">Platform updates and maintenance notices</p>
                    </div>
                    <Switch
                      id="system-updates"
                      checked={notifications.systemUpdates}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, systemUpdates: checked})
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Privacy Settings
              </CardTitle>
              <CardDescription>
                Control who can see your information and how it&apos;s used
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="profile-visibility">Profile Visibility</Label>
                  <Select
                    value={privacy.profileVisibility}
                    onValueChange={(value: 'public' | 'clients-only' | 'private') => 
                      setPrivacy({...privacy, profileVisibility: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public - Visible to all users</SelectItem>
                      <SelectItem value="clients-only">Clients Only - Visible to assigned clients</SelectItem>
                      <SelectItem value="private">Private - Not visible to others</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-phone">Show Phone Number</Label>
                    <p className="text-sm text-muted-foreground">Display your phone number on your profile</p>
                  </div>
                  <Switch
                    id="show-phone"
                    checked={privacy.showPhoneNumber}
                    onCheckedChange={(checked) => 
                      setPrivacy({...privacy, showPhoneNumber: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-email">Show Email Address</Label>
                    <p className="text-sm text-muted-foreground">Display your email address on your profile</p>
                  </div>
                  <Switch
                    id="show-email"
                    checked={privacy.showEmail}
                    onCheckedChange={(checked) => 
                      setPrivacy({...privacy, showEmail: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="direct-messages">Allow Direct Messages</Label>
                    <p className="text-sm text-muted-foreground">Let clients send you direct messages</p>
                  </div>
                  <Switch
                    id="direct-messages"
                    checked={privacy.allowDirectMessages}
                    onCheckedChange={(checked) => 
                      setPrivacy({...privacy, allowDirectMessages: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="performance-stats">Share Performance Stats</Label>
                    <p className="text-sm text-muted-foreground">Show your ratings and statistics to clients</p>
                  </div>
                  <Switch
                    id="performance-stats"
                    checked={privacy.sharePerformanceStats}
                    onCheckedChange={(checked) => 
                      setPrivacy({...privacy, sharePerformanceStats: checked})
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="h-5 w-5 mr-2" />
                Password & Security
              </CardTitle>
              <CardDescription>
                Keep your account secure with a strong password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={passwords.current}
                      onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwords.new}
                      onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button onClick={handleChangePassword}>
                  Update Password
                </Button>
              </div>

              <div className="pt-6 border-t">
                <h4 className="font-medium mb-4">Two-Factor Authentication</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMS Authentication</p>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Button variant="outline">
                    Enable 2FA
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>App Preferences</CardTitle>
              <CardDescription>
                Customize your app experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    value={appSettings.theme}
                    onValueChange={(value: 'light' | 'dark' | 'system') => 
                      setAppSettings({...appSettings, theme: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center">
                          <Sun className="h-4 w-4 mr-2" />
                          Light
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center">
                          <Moon className="h-4 w-4 mr-2" />
                          Dark
                        </div>
                      </SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={appSettings.language}
                    onValueChange={(value) => 
                      setAppSettings({...appSettings, language: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={appSettings.timezone}
                    onValueChange={(value) => 
                      setAppSettings({...appSettings, timezone: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date-format">Date Format</Label>
                  <Select
                    value={appSettings.dateFormat}
                    onValueChange={(value) => 
                      setAppSettings({...appSettings, dateFormat: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time-format">Time Format</Label>
                  <Select
                    value={appSettings.timeFormat}
                    onValueChange={(value: '12h' | '24h') => 
                      setAppSettings({...appSettings, timeFormat: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                      <SelectItem value="24h">24-hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Management</CardTitle>
              <CardDescription>
                Manage your account data and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Export Account Data</p>
                    <p className="text-sm text-muted-foreground">
                      Download a copy of your account data and activity
                    </p>
                  </div>
                  <Button variant="outline" onClick={handleExportData}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg border-red-200">
                  <div>
                    <p className="font-medium text-red-800">Delete Account</p>
                    <p className="text-sm text-red-600">
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                  <Button variant="destructive" onClick={handleDeleteAccount}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800">Important Notice</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Account deletion is permanent and cannot be undone. All your data, 
                      including your profile, work history, and certifications will be permanently removed.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
