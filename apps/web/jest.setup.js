// Import Jest DOM matchers
import '@testing-library/jest-dom'

// Import React for JSX
import React from 'react'
import { render } from '@testing-library/react'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock Next.js image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />
  },
}))

// Mock tRPC
jest.mock('@/lib/trpc', () => ({
  trpc: {
    auth: {
      login: {
        useMutation: jest.fn(() => ({
          mutate: jest.fn(),
          isLoading: false,
          error: null,
        })),
      },
      register: {
        useMutation: jest.fn(() => ({
          mutate: jest.fn(),
          isLoading: false,
          error: null,
        })),
      },
    },
    clients: {
      getAll: {
        useQuery: jest.fn(() => ({
          data: [],
          isLoading: false,
          error: null,
        })),
      },
    },
    caregivers: {
      getAll: {
        useQuery: jest.fn(() => ({
          data: [],
          isLoading: false,
          error: null,
        })),
      },
    },
  },
}))

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {
    return null
  }
  disconnect() {
    return null
  }
  unobserve() {
    return null
  }
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {
    return null
  }
  disconnect() {
    return null
  }
  unobserve() {
    return null
  }
}

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.sessionStorage = sessionStorageMock

// Mock console methods for cleaner test output
global.console = {
  ...console,
  // Uncomment to ignore a specific log level
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
}

// Setup environment variables for tests
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000/api'

// Global test utilities
global.renderWithProviders = (ui, options = {}) => {
  const { providers = [], ...renderOptions } = options
  
  function Wrapper({ children }) {
    return providers.reduce(
      (acc, Provider) => <Provider>{acc}</Provider>,
      children
    )
  }
  
  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// Mock fetch for API calls
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
    ok: true,
    status: 200,
  })
)

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks()
  localStorageMock.clear()
  sessionStorageMock.clear()
})