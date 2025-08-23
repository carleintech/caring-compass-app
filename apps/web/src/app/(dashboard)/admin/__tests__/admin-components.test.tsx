// apps/web/src/components/admin/__tests__/admin-components.test.tsx
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { jest } from '@jest/globals'
import { AnalyticsCard, QuickStats, ActivityFeed, SystemHealth, DataTable } from '../index'

describe('Admin Components', () => {
  describe('AnalyticsCard', () => {
    it('renders basic analytics card', () => {
      render(
        <AnalyticsCard 
          title="Test Metric" 
          value="100" 
        />
      )
      
      expect(screen.getByText('Test Metric')).toBeInTheDocument()
      expect(screen.getByText('100')).toBeInTheDocument()
    })

    it('shows trend information when provided', () => {
      render(
        <AnalyticsCard 
          title="Revenue" 
          value="$50,000" 
          change={{ value: 12.5, period: 'last month', type: 'increase' }}
        />
      )
      
      expect(screen.getByText('12.5% from last month')).toBeInTheDocument()
    })
  })

  describe('QuickStats', () => {
    const mockStats = [
      { label: 'Active Users', value: 150, total: 200 },
      { label: 'Completed Tasks', value: 95, badge: '95%' }
    ]

    it('renders quick stats with progress bars', () => {
      render(<QuickStats title="User Statistics" stats={mockStats} />)
      
      expect(screen.getByText('User Statistics')).toBeInTheDocument()
      expect(screen.getByText('Active Users')).toBeInTheDocument()
      expect(screen.getByText('150/200')).toBeInTheDocument()
    })
  })

  describe('ActivityFeed', () => {
    const mockActivities = [
      {
        id: '1',
        type: 'user_signup' as const,
        title: 'New User Registered',
        description: 'John Doe joined the platform',
        timestamp: new Date(),
        user: { name: 'John Doe' }
      }
    ]

    it('renders activity feed items', () => {
      render(<ActivityFeed activities={mockActivities} />)
      
      expect(screen.getByText('Recent Activity')).toBeInTheDocument()
      expect(screen.getByText('New User Registered')).toBeInTheDocument()
      expect(screen.getByText('John Doe joined the platform')).toBeInTheDocument()
    })
  })

  describe('SystemHealth', () => {
    const mockMetrics = [
      {
        name: 'Database',
        status: 'healthy' as const,
        value: 85,
        maxValue: 100,
        lastChecked: new Date()
      }
    ]

    it('renders system health metrics', () => {
      render(<SystemHealth metrics={mockMetrics} />)
      
      expect(screen.getByText('System Health')).toBeInTheDocument()
      expect(screen.getByText('Database')).toBeInTheDocument()
      expect(screen.getByText('85%')).toBeInTheDocument()
    })
  })

  describe('DataTable', () => {
    const mockData = [
      { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' }
    ]

    const mockColumns = [
      { key: 'name' as const, title: 'Name' },
      { key: 'email' as const, title: 'Email' },
      { key: 'status' as const, title: 'Status' }
    ]

    it('renders data table with rows and columns', () => {
      render(
        <DataTable 
          title="Users" 
          data={mockData} 
          columns={mockColumns} 
        />
      )
      
      expect(screen.getByText('Users')).toBeInTheDocument()
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('jane@example.com')).toBeInTheDocument()
    })

    it('allows searching through data', () => {
      render(
        <DataTable 
          data={mockData} 
          columns={mockColumns} 
          searchable 
        />
      )
      
      const searchInput = screen.getByPlaceholderText('Search...')
      fireEvent.change(searchInput, { target: { value: 'John' } })
      
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
  })
})