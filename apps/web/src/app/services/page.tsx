import { MarketingLayout } from '@/components/layout/page-layout'
import Link from 'next/link'
import { 
  Heart, 
  Users, 
  Clock, 
  Brain, 
  Shield, 
  Star, 
  ArrowRight, 
  CheckCircle,
  ChefHat,
  Car,
  Home,
  Calendar,
  Activity,
  BookOpen,
  Puzzle
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { FeatureCard } from '@/components/ui/feature-card'
import { CTASection } from '@/components/ui/cta-section'

const services = [
  {
    icon: Heart,
    title: 'Personal Care',
    description: 'Comprehensive assistance with daily living activities',
    features: [
      'Bathing and personal hygiene assistance',
      'Dressing and grooming support',
      'Mobility assistance and transfer support',
      'Medication reminders and monitoring',
      'Toileting and incontinence care',
      'Feeding and special diet assistance'
    ],
    link: '/services/personal-care'
  },
  {
    icon: Users,
    title: 'Companionship',
    description: 'Social interaction and emotional support services',
    features: [
      'Friendly conversation and companionship',
      'Social activities and games',
      'Hobbies and crafts assistance',
      'Accompanied walks and exercise',
      'Reading and mail assistance',
      'Event and appointment accompaniment'
    ],
    link: '/services/companionship'
  },
  {
    icon: ChefHat,
    title: 'Meal Preparation',
    description: 'Nutritious meal planning and preparation',
    features: [
      'Menu planning and grocery shopping',
      'Special diet accommodation',
      'Meal preparation and cooking',
      'Food storage and organization',
      'Kitchen cleaning and maintenance',
      'Hydration monitoring'
    ],
    link: '/services/meal-preparation'
  },
  {
    icon: Home,
    title: 'Household Support',
    description: 'Maintaining a clean and safe living environment',
    features: [
      'Light housekeeping and cleaning',
      'Laundry and linen changing',
      'Organization and decluttering',
      'Pet care assistance',
      'Plant care and maintenance',
      'Home safety checks'
    ],
    link: '/services/household'
  },
  {
    icon: Calendar,
    title: 'Specialized Care',
    description: 'Tailored care for specific health conditions',
    features: [
      'Dementia and Alzheimer\'s care',
      'Post-surgery recovery support',
      'Chronic illness management',
      'Diabetes care',
      'Stroke recovery assistance',
      'Pain management support'
    ],
    link: '/services/specialized'
  },
  {
    icon: Car,
    title: 'Transportation',
    description: 'Safe and reliable transportation services',
    features: [
      'Medical appointments',
      'Shopping trips',
      'Social events',
      'Religious services',
      'Family visits',
      'Errands assistance'
    ],
    link: '/services/transportation'
  }
]

const additionalServices = [
  {
    icon: Activity,
    title: 'Health Monitoring',
    description: 'Regular monitoring of vital signs and health conditions with detailed reporting to family and healthcare providers.'
  },
  {
    icon: BookOpen,
    title: 'Memory Care',
    description: 'Specialized support for individuals with memory-related conditions, including cognitive stimulation activities.'
  },
  {
    icon: Puzzle,
    title: 'Respite Care',
    description: 'Temporary relief for primary caregivers, providing them with much-needed breaks while ensuring continuous care.'
  }
]

export default function ServicesPage() {
  return (
    <MarketingLayout>
      <PageHeader
        title="Our Care Services"
        description="We provide comprehensive care services tailored to meet your unique needs, ensuring comfort and independence at home."
      />

      {/* Main Services */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Link 
                key={service.title} 
                href={service.link}
                className="group transition-transform hover:-translate-y-1"
              >
                <FeatureCard
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                  className="h-full"
                >
                  <ul className="mt-4 space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center text-sm text-muted-foreground">
                        <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </FeatureCard>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-[58rem] text-center mb-12">
            <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-4xl">
              Additional Support Services
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Complementary services to enhance your care experience
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {additionalServices.map((service) => (
              <FeatureCard
                key={service.title}
                icon={service.icon}
                title={service.title}
                description={service.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-[58rem] text-center mb-12">
            <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-4xl">
              Why Choose Our Services?
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Shield}
              title="Licensed & Insured"
              description="Our caregivers are fully licensed, bonded, and insured for your peace of mind."
            />
            <FeatureCard
              icon={Star}
              title="Experienced Staff"
              description="Our team consists of experienced professionals with extensive training in senior care."
            />
            <FeatureCard
              icon={Brain}
              title="Personalized Care"
              description="We develop customized care plans tailored to your specific needs and preferences."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="Ready to Get Started?"
        description="Contact us today to learn more about our services and how we can help you or your loved ones."
        primaryAction={{
          label: "Schedule a Free Consultation",
          href: "/request-care"
        }}
        secondaryAction={{
          label: "View Pricing",
          href: "/pricing"
        }}
      />
    </MarketingLayout>
  )
}
