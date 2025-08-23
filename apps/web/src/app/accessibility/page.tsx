'use client'

import { MarketingLayout } from '@/components/layout/page-layout'

export default function AccessibilityPage() {
  return (
    <MarketingLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Accessibility Statement</h1>
        <div className="prose max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Our Commitment to Accessibility</h2>
            <p className="mb-4">
              Caring Compass is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Conformance Status</h2>
            <p className="mb-4">
              The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA. Our website is partially conformant with WCAG 2.1 level AA.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Accessibility Features</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Alt text for all images</li>
              <li>Proper heading structure</li>
              <li>Keyboard navigation support</li>
              <li>Color contrast compliance</li>
              <li>Text resizing without loss of functionality</li>
              <li>ARIA labels where needed</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="mb-4">
              If you encounter any accessibility barriers on our website, please contact us. We welcome your feedback and suggestions for improvement.
            </p>
          </section>
        </div>
      </div>
    </MarketingLayout>
  )
}
