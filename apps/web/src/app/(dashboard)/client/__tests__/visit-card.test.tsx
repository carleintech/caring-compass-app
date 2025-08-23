// apps/web/src/components/client/__tests__/visit-card.test.tsx
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { VisitCard } from '../visit-card'

const mockVisit = {
  id: '1',
  date: '2025-01-20T10:00:00Z',
  timeSlot: '10:00 AM - 2:00 PM',
  duration: 4,
  status: 'scheduled' as const,
  caregiver: {
    id: '1',
    name: 'Sarah Wilson',
    rating: 4.8,
    specialties: ['Personal Care', 'Medication Reminders']
  },
  tasks: ['Bathing assistance', 'Meal preparation', 'Light housekeeping']
}

describe('VisitCard', () => {
  it('renders visit information', () => {
    render(<VisitCard visit={mockVisit} />)
    
    expect(screen.getByText('Sarah Wilson')).toBeInTheDocument()
    expect(screen.getByText('10:00 AM - 2:00 PM (4h)')).toBeInTheDocument()
    expect(screen.getByText('Bathing assistance')).toBeInTheDocument()
  })

  it('shows caregiver rating', () => {
    render(<VisitCard visit={mockVisit} />)
    
    expect(screen.getByText('4.8')).toBeInTheDocument()
  })

  it('displays action buttons for scheduled visits', () => {
    render(<VisitCard visit={mockVisit} />)
    
    expect(screen.getByText('Message')).toBeInTheDocument()
    expect(screen.getByText('Reschedule')).toBeInTheDocument()
  })

  it('calls message handler when message button clicked', () => {
    const onMessage = jest.fn()
    render(<VisitCard visit={mockVisit} onMessage={onMessage} />)
    
    fireEvent.click(screen.getByText('Message'))
    expect(onMessage).toHaveBeenCalled()
  })

  it('shows appropriate status badge', () => {
    render(<VisitCard visit={mockVisit} />)
    
    expect(screen.getByText('scheduled')).toBeInTheDocument()
  })
})