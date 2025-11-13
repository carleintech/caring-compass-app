'use client'

import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'

export interface ServiceItem {
  id: string
  title: string
  description: string
  price: string
  duration: string
  icon: string
  popular?: boolean
  details: string[]
}

export interface ContactInfo {
  name: string
  email: string
  phone: string
  preferredContactTime?: string
}

// Mock services data
const mockServices: ServiceItem[] = [
  {
    id: 'bathing-hygiene',
    title: "Bathing & Hygiene Assistance",
    description: "Gentle, respectful assistance with bathing, showering, and personal hygiene to maintain dignity and cleanliness.",
    icon: "Bath",
    price: "$28",
    duration: "30-60 min",
    popular: true,
    details: [
      "Safe transfer in and out of tub/shower",
      "Assistance with washing and shampooing",
      "Help with dental care and oral hygiene",
      "Nail care and grooming assistance",
      "Respectful assistance maintaining privacy",
      "Special attention to skin care needs"
    ]
  },
  {
    id: 'dressing-grooming',
    title: "Dressing & Grooming",
    description: "Compassionate help with selecting appropriate clothing and maintaining personal appearance.",
    icon: "Shirt",
    price: "$25",
    duration: "20-40 min",
    details: [
      "Assistance choosing weather-appropriate clothing",
      "Help with dressing and undressing",
      "Hair care and styling assistance",
      "Makeup application if desired",
      "Jewelry and accessory assistance",
      "Seasonal wardrobe organization"
    ]
  },
  {
    id: 'medication-management',
    title: "Medication Management",
    description: "Professional oversight to ensure medications are taken safely and on schedule.",
    icon: "AlertCircle",
    price: "$30",
    duration: "15-30 min",
    popular: true,
    details: [
      "Medication reminders and scheduling",
      "Pill sorting and organization",
      "Monitoring for side effects",
      "Communication with healthcare providers",
      "Prescription pickup coordination",
      "Emergency medication protocols"
    ]
  },
  {
    id: 'meal-assistance',
    title: "Meal Assistance",
    description: "Support with eating, feeding, and maintaining proper nutrition throughout the day.",
    icon: "Utensils",
    price: "$26",
    duration: "45-90 min",
    details: [
      "Assistance with eating and feeding",
      "Help with food preparation",
      "Dietary restriction monitoring",
      "Hydration encouragement",
      "Meal planning consultation",
      "Special diet accommodation"
    ]
  },
  {
    id: 'mobility-support',
    title: "Mobility Support",
    description: "Safe assistance with movement, transfers, and maintaining physical independence.",
    icon: "UserCheck",
    price: "$32",
    duration: "30-45 min",
    details: [
      "Safe transfer assistance",
      "Walking and mobility support",
      "Fall prevention measures",
      "Physical therapy coordination",
      "Exercise encouragement",
      "Assistive device training"
    ]
  },
  {
    id: 'companionship',
    title: "Companionship Care",
    description: "Emotional support and social interaction to combat isolation and loneliness.",
    icon: "Heart",
    price: "$22",
    duration: "60-120 min",
    details: [
      "Meaningful conversation and listening",
      "Activity planning and participation",
      "Emotional support and comfort",
      "Social interaction facilitation",
      "Memory stimulation activities",
      "Family communication updates"
    ]
  }
]

export function useServices() {
  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Helper functions
  const addServiceToPackage = (service: ServiceItem) => {
    if (!selectedServices.find(s => s.id === service.id)) {
      setSelectedServices(prev => [...prev, service])
      toast({
        title: "Service Added",
        description: `${service.title} added to your package!`,
      })
    } else {
      toast({
        title: "Already Added",
        description: 'Service is already in your package',
      })
    }
  }

  const removeServiceFromPackage = (serviceId: string) => {
    setSelectedServices(prev => prev.filter(s => s.id !== serviceId))
    toast({
      title: "Service Removed",
      description: 'Service removed from package',
    })
  }

  const calculateTotalEstimate = () => {
    return selectedServices.reduce((total, service) => {
      const price = parseFloat(service.price.replace('$', ''))
      return total + price
    }, 0)
  }

  // Mock API calls - replace with real API calls later
  const addToPackage = async (serviceId: string, serviceTitle: string, servicePrice: string, serviceDuration: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        toast({
          title: "Success",
          description: `${serviceTitle} added to your package!`,
        })
        resolve({ success: true, message: `${serviceTitle} added to your package!` })
      }, 1000)
    })
  }

  const scheduleConsultation = async (contactInfo: ContactInfo & {
    serviceType: string
    message?: string
    preferredDate?: string
  }) => {
    setIsSubmitting(true)
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
          toast({
            title: "Consultation Scheduled!",
            description: "We'll contact you within 24 hours to confirm your appointment.",
          })
          resolve({ success: true, message: "Consultation scheduled! We will contact you within 24 hours." })
        }, 1500)
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const buildCustomPackage = async (contactInfo: ContactInfo & {
    specialRequirements?: string
  }) => {
    setIsSubmitting(true)
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
          toast({
            title: "Package Request Submitted!",
            description: "Our care coordinator will contact you to finalize your plan.",
          })
          setSelectedServices([]) // Clear selection after successful submission
          resolve({ success: true, message: "Custom package request submitted! Our care coordinator will contact you to finalize your plan." })
        }, 1500)
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const speakWithCoordinator = async (contactInfo: ContactInfo & {
    reason: string
    urgency?: 'low' | 'medium' | 'high'
  }) => {
    setIsSubmitting(true)
    try {
      const urgencyMessage = contactInfo.urgency === 'high' ? 'within 1 hour' : 
                            contactInfo.urgency === 'medium' ? 'within 4 hours' : 'within 24 hours'
      
      return new Promise((resolve) => {
        setTimeout(() => {
          toast({
            title: "Request Submitted!",
            description: `A care coordinator will contact you ${urgencyMessage}.`,
          })
          resolve({ success: true, message: `Request submitted! A care coordinator will contact you ${urgencyMessage}.` })
        }, 1500)
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    // Data
    services: mockServices,
    selectedServices,
    isLoading: false,
    isSubmitting,
    
    // Computed values
    totalEstimate: calculateTotalEstimate(),
    
    // Actions
    addServiceToPackage,
    removeServiceFromPackage,
    addToPackage,
    scheduleConsultation,
    buildCustomPackage,
    speakWithCoordinator,
    
    // State setters
    setSelectedServices
  }
}

export function useServiceDetails(serviceId: string) {
  const service = mockServices.find(s => s.id === serviceId)
  
  return {
    data: service ? {
      ...service,
      availability: {
        nextAvailable: new Date(),
        slots: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM']
      },
      caregivers: [
        { id: '1', name: 'Sarah Johnson', rating: 4.9, specialties: ['Personal Care', 'Medication Management'] },
        { id: '2', name: 'Maria Rodriguez', rating: 4.8, specialties: ['Personal Care', 'Companionship'] },
      ]
    } : null,
    isLoading: false,
    error: null
  }
}
