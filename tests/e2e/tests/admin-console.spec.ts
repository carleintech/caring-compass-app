// tests/e2e/tests/admin-console.spec.ts
import { test, expect } from '@playwright/test'
import { loginAsAdmin } from '../utils/auth-helpers'

test.describe('Admin Console', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page)
  })

  test('admin dashboard displays correctly', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Admin Dashboard')
    
    // Check for key metrics
    await expect(page.locator('text=Active Clients')).toBeVisible()
    await expect(page.locator('text=Active Caregivers')).toBeVisible()
    await expect(page.locator('text=Monthly Revenue')).toBeVisible()
    await expect(page.locator('text=Visit Completion')).toBeVisible()
  })

  test('admin can manage leads', async ({ page }) => {
    await page.click('text=Leads')
    await expect(page).toHaveURL('/admin/leads')
    
    // Test adding a new lead
    await page.click('button:has-text("Add Lead")')
    
    await page.fill('input[name="firstName"]', 'Test')
    await page.fill('input[name="lastName"]', 'Lead')
    await page.fill('input[name="email"]', 'testlead@example.com')
    await page.fill('input[name="phone"]', '(757) 555-0000')
    
    await page.click('button:has-text("Create Lead")')
    await expect(page.locator('text=Lead created successfully')).toBeVisible()
  })

  test('admin can manage scheduling conflicts', async ({ page }) => {
    await page.click('text=Scheduling')
    await expect(page).toHaveURL('/admin/scheduling')
    
    // Should show conflicts if any exist
    if (await page.locator('text=Scheduling Conflicts').isVisible()) {
      await page.click('button:has-text("Auto-Fix"):first')
      await expect(page.locator('text=Conflict resolved')).toBeVisible()
    }
  })

  test('admin can generate reports', async ({ page }) => {
    await page.click('text=Reports')
    await expect(page).toHaveURL('/admin/reports')
    
    // Test report export
    await page.click('button:has-text("Export")')
    // Should initiate download
    
    // Test time range selection
    await page.selectOption('select[name="timeRange"]', 'quarter')
    await expect(page.locator('[data-testid="revenue-chart"]')).toBeVisible()
  })

  test('admin can manage users', async ({ page }) => {
    await page.click('text=User Management')
    await expect(page).toHaveURL('/admin/user-management')
    
    // Test creating a new user
    await page.click('button:has-text("Add User")')
    
    await page.fill('input[name="firstName"]', 'Test')
    await page.fill('input[name="lastName"]', 'User')
    await page.fill('input[name="email"]', 'testuser@example.com')
    await page.selectOption('select[name="role"]', 'caregiver')
    
    await page.click('button:has-text("Create User")')
    await expect(page.locator('text=User created successfully')).toBeVisible()
  })

  test('admin can configure system settings', async ({ page }) => {
    await page.click('text=Settings')
    await expect(page).toHaveURL('/admin/settings')
    
    // Test updating company information
    await page.fill('input[name="companyName"]', 'Updated Company Name')
    await page.click('button:has-text("Save Changes")')
    
    await expect(page.locator('text=Settings saved successfully')).toBeVisible()
  })
})