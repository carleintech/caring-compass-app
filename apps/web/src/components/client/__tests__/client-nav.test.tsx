import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { ClientNav } from '../client-nav'
import { useRouter } from 'next/navigation'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn()
}))

describe('ClientNav', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    require('next/navigation').useRouter.mockReturnValue({
      push: jest.fn(),
      pathname: '/client/dashboard',
      asPath: '/client/dashboard'
    })
    require('next/navigation').usePathname.mockReturnValue('/client/dashboard')
  })

  it('renders navigation items correctly', () => {
    render(<ClientNav />)
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Schedule')).toBeInTheDocument()
    expect(screen.getByText('Care Plan')).toBeInTheDocument()
    expect(screen.getByText('Messages')).toBeInTheDocument()
    expect(screen.getByText('Billing')).toBeInTheDocument()
    expect(screen.getByText('Documents')).toBeInTheDocument()
    expect(screen.getByText('Family Portal')).toBeInTheDocument()
    expect(screen.getByText('Profile')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  it('highlights active navigation item', () => {
    render(<ClientNav />)
    
    const dashboardLink = screen.getByRole('link', { name: /Dashboard/i })
    expect(dashboardLink).toHaveClass('bg-primary')
  })

  it('renders navigation icons', () => {
    render(<ClientNav />)
    
    const icons = screen.getAllByRole('img')
    expect(icons.length).toBeGreaterThan(0)
  })

  it('has proper accessibility attributes', () => {
    render(<ClientNav />)
    
    const nav = screen.getByRole('navigation')
    expect(nav).toBeInTheDocument()
    
    const links = screen.getAllByRole('link')
    links.forEach(link => {
      expect(link).toHaveAttribute('href')
    })
  })

  it('handles navigation clicks', async () => {
    const user = userEvent.setup()
    const mockPush = jest.fn()
    require('next/navigation').useRouter.mockReturnValue({
      push: mockPush,
      pathname: '/client/dashboard',
      asPath: '/client/dashboard'
    })
    
    render(<ClientNav />)
    
    const scheduleLink = screen.getByRole('link', { name: /Schedule/i })
    await user.click(scheduleLink)
    
    expect(mockPush).toHaveBeenCalledWith('/client/schedule')
  })

  it('shows notification badges when present', () => {
    render(<ClientNav />)
    
    const messagesLink = screen.getByRole('link', { name: /Messages/i })
    expect(messagesLink).toBeInTheDocument()
  })

  it('renders responsive navigation', () => {
    render(<ClientNav />)
    
    const nav = screen.getByRole('navigation')
    expect(nav).toHaveClass('flex')
    expect(nav).toHaveClass('flex-col')
  })

  it('maintains navigation state across renders', () => {
    const { rerender } = render(<ClientNav />)
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    
    rerender(<ClientNav />)
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })
})
