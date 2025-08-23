// tests/e2e/tests/caregiver-portal.spec.ts
import { test, expect } from '@playwright/test'
import { loginAsCaregiver } from '../utils/auth-helpers'

test.describe('Caregiver Portal', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsCaregiver(page)
  })

  test('caregiver dashboard displays correctly', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('My Shifts')
    
    // Check for key dashboard elements
    await expect(page.locator('text=Today\'s Schedule')).toBeVisible()
    await expect(page.locator('text=This Week')).toBeVisible()
    await expect(page.locator('text=Recent Visits')).toBeVisible()
  })

  test('caregiver can clock in/out for visits', async ({ page }) => {
    await page.click('text=EVV')
    await expect(page).toHaveURL('/caregiver/evv')
    
    // Test clock-in process
    await page.click('button:has-text("Clock In"):first')
    
    // Should request location permission
    await page.context().grantPermissions(['geolocation'])
    
    await expect(page.locator('text=Clocked in successfully')).toBeVisible()
    await expect(page.locator('text=Clock Out')).toBeVisible()
    
    // Test clock-out process
    await page.click('button:has-text("Clock Out")')
    await expect(page.locator('text=Clocked out successfully')).toBeVisible()
  })

  test('caregiver can update availability', async ({ page }) => {
    await page.click('text=Availability')
    await expect(page).toHaveURL('/caregiver/availability')
    
    // Update availability for Monday
    await page.click('[data-day="monday"] input[type="checkbox"]')
    await page.fill('[data-day="monday"] input[name="startTime"]', '08:00')
    await page.fill('[data-day="monday"] input[name="endTime"]', '16:00')
    
    await page.click('button:has-text("Save Availability")')
    await expect(page.locator('text=Availability updated successfully')).toBeVisible()
  })

  test('caregiver can view payroll information', async ({ page }) => {
    await page.click('text=Payroll')
    await expect(page).toHaveURL('/caregiver/payroll')
    
    await expect(page.locator('h1')).toContainText('Payroll & Earnings')
    await expect(page.locator('text=Current Pay Period')).toBeVisible()
    await expect(page.locator('text=YTD Earnings')).toBeVisible()
    
    // Test downloading pay stub
    await page.click('button:has-text("Download Pay Stub"):first')
    // Should initiate download
  })

  test('caregiver can complete training modules', async ({ page }) => {
    await page.click('text=Training')
    await expect(page).toHaveURL('/caregiver/training')
    
    // Start a training module
    await page.click('button:has-text("Start Module"):first')
    
    await expect(page.locator('text=Training Progress')).toBeVisible()
    
    // Complete training steps
    await page.click('button:has-text("Next")')
    await page.click('button:has-text("Complete Module")')
    
    await expect(page.locator('text=Module completed successfully')).toBeVisible()
  })
})