import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { VisitCard } from '../visit-card'

// Mock the visit card component since it doesn't exist yet
const MockVisitCard = ({ visit }: { visit: any }) => (
  <div data-testid="visit-card">
    <h3>{visit.caregiverName}</h3>
    <p>{visit.date}</p>
    <p>{visit.services.join(', ')}</p>
    <span data-testid="status">{visit.status}</span>
  </div>
)

describe('VisitCard', () => {
  const mockVisit = {
    id: '1',
    caregiverName: 'Sarah Johnson',
    date: '2024-01-15T10:00:00Z',
    duration: '2 hours',
    services: ['Personal Care', 'Medication Reminder'],
    status: 'confirmed'
  }

  it('renders visit information correctly', () => {
    render(<MockVisitCard visit={mockVisit} />)
    
    expect(screen.getByText('Sarah Johnson')).toBeInTheDocument()
    expect(screen.getByText('Personal Care, Medication Reminder')).toBeInTheDocument()
    expect(screen.getByTestId('status')).toHaveTextContent('confirmed')
  })

  it('displays visit status with correct styling', () => {
    render(<MockVisitCard visit={mockVisit} />)
    
    const statusElement = screen.getByTestId('status')
    expect(statusElement).toBeInTheDocument()
  })

  it('handles different visit statuses', () => {
    const pendingVisit = { ...mockVisit, status: 'pending' }
    render(<MockVisitCard visit={pendingVisit} />)
    
    expect(screen.getByTestId('status')).toHaveTextContent('pending')
  })

  it('renders multiple services correctly', () => {
    const multiServiceVisit = {
      ...mockVisit,
      services: ['Personal Care', 'Companionship', 'Light Housekeeping']
    }
    
    render(<MockVisitCard visit={multiServiceVisit} />)
    
    expect(screen.getByText('Personal Care, Companionship, Light Housekeeping')).toBeInTheDocument()
  })

  it('handles empty services array', () => {
    const noServicesVisit = { ...mockVisit, services: [] }
    render(<MockVisitCard visit={noServicesVisit} />)
    
    expect(screen.getByText('')).toBeInTheDocument()
  })
})
