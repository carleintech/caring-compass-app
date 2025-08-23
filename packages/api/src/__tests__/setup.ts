import { jest } from '@jest/globals'

// Global test setup
beforeAll(async () => {
  // Set test environment variables
  process.env.NODE_ENV = 'test'
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/caring_compass_test'
  process.env.SUPABASE_URL = 'https://test.supabase.co'
  process.env.SUPABASE_ANON_KEY = 'test-anon-key'
  process.env.SUPABASE_SERVICE_KEY = 'test-service-key'
  process.env.JWT_SECRET = 'test-jwt-secret'
})

// Mock external services
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      getUser: jest.fn(),
      updateUser: jest.fn()
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn()
    }))
  }))
}))

// Mock Prisma client
jest.mock('superjson', () => ({
  default: {
    parse: jest.fn((input: any) => input),
    stringify: jest.fn((input: any) => input),
  }
}))

jest.mock('@caring-compass/database/src/utils', () => ({
  getPrismaClient: jest.fn(() => ({
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn()
    },
    clientProfile: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn()
    },
    caregiverProfile: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn()
    },
    visit: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn()
    },
    invoice: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn()
    },
    payment: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn()
    },
    message: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn()
    },
    messageThread: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn()
    },
    document: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn()
    },
    auditLog: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn()
    },
    passwordResetToken: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn()
    },
    caregiverSkill: {
      create: jest.fn(),
      findMany: jest.fn(),
      deleteMany: jest.fn()
    },
    caregiverAvailability: {
      create: jest.fn(),
      findMany: jest.fn(),
      deleteMany: jest.fn(),
      update: jest.fn()
    },
    evvEvent: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn()
    },
    $transaction: jest.fn(async (fn) => {
      if (typeof fn === 'function') {
        return await fn(this)
      }
      return fn
    }),
    $disconnect: jest.fn(),
    $queryRaw: jest.fn()
  }))
}))

// Mock authentication service
jest.mock('@caring-compass/auth', () => ({
  AuthService: {
    verifyToken: jest.fn(),
    generateTokens: jest.fn(),
    hashPassword: jest.fn(),
    verifyPassword: jest.fn()
  },
  PermissionsManager: {
    checkPermission: jest.fn(),
    getUserPermissions: jest.fn()
  }
}))

// Console suppression for tests
const originalConsoleError = console.error
const originalConsoleWarn = console.warn

beforeEach(() => {
  // Suppress console output in tests unless explicitly needed
  console.error = jest.fn()
  console.warn = jest.fn()
})

afterEach(() => {
  // Restore console functions
  console.error = originalConsoleError
  console.warn = originalConsoleWarn
  
  // Clear all mocks
  jest.clearAllMocks()
})

// Global test utilities
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidDate(): R
      toBeValidEmail(): R
      toBeValidPhoneNumber(): R
    }
  }
}

// Custom Jest matchers
expect.extend({
  toBeValidDate(received) {
    const pass = received instanceof Date && !isNaN(received.getTime())
    return {
      message: () => `expected ${received} to be a valid Date`,
      pass
    }
  },

  toBeValidEmail(received) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const pass = typeof received === 'string' && emailRegex.test(received)
    return {
      message: () => `expected ${received} to be a valid email address`,
      pass
    }
  },

  toBeValidPhoneNumber(received) {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/
    const pass = typeof received === 'string' && phoneRegex.test(received)
    return {
      message: () => `expected ${received} to be a valid phone number`,
      pass
    }
  }
})

// Test data factories
export const TestDataFactory = {
  createUser: (overrides: any = {}) => ({
    id: 'test-user-id',
    email: 'test@example.com',
    role: 'CLIENT',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLoginAt: null,
    emailVerifiedAt: new Date(),
    ...overrides
  }),

  createClientProfile: (userId: string, overrides: any = {}) => ({
    id: 'test-client-profile-id',
    userId,
    firstName: 'John',
    lastName: 'Doe',
    phone: '555-0123',
    address: '123 Main St',
    city: 'Virginia Beach',
    state: 'VA',
    zipCode: '23451',
    dateOfBirth: new Date('1950-01-01'),
    status: 'ACTIVE',
    ...overrides
  }),

  createCaregiverProfile: (userId: string, overrides: any = {}) => ({
    id: 'test-caregiver-profile-id',
    userId,
    firstName: 'Jane',
    lastName: 'Caregiver',
    phone: '555-0456',
    address: '456 Care St',
    city: 'Norfolk',
    state: 'VA',
    zipCode: '23501',
    dateOfBirth: new Date('1990-01-01'),
    gender: 'FEMALE',
    primaryLanguage: 'English',
    yearsExperience: 3,
    hourlyRate: 18.50,
    status: 'ACTIVE',
    ...overrides
  }),

  createVisit: (clientId: string, caregiverId?: string, overrides: any = {}) => ({
    id: 'test-visit-id',
    clientId,
    caregiverId,
    scheduledStart: new Date(),
    scheduledEnd: new Date(Date.now() + 4 * 60 * 60 * 1000),
    serviceType: 'Personal Care',
    status: 'SCHEDULED',
    tasks: ['Medication reminder', 'Companionship'],
    ...overrides
  }),

  createInvoice: (clientId: string, overrides: any = {}) => ({
    id: 'test-invoice-id',
    clientId,
    invoiceNumber: 'INV-001',
    totalAmount: 100.00,
    status: 'PENDING',
    billingPeriod: {
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      endDate: new Date()
    },
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    ...overrides
  })
}

// Test database utilities
export const TestDbUtils = {
  async seedTestData() {
    // In a real implementation, this would seed the test database
    console.log('Seeding test data (placeholder)')
  },

  async cleanupTestData() {
    // In a real implementation, this would clean up test data
    console.log('Cleaning up test data (placeholder)')
  }
}