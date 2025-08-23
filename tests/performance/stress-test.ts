// tests/performance/stress-test.ts
import { test, expect } from '@playwright/test'

test.describe('Stress Testing', () => {
  test('handle rapid form submissions', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[name="email"]', 'admin@caringcompass.com')
    await page.fill('input[name="password"]', 'AdminPass123!')
    await page.click('button[type="submit"]')
    
    await page.goto('/admin/leads')
    
    // Rapidly create multiple leads
    for (let i = 0; i < 10; i++) {
      await page.click('button:has-text("Add Lead")')
      await page.fill('input[name="firstName"]', `Test${i}`)
      await page.fill('input[name="lastName"]', `Lead${i}`)
      await page.fill('input[name="email"]', `test${i}@example.com`)
      await page.click('button:has-text("Create Lead")')
      
      // Should handle rapid submissions gracefully
      await expect(page.locator('text=Lead created successfully')).toBeVisible()
    }
  })
  
  test('handle large data sets', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[name="email"]', 'admin@caringcompass.com')
    await page.fill('input[name="password"]', 'AdminPass123!')
    await page.click('button[type="submit"]')
    
    // Navigate to page with large dataset
    await page.goto('/admin/reports')
    
    // Should handle large data visualization
    await expect(page.locator('[data-testid="large-dataset-chart"]')).toBeVisible()
    
    // Page should remain responsive
    await page.click('text=Financial')
    await expect(page.locator('text=Revenue')).toBeVisible()
  })
  
  test('concurrent user operations', async ({ context }) => {
    // Simulate multiple admin users performing operations simultaneously
    const adminTasks = []
    
    for (let i = 0; i < 5; i++) {
      adminTasks.push(performAdminTask(context, i))
    }
    
    await Promise.all(adminTasks)
  })
})

async function performAdminTask(context: any, taskId: number) {
  const page = await context.newPage()
  
  try {
    await page.goto('/auth/login')
    await page.fill('input[name="email"]', 'admin@caringcompass.com')
    await page.fill('input[name="password"]', 'AdminPass123!')
    await page.click('button[type="submit"]')
    
    // Perform different tasks based on taskId
    switch (taskId % 3) {
      case 0:
        // User management task
        await page.goto('/admin/user-management')
        await page.click('button:has-text("Add User")')
        break
      case 1:
        // Scheduling task
        await page.goto('/admin/scheduling')
        await page.click('button:has-text("Schedule Visit")')
        break
      case 2:
        // Reports task
        await page.goto('/admin/reports')
        await page.click('button:has-text("Export")')
        break
    }
    
    await page.waitForTimeout(1000)
    
  } finally {
    await page.close()
  }
}