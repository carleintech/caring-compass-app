// tests/e2e/tests/client-portal.spec.ts
import { test, expect } from '@playwright/test'
import { loginAsClient } from '../utils/auth-helpers'

test.describe('Client Portal', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsClient(page)
  })

  test('client dashboard displays correctly', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('My Care Dashboard')
    
    // Check for key dashboard elements
    await expect(page.locator('text=Upcoming Visits')).toBeVisible()
    await expect(page.locator('text=Care Team')).toBeVisible()
    await expect(page.locator('text=Recent Activity')).toBeVisible()
  })

  test('client can view care plan', async ({ page }) => {
    await page.click('text=Care Plan')
    await expect(page).toHaveURL('/client/care-plan')
    
    await expect(page.locator('h1')).toContainText('My Care Plan')
    await expect(page.locator('text=Care Goals')).toBeVisible()
    await expect(page.locator('text=Service Tasks')).toBeVisible()
  })

  test('client can view schedule', async ({ page }) => {
    await page.click('text=Schedule')
    await expect(page).toHaveURL('/client/schedule')
    
    await expect(page.locator('h1')).toContainText('Visit Schedule')
    await expect(page.locator('[data-testid="calendar-view"]')).toBeVisible()
  })

  test('client can view billing information', async ({ page }) => {
    await page.click('text=Billing')
    await expect(page).toHaveURL('/client/billing')
    
    await expect(page.locator('h1')).toContainText('Billing & Payments')
    await expect(page.locator('text=Recent Invoices')).toBeVisible()
    await expect(page.locator('text=Payment Methods')).toBeVisible()
  })

  test('client can send messages', async ({ page }) => {
    await page.click('text=Messages')
    await expect(page).toHaveURL('/client/messages')
    
    await page.click('button:has-text("New Message")')
    await page.fill('textarea[placeholder*="message"]', 'Test message from E2E test')
    await page.click('button:has-text("Send")')
    
    await expect(page.locator('text=Message sent successfully')).toBeVisible()
  })

  test('client can make payment', async ({ page }) => {
    await page.goto('/client/billing')
    
    // Click on an unpaid invoice
    await page.click('button:has-text("Pay Now"):first')
    
    // Should show payment modal
    await expect(page.locator('text=Payment Details')).toBeVisible()
    
    // Test payment form (using test Stripe keys)
    await page.fill('[data-testid="card-number"]', '4242424242424242')
    await page.fill('[data-testid="card-expiry"]', '12/25')
    await page.fill('[data-testid="card-cvc"]', '123')
    
    await page.click('button:has-text("Complete Payment")')
    await expect(page.locator('text=Payment successful')).toBeVisible()
  })
})