// apps/web/src/app/(dashboard)/caregiver/__tests__/evv-system.test.tsx
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { jest } from '@jest/globals'
import EVVPage from '../evv/page'

// Mock geolocation
const mockGeolocation = {
  getCurrentPosition: jest.fn((success) => {
    success({
      coords: {
        latitude: 36.8508,
        longitude: -75.9776,
        accuracy: 12
      }
    })
  })
}

// @ts-ignore
global.navigator.geolocation = mockGeolocation

describe('EVV System', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders EVV interface with current visit info', () => {
    render(<EVVPage />)
    
    expect(screen.getByText('Electronic Visit Verification')).toBeInTheDocument()
    expect(screen.getByText('Margaret Johnson')).toBeInTheDocument()
  })

  it('shows GPS location verification', () => {
    render(<EVVPage />)
    
    expect(screen.getByText('Location Verification')).toBeInTheDocument()
    expect(screen.getByText(/Distance to client/)).toBeInTheDocument()
  })

  it('displays care tasks checklist', () => {
    render(<EVVPage />)
    
    expect(screen.getByText('Care Tasks')).toBeInTheDocument()
    expect(screen.getByText('Personal hygiene assistance')).toBeInTheDocument()
  })

  it('allows clock in when at location', async () => {
    render(<EVVPage />)
    
    await waitFor(() => {
      const clockInButton = screen.getByText('Clock In')
      expect(clockInButton).toBeInTheDocument()
      expect(clockInButton).not.toBeDisabled()
    })
  })

  it('prevents clock in when not at location', async () => {
    // Mock being far from location
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success({
        coords: {
          latitude: 36.0000, // Far from client location
          longitude: -76.0000,
          accuracy: 12
        }
      })
    })

    render(<EVVPage />)
    
    await waitFor(() => {
      const clockInButton = screen.getByText('Clock In')
      expect(clockInButton).toBeDisabled()
    })
  })
})

// apps/web/src/app/(dashboard)/caregiver/__tests__/job-application.test.tsx
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { jest } from '@jest/globals'
import JobApplicationPage from '../application/page'

describe('Job Application', () => {
  it('renders application form with step indicator', () => {
    render(<JobApplicationPage />)
    
    expect(screen.getByText('Caregiver Application')).toBeInTheDocument()
    expect(screen.getByText('Step 1 of 6')).toBeInTheDocument()
    expect(screen.getByText('Personal Information')).toBeInTheDocument()
  })

  it('shows validation errors for required fields', async () => {
    render(<JobApplicationPage />)
    
    const nextButton = screen.getByText('Next')
    fireEvent.click(nextButton)
    
    await waitFor(() => {
      expect(screen.getByText('Incomplete Information')).toBeInTheDocument()
    })
  })

  it('allows navigation between steps when valid', async () => {
    render(<JobApplicationPage />)
    
    // Fill in required fields
    fireEvent.change(screen.getByLabelText(/First Name/), {
      target: { value: 'John' }
    })
    fireEvent.change(screen.getByLabelText(/Last Name/), {
      target: { value: 'Doe' }
    })
    fireEvent.change(screen.getByLabelText(/Email/), {
      target: { value: 'john.doe@email.com' }
    })
    fireEvent.change(screen.getByLabelText(/Phone/), {
      target: { value: '(757) 555-0123' }
    })
    
    const nextButton = screen.getByText('Next')
    fireEvent.click(nextButton)
    
    await waitFor(() => {
      expect(screen.getByText('Experience & Skills')).toBeInTheDocument()
    })
  })

  it('tracks application progress correctly', () => {
    render(<JobApplicationPage />)
    
    expect(screen.getByText('0% Complete')).toBeInTheDocument()
  })
})