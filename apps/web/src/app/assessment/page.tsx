'use client'

import { MarketingLayout } from '@/components/layout/page-layout'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AssessmentPage() {
  return (
    <MarketingLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Care Assessment</h1>
        <div className="prose max-w-none">
          <p className="text-lg mb-4">
            Our comprehensive care assessment helps us understand your unique needs and create a personalized care plan. We evaluate various aspects of health, lifestyle, and preferences to ensure we provide the most appropriate care services.
          </p>
          
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Assessment Process</h2>
            <ol className="list-decimal pl-6 space-y-4">
              <li>Initial consultation to understand your needs</li>
              <li>Home environment evaluation</li>
              <li>Health and medical history review</li>
              <li>Daily routine and lifestyle assessment</li>
              <li>Care plan development</li>
              <li>Regular plan reviews and adjustments</li>
            </ol>
          </div>

          <div className="mt-8">
            <Link href="/request-care">
              <Button size="lg">Schedule an Assessment</Button>
            </Link>
          </div>
        </div>
      </div>
    </MarketingLayout>
  )
}
