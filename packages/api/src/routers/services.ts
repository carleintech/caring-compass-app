import { z } from 'zod'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc/trpc'
import { getPrismaClient } from '@caring-compass/database'

const prisma = getPrismaClient()

// Service input schemas
const ServiceItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  price: z.string(),
  duration: z.string(),
  icon: z.string(),
})

const ContactInfoSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  preferredContactTime: z.string().optional(),
})

export const servicesRouter = createTRPCRouter({
  // Get all available personal care services
  getPersonalCareServices: publicProcedure
    .query(async () => {
      // Return structured service data
      return [
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
    }),

  // Add service to user's package
  addToPackage: protectedProcedure
    .input(z.object({
      serviceId: z.string(),
      serviceTitle: z.string(),
      servicePrice: z.string(),
      serviceDuration: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      // In a real implementation, this would save to user's cart/package
      // For now, we'll create a care request
      const careRequest = await prisma.careRequest.create({
        data: {
          name: ctx.user?.name || 'User',
          email: ctx.user?.email || 'user@example.com',
          phone: '', // Will be collected later
          careType: input.serviceTitle,
          startDate: new Date(),
          message: `Added ${input.serviceTitle} to package. Price: ${input.servicePrice}, Duration: ${input.serviceDuration}`,
          status: 'PENDING',
          updatedAt: new Date(),
        }
      })

      return {
        success: true,
        message: 'Service added to your package!',
        careRequestId: careRequest.id
      }
    }),

  // Schedule consultation
  scheduleConsultation: publicProcedure
    .input(ContactInfoSchema.extend({
      serviceType: z.string(),
      message: z.string().optional(),
      preferredDate: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const careRequest = await prisma.careRequest.create({
        data: {
          name: input.name,
          email: input.email,
          phone: input.phone,
          careType: 'Consultation',
          startDate: input.preferredDate ? new Date(input.preferredDate) : new Date(),
          message: `Consultation request for ${input.serviceType}. ${input.message || ''}. Preferred contact time: ${input.preferredContactTime || 'Any time'}`,
          status: 'PENDING',
          updatedAt: new Date(),
        }
      })

      return {
        success: true,
        message: 'Consultation scheduled! We will contact you within 24 hours.',
        careRequestId: careRequest.id
      }
    }),

  // Build custom package
  buildCustomPackage: publicProcedure
    .input(ContactInfoSchema.extend({
      selectedServices: z.array(ServiceItemSchema),
      totalEstimate: z.string(),
      specialRequirements: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const servicesList = input.selectedServices.map(s => s.title).join(', ')
      
      const careRequest = await prisma.careRequest.create({
        data: {
          name: input.name,
          email: input.email,
          phone: input.phone,
          careType: 'Custom Package',
          startDate: new Date(),
          message: `Custom package request with services: ${servicesList}. Total estimate: ${input.totalEstimate}. Special requirements: ${input.specialRequirements || 'None'}`,
          status: 'PENDING',
          updatedAt: new Date(),
        }
      })

      return {
        success: true,
        message: 'Custom package request submitted! Our care coordinator will contact you to finalize your plan.',
        careRequestId: careRequest.id
      }
    }),

  // Speak with coordinator
  speakWithCoordinator: publicProcedure
    .input(ContactInfoSchema.extend({
      reason: z.string(),
      urgency: z.enum(['low', 'medium', 'high']).default('medium'),
    }))
    .mutation(async ({ input }) => {
      const careRequest = await prisma.careRequest.create({
        data: {
          name: input.name,
          email: input.email,
          phone: input.phone,
          careType: 'Coordinator Contact',
          startDate: new Date(),
          message: `Coordinator contact request. Reason: ${input.reason}. Urgency: ${input.urgency}. Preferred contact time: ${input.preferredContactTime || 'Any time'}`,
          status: 'PENDING',
          updatedAt: new Date(),
        }
      })

      return {
        success: true,
        message: 'Request submitted! A care coordinator will contact you within 2-4 hours.',
        careRequestId: careRequest.id
      }
    }),

  // Get service details
  getServiceDetails: publicProcedure
    .input(z.object({
      serviceId: z.string(),
    }))
    .query(async ({ input }) => {
      // Static service data with detailed information
      const servicesData = [
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

      const service = servicesData.find((s) => s.id === input.serviceId)
      
      if (!service) {
        throw new Error('Service not found')
      }

      return {
        ...service,
        availability: {
          nextAvailable: new Date(),
          slots: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM']
        },
        caregivers: [
          { id: '1', name: 'Sarah Johnson', rating: 4.9, specialties: ['Personal Care', 'Medication Management'] },
          { id: '2', name: 'Maria Rodriguez', rating: 4.8, specialties: ['Personal Care', 'Companionship'] },
        ]
      }
    }),

  availabilityCheck: publicProcedure
    .input(z.object({
      date: z.string(),
    }))
    .query(async ({ input }: { input: { date: string } }) => {
      // TODO: Integrate with actual availability database
      // For now, return mock data
      return {
        slots: [
          '9:00 AM',
          '10:00 AM',
          '11:00 AM',
          '2:00 PM',
          '3:00 PM',
          '4:00 PM'
        ]
      }
    }),
})
