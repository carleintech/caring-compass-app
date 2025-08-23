'use client'

import { MarketingLayout } from '@/components/layout/page-layout'

export default function ResourcesPage() {
  return (
    <MarketingLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Care Resources</h1>
        <div className="prose max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Helpful Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Caregiver Resources</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Caregiver Support Groups</li>
                  <li>Respite Care Information</li>
                  <li>Stress Management Tips</li>
                  <li>Training Materials</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Health Information</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Disease Management Guides</li>
                  <li>Medication Management</li>
                  <li>Nutrition Resources</li>
                  <li>Exercise Tips</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Community Resources</h2>
            <p className="mb-4">Find local resources and support services in your area:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Senior Centers</li>
              <li>Support Groups</li>
              <li>Transportation Services</li>
              <li>Meal Delivery Programs</li>
            </ul>
          </section>
        </div>
      </div>
    </MarketingLayout>
  )
}
