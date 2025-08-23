import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder as any

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    route: '/',
    pathname: '',
    query: {},
    asPath: '',
    push: jest.fn(),
    replace: jest.fn(),
  })
}))

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getSession: jest.fn(),
      getUser: jest.fn(),
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
    }
  })),
}))

// Mock database config
jest.mock('@caring-compass/database', () => ({
  databaseConfig: {
    supabase: {
      url: 'mock-url',
      anonKey: 'mock-key',
    }
  },
  UserRole: {
    ADMIN: 'ADMIN',
    CAREGIVER: 'CAREGIVER',
    CLIENT: 'CLIENT',
    CARE_MANAGER: 'CARE_MANAGER'
  }
}))

// Mock next/server
jest.mock('next/server', () => ({
  NextRequest: class NextRequest {
    constructor(input: string | Request, init?: RequestInit) {}
    cookies = {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
    }
  },
  NextResponse: {
    next: jest.fn(),
    redirect: jest.fn(),
    json: jest.fn(),
  }
}))
