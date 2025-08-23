// apps/web/src/app/(dashboard)/admin/__tests__/admin-dashboard.test.tsx
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { jest } from '@jest/globals'
import AdminDashboard from '../dashboard/page'

// Mock the trpc hook
jest.mock('@/lib/trpc', () => ({
  trpc: {
    useContext: () => ({
      metrics: {
        invalidate: jest.fn()
      }
    })
  }
}))

// Mock chart components
jest.mock('lucide-react', () => ({
  ...jest.requireActual('lucide-react'),
  LineChart: () => <div data-testid="line-chart">Line Chart</div>,
  BarChart3: () => <div data-testid="bar-chart">Bar Chart</div>,
  PieChart: () => <div data-testid="pie-chart">Pie Chart</div>
}))

describe('AdminDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders dashboard header correctly', () => {
    render(<AdminDashboard />)
    
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Overview of your home care operations')).toBeInTheDocument()
  })

  it('displays key metrics cards', () => {
    render(<AdminDashboard />)
    
    expect(screen.getByText('Active Clients')).toBeInTheDocument()
    expect(screen.getByText('Active Caregivers')).toBeInTheDocument()
    expect(screen.getByText('Monthly Revenue')).toBeInTheDocument()
    expect(screen.getByText('Visit Completion')).toBeInTheDocument()
  })

  it('shows alert section when there are conflicts', () => {
    render(<AdminDashboard />)
    
    expect(screen.getByText(/Action Required/)).toBeInTheDocument()
    expect(screen.getByText('Low Caregiver Availability')).toBeInTheDocument()
  })

  it('handles time range selection', () => {
    render(<AdminDashboard />)
    
    const monthTab = screen.getByRole('tab', { name: 'Month' })
    fireEvent.click(monthTab)
    
    expect(monthTab).toHaveAttribute('data-state', 'active')
  })

  it('renders quick actions section', () => {
    render(<AdminDashboard />)
    
    expect(screen.getByText('Add New Client')).toBeInTheDocument()
    expect(screen.getByText('Schedule Visit')).toBeInTheDocument()
    expect(screen.getByText('Review Applications')).toBeInTheDocument()
    expect(screen.getByText('Process Billing')).toBeInTheDocument()
  })

  it('displays operational status cards', () => {
    render(<AdminDashboard />)
    
    expect(screen.getByText("Today's Schedule")).toBeInTheDocument()
    expect(screen.getByText('Caregiver Status')).toBeInTheDocument()
    expect(screen.getByText('System Health')).toBeInTheDocument()
  })

  it('allows tab navigation between different views', () => {
    render(<AdminDashboard />)
    
    const activityTab = screen.getByRole('tab', { name: 'Recent Activity' })
    fireEvent.click(activityTab)
    
    expect(activityTab).toHaveAttribute('data-state', 'active')
  })
})