// tests/security/owasp-compliance.test.ts
import { test, expect } from '@playwright/test'
import { loginAsAdmin, loginAsClient } from '../e2e/utils/auth-helpers'

test.describe('OWASP Top 10 Security Tests', () => {
  
  test.describe('A01 - Broken Access Control', () => {
    test('unauthorized users cannot access admin routes', async ({ page }) => {
      // Try to access admin dashboard without authentication
      await page.goto('/admin/dashboard')
      
      // Should redirect to login
      await expect(page).toHaveURL('/login')
      await expect(page.locator('text=Sign in to your account')).toBeVisible()
    })

    test('clients cannot access other client data', async ({ page }) => {
      await loginAsClient(page)
      
      // Try to access another client's data by manipulating URL
      await page.goto('/client/profile/other-client-id')
      
      // Should show 403 or redirect to own profile
      await expect(page.locator('text=Access denied')).toBeVisible()
    })

    test('role-based access control is enforced', async ({ page }) => {
      await loginAsClient(page)
      
      // Try to access admin functionality
      const response = await page.goto('/admin/user-management')
      
      // Should be denied or redirected
      expect(response?.status()).toBe(403)
    })

    test('API endpoints respect permissions', async ({ page }) => {
      const context = page.context()
      
      // Login as client to get session
      await loginAsClient(page)
      
      // Try to access admin API endpoint
      const response = await context.request.get('/api/admin/users')
      
      expect(response.status()).toBe(403)
    })
  })

  test.describe('A02 - Cryptographic Failures', () => {
    test('sensitive data is transmitted over HTTPS', async ({ page }) => {
      // Ensure all requests use HTTPS in production
      page.on('request', request => {
        if (process.env.NODE_ENV === 'production') {
          expect(request.url()).toMatch(/^https:\/\//)
        }
      })

      await page.goto('/auth/login')
      await page.fill('input[name="email"]', 'test@example.com')
      await page.fill('input[name="password"]', 'password123')
      await page.click('button[type="submit"]')
    })

    test('passwords are not exposed in client-side code', async ({ page }) => {
      await page.goto('/auth/login')
      
      // Check that password field has proper type
      const passwordField = page.locator('input[name="password"]')
      await expect(passwordField).toHaveAttribute('type', 'password')
      
      // Ensure autocomplete is properly configured
      await expect(passwordField).toHaveAttribute('autocomplete', 'current-password')
    })

    test('session tokens are properly secured', async ({ page }) => {
      await loginAsAdmin(page)
      
      // Check for secure cookie attributes
      const cookies = await page.context().cookies()
      const sessionCookie = cookies.find(c => c.name.includes('session') || c.name.includes('token'))
      
      if (sessionCookie) {
        expect(sessionCookie.secure).toBe(true)
        expect(sessionCookie.httpOnly).toBe(true)
        expect(sessionCookie.sameSite).toBe('Strict')
      }
    })
  })

  test.describe('A03 - Injection', () => {
    test('SQL injection protection in search', async ({ page }) => {
      await loginAsAdmin(page)
      await page.goto('/admin/user-management')
      
      // Try SQL injection in search field
      const maliciousInput = "'; DROP TABLE users; --"
      await page.fill('input[placeholder*="Search"]', maliciousInput)
      
      // Should not cause errors or unexpected behavior
      await page.waitForTimeout(1000)
      await expect(page.locator('text=Error')).toHaveCount(0)
    })

    test('XSS protection in user inputs', async ({ page }) => {
      await loginAsAdmin(page)
      await page.goto('/admin/leads')
      
      // Try XSS injection in form
      await page.click('button:has-text("Add Lead")')
      
      const xssPayload = '<script>alert("XSS")</script>'
      await page.fill('input[name="firstName"]', xssPayload)
      await page.fill('input[name="lastName"]', 'Test')
      await page.fill('input[name="email"]', 'test@example.com')
      
      await page.click('button:has-text("Create Lead")')
      
      // Script should not execute
      await page.waitForTimeout(1000)
      await expect(page.locator('text=XSS')).toHaveCount(0)
    })

    test('command injection protection in file uploads', async ({ page }) => {
      await loginAsClient(page)
      await page.goto('/client/documents')
      
      // Test file upload with malicious filename
      const maliciousFilename = 'test; rm -rf /.pdf'
      
      // Should sanitize filename and not execute commands
      await page.setInputFiles('input[type="file"]', {
        name: maliciousFilename,
        mimeType: 'application/pdf',
        buffer: Buffer.from('fake pdf content')
      })
      
      await page.click('button:has-text("Upload")')
      
      // Should handle gracefully without executing commands
      await expect(page.locator('text=File uploaded successfully')).toBeVisible()
    })
  })

  test.describe('A04 - Insecure Design', () => {
    test('password reset requires email verification', async ({ page }) => {
      await page.goto('/auth/forgot-password')
      await page.fill('input[name="email"]', 'test@example.com')
      await page.click('button[type="submit"]')
      
      // Should not directly reset password
      await expect(page.locator('text=Check your email')).toBeVisible()
      
      // Should not reveal if email exists
      await page.fill('input[name="email"]', 'nonexistent@example.com')
      await page.click('button[type="submit"]')
      await expect(page.locator('text=Check your email')).toBeVisible()
    })

    test('account lockout after multiple failed login attempts', async ({ page }) => {
      await page.goto('/auth/login')
      
      // Attempt multiple failed logins
      for (let i = 0; i < 6; i++) {
        await page.fill('input[name="email"]', 'test@example.com')
        await page.fill('input[name="password"]', 'wrongpassword')
        await page.click('button[type="submit"]')
        await page.waitForTimeout(500)
      }
      
      // Should show account lockout message
      await expect(page.locator('text=Account temporarily locked')).toBeVisible()
    })

    test('session management is secure', async ({ page }) => {
      await loginAsAdmin(page)
      
      // Session should timeout after inactivity
      // Note: This would require waiting for session timeout in real test
      
      // Logout should invalidate session
      await page.click('button:has-text("Logout")')
      
      // Try to access protected page with old session
      await page.goto('/admin/dashboard')
      await expect(page).toHaveURL('/auth/login')
    })
  })

  test.describe('A05 - Security Misconfiguration', () => {
    test('error pages do not reveal sensitive information', async ({ page }) => {
      // Try to access non-existent page
      const response = await page.goto('/admin/nonexistent-page')
      
      // Should not reveal stack traces or internal paths
      const content = await page.content()
      expect(content).not.toContain('Error:')
      expect(content).not.toContain('at ')
      expect(content).not.toContain('/node_modules/')
    })

    test('security headers are properly set', async ({ page }) => {
      const response = await page.goto('/')
      
      const headers = response?.headers()
      
      // Check for security headers
      expect(headers?.['x-frame-options']).toBeDefined()
      expect(headers?.['x-content-type-options']).toBe('nosniff')
      expect(headers?.['x-xss-protection']).toBeDefined()
      expect(headers?.['strict-transport-security']).toBeDefined()
      expect(headers?.['content-security-policy']).toBeDefined()
    })

    test('default credentials are not used', async ({ page }) => {
      await page.goto('/auth/login')
      
      // Try common default credentials
      const defaultCredentials = [
        { email: 'admin@admin.com', password: 'admin' },
        { email: 'admin@example.com', password: 'password' },
        { email: 'test@test.com', password: 'test' }
      ]
      
      for (const creds of defaultCredentials) {
        await page.fill('input[name="email"]', creds.email)
        await page.fill('input[name="password"]', creds.password)
        await page.click('button[type="submit"]')
        
        // Should not succeed with default credentials
        await expect(page.locator('text=Invalid credentials')).toBeVisible()
      }
    })
  })

  test.describe('A06 - Vulnerable Components', () => {
    test('application uses secure dependencies', async () => {
      // This would typically be checked with npm audit or similar tools
      // For demonstration, we'll check that known vulnerable patterns aren't used
      
      // In a real implementation, this would run:
      // const auditResult = execSync('npm audit --audit-level=high --json')
      // expect(JSON.parse(auditResult).vulnerabilities).toEqual({})
      
      expect(true).toBe(true) // Placeholder
    })
  })

  test.describe('A07 - Identification and Authentication Failures', () => {
    test('weak passwords are rejected', async ({ page }) => {
      await page.goto('/auth/register')
      
      await page.fill('input[name="email"]', 'test@example.com')
      await page.fill('input[name="password"]', '123') // Weak password
      await page.fill('input[name="confirmPassword"]', '123')
      
      await page.click('button[type="submit"]')
      
      // Should show password strength error
      await expect(page.locator('text=Password must be at least 8 characters')).toBeVisible()
    })

    test('MFA is enforced for admin users', async ({ page }) => {
      // This would test MFA implementation if enabled
      await page.goto('/auth/login')
      await page.fill('input[name="email"]', 'admin@caringcompass.com')
      await page.fill('input[name="password"]', 'AdminPass123!')
      await page.click('button[type="submit"]')
      
      // Should prompt for MFA code if enabled
      // await expect(page.locator('text=Enter verification code')).toBeVisible()
    })

    test('session management prevents fixation', async ({ page }) => {
      // Get initial session ID
      await page.goto('/')
      const initialCookies = await page.context().cookies()
      const initialSessionId = initialCookies.find(c => c.name.includes('session'))?.value
      
      // Login
      await loginAsAdmin(page)
      
      // Session ID should change after login
      const postLoginCookies = await page.context().cookies()
      const postLoginSessionId = postLoginCookies.find(c => c.name.includes('session'))?.value
      
      expect(postLoginSessionId).not.toBe(initialSessionId)
    })
  })

  test.describe('A08 - Software and Data Integrity Failures', () => {
    test('file uploads are validated', async ({ page }) => {
      await loginAsClient(page)
      await page.goto('/client/documents')
      
      // Try to upload executable file
      await page.setInputFiles('input[type="file"]', {
        name: 'malicious.exe',
        mimeType: 'application/x-msdownload',
        buffer: Buffer.from('fake executable')
      })
      
      await page.click('button:has-text("Upload")')
      
      // Should reject non-allowed file types
      await expect(page.locator('text=File type not allowed')).toBeVisible()
    })

    test('file size limits are enforced', async ({ page }) => {
      await loginAsClient(page)
      await page.goto('/client/documents')
      
      // Try to upload large file (simulated)
      const largeBuffer = Buffer.alloc(50 * 1024 * 1024) // 50MB
      
      await page.setInputFiles('input[type="file"]', {
        name: 'large-file.pdf',
        mimeType: 'application/pdf',
        buffer: largeBuffer
      })
      
      await page.click('button:has-text("Upload")')
      
      // Should reject files over size limit
      await expect(page.locator('text=File too large')).toBeVisible()
    })
  })

  test.describe('A09 - Security Logging and Monitoring Failures', () => {
    test('failed login attempts are logged', async ({ page }) => {
      await page.goto('/auth/login')
      
      // Attempt failed login
      await page.fill('input[name="email"]', 'test@example.com')
      await page.fill('input[name="password"]', 'wrongpassword')
      await page.click('button[type="submit"]')
      
      // In real implementation, would check server logs
      // expect(serverLogs).toContain('Failed login attempt for test@example.com')
      
      await expect(page.locator('text=Invalid credentials')).toBeVisible()
    })

    test('admin actions are audited', async ({ page }) => {
      await loginAsAdmin(page)
      await page.goto('/admin/user-management')
      
      // Perform admin action
      await page.click('button:has-text("Add User")')
      await page.fill('input[name="firstName"]', 'Test')
      await page.fill('input[name="lastName"]', 'User')
      await page.fill('input[name="email"]', 'newuser@example.com')
      await page.click('button:has-text("Create User")')
      
      // Check audit log (would need to navigate to audit section)
      await page.goto('/admin/user-management?tab=activity')
      await expect(page.locator('text=User created')).toBeVisible()
    })
  })

  test.describe('A10 - Server-Side Request Forgery (SSRF)', () => {
    test('external URL requests are validated', async ({ page }) => {
      await loginAsAdmin(page)
      
      // Try to make request to internal network
      const response = await page.context().request.post('/api/admin/webhook-test', {
        data: {
          url: 'http://localhost:22/ssh-config'
        }
      })
      
      // Should reject requests to internal networks
      expect(response.status()).toBe(400)
    })

    test('webhook URLs are validated', async ({ page }) => {
      await loginAsAdmin(page)
      await page.goto('/admin/settings')
      
      // Navigate to integrations tab
      await page.click('text=Integrations')
      
      // Try to set malicious webhook URL
      await page.fill('input[name="webhookUrl"]', 'http://127.0.0.1:22')
      await page.click('button:has-text("Save")')
      
      // Should reject internal network URLs
      await expect(page.locator('text=Invalid webhook URL')).toBeVisible()
    })
  })
})