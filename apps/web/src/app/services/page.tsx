import { ServicesHero } from '@/components/ui/services-hero'
import { ServicesGrid } from '@/components/ui/services-grid'

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20">
      <ServicesHero />
      <ServicesGrid />
    </div>
  )
}
