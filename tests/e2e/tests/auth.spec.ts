// tests/e2e/tests/auth.spec.ts
import { test, expect } from '@playwright/test'
import { loginAsAdmin, loginAsClient, loginAsCaregiver } from '../utils/auth-helpers'

test.describe('Authentication Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('user can navigate to login page', async ({ page }) => {
    await page.click('text=Login')
    await expect(page).toHaveURL('/auth/login')
    await expect(page.locator('h1')).toContainText('Sign in to your account')
  })

  test('admin login flow works correctly', async ({ page }) => {
    await loginAsAdmin(page)
    
    // Should redirect to admin dashboard
    await expect(page).toHaveURL('/admin/dashboard')
    await expect(page.locator('h1')).toContainText('Admin Dashboard')
    
    // Should show admin navigation
    await expect(page.locator('text=Lead Management')).toBeVisible()
    await expect(page.locator('text=User Management')).toBeVisible()
  })

  test('client login flow works correctly', async ({ page }) => {
    await loginAsClient(page)
    
    // Should redirect to client dashboard
    await expect(page).toHaveURL('/client/dashboard')
    await expect(page.locator('h1')).toContainText('My Care Dashboard')
    
    // Should show client navigation
    await expect(page.locator('text=Care Plan')).toBeVisible()
    await expect(page.locator('text=Schedule')).toBeVisible()
  })

  test('caregiver login flow works correctly', async ({ page }) => {
    await loginAsCaregiver(page)
    
    // Should redirect to caregiver dashboard
    await expect(page).toHaveURL('/caregiver/dashboard')
    await expect(page.locator('h1')).toContainText('My Shifts')')
    
    // Should show caregiver navigation
    await expect(page.locator('text=EVV')).toBeVisible()
    await expect(page.locator('text=Availability')).toBeVisible()
  })

  test('invalid login shows error message', async ({ page }) => {
    await page.goto('/auth/login')
    await page.fill('input[name="email"]', 'invalid@example.com')
    await page.fill('input[name="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')
    
    await expect(page.locator('text=Invalid credentials')).toBeVisible()
  })

  test('password reset flow works', async ({ page }) => {
    await page.goto('/auth/forgot-password')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.click('button[type="submit"]')
    
    await expect(page.locator('text=Check your email')).toBeVisible()
  })
})