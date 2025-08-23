import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppointmentForm } from '../components/appointments/appointment-form'

describe('AppointmentForm', () => {
  const mockDate = new Date('2025-08-19T12:00:00Z')
  const mockOnSubmit = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders create form correctly', () => {
    render(
      <AppointmentForm
        mode="create"
        date={mockDate}
        onSubmit={mockOnSubmit}
      />
    )

    expect(screen.getByLabelText(/time/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/duration/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create appointment/i })).toBeInTheDocument()
  })

  it('renders edit form with appointment data', () => {
    const mockAppointment = {
      id: '1',
      date: mockDate,
      duration: 60,
      notes: 'Test notes',
      status: 'SCHEDULED' as const,
    }

    render(
      <AppointmentForm
        mode="edit"
        date={mockDate}
        onSubmit={mockOnSubmit}
        appointment={mockAppointment}
      />
    )

    expect(screen.getByLabelText(/time/i)).toHaveValue('12:00')
    expect(screen.getByLabelText(/duration/i)).toHaveValue(60)
    expect(screen.getByLabelText(/notes/i)).toHaveValue('Test notes')
    expect(screen.getByRole('button', { name: /update appointment/i })).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    render(
      <AppointmentForm
        mode="create"
        date={mockDate}
        onSubmit={mockOnSubmit}
      />
    )

    const submitButton = screen.getByRole('button', { name: /create appointment/i })
    const timeInput = screen.getByLabelText(/time/i)
    const durationInput = screen.getByLabelText(/duration/i)

    // Clear required fields
    await userEvent.clear(timeInput)
    await userEvent.clear(durationInput)
    
    // Submit form
    fireEvent.click(submitButton)

    // Wait for validation messages
    await waitFor(() => {
      expect(screen.getByText(/time is required/i)).toBeInTheDocument()
      expect(screen.getByText(/duration is required/i)).toBeInTheDocument()
    })

    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('submits form with valid data', async () => {
    render(
      <AppointmentForm
        mode="create"
        date={mockDate}
        onSubmit={mockOnSubmit}
      />
    )

    const timeInput = screen.getByLabelText(/time/i)
    const durationInput = screen.getByLabelText(/duration/i)
    const notesInput = screen.getByLabelText(/notes/i)
    const submitButton = screen.getByRole('button', { name: /create appointment/i })

    // Fill in form
    await userEvent.type(timeInput, '14:30')
    await userEvent.type(durationInput, '45')
    await userEvent.type(notesInput, 'Test appointment')

    // Submit form
    fireEvent.click(submitButton)

    // Verify submission
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        date: mockDate,
        time: '14:30',
        duration: 45,
        notes: 'Test appointment',
      })
    })
  })

  it('shows loading state during submission', () => {
    render(
      <AppointmentForm
        mode="create"
        date={mockDate}
        onSubmit={mockOnSubmit}
        isLoading={true}
      />
    )

    expect(screen.getByRole('button', { name: /creating/i })).toBeDisabled()
  })

  it('displays error message when provided', () => {
    const errorMessage = 'Failed to create appointment'
    render(
      <AppointmentForm
        mode="create"
        date={mockDate}
        onSubmit={mockOnSubmit}
        error={errorMessage}
      />
    )

    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })
})
