// tests/security/infrastructure-security.test.ts
import { test, expect } from '@playwright/test'

test.describe('Infrastructure Security', () => {
  test('database connections are secure', async ({ page }) => {
    // This would test database connection security
    // In real implementation, would check:
    // - SSL/TLS encryption
    // - Connection string security
    // - Database user permissions
    
    expect(process.env.DATABASE_URL).toMatch(/^postgres.*sslmode=require/)
  })

  test('API endpoints use HTTPS in production', async ({ page }) => {
    if (process.env.NODE_ENV === 'production') {
      page.on('request', request => {
        if (request.url().includes('/api/')) {
          expect(request.url()).toMatch(/^https:\/\//)
        }
      })
      
      await page.goto('/')
      await page.click('text=Login')
    }
  })

  test('sensitive environment variables are not exposed', async ({ page }) => {
    // Check that sensitive env vars are not leaked to client
    await page.goto('/')
    
    const windowEnv = await page.evaluate(() => {
      return JSON.stringify(window)
    })
    
    // Should not contain database URLs, API keys, etc.
    expect(windowEnv).not.toContain('DATABASE_URL')
    expect(windowEnv).not.toContain('SECRET_KEY')
    expect(windowEnv).not.toContain('STRIPE_SECRET')
  })

  test('error handling does not leak information', async ({ page }) => {
    // Try to trigger an error
    const response = await page.context().request.post('/api/nonexistent-endpoint')
    
    const errorText = await response.text()
    
    // Should not contain stack traces or internal paths
    expect(errorText).not.toContain('Error:')
    expect(errorText).not.toContain('/var/www/')
    expect(errorText).not.toContain('node_modules')
  })
})