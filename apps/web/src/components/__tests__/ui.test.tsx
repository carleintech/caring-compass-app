import { render, screen, fireEvent } from '@testing-library/react'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'

describe('UI Components', () => {
  describe('LoadingSpinner', () => {
    it('renders with default props', () => {
      render(<LoadingSpinner />)
      const spinner = screen.getByTestId('loading-spinner')
      expect(spinner).toBeInTheDocument()
      expect(spinner).toHaveClass('animate-spin')
    })

    it('applies custom className', () => {
      render(<LoadingSpinner className="custom-class" />)
      const spinner = screen.getByTestId('loading-spinner')
      expect(spinner).toHaveClass('custom-class')
    })

    it('renders with custom size', () => {
      render(<LoadingSpinner size="large" />)
      const spinner = screen.getByTestId('loading-spinner')
      expect(spinner).toHaveClass('h-8', 'w-8')
    })
  })

  describe('EmptyState', () => {
    it('renders with title and description', () => {
      render(
        <EmptyState
          title="No data"
          description="There is no data to display"
        />
      )
      
      expect(screen.getByText('No data')).toBeInTheDocument()
      expect(screen.getByText('There is no data to display')).toBeInTheDocument()
    })

    it('renders with action button', () => {
      const mockAction = jest.fn()
      render(
        <EmptyState
          title="No data"
          description="There is no data to display"
          action={
            <Button onClick={mockAction}>Add Item</Button>
          }
        />
      )
      
      const button = screen.getByText('Add Item')
      expect(button).toBeInTheDocument()
      
      fireEvent.click(button)
      expect(mockAction).toHaveBeenCalledTimes(1)
    })

    it('renders with custom icon', () => {
      const CustomIcon = () => <div data-testid="custom-icon">Icon</div>
      render(
        <EmptyState
          title="No data"
          description="There is no data to display"
          icon={<CustomIcon />}
        />
      )
      
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
    })
  })

  describe('Button', () => {
    it('renders with default variant', () => {
      render(<Button>Click me</Button>)
      const button = screen.getByRole('button', { name: 'Click me' })
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('bg-primary')
    })

    it('renders with different variants', () => {
      render(<Button variant="outline">Outline Button</Button>)
      const button = screen.getByRole('button', { name: 'Outline Button' })
      expect(button).toHaveClass('border-input')
    })

    it('renders with different sizes', () => {
      render(<Button size="sm">Small Button</Button>)
      const button = screen.getByRole('button', { name: 'Small Button' })
      expect(button).toHaveClass('h-9')
    })

    it('handles click events', () => {
      const mockClick = jest.fn()
      render(<Button onClick={mockClick}>Click me</Button>)
      
      const button = screen.getByRole('button', { name: 'Click me' })
      fireEvent.click(button)
      
      expect(mockClick).toHaveBeenCalledTimes(1)
    })

    it('is disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled Button</Button>)
      const button = screen.getByRole('button', { name: 'Disabled Button' })
      expect(button).toBeDisabled()
    })
  })
})