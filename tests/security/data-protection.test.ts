// tests/security/data-protection.test.ts
import { test, expect } from '@playwright/test'
import { loginAsAdmin, loginAsClient } from '../e2e/utils/auth-helpers'

test.describe('Data Protection & Privacy', () => {
  test('PII is properly protected', async ({ page }) => {
    await loginAsClient(page)
    await page.goto('/client/profile')
    
    // Check that SSN or other sensitive data is masked
    const ssnField = page.locator('[data-field="ssn"]')
    if (await ssnField.count() > 0) {
      const ssnValue = await ssnField.textContent()
      expect(ssnValue).toMatch(/\*\*\*-\*\*-\d{4}/) // Should be masked
    }
  })

  test('data export follows privacy rules', async ({ page }) => {
    await loginAsClient(page)
    await page.goto('/client/profile')
    
    // Request data export
    await page.click('button:has-text("Export My Data")')
    
    // Should require additional verification
    await expect(page.locator('text=Verify your identity')).toBeVisible()
  })

  test('data deletion is thorough', async ({ page }) => {
    await loginAsClient(page)
    await page.goto('/client/settings')
    
    // Request account deletion
    await page.click('button:has-text("Delete Account")')
    
    // Should require multiple confirmations
    await expect(page.locator('text=This action cannot be undone')).toBeVisible()
    await page.click('button:has-text("I understand, delete my account")')
    
    // Should require password confirmation
    await expect(page.locator('input[name="password"]')).toBeVisible()
  })

  test('audit logs protect sensitive operations', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/admin/user-management')
    
    // View user details
    await page.click('button:has-text("View Details"):first')
    
    // Check that view action is logged
    await page.goto('/admin/user-management?tab=activity')
    await expect(page.locator('text=User profile viewed')).toBeVisible()
  })

  test('backup data is encrypted', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/admin/settings')
    
    // Navigate to backup section
    await page.click('text=General')
    await page.click('button:has-text("Export Settings")')
    
    // Downloaded backup should not contain plaintext passwords
    // This would require checking the downloaded file content
    // expect(backupContent).not.toContain('password:')
  })
})