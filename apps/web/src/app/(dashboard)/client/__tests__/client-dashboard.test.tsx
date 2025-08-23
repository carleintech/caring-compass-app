// apps/web/src/app/(dashboard)/client/__tests__/client-dashboard.test.tsx
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { jest } from '@jest/globals'
import ClientDashboard from '../dashboard/page'

// Mock the tRPC client
jest.mock('@/lib/trpc', () => ({
  api: {
    clients: {
      getDashboard: {
        useQuery: jest.fn(() => ({
          data: {
            client: {
              id: '1',
              firstName: 'Margaret',
              lastName: 'Johnson',
              careStatus: 'active'
            },
            upcomingVisits: [
              {
                id: '1',
                date: '2025-01-20T10:00:00Z',
                timeSlot: '10:00 AM - 2:00 PM',
                duration: 4,
                status: 'scheduled',
                caregiver: {
                  id: '1',
                  name: 'Sarah Wilson',
                  rating: 4.8,
                  specialties: ['Personal Care', 'Medication Reminders']
                },
                tasks: ['Bathing assistance', 'Meal preparation', 'Light housekeeping']
              }
            ],
            recentVisits: [],
            careTasks: [
              {
                id: '1',
                name: 'Daily medication reminder',
                category: 'medication',
                frequency: 'daily',
                completedThisWeek: 5,
                targetPerWeek: 7,
                status: 'on-track'
              }
            ],
            metrics: {
              totalVisits: 45,
              hoursThisMonth: 68,
              satisfactionScore: 4.9,
              upcomingAppointments: 3
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
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/client/dashboard',
}))

describe('Client Dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders client dashboard with welcome message', async () => {
    render(<ClientDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText(/Welcome back, Margaret/)).toBeInTheDocument()
    })
  })

  it('displays upcoming visits', async () => {
    render(<ClientDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('Sarah Wilson')).toBeInTheDocument()
      expect(screen.getByText('10:00 AM - 2:00 PM')).toBeInTheDocument()
      expect(screen.getByText('Bathing assistance')).toBeInTheDocument()
    })
  })

  it('shows care task progress', async () => {
    render(<ClientDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('Daily medication reminder')).toBeInTheDocument()
      expect(screen.getByText('5 of 7 this week')).toBeInTheDocument()
    })
  })

  it('displays metrics correctly', async () => {
    render(<ClientDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('45')).toBeInTheDocument() // Total visits
      expect(screen.getByText('68h')).toBeInTheDocument() // Hours this month
      expect(screen.getByText('4.9/5')).toBeInTheDocument() // Satisfaction
      expect(screen.getByText('3')).toBeInTheDocument() // Upcoming appointments
    })
  })

  it('allows quick actions interaction', async () => {
    render(<ClientDashboard />)
    
    await waitFor(() => {
      const messageButton = screen.getByText('Send Message')
      expect(messageButton).toBeInTheDocument()
      
      fireEvent.click(messageButton)
      // Add assertion for what should happen when message button is clicked
    })
  })
})