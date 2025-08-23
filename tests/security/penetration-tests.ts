// tests/security/penetration-tests.ts
import { test, expect } from '@playwright/test'

test.describe('Penetration Testing Scenarios', () => {
  test('directory traversal protection', async ({ page }) => {
    // Try directory traversal in file download
    const response = await page.context().request.get('/api/files/download?path=../../../etc/passwd')
    
    // Should not allow directory traversal
    expect(response.status()).toBe(403)
  })

  test('CSRF protection is enabled', async ({ page }) => {
    await page.goto('/auth/login')
    
    // Get CSRF token
    const csrfToken = await page.locator('input[name="_token"]').getAttribute('value')
    
    // Try request without CSRF token
    const response = await page.context().request.post('/api/admin/users', {
      data: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com'
      }
    })
    
    // Should be rejected without CSRF token
    expect(response.status()).toBe(403)
  })

  test('rate limiting is enforced', async ({ page }) => {
    // Make multiple rapid requests
    const promises = []
    for (let i = 0; i < 100; i++) {
      promises.push(
        page.context().request.post('/api/auth/login', {
          data: {
            email: 'test@example.com',
            password: 'wrongpassword'
          }
        })
      )
    }
    
    const responses = await Promise.all(promises)
    
    // Should have some rate limited responses
    const rateLimitedResponses = responses.filter(r => r.status() === 429)
    expect(rateLimitedResponses.length).toBeGreaterThan(0)
  })

  test('clickjacking protection', async ({ page }) => {
    const response = await page.goto('/')
    const headers = response?.headers()
    
    // Should have X-Frame-Options or CSP frame-ancestors
    const hasFrameOptions = headers?.['x-frame-options'] === 'DENY' || 
                           headers?.['x-frame-options'] === 'SAMEORIGIN'
    const hasCSPFrameAncestors = headers?.['content-security-policy']?.includes('frame-ancestors')
    
    expect(hasFrameOptions || hasCSPFrameAncestors).toBe(true)
  })

  test('content type sniffing protection', async ({ page }) => {
    const response = await page.goto('/')
    const headers = response?.headers()
    
    expect(headers?.['x-content-type-options']).toBe('nosniff')
  })
})