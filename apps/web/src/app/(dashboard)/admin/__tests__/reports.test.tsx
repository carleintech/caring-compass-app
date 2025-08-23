// apps/web/src/app/(dashboard)/admin/__tests__/reports.test.tsx
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { jest } from '@jest/globals'
import ReportsAnalytics from '../reports/page'

describe('ReportsAnalytics', () => {
  it('renders reports header', () => {
    render(<ReportsAnalytics />)
    
    expect(screen.getByText('Reports & Analytics')).toBeInTheDocument()
    expect(screen.getByText('Comprehensive business intelligence and performance metrics')).toBeInTheDocument()
  })

  it('displays key metrics overview', () => {
    render(<ReportsAnalytics />)
    
    expect(screen.getByText('Total Revenue')).toBeInTheDocument()
    expect(screen.getByText('Active Clients')).toBeInTheDocument()
    expect(screen.getByText('Visit Completion')).toBeInTheDocument()
    expect(screen.getByText('Client Satisfaction')).toBeInTheDocument()
  })

  it('shows time range selector', () => {
    render(<ReportsAnalytics />)
    
    expect(screen.getByDisplayValue('Last Month')).toBeInTheDocument()
  })

  it('has export functionality', () => {
    render(<ReportsAnalytics />)
    
    const exportButton = screen.getByRole('button', { name: /Export/i })
    expect(exportButton).toBeInTheDocument()
  })

  it('allows switching between report tabs', () => {
    render(<ReportsAnalytics />)
    
    const financialTab = screen.getByRole('tab', { name: 'Financial' })
    fireEvent.click(financialTab)
    
    expect(financialTab).toHaveAttribute('data-state', 'active')
  })

  it('displays report action buttons', () => {
    render(<ReportsAnalytics />)
    
    expect(screen.getByText('Export to PDF')).toBeInTheDocument()
    expect(screen.getByText('Export to Excel')).toBeInTheDocument()
    expect(screen.getByText('Schedule Report')).toBeInTheDocument()
  })
})