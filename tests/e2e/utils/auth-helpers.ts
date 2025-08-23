// tests/e2e/utils/auth-helpers.ts
import { Page } from '@playwright/test'

export async function loginAsAdmin(page: Page) {
  await page.goto('/login')
  await page.fill('input[name="email"]', 'admin@caringcompass.com')
  await page.fill('input[name="password"]', 'AdminPass123!')
  await page.click('button[type="submit"]')
  await page.waitForURL('/admin/dashboard')
}

export async function loginAsClient(page: Page) {
  await page.goto('/login')
  await page.fill('input[name="email"]', 'client@example.com')
  await page.fill('input[name="password"]', 'ClientPass123!')
  await page.click('button[type="submit"]')
  await page.waitForURL('/client/dashboard')
}

export async function loginAsCaregiver(page: Page) {
  await page.goto('/login')
  await page.fill('input[name="email"]', 'caregiver@example.com')
  await page.fill('input[name="password"]', 'CaregiverPass123!')
  await page.click('button[type="submit"]')
  await page.waitForURL('/caregiver/dashboard')
}

export async function loginAsCoordinator(page: Page) {
  await page.goto('/login')
  await page.fill('input[name="email"]', 'coordinator@caringcompass.com')
  await page.fill('input[name="password"]', 'CoordPass123!')
  await page.click('button[type="submit"]')
  await page.waitForURL('/admin/dashboard')
}