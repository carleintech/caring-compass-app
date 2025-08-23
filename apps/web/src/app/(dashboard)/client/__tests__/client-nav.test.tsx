// apps/web/src/components/client/__tests__/client-nav.test.tsx
import React from 'react'
import { render, screen } from '@testing-library/react'
import { ClientNav } from '../client-nav'

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/client/dashboard'
}))

describe('ClientNav', () => {
  it('renders all navigation items', () => {
    render(<ClientNav />)
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Care Plan')).toBeInTheDocument()
    expect(screen.getByText('Schedule')).toBeInTheDocument()
    expect(screen.getByText('Billing')).toBeInTheDocument()
    expect(screen.getByText('Messages')).toBeInTheDocument()
    expect(screen.getByText('Documents')).toBeInTheDocument()
    expect(screen.getByText('Family Portal')).toBeInTheDocument()
    expect(screen.getByText('Profile')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  it('shows notification badges', () => {
    const notifications = {
      messages: 3,
      appointments: 1,
      billing: 2
    }
    
    render(<ClientNav notifications={notifications} />)
    
    expect(screen.getByText('3')).toBeInTheDocument() // Messages badge
    expect(screen.getByText('1')).toBeInTheDocument() // Appointments badge
    expect(screen.getByText('2')).toBeInTheDocument() // Billing badge
  })

  it('highlights active navigation item', () => {
    render(<ClientNav />)
    
    const dashboardButton = screen.getByRole('button', { name: /Dashboard/ })
    expect(dashboardButton).toHaveClass('bg-primary')
  })
})

// Export test utilities
export const clientTestUtils = {
  mockVisit,
  mockClient: {
    id: '1',
    firstName: 'Margaret',
    lastName: 'Johnson',
    email: 'margaret.johnson@email.com',
    phone: '(757) 555-0123'
  }
}