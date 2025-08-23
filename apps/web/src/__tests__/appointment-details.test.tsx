import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppointmentDetails } from '../components/appointments/appointment-details'

describe('AppointmentDetails', () => {
  const mockAppointment = {
    id: '1',
    date: new Date('2025-08-19T14:30:00Z'),
    duration: 45,
    notes: 'Test appointment',
    status: 'SCHEDULED' as const,
  }

  const mockOnEdit = jest.fn()
  const mockOnDelete = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders appointment details correctly', () => {
    render(
      <AppointmentDetails
        appointment={mockAppointment}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getByText(/august 19, 2025/i)).toBeInTheDocument()
    expect(screen.getByText(/45 minutes/i)).toBeInTheDocument()
    expect(screen.getByText(/test appointment/i)).toBeInTheDocument()
    expect(screen.getByText(/scheduled/i)).toBeInTheDocument()
  })

  it('calls onEdit when edit button is clicked', () => {
    render(
      <AppointmentDetails
        appointment={mockAppointment}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    const editButton = screen.getByRole('button', { name: /edit/i })
    fireEvent.click(editButton)

    expect(mockOnEdit).toHaveBeenCalledWith(mockAppointment)
  })

  it('shows delete confirmation dialog when delete button is clicked', () => {
    render(
      <AppointmentDetails
        appointment={mockAppointment}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    const deleteButton = screen.getByRole('button', { name: /delete/i })
    fireEvent.click(deleteButton)

    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
    expect(screen.getByText(/are you sure/i)).toBeInTheDocument()
  })

  it('calls onDelete when delete is confirmed', async () => {
    const mockFetch = jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
      Promise.resolve(new Response(null, { status: 204 }))
    )

    render(
      <AppointmentDetails
        appointment={mockAppointment}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    // Click delete button to open dialog
    const deleteButton = screen.getByRole('button', { name: /delete/i })
    fireEvent.click(deleteButton)

    // Click confirm button in dialog
    const confirmButton = screen.getByRole('button', { name: /delete$/i })
    fireEvent.click(confirmButton)

    // Wait for the delete operation to complete
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        `/api/appointments/${mockAppointment.id}`,
        { method: 'DELETE' }
      )
      expect(mockOnDelete).toHaveBeenCalledWith(mockAppointment.id)
    })

    mockFetch.mockRestore()
  })

  it('shows error toast when delete fails', async () => {
    const mockFetch = jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
      Promise.reject(new Error('Network error'))
    )

    render(
      <AppointmentDetails
        appointment={mockAppointment}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    // Click delete button to open dialog
    const deleteButton = screen.getByRole('button', { name: /delete/i })
    fireEvent.click(deleteButton)

    // Click confirm button in dialog
    const confirmButton = screen.getByRole('button', { name: /delete$/i })
    fireEvent.click(confirmButton)

    // Wait for error toast
    await waitFor(() => {
      expect(screen.getByText(/failed to delete appointment/i)).toBeInTheDocument()
    })

    mockFetch.mockRestore()
  })
})
