// apps/web/src/app/(dashboard)/client/__tests__/billing.test.tsx
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { jest } from '@jest/globals'
import BillingPage from '../billing/page'

// Mock Stripe
jest.mock('@stripe/stripe-js', () => ({
  loadStripe: jest.fn(() => Promise.resolve({
    confirmPayment: jest.fn(() => Promise.resolve({ error: null }))
  }))
}))

// Mock tRPC
jest.mock('@/lib/trpc', () => ({
  api: {
    billing: {
      getInvoices: {
        useQuery: jest.fn(() => ({
          data: {
            invoices: [
              {
                id: '1',
                invoiceNumber: 'INV-001',
                dateIssued: '2025-01-01',
                dueDate: '2025-01-15',
                amount: 1200.00,
                status: 'pending',
                servicesPeriod: {
                  start: '2024-12-01',
                  end: '2024-12-31'
                },
                hoursProvided: 48
              }
            ]
          },
          isLoading: false,
          error: null
        }))
      },
      createPaymentIntent: {
        useMutation: jest.fn(() => ({
          mutate: jest.fn(),
          isLoading: false
        }))
      }
    }
  }
}))

describe('Client Billing', () => {
  it('displays invoice list', async () => {
    render(<BillingPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Invoice #INV-001')).toBeInTheDocument()
      expect(screen.getByText('$1,200.00')).toBeInTheDocument()
      expect(screen.getByText('48 hours')).toBeInTheDocument()
    })
  })

  it('shows payment button for pending invoices', async () => {
    render(<BillingPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Pay Now')).toBeInTheDocument()
    })
  })

  it('allows invoice download', async () => {
    render(<BillingPage />)
    
    await waitFor(() => {
      const downloadButton = screen.getByText('Download')
      expect(downloadButton).toBeInTheDocument()
      
      fireEvent.click(downloadButton)
      // Add assertion for download functionality
    })
  })
})