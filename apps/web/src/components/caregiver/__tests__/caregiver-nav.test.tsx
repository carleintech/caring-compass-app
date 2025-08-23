// apps/web/src/components/caregiver/__tests__/caregiver-nav.test.tsx
import React from 'react'
import { render, screen } from '@testing-library/react'
import { CaregiverNav } from '../caregiver-nav'

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/caregiver/dashboard'
}))

describe('CaregiverNav', () => {
  it('renders all navigation items', () => {
    render(<CaregiverNav />)
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('My Shifts')).toBeInTheDocument()
    expect(screen.getByText('EVV Clock In/Out')).toBeInTheDocument()
    expect(screen.getByText('Availability')).toBeInTheDocument()
    expect(screen.getByText('Job Application')).toBeInTheDocument()
    expect(screen.getByText('Background Check')).toBeInTheDocument()
    expect(screen.getByText('Payroll & Earnings')).toBeInTheDocument()
    expect(screen.getByText('Training & Certification')).toBeInTheDocument()
  })

  it('shows notification badges when provided', () => {
    const notifications = {
      shifts: 3,
      applications: 1,
      training: 2,
      certifications: 1
    }
    
    render(<CaregiverNav notifications={notifications} />)
    
    expect(screen.getByText('3')).toBeInTheDocument() // Shifts badge
    expect(screen.getByText('1')).toBeInTheDocument() // Applications badge
  })

  it('highlights active navigation item', () => {
    render(<CaregiverNav />)
    
    const dashboardButton = screen.getByRole('button', { name: /Dashboard/ })
    expect(dashboardButton).toHaveClass('bg-primary')
  })
})

// Export test utilities
export const caregiverTestUtils = {
  mockShift,
  mockCaregiver: {
    id: '1',
    firstName: 'Sarah',
    lastName: 'Wilson',
    email: 'sarah.wilson@email.com',
    phone: '(757) 555-0123',
    rating: 4.8,
    employmentStatus: 'active'
  }
}