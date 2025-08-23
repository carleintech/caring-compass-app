// tests/e2e/tests/accessibility.spec.ts
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility Tests', () => {
  test('homepage should be accessible', async ({ page }) => {
    await page.goto('/')
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('login page should be accessible', async ({ page }) => {
    await page.goto('/auth/login')
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('admin dashboard should be accessible', async ({ page }) => {
    // Login as admin first
    await page.goto('/auth/login')
    await page.fill('input[name="email"]', 'admin@caringcompass.com')
    await page.fill('input[name="password"]', 'AdminPass123!')
    await page.click('button[type="submit"]')
    await page.waitForURL('/admin/dashboard')
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .exclude('#charts') // Exclude complex charts from accessibility scan
      .analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('client portal should be accessible', async ({ page }) => {
    // Login as client first
    await page.goto('/auth/login')
    await page.fill('input[name="email"]', 'client@example.com')
    await page.fill('input[name="password"]', 'ClientPass123!')
    await page.click('button[type="submit"]')
    await page.waitForURL('/client/dashboard')
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })
})