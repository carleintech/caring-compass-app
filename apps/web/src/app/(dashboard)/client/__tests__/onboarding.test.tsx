// apps/web/src/app/(dashboard)/client/__tests__/onboarding.test.tsx
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { jest } from '@jest/globals'
import OnboardingPage from '../onboarding/page'

// Mock tRPC
jest.mock('@/lib/trpc', () => ({
  api: {
    clients: {
      completeOnboarding: {
        useMutation: jest.fn(() => ({
          mutate: jest.fn(),
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
}))

describe('Client Onboarding', () => {
  it('renders personal information step', () => {
    render(<OnboardingPage />)
    
    expect(screen.getByText('Personal Information')).toBeInTheDocument()
    expect(screen.getByLabelText('First Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument()
  })

  it('allows navigation between steps', async () => {
    render(<OnboardingPage />)
    
    // Fill in required fields
    fireEvent.change(screen.getByLabelText('First Name'), {
      target: { value: 'John' }
    })
    fireEvent.change(screen.getByLabelText('Last Name'), {
      target: { value: 'Doe' }
    })
    
    // Navigate to next step
    const nextButton = screen.getByText('Next Step')
    fireEvent.click(nextButton)
    
    await waitFor(() => {
      expect(screen.getByText('Care Needs Assessment')).toBeInTheDocument()
    })
  })

  it('validates required fields', async () => {
    render(<OnboardingPage />)
    
    const nextButton = screen.getByText('Next Step')
    fireEvent.click(nextButton)
    
    await waitFor(() => {
      expect(screen.getByText('First name is required')).toBeInTheDocument()
    })
  })

  it('shows progress indicator', () => {
    render(<OnboardingPage />)
    
    expect(screen.getByText('Step 1 of 5')).toBeInTheDocument()
  })
})