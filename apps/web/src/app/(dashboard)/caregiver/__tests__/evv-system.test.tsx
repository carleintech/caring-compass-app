import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import EVVSystem from '../evv/page'

// Mock geolocation
const mockGeolocation = {
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
  clearWatch: jest.fn()
}

Object.defineProperty(global.navigator, 'geolocation', {
  value: mockGeolocation,
  writable: true
})

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/caregiver/evv'
  }),
  usePathname: () => '/caregiver/evv'
}))

// Mock tRPC
jest.mock('@/lib/trpc', () => ({
  trpc: {
    visits: {
      getCurrentVisit: {
        useQuery: () => ({
          data: {
            id: '1',
            clientName: 'Margaret Smith',
            clientAddress: '123 Main St, Springfield, IL',
            scheduledStart: new Date(),
            scheduledEnd: new Date(Date.now() + 2 * 60 * 60 * 1000),
            status: 'scheduled',
            tasks: [
              { id: '1', name: 'Personal Care', completed: false },
              { id: '2', name: 'Medication Reminder', completed: false }
            ]
          },
          isLoading: false,
          error: null
        })
      },
      clockIn: {
        useMutation: () => ({
          mutate: jest.fn(),
          isLoading: false
        })
      },
      clockOut: {
        useMutation: () => ({
          mutate: jest.fn(),
          isLoading: false
        })
      }
    }
  }
}))

describe('EVVSystem', () => {
  beforeEach(() => {
    // Reset geolocation mock
    mockGeolocation.getCurrentPosition.mockClear()
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success({
        coords: {
          latitude: 39.7817,
          longitude: -89.6501,
          accuracy: 10
        }
      })
    })
  })

  it('renders EVV system header', () => {
    render(<EVVSystem />)
    
    expect(screen.getByText('Electronic Visit Verification')).toBeInTheDocument()
    expect(screen.getByText('Track your visits with GPS verification')).toBeInTheDocument()
  })

  it('displays current visit information', () => {
    render(<EVVSystem />)
    
    expect(screen.getByText('Current Visit')).toBeInTheDocument()
    expect(screen.getByText('Margaret Smith')).toBeInTheDocument()
    expect(screen.getByText('123 Main St, Springfield, IL')).toBeInTheDocument()
  })

  it('shows GPS location status', async () => {
    render(<EVVSystem />)
    
    await waitFor(() => {
      expect(screen.getByText(/GPS Status/i)).toBeInTheDocument()
    })
  })

  it('displays clock in/out buttons', () => {
    render(<EVVSystem />)
    
    expect(screen.getByText('Clock In')).toBeInTheDocument()
  })

  it('handles clock in with GPS verification', async () => {
    const user = userEvent.setup()
    render(<EVVSystem />)
    
    const clockInButton = screen.getByText('Clock In')
    await user.click(clockInButton)
    
    await waitFor(() => {
      expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled()
    })
  })

  it('shows task checklist', () => {
    render(<EVVSystem />)
    
    expect(screen.getByText('Visit Tasks')).toBeInTheDocument()
    expect(screen.getByText('Personal Care')).toBeInTheDocument()
    expect(screen.getByText('Medication Reminder')).toBeInTheDocument()
  })

  it('handles task completion', async () => {
    const user = userEvent.setup()
    render(<EVVSystem />)
    
    const taskCheckbox = screen.getAllByRole('checkbox')[0]
    await user.click(taskCheckbox)
    
    expect(taskCheckbox).toBeChecked()
  })

  it('displays visit timer', () => {
    render(<EVVSystem />)
    
    expect(screen.getByText(/Visit Duration/i)).toBeInTheDocument()
  })

  it('shows location verification status', async () => {
    render(<EVVSystem />)
    
    await waitFor(() => {
      expect(screen.getByText(/Location/i)).toBeInTheDocument()
    })
  })

  it('handles GPS permission denied', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
      error({
        code: 1,
        message: 'User denied the request for Geolocation.'
      })
    })

    render(<EVVSystem />)
    
    await waitFor(() => {
      expect(screen.getByText(/GPS access required/i)).toBeInTheDocument()
    })
  })

  it('displays visit notes section', () => {
    render(<EVVSystem />)
    
    expect(screen.getByText('Visit Notes')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('shows emergency contact information', () => {
    render(<EVVSystem />)
    
    expect(screen.getByText(/Emergency/i)).toBeInTheDocument()
  })

  it('handles clock out process', async () => {
    const user = userEvent.setup()
    
    // Mock that user is already clocked in
    jest.mocked(require('@/lib/trpc').trpc.visits.getCurrentVisit.useQuery).mockReturnValue({
      data: {
        id: '1',
        clientName: 'Margaret Smith',
        status: 'in_progress',
        clockedInAt: new Date(Date.now() - 60 * 60 * 1000),
        tasks: []
      },
      isLoading: false,
      error: null
    })

    render(<EVVSystem />)
    
    const clockOutButton = screen.getByText('Clock Out')
    await user.click(clockOutButton)
    
    await waitFor(() => {
      expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled()
    })
  })

  it('validates required tasks before clock out', async () => {
    const user = userEvent.setup()
    render(<EVVSystem />)
    
    // Try to clock out without completing required tasks
    const clockOutButton = screen.getByText('Clock Out')
    await user.click(clockOutButton)
    
    // Should show validation message
    expect(screen.getByText(/complete all required tasks/i)).toBeInTheDocument()
  })
})
