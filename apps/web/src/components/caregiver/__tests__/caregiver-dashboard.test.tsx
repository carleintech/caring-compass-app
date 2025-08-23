// apps/web/src/app/(dashboard)/caregiver/__tests__/caregiver-dashboard.test.tsx
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { jest } from '@jest/globals'
import CaregiverDashboard from '../dashboard/page'

// Mock the tRPC client
jest.mock('@/lib/trpc', () => ({
  api: {
    caregivers: {
      getDashboard: {
        useQuery: jest.fn(() => ({
          data: {
            caregiver: {
              id: '1',
              firstName: 'Sarah',
              lastName: 'Wilson',
              rating: 4.8,
              employmentStatus: 'active'
            },
            upcomingShifts: [
              {
                id: '1',
                client: {
                  name: 'Margaret Johnson',
                  address: '123 Oceanfront Ave, Virginia Beach, VA'
                },
                date: '2025-01-20',
                startTime: '10:00',
                endTime: '14:00',
                duration: 4,
                status: 'scheduled'
              }
            ],
            metrics: {
              weeklyHours: 32,
              weeklyEarnings: 768.00,
              clientRating: 4.8,
              completedVisits: 156
            }
          },
          isLoading: false,
          error: null
        }))
      }
    }
  }
}))

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/caregiver/dashboard',
}))

describe('Caregiver Dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders caregiver dashboard with welcome message', async () => {
    render(<CaregiverDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText(/Welcome back, Sarah/)).toBeInTheDocument()
    })
  })

  it('displays upcoming shifts', async () => {
    render(<CaregiverDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('Margaret Johnson')).toBeInTheDocument()
      expect(screen.getByText('10:00 - 14:00')).toBeInTheDocument()
    })
  })

  it('shows key metrics correctly', async () => {
    render(<CaregiverDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('32h')).toBeInTheDocument() // Weekly hours
      expect(screen.getByText('$768')).toBeInTheDocument() // Weekly earnings
      expect(screen.getByText('4.8/5')).toBeInTheDocument() // Rating
    })
  })

  it('allows quick actions interaction', async () => {
    render(<CaregiverDashboard />)
    
    await waitFor(() => {
      const clockInButton = screen.getByText('Clock In')
      expect(clockInButton).toBeInTheDocument()
      
      fireEvent.click(clockInButton)
      // Add assertion for what should happen when clock in is clicked
    })
  })
})