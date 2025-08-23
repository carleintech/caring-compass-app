// apps/web/src/app/(dashboard)/caregiver/__tests__/shifts.test.tsx
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { jest } from '@jest/globals'
import ShiftsPage from '../shifts/page'

// Mock tRPC
jest.mock('@/lib/trpc', () => ({
  api: {
    caregivers: {
      getShifts: {
        useQuery: jest.fn(() => ({
          data: {
            shifts: [
              {
                id: '1',
                status: 'scheduled',
                client: { name: 'Margaret Johnson' },
                date: '2025-01-20',
                startTime: '10:00',
                endTime: '14:00',
                duration: 4,
                hourlyRate: 24.00,
                totalPay: 96.00
              }
            ],
            availableShifts: []
          },
          isLoading: false
        }))
      }
    }
  }
}))

describe('Shifts Management', () => {
  it('renders shifts interface with tabs', () => {
    render(<ShiftsPage />)
    
    expect(screen.getByText('Shift Management')).toBeInTheDocument()
    expect(screen.getByText('My Shifts')).toBeInTheDocument()
    expect(screen.getByText('Available Shifts')).toBeInTheDocument()
  })

  it('displays assigned shifts correctly', async () => {
    render(<ShiftsPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Margaret Johnson')).toBeInTheDocument()
      expect(screen.getByText('$96')).toBeInTheDocument()
    })
  })

  it('allows filtering shifts by status', async () => {
    render(<ShiftsPage />)
    
    const filterSelect = screen.getByDisplayValue('All Shifts')
    fireEvent.click(filterSelect)
    
    await waitFor(() => {
      expect(screen.getByText('Scheduled')).toBeInTheDocument()
    })
  })
})