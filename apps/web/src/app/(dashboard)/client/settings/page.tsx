'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { 
  BellIcon,
  PhoneIcon,
  MailIcon,
  MessageSquareIcon,
  ShieldIcon,
  EyeIcon,
  CalendarIcon,
  ClockIcon,
  VolumeXIcon,
  Volume2Icon,
  MoonIcon,
  SunIcon,
  GlobeIcon,
  SaveIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  InfoIcon,
  SettingsIcon,
  UserIcon,
  TrashIcon,
  DownloadIcon,
  CreditCardIcon
} from 'lucide-react'

// Mock data - in real app, this would come from API
const mockSettings = {
  notifications: {
    email: {
      visitReminders: true,
      visitUpdates: true,
      careplanChanges: true,
      emergencyAlerts: true,
      billingNotifications: true,
      weeklyReports: true,
      monthlyReports: false,
      marketingEmails: false
    },
    sms: {
      visitReminders: true,
      emergencyAlerts: true,
      urgentUpdates: true,
      billingReminders: false,
      weeklyReports: false
    },
    push: {
      visitReminders: true,
      messages: true,
      emergencyAlerts: true,
      allUpdates: false
    },
    quiet_hours: {
      enabled: true,
      start: '22:00',
      end: '07:00',
      emergency_override: true
    }
  },
  communication: {
    preferred_method: 'email',
    language: 'English',
    timezone: 'America/New_York',
    call_preference: 'morning',
    auto_reply: false,
    read_receipts: true
  },
  privacy: {
    data_sharing: {
      family_members: true,
      care_team: true,
      billing_department: true,
      quality_assurance: false,
      research_anonymized: false
    },
    profile_visibility: {
      basic_info: 'care_team',
      medical_info: 'authorized_only',
      family_contacts: 'family_and_care_team',
      billing_info: 'client_only'
    },
    activity_tracking: true,
    analytics_sharing: false
  },
  accessibility: {
    large_text: false,
    high_contrast: false,
    screen_reader: false,
    reduced_motion: false,
    audio_alerts: true,
    keyboard_navigation: false
  },
  care_preferences: {
    visit_confirmations: 'always',
    caregiver_updates: 'daily',
    emergency_protocol: 'contact_family_first',
    medication_reminders: true,
    photo_documentation: true,
    visit_notes_sharing: 'real_time'
  }
}

const NotificationSettings = ({ settings, onUpdate }: any) => {
  const [notifications, setNotifications] = useState(settings.notifications)

  const updateSetting = (category: string, setting: string, value: boolean | string) => {
    const updated = {
      ...notifications,
      [category]: {
        ...notifications[category],
        [setting]: value
      }
    }
    setNotifications(updated)
    onUpdate('notifications', updated)
  }

  const updateQuietHours = (field: string, value: boolean | string) => {
    const updated = {
      ...notifications,
      quiet_hours: {
        ...notifications.quiet_hours,
        [field]: value
      }
    }
    setNotifications(updated)
    onUpdate('notifications', updated)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MailIcon className="h-5 w-5 mr-2" />
            Email Notifications
          </CardTitle>
          <CardDescription>
            Choose what email notifications you&apos;d like to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(notifications.email).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <Label className="capitalize font-medium">
                  {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}
                </Label>
                <p className="text-sm text-gray-600">
                  {key === 'visitReminders' && 'Get notified before scheduled visits'}
                  {key === 'visitUpdates' && 'Updates when visits are completed or changed'}
                  {key === 'careplanChanges' && 'Notifications when your care plan is updated'}
                  {key === 'emergencyAlerts' && 'Critical alerts for emergency situations'}
                  {key === 'billingNotifications' && 'Invoice and payment notifications'}
                  {key === 'weeklyReports' && 'Weekly summary of your care activities'}
                  {key === 'monthlyReports' && 'Monthly progress and care reports'}
                  {key === 'marketingEmails' && 'Promotional emails and care tips'}
                </p>
              </div>
              <Switch
                checked={value as boolean}
                onCheckedChange={(checked) => updateSetting('email', key, checked)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <PhoneIcon className="h-5 w-5 mr-2" />
            SMS Notifications
          </CardTitle>
          <CardDescription>
            Text message notifications for time-sensitive updates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(notifications.sms).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <Label className="capitalize font-medium">
                  {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}
                </Label>
                <p className="text-sm text-gray-600">
                  {key === 'visitReminders' && 'Text reminders before visits'}
                  {key === 'emergencyAlerts' && 'Emergency notifications via SMS'}
                  {key === 'urgentUpdates' && 'Urgent care updates that need immediate attention'}
                  {key === 'billingReminders' && 'Payment due date reminders'}
                  {key === 'weeklyReports' && 'Weekly care summary via text'}
                </p>
              </div>
              <Switch
                checked={value as boolean}
                onCheckedChange={(checked) => updateSetting('sms', key, checked)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <VolumeXIcon className="h-5 w-5 mr-2" />
            Quiet Hours
          </CardTitle>
          <CardDescription>
            Set times when you don&apos;t want to receive non-emergency notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Enable Quiet Hours</Label>
              <p className="text-sm text-gray-600">Suppress non-emergency notifications during these hours</p>
            </div>
            <Switch
              checked={notifications.quiet_hours.enabled}
              onCheckedChange={(checked) => updateQuietHours('enabled', checked)}
            />
          </div>

          {notifications.quiet_hours.enabled && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quietStart">Start Time</Label>
                  <Select
                    value={notifications.quiet_hours.start}
                    onValueChange={(value) => updateQuietHours('start', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, '0')
                        return (
                          <SelectItem key={hour} value={`${hour}:00`}>
                            {i === 0 ? '12:00 AM' : i < 12 ? `${i}:00 AM` : i === 12 ? '12:00 PM' : `${i - 12}:00 PM`}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quietEnd">End Time</Label>
                  <Select
                    value={notifications.quiet_hours.end}
                    onValueChange={(value) => updateQuietHours('end', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, '0')
                        return (
                          <SelectItem key={hour} value={`${hour}:00`}>
                            {i === 0 ? '12:00 AM' : i < 12 ? `${i}:00 AM` : i === 12 ? '12:00 PM' : `${i - 12}:00 PM`}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Emergency Override</Label>
                  <p className="text-sm text-gray-600">Allow emergency alerts even during quiet hours</p>
                </div>
                <Switch
                  checked={notifications.quiet_hours.emergency_override}
                  onCheckedChange={(checked) => updateQuietHours('emergency_override', checked)}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

const CommunicationSettings = ({ settings, onUpdate }: any) => {
  const [communication, setCommunication] = useState(settings.communication)

  const updateSetting = (setting: string, value: string | boolean) => {
    const updated = {
      ...communication,
      [setting]: value
    }
    setCommunication(updated)
    onUpdate('communication', updated)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquareIcon className="h-5 w-5 mr-2" />
          Communication Preferences
        </CardTitle>
        <CardDescription>
          Configure how you prefer to communicate with your care team
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="preferredMethod">Preferred Contact Method</Label>
            <Select value={communication.preferred_method} onValueChange={(value) => updateSetting('preferred_method', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="phone">Phone Call</SelectItem>
                <SelectItem value="sms">Text Message</SelectItem>
                <SelectItem value="app">In-App Messaging</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="callPreference">Best Time to Call</Label>
            <Select value={communication.call_preference} onValueChange={(value) => updateSetting('call_preference', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Morning (8-11 AM)</SelectItem>
                <SelectItem value="afternoon">Afternoon (12-4 PM)</SelectItem>
                <SelectItem value="evening">Evening (5-8 PM)</SelectItem>
                <SelectItem value="anytime">Anytime</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select value={communication.language} onValueChange={(value) => updateSetting('language', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Spanish">Español</SelectItem>
                <SelectItem value="French">Français</SelectItem>
                <SelectItem value="Haitian Creole">Kreyòl Ayisyen</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select value={communication.timezone} onValueChange={(value) => updateSetting('timezone', value)}>
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
        </div>

        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Auto-Reply Messages</Label>
              <p className="text-sm text-gray-600">Automatically acknowledge received messages</p>
            </div>
            <Switch
              checked={communication.auto_reply}
              onCheckedChange={(checked) => updateSetting('auto_reply', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Read Receipts</Label>
              <p className="text-sm text-gray-600">Let others know when you&apos;ve read their messages</p>
            </div>
            <Switch
              checked={communication.read_receipts}
              onCheckedChange={(checked) => updateSetting('read_receipts', checked)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const PrivacySettings = ({ settings, onUpdate }: any) => {
  const [privacy, setPrivacy] = useState(settings.privacy)

  const updateDataSharing = (setting: string, value: boolean) => {
    const updated = {
      ...privacy,
      data_sharing: {
        ...privacy.data_sharing,
        [setting]: value
      }
    }
    setPrivacy(updated)
    onUpdate('privacy', updated)
  }

  const updateVisibility = (setting: string, value: string) => {
    const updated = {
      ...privacy,
      profile_visibility: {
        ...privacy.profile_visibility,
        [setting]: value
      }
    }
    setPrivacy(updated)
    onUpdate('privacy', updated)
  }

  const updatePrivacySetting = (setting: string, value: boolean) => {
    const updated = {
      ...privacy,
      [setting]: value
    }
    setPrivacy(updated)
    onUpdate('privacy', updated)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShieldIcon className="h-5 w-5 mr-2" />
            Data Sharing Permissions
          </CardTitle>
          <CardDescription>
            Control who can access your care information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(privacy.data_sharing).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <Label className="capitalize font-medium">
                  {key.replace(/_/g, ' ')}
                </Label>
                <p className="text-sm text-gray-600">
                  {key === 'family_members' && 'Share care updates with authorized family members'}
                  {key === 'care_team' && 'Share information with your assigned care team'}
                  {key === 'billing_department' && 'Share billing and payment information'}
                  {key === 'quality_assurance' && 'Allow access for quality improvement purposes'}
                  {key === 'research_anonymized' && 'Use anonymized data for research to improve care'}
                </p>
              </div>
              <Switch
                checked={value as boolean}
                onCheckedChange={(checked) => updateDataSharing(key, checked)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profile Visibility</CardTitle>
          <CardDescription>
            Set who can see different parts of your profile
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(privacy.profile_visibility).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <Label className="capitalize font-medium">
                  {key.replace(/_/g, ' ')}
                </Label>
              </div>
              <Select value={value as string} onValueChange={(val) => updateVisibility(key, val)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client_only">Client Only</SelectItem>
                  <SelectItem value="authorized_only">Authorized Personnel</SelectItem>
                  <SelectItem value="care_team">Care Team</SelectItem>
                  <SelectItem value="family_and_care_team">Family & Care Team</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity & Analytics</CardTitle>
          <CardDescription>
            Control activity tracking and analytics sharing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Activity Tracking</Label>
              <p className="text-sm text-gray-600">Track app usage to improve your experience</p>
            </div>
            <Switch
              checked={privacy.activity_tracking}
              onCheckedChange={(checked) => updatePrivacySetting('activity_tracking', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Analytics Sharing</Label>
              <p className="text-sm text-gray-600">Share anonymized usage data to help improve our services</p>
            </div>
            <Switch
              checked={privacy.analytics_sharing}
              onCheckedChange={(checked) => updatePrivacySetting('analytics_sharing', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const AccessibilitySettings = ({ settings, onUpdate }: any) => {
  const [accessibility, setAccessibility] = useState(settings.accessibility)

  const updateSetting = (setting: string, value: boolean) => {
    const updated = {
      ...accessibility,
      [setting]: value
    }
    setAccessibility(updated)
    onUpdate('accessibility', updated)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <EyeIcon className="h-5 w-5 mr-2" />
          Accessibility Options
        </CardTitle>
        <CardDescription>
          Customize the interface to meet your accessibility needs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(accessibility).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <div>
              <Label className="capitalize font-medium">
                {key.replace(/_/g, ' ')}
              </Label>
              <p className="text-sm text-gray-600">
                {key === 'large_text' && 'Increase text size throughout the app'}
                {key === 'high_contrast' && 'Use high contrast colors for better visibility'}
                {key === 'screen_reader' && 'Optimize interface for screen readers'}
                {key === 'reduced_motion' && 'Reduce animations and motion effects'}
                {key === 'audio_alerts' && 'Enable audio notifications and alerts'}
                {key === 'keyboard_navigation' && 'Enable keyboard-only navigation'}
              </p>
            </div>
            <Switch
              checked={value as boolean}
              onCheckedChange={(checked) => updateSetting(key, checked)}
            />
          </div>
        ))}

        <Alert className="mt-6">
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            Some accessibility changes may require refreshing the page to take effect.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}

const AccountManagement = () => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DownloadIcon className="h-5 w-5 mr-2" />
            Data Export
          </CardTitle>
          <CardDescription>
            Download your personal data and care history
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-medium">Export Care Data</h3>
              <p className="text-sm text-gray-600">Download your complete care history, visits, and documents</p>
            </div>
            <Button variant="outline">
              <DownloadIcon className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-medium">Export Billing History</h3>
              <p className="text-sm text-gray-600">Download all invoices and payment records</p>
            </div>
            <Button variant="outline">
              <CreditCardIcon className="h-4 w-4 mr-2" />
              Export Billing
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <TrashIcon className="h-5 w-5 mr-2" />
            Account Deletion
          </CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertDescription>
              <strong>Warning:</strong> Account deletion is permanent and cannot be undone. 
              All your care history, documents, and data will be permanently removed.
            </AlertDescription>
          </Alert>

          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Account Deletion</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. Please contact your care coordinator to discuss 
                  account closure and ensure proper transition of care.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                  Cancel
                </Button>
                <Button variant="destructive">
                  Contact Care Coordinator
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ClientSettingsPage() {
  const [settings, setSettings] = useState(mockSettings)
  const [activeTab, setActiveTab] = useState('notifications')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const handleUpdate = (section: string, data: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: data
    }))
    setHasUnsavedChanges(true)
  }

  const saveSettings = () => {
    // Here you would make an API call to save settings
    console.log('Saving settings:', settings)
    setHasUnsavedChanges(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">
            Manage your preferences and account settings
          </p>
        </div>
        
        {hasUnsavedChanges && (
          <Button onClick={saveSettings}>
            <SaveIcon className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        )}
      </div>

      {/* Unsaved Changes Alert */}
      {hasUnsavedChanges && (
        <Alert>
          <AlertCircleIcon className="h-4 w-4" />
          <AlertDescription>
            You have unsaved changes. Don&apos;t forget to save your settings before leaving this page.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-6">
          <NotificationSettings settings={settings} onUpdate={handleUpdate} />
        </TabsContent>

        <TabsContent value="communication" className="space-y-6">
          <CommunicationSettings settings={settings} onUpdate={handleUpdate} />
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <PrivacySettings settings={settings} onUpdate={handleUpdate} />
        </TabsContent>

        <TabsContent value="accessibility" className="space-y-6">
          <AccessibilitySettings settings={settings} onUpdate={handleUpdate} />
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <AccountManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}