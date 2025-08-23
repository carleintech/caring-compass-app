import { render, screen, fireEvent } from '@testing-library/react'
import { MainNav } from '@/components/layout/main-nav'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'

// Mock next/link
jest.mock('next/link', () => {
  const MockLink = ({ children, href, ...props }) => {
    return <a href={href} {...props}>{children}</a>
  }
  MockLink.displayName = 'MockLink'
  return MockLink
})

describe('Layout Components', () => {
  describe('MainNav', () => {
    it('renders navigation items', () => {
      render(<MainNav />)
      
      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('Services')).toBeInTheDocument()
      expect(screen.getByText('About')).toBeInTheDocument()
      expect(screen.getByText('Contact')).toBeInTheDocument()
    })

    it('has correct navigation links', () => {
      render(<MainNav />)
      
      const homeLink = screen.getByText('Home').closest('a')
      const servicesLink = screen.getByText('Services').closest('a')
      const aboutLink = screen.getByText('About').closest('a')
      const contactLink = screen.getByText('Contact').closest('a')
      
      expect(homeLink).toHaveAttribute('href', '/')
      expect(servicesLink).toHaveAttribute('href', '/services')
      expect(aboutLink).toHaveAttribute('href', '/about')
      expect(contactLink).toHaveAttribute('href', '/contact')
    })

    it('applies mobile styles correctly', () => {
      render(<MainNav className="md:hidden" />)
      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('md:hidden')
    })
  })

  describe('SiteHeader', () => {
    it('renders the logo and navigation', () => {
      render(<SiteHeader />)
      
      expect(screen.getByText('Caring Compass')).toBeInTheDocument()
      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })

    it('renders login and get started buttons', () => {
      render(<SiteHeader />)
      
      expect(screen.getByText('Log in')).toBeInTheDocument()
      expect(screen.getByText('Get Started')).toBeInTheDocument()
    })

    it('has mobile menu button', () => {
      render(<SiteHeader />)
      
      const menuButton = screen.getByLabelText('Toggle menu')
      expect(menuButton).toBeInTheDocument()
    })

    it('toggles mobile menu when button is clicked', () => {
      render(<SiteHeader />)
      
      const menuButton = screen.getByLabelText('Toggle menu')
      
      // Initially, mobile menu should not be visible
      expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument()
      
      // Click to open menu
      fireEvent.click(menuButton)
      
      // Mobile menu should now be visible
      expect(screen.getByTestId('mobile-menu')).toBeInTheDocument()
    })
  })

  describe('SiteFooter', () => {
    it('renders company information', () => {
      render(<SiteFooter />)
      
      expect(screen.getByText('Caring Compass')).toBeInTheDocument()
      expect(screen.getByText(/Compassionate, personalized care/)).toBeInTheDocument()
    })

    it('renders footer navigation sections', () => {
      render(<SiteFooter />)
      
      expect(screen.getByText('Services')).toBeInTheDocument()
      expect(screen.getByText('Company')).toBeInTheDocument()
      expect(screen.getByText('Resources')).toBeInTheDocument()
      expect(screen.getByText('Legal')).toBeInTheDocument()
    })

    it('renders contact information', () => {
      render(<SiteFooter />)
      
      expect(screen.getByText('Contact Us')).toBeInTheDocument()
      expect(screen.getByText(/Virginia Beach, VA/)).toBeInTheDocument()
    })

    it('renders social media links', () => {
      render(<SiteFooter />)
      
      const facebookLink = screen.getByLabelText('Facebook')
      const twitterLink = screen.getByLabelText('Twitter')
      const linkedinLink = screen.getByLabelText('LinkedIn')
      
      expect(facebookLink).toBeInTheDocument()
      expect(twitterLink).toBeInTheDocument()
      expect(linkedinLink).toBeInTheDocument()
    })

    it('renders copyright notice', () => {
      render(<SiteFooter />)
      
      const currentYear = new Date().getFullYear()
      expect(screen.getByText(`© ${currentYear} Caring Compass Home Care LLC. All rights reserved.`)).toBeInTheDocument()
    })

    it('has correct link attributes', () => {
      render(<SiteFooter />)
      
      const personalCareLink = screen.getByText('Personal Care').closest('a')
      const companionshipLink = screen.getByText('Companionship').closest('a')
      
      expect(personalCareLink).toHaveAttribute('href', '/services/personal-care')
      expect(companionshipLink).toHaveAttribute('href', '/services/companionship')
    })
  })
})