// apps/web/src/app/(dashboard)/admin/__tests__/settings.test.tsx
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { jest } from '@jest/globals'
import SystemSettings from '../settings/page'

describe('SystemSettings', () => {
  it('renders settings header', () => {
    render(<SystemSettings />)
    
    expect(screen.getByText('System Settings')).toBeInTheDocument()
    expect(screen.getByText('Configure system preferences, integrations, and business rules')).toBeInTheDocument()
  })

  it('shows save changes button', () => {
    render(<SystemSettings />)
    
    const saveButton = screen.getByRole('button', { name: /Save Changes/i })
    expect(saveButton).toBeInTheDocument()
  })

  it('displays settings tabs', () => {
    render(<SystemSettings />)
    
    expect(screen.getByRole('tab', { name: 'General' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Notifications' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Billing' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Security' })).toBeInTheDocument()
  })

  it('allows switching between settings tabs', () => {
    render(<SystemSettings />)
    
    const notificationsTab = screen.getByRole('tab', { name: 'Notifications' })
    fireEvent.click(notificationsTab)
    
    expect(notificationsTab).toHaveAttribute('data-state', 'active')
  })

  it('shows company information form', () => {
    render(<SystemSettings />)
    
    expect(screen.getByLabelText('Company Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Phone Number')).toBeInTheDocument()
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument()
  })

  it('displays integration settings', () => {
    render(<SystemSettings />)
    
    const integrationsTab = screen.getByRole('tab', { name: 'Integrations' })
    fireEvent.click(integrationsTab)
    
    expect(screen.getByText('Payment Processing')).toBeInTheDocument()
    expect(screen.getByText('SMS Notifications')).toBeInTheDocument()
    expect(screen.getByText('Email Service')).toBeInTheDocument()
  })
})