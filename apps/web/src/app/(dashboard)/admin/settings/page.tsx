'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { 
  Settings, 
  Save,
  RotateCcw,
  Bell,
  Mail,
  Smartphone,
  DollarSign,
  Calendar,
  Clock,
  MapPin,
  Shield,
  Database,
  Server,
  Globe,
  Key,
  FileText,
  Upload,
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react'
import { trpc } from '@/lib/trpc'

interface SystemSettings {
  company: {
    name: string
    address: string
    phone: string
    email: string
    website: string
    logo?: string
    timeZone: string
    currency: string
  }
  notifications: {
    emailEnabled: boolean
    smsEnabled: boolean
    pushEnabled: boolean
    visitReminders: boolean
    paymentAlerts: boolean
    systemAlerts: boolean
    reminderHours: number[]
  }
  billing: {
    defaultPaymentTerms: number
    lateFeePercentage: number
    autoInvoicing: boolean
    paymentMethods: string[]
    taxRate: number
    invoicePrefix: string
    invoiceNumbering: 'sequential' | 'random'
  }
  scheduling: {
    defaultVisitDuration: number
    minimumNoticeHours: number
    maximumAdvanceBooking: number
    overtimeThreshold: number
    allowDoubleBooking: boolean
    autoConfirmVisits: boolean
  }
  security: {
    passwordPolicy: {
      minLength: number
      requireUppercase: boolean
      requireLowercase: boolean
      requireNumbers: boolean
      requireSpecialChars: boolean
      expiryDays: number
    }
    sessionTimeout: number
    maxLoginAttempts: number
    twoFactorRequired: boolean
    ipWhitelist: string[]
  }
  integrations: {
    stripe: {
      enabled: boolean
      publicKey: string
      webhookSecret: string
    }
    twilio: {
      enabled: boolean
      accountSid: string
      authToken: string
      phoneNumber: string
    }
    email: {
      provider: 'sendgrid' | 'resend' | 'ses'
      apiKey: string
      fromEmail: string
      fromName: string
    }
  }
}

export default function SystemSettings() {
  const [activeTab, setActiveTab] = useState('general')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Mock data - replace with actual tRPC calls
  const [settings, setSettings] = useState<SystemSettings>({
    company: {
      name: 'Caring Compass Home Care LLC',
      address: '123 Care Street, Virginia Beach, VA 23451',
      phone: '(757) 555-0100',
      email: 'info@caringcompass.com',
      website: 'https://caringcompass.com',
      timeZone: 'America/New_York',
      currency: 'USD'
    },
    notifications: {
      emailEnabled: true,
      smsEnabled: true,
      pushEnabled: false,
      visitReminders: true,
      paymentAlerts: true,
      systemAlerts: true,
      reminderHours: [24, 2]
    },
    billing: {
      defaultPaymentTerms: 30,
      lateFeePercentage: 5,
      autoInvoicing: true,
      paymentMethods: ['ACH', 'Credit Card', 'Check'],
      taxRate: 8.5,
      invoicePrefix: 'INV',
      invoiceNumbering: 'sequential'
    },
    scheduling: {
      defaultVisitDuration: 120,
      minimumNoticeHours: 24,
      maximumAdvanceBooking: 90,
      overtimeThreshold: 40,
      allowDoubleBooking: false,
      autoConfirmVisits: false
    },
    security: {
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        expiryDays: 90
      },
      sessionTimeout: 1440, // 24 hours in minutes
      maxLoginAttempts: 5,
      twoFactorRequired: false,
      ipWhitelist: []
    },
    integrations: {
      stripe: {
        enabled: true,
        publicKey: 'pk_test_...',
        webhookSecret: 'whsec_...'
      },
      twilio: {
        enabled: true,
        accountSid: 'AC...',
        authToken: '••••••••••••••••',
        phoneNumber: '+17575550100'
      },
      email: {
        provider: 'sendgrid',
        apiKey: 'SG.••••••••••••••••',
        fromEmail: 'noreply@caringcompass.com',
        fromName: 'Caring Compass'
      }
    }
  })

  const updateSetting = (path: string, value: any) => {
    setHasUnsavedChanges(true)
    // Deep update logic would go here
    console.log('Updating setting:', path, value)
  }

  const saveSettings = async () => {
    setIsLoading(true)
    // Save settings via tRPC
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    setHasUnsavedChanges(false)
    setIsLoading(false)
  }

  const resetSettings = () => {
    // Reset to default values
    setHasUnsavedChanges(false)
    console.log('Resetting settings to defaults')
  }

  const testIntegration = (integration: string) => {
    console.log('Testing integration:', integration)
  }

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'system-settings.json'
    link.click()
  }

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string)
          setSettings(importedSettings)
          setHasUnsavedChanges(true)
        } catch (error) {
          console.error('Error importing settings:', error)
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
          <p className="text-muted-foreground">
            Configure system preferences, integrations, and business rules
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {hasUnsavedChanges && (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              Unsaved Changes
            </Badge>
          )}
          <Button variant="outline" onClick={resetSettings}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={saveSettings} disabled={!hasUnsavedChanges || isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Basic company details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={settings.company.name}
                      onChange={(e) => updateSetting('company.name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyPhone">Phone Number</Label>
                    <Input
                      id="companyPhone"
                      value={settings.company.phone}
                      onChange={(e) => updateSetting('company.phone', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyEmail">Email Address</Label>
                    <Input
                      id="companyEmail"
                      type="email"
                      value={settings.company.email}
                      onChange={(e) => updateSetting('company.email', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="companyAddress">Address</Label>
                    <Textarea
                      id="companyAddress"
                      value={settings.company.address}
                      onChange={(e) => updateSetting('company.address', e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyWebsite">Website</Label>
                    <Input
                      id="companyWebsite"
                      value={settings.company.website}
                      onChange={(e) => updateSetting('company.website', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="timeZone">Time Zone</Label>
                  <Select value={settings.company.timeZone} onValueChange={(value) => updateSetting('company.timeZone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={settings.company.currency} onValueChange={(value) => updateSetting('company.currency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                      <SelectItem value="CAD">Canadian Dollar (CAD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Company Logo</Label>
                <div className="mt-2 flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Settings className="h-8 w-8 text-gray-500" />
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Logo
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Backup & Recovery</CardTitle>
              <CardDescription>
                Export and import system configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <Button onClick={exportSettings}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Settings
                </Button>
                <div>
                  <input
                    type="file"
                    accept=".json"
                    onChange={importSettings}
                    className="hidden"
                    id="import-settings"
                  />
                  <Button asChild variant="outline">
                    <label htmlFor="import-settings" className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      Import Settings
                    </label>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Channels</CardTitle>
              <CardDescription>
                Configure which notification methods are enabled
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Send notifications via email</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.notifications.emailEnabled}
                    onCheckedChange={(checked) => updateSetting('notifications.emailEnabled', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">SMS Notifications</p>
                      <p className="text-sm text-muted-foreground">Send notifications via SMS</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.notifications.smsEnabled}
                    onCheckedChange={(checked) => updateSetting('notifications.smsEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bell className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-muted-foreground">Send push notifications to mobile app</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.notifications.pushEnabled}
                    onCheckedChange={(checked) => updateSetting('notifications.pushEnabled', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notification Types</CardTitle>
              <CardDescription>
                Choose which events trigger notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Visit Reminders</p>
                    <p className="text-sm text-muted-foreground">Remind clients and caregivers of upcoming visits</p>
                  </div>
                  <Switch
                    checked={settings.notifications.visitReminders}
                    onCheckedChange={(checked) => updateSetting('notifications.visitReminders', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Payment Alerts</p>
                    <p className="text-sm text-muted-foreground">Notify about overdue payments and invoices</p>
                  </div>
                  <Switch
                    checked={settings.notifications.paymentAlerts}
                    onCheckedChange={(checked) => updateSetting('notifications.paymentAlerts', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">System Alerts</p>
                    <p className="text-sm text-muted-foreground">Critical system notifications and alerts</p>
                  </div>
                  <Switch
                    checked={settings.notifications.systemAlerts}
                    onCheckedChange={(checked) => updateSetting('notifications.systemAlerts', checked)}
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div>
                  <Label>Visit Reminder Schedule</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Choose when to send visit reminders (hours before visit)
                  </p>
                  <div className="space-y-2">
                    {[24, 2, 1, 0.5].map((hours) => (
                      <div key={hours} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`reminder-${hours}`}
                          checked={settings.notifications.reminderHours.includes(hours)}
                          onChange={(e) => {
                            const newReminders = e.target.checked
                              ? [...settings.notifications.reminderHours, hours]
                              : settings.notifications.reminderHours.filter(h => h !== hours)
                            updateSetting('notifications.reminderHours', newReminders)
                          }}
                          className="rounded"
                        />
                        <Label htmlFor={`reminder-${hours}`}>
                          {hours >= 1 ? `${hours} hour${hours > 1 ? 's' : ''}` : '30 minutes'} before
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Terms</CardTitle>
              <CardDescription>
                Configure default billing and payment settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="paymentTerms">Default Payment Terms (days)</Label>
                  <Input
                    id="paymentTerms"
                    type="number"
                    value={settings.billing.defaultPaymentTerms}
                    onChange={(e) => updateSetting('billing.defaultPaymentTerms', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="lateFee">Late Fee Percentage</Label>
                  <Input
                    id="lateFee"
                    type="number"
                    step="0.1"
                    value={settings.billing.lateFeePercentage}
                    onChange={(e) => updateSetting('billing.lateFeePercentage', parseFloat(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.1"
                    value={settings.billing.taxRate}
                    onChange={(e) => updateSetting('billing.taxRate', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
                  <Input
                    id="invoicePrefix"
                    value={settings.billing.invoicePrefix}
                    onChange={(e) => updateSetting('billing.invoicePrefix', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Automatic Invoicing</p>
                    <p className="text-sm text-muted-foreground">Generate invoices automatically based on completed visits</p>
                  </div>
                  <Switch
                    checked={settings.billing.autoInvoicing}
                    onCheckedChange={(checked) => updateSetting('billing.autoInvoicing', checked)}
                  />
                </div>

                <div>
                  <Label>Invoice Numbering</Label>
                  <Select 
                    value={settings.billing.invoiceNumbering} 
                    onValueChange={(value) => updateSetting('billing.invoiceNumbering', value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sequential">Sequential (INV-001, INV-002...)</SelectItem>
                      <SelectItem value="random">Random (INV-A7B9, INV-X2Y4...)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Configure accepted payment methods
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['ACH', 'Credit Card', 'Debit Card', 'Check', 'Cash'].map((method) => (
                  <div key={method} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`payment-${method}`}
                      checked={settings.billing.paymentMethods.includes(method)}
                      onChange={(e) => {
                        const newMethods = e.target.checked
                          ? [...settings.billing.paymentMethods, method]
                          : settings.billing.paymentMethods.filter(m => m !== method)
                        updateSetting('billing.paymentMethods', newMethods)
                      }}
                      className="rounded"
                    />
                    <Label htmlFor={`payment-${method}`}>{method}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduling" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Visit Settings</CardTitle>
              <CardDescription>
                Configure default scheduling parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="defaultDuration">Default Visit Duration (minutes)</Label>
                  <Input
                    id="defaultDuration"
                    type="number"
                    value={settings.scheduling.defaultVisitDuration}
                    onChange={(e) => updateSetting('scheduling.defaultVisitDuration', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="minimumNotice">Minimum Notice (hours)</Label>
                  <Input
                    id="minimumNotice"
                    type="number"
                    value={settings.scheduling.minimumNoticeHours}
                    onChange={(e) => updateSetting('scheduling.minimumNoticeHours', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="maxAdvanceBooking">Maximum Advance Booking (days)</Label>
                  <Input
                    id="maxAdvanceBooking"
                    type="number"
                    value={settings.scheduling.maximumAdvanceBooking}
                    onChange={(e) => updateSetting('scheduling.maximumAdvanceBooking', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="overtimeThreshold">Overtime Threshold (hours/week)</Label>
                  <Input
                    id="overtimeThreshold"
                    type="number"
                    value={settings.scheduling.overtimeThreshold}
                    onChange={(e) => updateSetting('scheduling.overtimeThreshold', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Allow Double Booking</p>
                    <p className="text-sm text-muted-foreground">Allow caregivers to have overlapping visits</p>
                  </div>
                  <Switch
                    checked={settings.scheduling.allowDoubleBooking}
                    onCheckedChange={(checked) => updateSetting('scheduling.allowDoubleBooking', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto-Confirm Visits</p>
                    <p className="text-sm text-muted-foreground">Automatically confirm visits when assigned</p>
                  </div>
                  <Switch
                    checked={settings.scheduling.autoConfirmVisits}
                    onCheckedChange={(checked) => updateSetting('scheduling.autoConfirmVisits', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Password Policy</CardTitle>
              <CardDescription>
                Configure password requirements for all users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Minimum Password Length: {settings.security.passwordPolicy.minLength} characters</Label>
                <Slider
                  value={[settings.security.passwordPolicy.minLength]}
                  onValueChange={([value]) => updateSetting('security.passwordPolicy.minLength', value)}
                  max={20}
                  min={6}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Require uppercase letters</span>
                  <Switch
                    checked={settings.security.passwordPolicy.requireUppercase}
                    onCheckedChange={(checked) => updateSetting('security.passwordPolicy.requireUppercase', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span>Require lowercase letters</span>
                  <Switch
                    checked={settings.security.passwordPolicy.requireLowercase}
                    onCheckedChange={(checked) => updateSetting('security.passwordPolicy.requireLowercase', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span>Require numbers</span>
                  <Switch
                    checked={settings.security.passwordPolicy.requireNumbers}
                    onCheckedChange={(checked) => updateSetting('security.passwordPolicy.requireNumbers', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span>Require special characters</span>
                  <Switch
                    checked={settings.security.passwordPolicy.requireSpecialChars}
                    onCheckedChange={(checked) => updateSetting('security.passwordPolicy.requireSpecialChars', checked)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="passwordExpiry">Password Expiry (days, 0 = never)</Label>
                <Input
                  id="passwordExpiry"
                  type="number"
                  value={settings.security.passwordPolicy.expiryDays}
                  onChange={(e) => updateSetting('security.passwordPolicy.expiryDays', parseInt(e.target.value))}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Session & Access Control</CardTitle>
              <CardDescription>
                Configure session timeout and login restrictions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => updateSetting('security.sessionTimeout', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) => updateSetting('security.maxLoginAttempts', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Require 2FA for all users</p>
                </div>
                <Switch
                  checked={settings.security.twoFactorRequired}
                  onCheckedChange={(checked) => updateSetting('security.twoFactorRequired', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Processing</CardTitle>
              <CardDescription>
                Configure Stripe payment integration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Stripe Integration</p>
                  <p className="text-sm text-muted-foreground">Enable Stripe for payment processing</p>
                </div>
                <Switch
                  checked={settings.integrations.stripe.enabled}
                  onCheckedChange={(checked) => updateSetting('integrations.stripe.enabled', checked)}
                />
              </div>

              {settings.integrations.stripe.enabled && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="stripePublicKey">Stripe Public Key</Label>
                    <Input
                      id="stripePublicKey"
                      value={settings.integrations.stripe.publicKey}
                      onChange={(e) => updateSetting('integrations.stripe.publicKey', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="stripeWebhookSecret">Webhook Secret</Label>
                    <div className="relative">
                      <Input
                        id="stripeWebhookSecret"
                        type="password"
                        value={settings.integrations.stripe.webhookSecret}
                        onChange={(e) => updateSetting('integrations.stripe.webhookSecret', e.target.value)}
                      />
                    </div>
                  </div>
                  <Button onClick={() => testIntegration('stripe')} variant="outline">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Test Connection
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SMS Notifications</CardTitle>
              <CardDescription>
                Configure Twilio for SMS messaging
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Twilio Integration</p>
                  <p className="text-sm text-muted-foreground">Enable SMS notifications via Twilio</p>
                </div>
                <Switch
                  checked={settings.integrations.twilio.enabled}
                  onCheckedChange={(checked) => updateSetting('integrations.twilio.enabled', checked)}
                />
              </div>

              {settings.integrations.twilio.enabled && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="twilioSid">Account SID</Label>
                    <Input
                      id="twilioSid"
                      value={settings.integrations.twilio.accountSid}
                      onChange={(e) => updateSetting('integrations.twilio.accountSid', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="twilioToken">Auth Token</Label>
                    <Input
                      id="twilioToken"
                      type="password"
                      value={settings.integrations.twilio.authToken}
                      onChange={(e) => updateSetting('integrations.twilio.authToken', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="twilioPhone">Phone Number</Label>
                    <Input
                      id="twilioPhone"
                      value={settings.integrations.twilio.phoneNumber}
                      onChange={(e) => updateSetting('integrations.twilio.phoneNumber', e.target.value)}
                    />
                  </div>
                  <Button onClick={() => testIntegration('twilio')} variant="outline">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Test SMS
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Email Service</CardTitle>
              <CardDescription>
                Configure email service provider
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Email Provider</Label>
                <Select 
                  value={settings.integrations.email.provider} 
                  onValueChange={(value: any) => updateSetting('integrations.email.provider', value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sendgrid">SendGrid</SelectItem>
                    <SelectItem value="resend">Resend</SelectItem>
                    <SelectItem value="ses">Amazon SES</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fromEmail">From Email</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={settings.integrations.email.fromEmail}
                    onChange={(e) => updateSetting('integrations.email.fromEmail', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="fromName">From Name</Label>
                  <Input
                    id="fromName"
                    value={settings.integrations.email.fromName}
                    onChange={(e) => updateSetting('integrations.email.fromName', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="emailApiKey">API Key</Label>
                <Input
                  id="emailApiKey"
                  type="password"
                  value={settings.integrations.email.apiKey}
                  onChange={(e) => updateSetting('integrations.email.apiKey', e.target.value)}
                />
              </div>

              <Button onClick={() => testIntegration('email')} variant="outline">
                <CheckCircle className="h-4 w-4 mr-2" />
                Send Test Email
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}