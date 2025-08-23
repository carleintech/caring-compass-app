// apps/web/src/components/caregiver/__tests__/shift-card.test.tsx
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ShiftCard } from '../shift-card'

const mockShift = {
  id: '1',
  status: 'scheduled' as const,
  client: {
    name: 'Margaret Johnson',
    address: '123 Main St, Virginia Beach, VA',
    phone: '(757) 555-0123',
    rating: 4.8
  },
  date: '2025-01-20',
  startTime: '10:00',
  endTime: '14:00',
  duration: 4,
  hourlyRate: 24.00,
  totalPay: 96.00,
  tasks: ['Personal care', 'Meal preparation'],
  distance: 12.5
}

describe('ShiftCard', () => {
  it('renders shift information correctly', () => {
    render(<ShiftCard shift={mockShift} />)
    
    expect(screen.getByText('Margaret Johnson')).toBeInTheDocument()
    expect(screen.getByText('10:00 - 14:00')).toBeInTheDocument()
    expect(screen.getByText('$96 ($24/hr)')).toBeInTheDocument()
    expect(screen.getByText('Personal care')).toBeInTheDocument()
  })

  it('shows client rating when available', () => {
    render(<ShiftCard shift={mockShift} />)
    
    expect(screen.getByText('4.8')).toBeInTheDocument()
  })

  it('displays appropriate action buttons for scheduled shifts', () => {
    render(<ShiftCard shift={mockShift} type="assigned" />)
    
    expect(screen.getByText('Directions')).toBeInTheDocument()
    expect(screen.getByText('Call')).toBeInTheDocument()
    expect(screen.getByText('Start EVV')).toBeInTheDocument()
  })

  it('shows accept/decline buttons for available shifts', () => {
    const availableShift = { ...mockShift, status: 'available' as const }
    render(<ShiftCard shift={availableShift} type="available" />)
    
    expect(screen.getByText('Accept')).toBeInTheDocument()
    expect(screen.getByText('Decline')).toBeInTheDocument()
  })

  it('calls appropriate handlers when buttons are clicked', () => {
    const onAccept = jest.fn()
    const onDecline = jest.fn()
    const availableShift = { ...mockShift, status: 'available' as const }
    
    render(
      <ShiftCard 
        shift={availableShift} 
        type="available" 
        onAccept={onAccept}
        onDecline={onDecline}
      />
    )
    
    fireEvent.click(screen.getByText('Accept'))
    expect(onAccept).toHaveBeenCalled()
    
    fireEvent.click(screen.getByText('Decline'))
    expect(onDecline).toHaveBeenCalled()
  })
})