'use client'

import { useState } from 'react'
import { ServicePageLayout } from '@/components/layout/service-page-layout'
import { ServiceHero } from '@/components/ui/service-hero'
import { ServiceFeatures } from '@/components/ui/service-features'
import { ServiceTestimonials } from '@/components/ui/service-testimonials'
import { CustomPackageModal } from '@/components/modals/custom-package-modal'

const personalCareFeatures = [
  {
    title: "Bathing & Hygiene Assistance",
    description: "Gentle, respectful assistance with bathing, showering, and personal hygiene to maintain dignity and cleanliness.",
    icon: "Bath",
    details: [
      "Safe transfer in and out of tub/shower",
      "Assistance with washing and shampooing",
      "Help with dental care and oral hygiene",
      "Nail care and grooming assistance",
      "Respectful assistance maintaining privacy",
      "Special attention to skin care needs"
    ],
    price: "$28",
    duration: "30-60 min",
    popular: true
  },
  {
    title: "Dressing & Grooming",
    description: "Compassionate help with selecting appropriate clothing and maintaining personal appearance.",
    icon: "Shirt",
    details: [
      "Assistance choosing weather-appropriate clothing",
      "Help with dressing and undressing",
      "Hair care and styling assistance",
      "Makeup application if desired",
      "Jewelry and accessory assistance",
      "Seasonal wardrobe organization"
    ],
    price: "$25",
    duration: "20-40 min"
  },
  {
    title: "Medication Management",
    description: "Professional oversight to ensure medications are taken safely and on schedule.",
    icon: "AlertCircle",
    details: [
      "Medication reminders and scheduling",
      "Pill sorting and organization",
      "Monitoring for side effects",
      "Communication with healthcare providers",
      "Prescription pickup coordination",
      "Emergency medication protocols"
    ],
    price: "$30",
    duration: "15-30 min",
    popular: true
  },
  {
    title: "Meal Assistance",
    description: "Support with eating, feeding, and maintaining proper nutrition throughout the day.",
    icon: "Utensils",
    details: [
      "Assistance with eating and feeding",
      "Help with food preparation",
      "Dietary restriction monitoring",
      "Hydration encouragement",
      "Meal planning consultation",
      "Special diet accommodation"
    ],
    price: "$26",
    duration: "45-90 min"
  },
  {
    title: "Mobility Support",
    description: "Safe assistance with walking, transfers, and movement to maintain independence.",
    icon: "UserCheck",
    details: [
      "Walking assistance and stability support",
      "Safe transfer techniques",
      "Exercise encouragement",
      "Fall prevention strategies",
      "Assistive device support",
      "Physical therapy coordination"
    ],
    price: "$27",
    duration: "30-60 min"
  },
  {
    title: "Health Monitoring",
    description: "Regular observation and documentation of health status and vital signs.",
    icon: "Timer",
    details: [
      "Vital signs monitoring",
      "Symptom observation and reporting",
      "Weight and health tracking",
      "Appointment coordination",
      "Health diary maintenance",
      "Emergency response protocols"
    ],
    price: "$32",
    duration: "20-30 min"
  }
]

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "Tallahassee, FL",
    text: "The personal care services have been absolutely wonderful. Maria is so gentle and respectful with my mother. She treats her with such dignity and care.",
    rating: 5,
    relationship: "Daughter of care recipient"
  },
  {
    id: 2,
    name: "Robert Chen",
    location: "Gainesville, FL",
    text: "After my father's stroke, we needed someone reliable for his daily care. The team has exceeded our expectations in every way. Professional and compassionate.",
    rating: 5,
    relationship: "Son of care recipient"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    location: "Tampa, FL",
    text: "I was hesitant about having someone help with personal care, but the caregiver makes me feel so comfortable. She's become like family to us.",
    rating: 5,
    relationship: "Care recipient"
  },
  {
    id: 4,
    name: "Michael Thompson",
    location: "Orlando, FL",
    text: "The medication management has been a game-changer. We no longer worry about missed doses or confusion. Everything is organized and professional.",
    rating: 5,
    relationship: "Husband of care recipient"
  },
  {
    id: 5,
    name: "Linda Davis",
    location: "Jacksonville, FL",
    text: "The bathing assistance has restored my mother's independence. She feels confident and clean every day. The caregivers are angels.",
    rating: 5,
    relationship: "Daughter of care recipient"
  },
  {
    id: 6,
    name: "James Wilson",
    location: "Miami, FL",
    text: "From grooming to mobility support, every aspect of care is handled with expertise. My wife looks forward to her caregiver's visits every day.",
    rating: 5,
    relationship: "Husband of care recipient"
  }
]

export default function PersonalCarePage() {
  // Modal state
  const [isCustomPackageModalOpen, setIsCustomPackageModalOpen] = useState(false)

  return (
    <>
      <ServicePageLayout onBuildPackageClick={() => setIsCustomPackageModalOpen(true)}>
        <ServiceHero
          title="Personal Care"
          subtitle="Compassionate Daily Living Assistance"
          description="Our certified caregivers provide gentle, respectful assistance with personal care activities, helping your loved ones maintain their dignity and independence while ensuring their safety and comfort."
          icon="Heart"
          pricing="$25/hour"
          features={[
            "Certified Caregivers",
            "Flexible Scheduling",
            "Personalized Care Plans",
            "Family Communication"
          ]}
          badge="Most Popular Service"
        />

        <ServiceFeatures
          title="Comprehensive Personal Care Services"
          subtitle="Professional assistance tailored to your unique needs and preferences"
          features={personalCareFeatures}
        />

        <ServiceTestimonials
          testimonials={testimonials}
          title="Trusted by Families Across Florida"
          subtitle="See why families choose our personal care services for their loved ones"
        />
      </ServicePageLayout>

      <CustomPackageModal 
        isOpen={isCustomPackageModalOpen}
        onClose={() => setIsCustomPackageModalOpen(false)}
      />
    </>
  )
}