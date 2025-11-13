'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { HeadphonesIcon, User, Mail, Phone, Clock } from 'lucide-react'
import { useServices } from '@/hooks/use-services'

interface CoordinatorModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CoordinatorModal({ isOpen, onClose }: CoordinatorModalProps) {
  const { speakWithCoordinator, isSubmitting } = useServices()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredContactTime: '',
    reason: '',
    urgency: 'medium' as 'low' | 'medium' | 'high'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await speakWithCoordinator(formData)
      onClose()
      setFormData({
        name: '',
        email: '',
        phone: '',
        preferredContactTime: '',
        reason: '',
        urgency: 'medium'
      })
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const urgencyOptions = [
    { value: 'low', label: 'Low - General inquiry', description: 'Response within 24 hours' },
    { value: 'medium', label: 'Medium - Need assistance soon', description: 'Response within 4 hours' },
    { value: 'high', label: 'High - Urgent care need', description: 'Response within 1 hour' }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HeadphonesIcon className="h-5 w-5 text-blue-600" />
            Speak with Care Coordinator
          </DialogTitle>
          <DialogDescription>
            Our experienced care coordinators are here to help you find the perfect care solution. 
            We'll contact you as soon as possible based on your urgency level.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-1">
                <User className="h-4 w-4" />
                Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Your full name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                Phone *
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="(555) 123-4567"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="your.email@example.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="preferredContactTime" className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Preferred Contact Time
            </Label>
            <Select value={formData.preferredContactTime} onValueChange={(value) => handleChange('preferredContactTime', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Any time works" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Morning (8AM - 12PM)</SelectItem>
                <SelectItem value="afternoon">Afternoon (12PM - 5PM)</SelectItem>
                <SelectItem value="evening">Evening (5PM - 8PM)</SelectItem>
                <SelectItem value="anytime">Any time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="urgency">
              Urgency Level
            </Label>
            <Select value={formData.urgency} onValueChange={(value: 'low' | 'medium' | 'high') => handleChange('urgency', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {urgencyOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-gray-500">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reason">
              How can we help you? *
            </Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => handleChange('reason', e.target.value)}
              placeholder="Please describe what you need help with - service questions, care planning, pricing, scheduling, or any other concerns..."
              rows={4}
              required
            />
          </div>
          
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isSubmitting ? 'Submitting...' : 'Request Contact'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
