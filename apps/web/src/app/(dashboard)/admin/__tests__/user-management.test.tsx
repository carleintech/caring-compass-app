// apps/web/src/app/(dashboard)/admin/__tests__/user-management.test.tsx
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { jest } from '@jest/globals'
import UserManagement from '../user-management/page'

describe('UserManagement', () => {
  it('renders user management header', () => {
    render(<UserManagement />)
    
    expect(screen.getByText('User Management')).toBeInTheDocument()
    expect(screen.getByText('Manage users, roles, and permissions across the platform')).toBeInTheDocument()
  })

  it('displays user statistics', () => {
    render(<UserManagement />)
    
    expect(screen.getByText('Total Users')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByText('Inactive')).toBeInTheDocument()
    expect(screen.getByText('Suspended')).toBeInTheDocument()
  })

  it('shows add user button', () => {
    render(<UserManagement />)
    
    const addButton = screen.getByRole('button', { name: /Add User/i })
    expect(addButton).toBeInTheDocument()
  })

  it('opens add user dialog when button is clicked', async () => {
    render(<UserManagement />)
    
    const addButton = screen.getByRole('button', { name: /Add User/i })
    fireEvent.click(addButton)
    
    await waitFor(() => {
      expect(screen.getByText('Create New User')).toBeInTheDocument()
    })
  })

  it('displays user search and filters', () => {
    render(<UserManagement />)
    
    expect(screen.getByPlaceholderText('Search users...')).toBeInTheDocument()
  })

  it('allows switching between management tabs', () => {
    render(<UserManagement />)
    
    const rolesTab = screen.getByRole('tab', { name: 'Roles & Permissions' })
    fireEvent.click(rolesTab)
    
    expect(rolesTab).toHaveAttribute('data-state', 'active')
  })

  it('displays activity log tab', () => {
    render(<UserManagement />)
    
    const activityTab = screen.getByRole('tab', { name: 'Activity Log' })
    fireEvent.click(activityTab)
    
    expect(screen.getByText('Recent user actions and system events')).toBeInTheDocument()
  })
})