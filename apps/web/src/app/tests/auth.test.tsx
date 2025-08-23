import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LoginPage from '@/app/(auth)/login/page'
import RegisterPage from '@/app/(auth)/register/page'

// Mock the tRPC hook
const mockMutate = jest.fn()
const mockLoginMutation = {
  mutate: mockMutate,
  isLoading: false,
  error: null,
}

jest.mock('@/lib/trpc', () => ({
  trpc: {
    auth: {
      login: {
        useMutation: jest.fn(() => mockLoginMutation),
      },
      registerCaregiver: {
        useMutation: jest.fn(() => mockLoginMutation),
      },
    },
  },
}))

describe('Authentication Pages', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('LoginPage', () => {
    it('renders login form correctly', () => {
      render(<LoginPage />)
      
      expect(screen.getByText('Sign In')).toBeInTheDocument()
      expect(screen.getByLabelText('Email')).toBeInTheDocument()
      expect(screen.getByLabelText('Password')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument()
    })

    it('shows validation error for empty fields', async () => {
      render(<LoginPage />)
      
      const submitButton = screen.getByRole('button', { name: 'Sign In' })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Please fill in all fields')).toBeInTheDocument()
      })
    })

    it('toggles password visibility', () => {
      render(<LoginPage />)
      
      const passwordInput = screen.getByLabelText('Password')
      const toggleButton = screen.getByRole('button', { name: '' }) // Eye icon button
      
      expect(passwordInput).toHaveAttribute('type', 'password')
      
      fireEvent.click(toggleButton)
      expect(passwordInput).toHaveAttribute('type', 'text')
      
      fireEvent.click(toggleButton)
      expect(passwordInput).toHaveAttribute('type', 'password')
    })

    it('submits form with valid data', async () => {
      render(<LoginPage />)
      
      const emailInput = screen.getByLabelText('Email')
      const passwordInput = screen.getByLabelText('Password')
      const submitButton = screen.getByRole('button', { name: 'Sign In' })
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        })
      })
    })

    it('displays forgot password link', () => {
      render(<LoginPage />)
      
      const forgotPasswordLink = screen.getByText('Forgot your password?')
      expect(forgotPasswordLink).toBeInTheDocument()
      expect(forgotPasswordLink.closest('a')).toHaveAttribute('href', '/forgot-password')
    })

    it('displays register link', () => {
      render(<LoginPage />)
      
      const registerLink = screen.getByText('Contact your coordinator')
      expect(registerLink).toBeInTheDocument()
      expect(registerLink.closest('a')).toHaveAttribute('href', '/register')
    })
  })

  describe('RegisterPage', () => {
    it('renders registration form correctly', () => {
      render(<RegisterPage />)
      
      expect(screen.getByText('Join Our Caregiving Team')).toBeInTheDocument()
      expect(screen.getByLabelText(/First Name/)).toBeInTheDocument()
      expect(screen.getByLabelText(/Last Name/)).toBeInTheDocument()
      expect(screen.getByLabelText(/Email Address/)).toBeInTheDocument()
      expect(screen.getByLabelText(/Phone Number/)).toBeInTheDocument()
    })

    it('shows validation error for mismatched passwords', async () => {
      render(<RegisterPage />)
      
      const passwordInput = screen.getByLabelText(/^Password/)
      const confirmPasswordInput = screen.getByLabelText(/Confirm Password/)
      const submitButton = screen.getByRole('button', { name: 'Submit Application' })
      
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
      })
    })

    it('shows validation error for short password', async () => {
      render(<RegisterPage />)
      
      const passwordInput = screen.getByLabelText(/^Password/)
      const confirmPasswordInput = screen.getByLabelText(/Confirm Password/)
      const submitButton = screen.getByRole('button', { name: 'Submit Application' })
      
      fireEvent.change(passwordInput, { target: { value: 'short' } })
      fireEvent.change(confirmPasswordInput, { target: { value: 'short' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Password must be at least 8 characters long')).toBeInTheDocument()
      })
    })

    it('toggles certification details section', () => {
      render(<RegisterPage />)
      
      const certificationCheckbox = screen.getByLabelText(/I have CNA, PCA, or HHA certification/)
      
      // Initially, certification details should not be visible
      expect(screen.queryByLabelText('Certification Details')).not.toBeInTheDocument()
      
      // Check the certification checkbox
      fireEvent.click(certificationCheckbox)
      
      // Certification details should now be visible
      expect(screen.getByLabelText('Certification Details')).toBeInTheDocument()
    })

    it('requires terms agreement before submission', async () => {
      render(<RegisterPage />)
      
      // Fill in required fields
      fireEvent.change(screen.getByLabelText(/First Name/), { target: { value: 'John' } })
      fireEvent.change(screen.getByLabelText(/Last Name/), { target: { value: 'Doe' } })
      fireEvent.change(screen.getByLabelText(/Email Address/), { target: { value: 'john@example.com' } })
      fireEvent.change(screen.getByLabelText(/Phone Number/), { target: { value: '555-1234' } })
      fireEvent.change(screen.getByLabelText(/^Password/), { target: { value: 'password123' } })
      fireEvent.change(screen.getByLabelText(/Confirm Password/), { target: { value: 'password123' } })
      
      const submitButton = screen.getByRole('button', { name: 'Submit Application' })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Please accept the terms and background check consent')).toBeInTheDocument()
      })
    })

    it('submits form with complete valid data', async () => {
      render(<RegisterPage />)
      
      // Fill in all required fields
      fireEvent.change(screen.getByLabelText(/First Name/), { target: { value: 'John' } })
      fireEvent.change(screen.getByLabelText(/Last Name/), { target: { value: 'Doe' } })
      fireEvent.change(screen.getByLabelText(/Email Address/), { target: { value: 'john@example.com' } })
      fireEvent.change(screen.getByLabelText(/Phone Number/), { target: { value: '555-1234' } })
      fireEvent.change(screen.getByLabelText(/^Password/), { target: { value: 'password123' } })
      fireEvent.change(screen.getByLabelText(/Confirm Password/), { target: { value: 'password123' } })
      
      // Check agreements
      fireEvent.click(screen.getByLabelText(/I agree to the Terms of Service/))
      fireEvent.click(screen.getByLabelText(/I consent to a background check/))
      
      const submitButton = screen.getByRole('button', { name: 'Submit Application' })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith(
          expect.objectContaining({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            phone: '555-1234',
            password: 'password123',
          })
        )
      })
    })
  })
})