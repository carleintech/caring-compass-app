'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Minus, Package, User, Mail, Phone, X } from 'lucide-react'
import { useServices, ServiceItem } from '@/hooks/use-services'

interface CustomPackageModalProps {
  isOpen: boolean
  onClose: () => void
  preselectedService?: ServiceItem
}

export function CustomPackageModal({ isOpen, onClose, preselectedService }: CustomPackageModalProps) {
  const { 
    services, 
    selectedServices, 
    totalEstimate, 
    addServiceToPackage, 
    removeServiceFromPackage, 
    buildCustomPackage, 
    isSubmitting,
    setSelectedServices
  } = useServices()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialRequirements: ''
  })

  // Add preselected service when modal opens
  useState(() => {
    if (preselectedService && !selectedServices.find(s => s.id === preselectedService.id)) {
      addServiceToPackage(preselectedService)
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (selectedServices.length === 0) {
      return
    }
    
    try {
      await buildCustomPackage(formData)
      onClose()
      setFormData({
        name: '',
        email: '',
        phone: '',
        specialRequirements: ''
      })
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            Build Custom Care Package
          </DialogTitle>
          <DialogDescription>
            Select the services you need and we'll create a personalized care package for you.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Service Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Available Services</h3>
            <div className="grid gap-3 max-h-60 overflow-y-auto">
              {services.map((service) => {
                const isSelected = selectedServices.find(s => s.id === service.id)
                return (
                  <Card 
                    key={service.id} 
                    className={`cursor-pointer transition-all ${
                      isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                    }`}
                    onClick={() => {
                      if (isSelected) {
                        removeServiceFromPackage(service.id)
                      } else {
                        addServiceToPackage(service)
                      }
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{service.title}</h4>
                            {service.popular && <Badge variant="secondary" className="text-xs">Popular</Badge>}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-lg font-bold text-blue-600">{service.price}/hr</span>
                            <span className="text-sm text-gray-500">{service.duration}</span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant={isSelected ? "destructive" : "default"}
                          onClick={(e) => {
                            e.stopPropagation()
                            if (isSelected) {
                              removeServiceFromPackage(service.id)
                            } else {
                              addServiceToPackage(service)
                            }
                          }}
                        >
                          {isSelected ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Selected Services Summary */}
          {selectedServices.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Your Package ({selectedServices.length} services)</h3>
              <div className="space-y-2">
                {selectedServices.map((service) => (
                  <div key={service.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <span className="font-medium">{service.title}</span>
                      <span className="text-sm text-gray-600 ml-2">({service.duration})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-blue-600">{service.price}/hr</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeServiceFromPackage(service.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span className="font-semibold">Estimated Starting Rate:</span>
                <span className="text-xl font-bold text-blue-600">${totalEstimate.toFixed(2)}/hr</span>
              </div>
            </div>
          )}

          {/* Contact Information */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            
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
              <Label htmlFor="specialRequirements">
                Special Requirements or Notes
              </Label>
              <Textarea
                id="specialRequirements"
                value={formData.specialRequirements}
                onChange={(e) => handleChange('specialRequirements', e.target.value)}
                placeholder="Any specific needs, medical conditions, scheduling preferences, or other important information..."
                rows={3}
              />
            </div>
            
            <div className="flex gap-3 pt-4">
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
                disabled={isSubmitting || selectedServices.length === 0}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Package Request'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
