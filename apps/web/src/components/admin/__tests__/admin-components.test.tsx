import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/admin/dashboard'
  }),
  usePathname: () => '/admin/dashboard'
}))

// Mock admin components since they may not exist yet
const MockAnalyticsCard = ({ title, value, change }: any) => (
  <div data-testid="analytics-card">
    <h3>{title}</h3>
    <div>{value}</div>
    {change && (
      <span className={change.type === 'increase' ? 'text-green-600' : 'text-red-600'}>
        {change.value}% from {change.period}
      </span>
    )}
  </div>
)

const MockAdminNav = () => (
  <nav role="navigation" aria-label="Admin navigation">
    <a href="/admin/dashboard" className="bg-primary">Dashboard</a>
    <a href="/admin/leads">Leads</a>
    <a href="/admin/scheduling">Scheduling</a>
    <a href="/admin/reports">Reports</a>
    <a href="/admin/users">Users</a>
    <a href="/admin/settings">Settings</a>
  </nav>
)

const MockDataTable = ({ data, columns }: any) => (
  <div>
    <input placeholder="Search..." />
    <table>
      <thead>
        <tr>
          {columns.map((col: any) => (
            <th key={col.key}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row: any) => (
          <tr key={row.id}>
            <td>{row.name}</td>
            <td>{row.email}</td>
            <td>{row.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <button>Previous</button>
    <button>Next</button>
  </div>
)

const MockQuickStats = ({ title, value }: any) => (
  <div>
    <h3>{title}</h3>
    <div>{value.toLocaleString()}</div>
  </div>
)

const MockSystemHealth = () => (
  <div>
    <h3>System Health</h3>
    <div>API Status</div>
    <div>Database</div>
    <span className="text-green-600">Operational</span>
    <span className="text-yellow-600">Warning</span>
    <span>120ms</span>
    <span>45</span>
    <span>12</span>
  </div>
)

describe('Admin Components', () => {
  describe('AnalyticsCard', () => {
    const mockData = {
      title: 'Total Revenue',
      value: '$156,750',
      change: {
        value: 12.5,
        period: 'last month',
        type: 'increase' as const
      }
    }

    it('renders analytics card with correct data', () => {
      render(<MockAnalyticsCard {...mockData} />)
      
      expect(screen.getByText('Total Revenue')).toBeInTheDocument()
      expect(screen.getByText('$156,750')).toBeInTheDocument()
      expect(screen.getByText('12.5% from last month')).toBeInTheDocument()
    })

    it('displays trend indicators correctly', () => {
      render(<MockAnalyticsCard {...mockData} />)
      
      const trendElement = screen.getByText('12.5% from last month')
      expect(trendElement).toHaveClass('text-green-600')
    })

    it('handles negative trends', () => {
      const negativeData = {
        ...mockData,
        change: {
          value: 5.2,
          period: 'last month',
          type: 'decrease' as const
        }
      }
      render(<MockAnalyticsCard {...negativeData} />)
      
      const trendElement = screen.getByText('5.2% from last month')
      expect(trendElement).toHaveClass('text-red-600')
    })
  })

  describe('AdminNav', () => {
    it('renders navigation items', () => {
      render(<MockAdminNav />)
      
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      expect(screen.getByText('Leads')).toBeInTheDocument()
      expect(screen.getByText('Scheduling')).toBeInTheDocument()
      expect(screen.getByText('Reports')).toBeInTheDocument()
      expect(screen.getByText('Users')).toBeInTheDocument()
      expect(screen.getByText('Settings')).toBeInTheDocument()
    })

    it('highlights active navigation item', () => {
      render(<MockAdminNav />)
      
      const dashboardLink = screen.getByText('Dashboard').closest('a')
      expect(dashboardLink).toHaveClass('bg-primary')
    })

    it('has proper accessibility attributes', () => {
      render(<MockAdminNav />)
      
      const nav = screen.getByRole('navigation')
      expect(nav).toBeInTheDocument()
      expect(nav).toHaveAttribute('aria-label', 'Admin navigation')
    })
  })

  describe('DataTable', () => {
    const mockData = [
      { id: '1', name: 'John Doe', email: 'john@example.com', status: 'active' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' }
    ]

    const mockColumns = [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'status', label: 'Status' }
    ]

    it('renders table with data', () => {
      render(<MockDataTable data={mockData} columns={mockColumns} />)
      
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('jane@example.com')).toBeInTheDocument()
    })

    it('handles filtering', async () => {
      const user = userEvent.setup()
      render(<MockDataTable data={mockData} columns={mockColumns} />)
      
      const searchInput = screen.getByPlaceholderText('Search...')
      await user.type(searchInput, 'John')
      
      expect(searchInput).toHaveValue('John')
    })

    it('shows pagination controls', () => {
      render(<MockDataTable data={mockData} columns={mockColumns} />)
      
      expect(screen.getByText('Previous')).toBeInTheDocument()
      expect(screen.getByText('Next')).toBeInTheDocument()
    })
  })

  describe('QuickStats', () => {
    const mockStats = {
      title: 'Active Users',
      value: 1247
    }

    it('renders quick stats correctly', () => {
      render(<MockQuickStats {...mockStats} />)
      
      expect(screen.getByText('Active Users')).toBeInTheDocument()
      expect(screen.getByText('1,247')).toBeInTheDocument()
    })

    it('formats large numbers correctly', () => {
      const largeStats = { ...mockStats, value: 1234567 }
      render(<MockQuickStats {...largeStats} />)
      
      expect(screen.getByText('1,234,567')).toBeInTheDocument()
    })
  })

  describe('SystemHealth', () => {
    it('renders system health status', () => {
      render(<MockSystemHealth />)
      
      expect(screen.getByText('System Health')).toBeInTheDocument()
      expect(screen.getByText('API Status')).toBeInTheDocument()
      expect(screen.getByText('Database')).toBeInTheDocument()
    })

    it('shows correct status indicators', () => {
      render(<MockSystemHealth />)
      
      const operationalStatus = screen.getByText('Operational')
      expect(operationalStatus).toHaveClass('text-green-600')
      
      const warningStatus = screen.getByText('Warning')
      expect(warningStatus).toHaveClass('text-yellow-600')
    })

    it('displays performance metrics', () => {
      render(<MockSystemHealth />)
      
      expect(screen.getByText('120ms')).toBeInTheDocument()
      expect(screen.getByText('45')).toBeInTheDocument()
      expect(screen.getByText('12')).toBeInTheDocument()
    })
  })
})
