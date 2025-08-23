// tests/e2e/tests/performance.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Performance Tests', () => {
  test('homepage loads within performance budget', async ({ page }) => {
    await page.goto('/')
    
    // Measure Core Web Vitals
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lcp = entries.find(entry => entry.entryType === 'largest-contentful-paint')
          if (lcp) {
            resolve({
              lcp: lcp.startTime,
              fcp: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime
            })
          }
        }).observe({ entryTypes: ['largest-contentful-paint'] })
      })
    })
    
    // Verify LCP is under 2.5 seconds
    expect(metrics.lcp).toBeLessThan(2500)
  })

  test('admin dashboard loads efficiently', async ({ page }) => {
    // Login as admin
    await page.goto('/auth/login')
    await page.fill('input[name="email"]', 'admin@caringcompass.com')
    await page.fill('input[name="password"]', 'AdminPass123!')
    
    // Measure navigation to dashboard
    const navigationStart = Date.now()
    await page.click('button[type="submit"]')
    await page.waitForURL('/admin/dashboard')
    await page.waitForSelector('h1:has-text("Admin Dashboard")')
    const navigationEnd = Date.now()
    
    const navigationTime = navigationEnd - navigationStart
    
    // Navigation should complete within 3 seconds
    expect(navigationTime).toBeLessThan(3000)
  })

  test('API responses are fast', async ({ page }) => {
    // Intercept API calls and measure response times
    const apiTimes: number[] = []
    
    page.on('response', response => {
      if (response.url().includes('/api/')) {
        const timing = response.timing()
        if (timing) {
          apiTimes.push(timing.responseEnd - timing.requestStart)
        }
      }
    })
    
    // Login and navigate to data-heavy page
    await page.goto('/auth/login')
    await page.fill('input[name="email"]', 'admin@caringcompass.com')
    await page.fill('input[name="password"]', 'AdminPass123!')
    await page.click('button[type="submit"]')
    await page.waitForURL('/admin/dashboard')
    
    // Navigate to reports page (data-heavy)
    await page.click('text=Reports')
    await page.waitForURL('/admin/reports')
    await page.waitForSelector('text=Total Revenue')
    
    // Check that API responses are under 300ms
    const avgResponseTime = apiTimes.reduce((a, b) => a + b, 0) / apiTimes.length
    expect(avgResponseTime).toBeLessThan(300)
  })
})