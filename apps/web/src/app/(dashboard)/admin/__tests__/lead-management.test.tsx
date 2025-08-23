// apps/web/src/app/(dashboard)/admin/__tests__/lead-management.test.tsx
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { jest } from '@jest/globals'
import LeadManagement from '../leads/page'

describe('LeadManagement', () => {
  it('renders lead management header', () => {
    render(<LeadManagement />)
    
    expect(screen.getByText('Lead Management')).toBeInTheDocument()
    expect(screen.getByText('Manage your sales pipeline and convert leads to clients')).toBeInTheDocument()
  })

  it('displays pipeline overview metrics', () => {
    render(<LeadManagement />)
    
    expect(screen.getByText('Total Pipeline Value')).toBeInTheDocument()
    expect(screen.getByText('Active Leads')).toBeInTheDocument()
    expect(screen.getByText('Conversion Rate')).toBeInTheDocument()
    expect(screen.getByText('Avg. Sales Cycle')).toBeInTheDocument()
  })

  it('shows add lead button', () => {
    render(<LeadManagement />)
    
    const addButton = screen.getByRole('button', { name: /Add Lead/i })
    expect(addButton).toBeInTheDocument()
  })

  it('opens add lead dialog when button is clicked', async () => {
    render(<LeadManagement />)
    
    const addButton = screen.getByRole('button', { name: /Add Lead/i })
    fireEvent.click(addButton)
    
    await waitFor(() => {
      expect(screen.getByText('Add New Lead')).toBeInTheDocument()
    })
  })

  it('displays pipeline kanban board', () => {
    render(<LeadManagement />)
    
    const pipelineTab = screen.getByRole('tab', { name: 'Pipeline' })
    fireEvent.click(pipelineTab)
    
    expect(screen.getByText('New')).toBeInTheDocument()
    expect(screen.getByText('Contacted')).toBeInTheDocument()
    expect(screen.getByText('Assessment Scheduled')).toBeInTheDocument()
  })

  it('allows switching between pipeline views', () => {
    render(<LeadManagement />)
    
    const leadsTab = screen.getByRole('tab', { name: 'All Leads' })
    fireEvent.click(leadsTab)
    
    expect(leadsTab).toHaveAttribute('data-state', 'active')
  })

  it('displays lead search and filters', () => {
    render(<LeadManagement />)
    
    const leadsTab = screen.getByRole('tab', { name: 'All Leads' })
    fireEvent.click(leadsTab)
    
    expect(screen.getByPlaceholderText('Search leads...')).toBeInTheDocument()
  })
})