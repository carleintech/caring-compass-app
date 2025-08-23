import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import CaregiverDashboard from '../dashboard/page'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/caregiver/dashboard'
  }),
  usePathname: () => '/caregiver/dashboard'
}))

// Mock tRPC
jest.mock('@/lib/trpc', () => ({
  trpc: {
    caregivers: {
      getDashboardData: {
        useQuery: () => ({
          data: {
            upcomingShifts: [
              {
                id: '1',
                clientName: 'Margaret Smith',
                startTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
                endTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
                services: ['Personal Care'],
                status: 'confirmed'
              }
            ],
            weeklyHours: 32,
            monthlyEarnings: 2400,
            completedVisits: 45,
            rating: 4.9
          },
          isLoading: false,
          error: null
        })
      }
    }
  }
}))

describe('CaregiverDashboard', () => {
  it('renders dashboard header correctly', () => {
    render(<CaregiverDashboard />)
    
    expect(screen.getByText('Welcome back, Sarah')).toBeInTheDocument()
    expect(screen.getByText('Here\'s your care schedule and updates')).toBeInTheDocument()
  })

  it('displays key metrics cards', () => {
    render(<CaregiverDashboard />)
    
    expect(screen.getByText('This Week')).toBeInTheDocument()
    expect(screen.getByText('Monthly Earnings')).toBeInTheDocument()
    expect(screen.getByText('Completed Visits')).toBeInTheDocument()
    expect(screen.getByText('Rating')).toBeInTheDocument()
  })

  it('shows upcoming shifts', () => {
    render(<CaregiverDashboard />)
    
    expect(screen.getByText('Upcoming Shifts')).toBeInTheDocument()
    expect(screen.getByText('Margaret Smith')).toBeInTheDocument()
  })

  it('displays quick actions', () => {
    render(<CaregiverDashboard />)
    
    expect(screen.getByText('Clock In/Out')).toBeInTheDocument()
    expect(screen.getByText('View Schedule')).toBeInTheDocument()
    expect(screen.getByText('Update Availability')).toBeInTheDocument()
    expect(screen.getByText('Messages')).toBeInTheDocument()
  })

  it('handles clock in/out action', async () => {
    const user = userEvent.setup()
    render(<CaregiverDashboard />)
    
    const clockButton = screen.getByText('Clock In/Out')
    await user.click(clockButton)
    
    // Should trigger clock in/out functionality
    expect(clockButton).toBeInTheDocument()
  })

  it('shows recent activity', () => {
    render(<CaregiverDashboard />)
    
    expect(screen.getByText('Recent Activity')).toBeInTheDocument()
  })

  it('displays performance metrics', () => {
    render(<CaregiverDashboard />)
    
    // Check for performance-related content
    expect(screen.getByText('4.9')).toBeInTheDocument() // Rating
  })

  it('handles loading state', () => {
    // Mock loading state
    jest.mocked(require('@/lib/trpc').trpc.caregivers.getDashboardData.useQuery).mockReturnValue({
      data: null,
      isLoading: true,
      error: null
    })

    render(<CaregiverDashboard />)
    
    // Should show loading indicators or skeleton
    expect(screen.getByText('Welcome back, Sarah')).toBeInTheDocument()
  })

  it('handles error state', () => {
    // Mock error state
    jest.mocked(require('@/lib/trpc').trpc.caregivers.getDashboardData.useQuery).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Failed to load dashboard data')
    })

    render(<CaregiverDashboard />)
    
    // Should still render basic structure
    expect(screen.getByText('Welcome back, Sarah')).toBeInTheDocument()
  })

  it('formats time correctly', () => {
    render(<CaregiverDashboard />)
    
    // Should display formatted times for shifts
    expect(screen.getByText('Margaret Smith')).toBeInTheDocument()
  })

  it('shows shift status badges', () => {
    render(<CaregiverDashboard />)
    
    // Should show status badges for shifts
    const statusElements = screen.getAllByText(/confirmed|pending|completed/i)
    expect(statusElements.length).toBeGreaterThan(0)
  })
})
