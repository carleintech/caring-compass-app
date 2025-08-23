'use client'

import { MarketingLayout } from '@/components/layout/page-layout'

export default function InsurancePage() {
  return (
    <MarketingLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Insurance & Payment Options</h1>
        <div className="prose max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Accepted Insurance Plans</h2>
            <p className="mb-4">We work with various insurance providers to help make care accessible. We accept:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Long-term Care Insurance</li>
              <li>Medicare Advantage Plans</li>
              <li>Veterans Benefits</li>
              <li>Private Insurance</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Payment Options</h2>
            <p className="mb-4">We offer flexible payment options including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Private Pay</li>
              <li>Credit Cards</li>
              <li>Monthly Payment Plans</li>
              <li>Insurance Direct Billing</li>
            </ul>
          </section>
        </div>
      </div>
    </MarketingLayout>
  )
}
