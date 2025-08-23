// tests/performance/load-testing.ts
import { test, expect } from '@playwright/test'

test.describe('Load Testing', () => {
  test('concurrent user simulation', async ({ page, context }) => {
    const users = 10
    const promises: Promise<void>[] = []

    for (let i = 0; i < users; i++) {
      promises.push(simulateUser(context, i))
    }

    await Promise.all(promises)
  })

  test('database query performance', async ({ page }) => {
    // Login as admin to access reports
    await page.goto('/login')
    await page.fill('input[name="email"]', 'admin@caringcompass.com')
    await page.fill('input[name="password"]', 'AdminPass123!')
    await page.click('button[type="submit"]')

    // Navigate to data-heavy page
    const startTime = Date.now()
    await page.goto('/admin/reports')
    await page.waitForSelector('text=Total Revenue')
    const endTime = Date.now()

    const loadTime = endTime - startTime
    expect(loadTime).toBeLessThan(3000) // Should load within 3 seconds

    // Check for loading states
    await expect(page.locator('[data-testid="loading-spinner"]')).toHaveCount(0)
  })

  test('API response times under load', async ({ page }) => {
    const apiTimes: number[] = []

    page.on('response', response => {
      if (response.url().includes('/api/')) {
        const timing = response.timing()
        if (timing) {
          apiTimes.push(timing.responseEnd - timing.requestStart)
        }
      }
    })

    // Simulate multiple API calls
    await page.goto('/admin/dashboard')
    await page.click('text=Reports')
    await page.click('text=User Management')
    await page.click('text=Scheduling')

    // Wait for all requests to complete
    await page.waitForTimeout(2000)

    // Verify API performance
    const avgResponseTime = apiTimes.reduce((a, b) => a + b, 0) / apiTimes.length
    const maxResponseTime = Math.max(...apiTimes)

    expect(avgResponseTime).toBeLessThan(300) // Average under 300ms
    expect(maxResponseTime).toBeLessThan(1000) // Max under 1 second
  })

  test('memory usage stays within bounds', async ({ page }) => {
    // Navigate through memory-intensive operations
    await page.goto('/admin/dashboard')
    
    const initialMemory = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0
    })

    // Perform memory-intensive operations
    for (let i = 0; i < 10; i++) {
      await page.goto('/admin/reports')
      await page.goto('/admin/scheduling')
      await page.goto('/admin/user-management')
    }

    const finalMemory = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0
    })

    // Memory growth should be reasonable
    const memoryGrowth = finalMemory - initialMemory
    expect(memoryGrowth).toBeLessThan(50 * 1024 * 1024) // Less than 50MB growth
  })
})

async function simulateUser(context: any, userId: number) {
  const page = await context.newPage()
  
  try {
    // Simulate user journey
    await page.goto('/')
    await page.click('text=Login')
    
    // Simulate different user types
    const userType = userId % 3
    if (userType === 0) {
      // Client simulation
      await page.fill('input[name="email"]', `client${userId}@example.com`)
      await page.fill('input[name="password"]', 'ClientPass123!')
      await page.click('button[type="submit"]')
      await page.goto('/client/dashboard')
      await page.goto('/client/schedule')
    } else if (userType === 1) {
      // Caregiver simulation
      await page.fill('input[name="email"]', `caregiver${userId}@example.com`)
      await page.fill('input[name="password"]', 'CaregiverPass123!')
      await page.click('button[type="submit"]')
      await page.goto('/caregiver/dashboard')
      await page.goto('/caregiver/evv')
    } else {
      // Admin simulation
      await page.fill('input[name="email"]', 'admin@caringcompass.com')
      await page.fill('input[name="password"]', 'AdminPass123!')
      await page.click('button[type="submit"]')
      await page.goto('/admin/dashboard')
      await page.goto('/admin/reports')
    }
    
    // Random navigation
    await page.waitForTimeout(Math.random() * 2000 + 1000)
    
  } finally {
    await page.close()
  }
}