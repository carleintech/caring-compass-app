// apps/web/src/app/(dashboard)/admin/__tests__/scheduling.test.tsx
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { jest } from '@jest/globals'
import AdvancedScheduling from '../scheduling/page'

describe('AdvancedScheduling', () => {
  it('renders scheduling header', () => {
    render(<AdvancedScheduling />)
    
    expect(screen.getByText('Advanced Scheduling')).toBeInTheDocument()
    expect(screen.getByText('Manage visits, assignments, and resolve scheduling conflicts')).toBeInTheDocument()
  })

  it('shows conflict alerts when present', () => {
    render(<AdvancedScheduling />)
    
    expect(screen.getByText(/Scheduling Conflicts/)).toBeInTheDocument()
    expect(screen.getByText('Visit scheduled without assigned caregiver')).toBeInTheDocument()
  })

  it('displays view toggle buttons', () => {
    render(<AdvancedScheduling />)
    
    expect(screen.getByRole('tab', { name: 'Day' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Week' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Month' })).toBeInTheDocument()
  })

  it('shows schedule visit button', () => {
    render(<AdvancedScheduling />)
    
    const scheduleButton = screen.getByRole('button', { name: /Schedule Visit/i })
    expect(scheduleButton).toBeInTheDocument()
  })

  it('opens schedule dialog when button is clicked', async () => {
    render(<AdvancedScheduling />)
    
    const scheduleButton = screen.getByRole('button', { name: /Schedule Visit/i })
    fireEvent.click(scheduleButton)
    
    await waitFor(() => {
      expect(screen.getByText('Schedule New Visit')).toBeInTheDocument()
    })
  })

  it('displays caregiver availability panel', () => {
    render(<AdvancedScheduling />)
    
    expect(screen.getByText('Caregiver Availability')).toBeInTheDocument()
    expect(screen.getByText('Current availability and capacity for scheduling')).toBeInTheDocument()
  })

  it('allows switching between calendar views', () => {
    render(<AdvancedScheduling />)
    
    const dayTab = screen.getByRole('tab', { name: 'Day' })
    fireEvent.click(dayTab)
    
    expect(dayTab).toHaveAttribute('data-state', 'active')
  })
})