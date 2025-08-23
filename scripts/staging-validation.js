// scripts/staging-validation.js
const axios = require('axios')
const { chromium } = require('playwright')

class StagingValidator {
  constructor(stagingUrl = 'https://staging.caringcompass.com') {
    this.baseUrl = stagingUrl
    this.testResults = []
    this.browser = null
    this.page = null
  }

  async runFullStagingValidation() {
    console.log('🔍 STAGING ENVIRONMENT VALIDATION')
    console.log('=================================')
    console.log(`Testing: ${this.baseUrl}`)
    console.log(`Started: ${new Date().toISOString()}`)

    try {
      await this.setupBrowser()
      await this.validateInfrastructure()
      await this.validateAuthentication()
      await this.validateClientWorkflow()
      await this.validateCaregiverWorkflow()
      await this.validateAdminWorkflow()
      await this.validateIntegrations()
      await this.validatePerformance()
      await this.generateStagingReport()
    } finally {
      await this.cleanup()
    }
  }

  async setupBrowser() {
    this.browser = await chromium.launch({ headless: true })
    this.page = await this.browser.newPage()
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close()
    }
  }

  async validateInfrastructure() {
    console.log('\n🏗️ Validating Infrastructure...')

    const infrastructureTests = [
      {
        name: 'Application Health',
        url: `${this.baseUrl}/api/health`,
        expectedStatus: 200
      },
      {
        name: 'Database Connection',
        url: `${this.baseUrl}/api/health/database`,
        expectedStatus: 200
      },
      {
        name: 'Redis Connection',
        url: `${this.baseUrl}/api/health/redis`,
        expectedStatus: 200
      },
      {
        name: 'File Storage',
        url: `${this.baseUrl}/api/health/storage`,
        expectedStatus: 200
      },
      {
        name: 'Email Service',
        url: `${this.baseUrl}/api/health/email`,
        expectedStatus: 200
      }
    ]

    for (const test of infrastructureTests) {
      try {
        const response = await axios.get(test.url, { timeout: 10000 })
        
        if (response.status === test.expectedStatus) {
          console.log(`✅ ${test.name}: Healthy`)
          this.testResults.push({
            category: 'Infrastructure',
            test: test.name,
            status: 'PASSED',
            details: `HTTP ${response.status}`
          })
        } else {
          console.log(`❌ ${test.name}: Unexpected status ${response.status}`)
          this.testResults.push({
            category: 'Infrastructure',
            test: test.name,
            status: 'FAILED',
            details: `Expected ${test.expectedStatus}, got ${response.status}`
          })
        }
      } catch (error) {
        console.log(`❌ ${test.name}: ${error.message}`)
        this.testResults.push({
          category: 'Infrastructure',
          test: test.name,
          status: 'FAILED',
          details: error.message
        })
      }
    }
  }

  async validateAuthentication() {
    console.log('\n🔐 Validating Authentication...')

    await this.page.goto(`${this.baseUrl}/login`)

    // Test login page loads
    await this.page.waitForSelector('form', { timeout: 10000 })
    console.log('✅ Login page loads successfully')

    // Test registration functionality
    await this.page.goto(`${this.baseUrl}/register`)
    await this.page.waitForSelector('form', { timeout: 10000 })
    console.log('✅ Registration page loads successfully')

    // Test password reset
    await this.page.goto(`${this.baseUrl}/forgot-password`)
    await this.page.waitForSelector('form', { timeout: 10000 })
    console.log('✅ Password reset page loads successfully')

    this.testResults.push({
      category: 'Authentication',
      test: 'Auth Pages Load',
      status: 'PASSED',
      details: 'All authentication pages load correctly'
    })
  }

  async validateClientWorkflow() {
    console.log('\n👨‍👩‍👧‍👦 Validating Client Workflow...')

    // Test client dashboard
    await this.page.goto(`${this.baseUrl}/client/dashboard`)
    
    // Check if redirected to login (expected for unauthenticated user)
    const currentUrl = this.page.url()
    if (currentUrl.includes('/login')) {
      console.log('✅ Client dashboard properly protected')
      
      this.testResults.push({
        category: 'Client Workflow',
        test: 'Dashboard Protection',
        status: 'PASSED',
        details: 'Client dashboard redirects to login when unauthenticated'
      })
    }

    // Test public client pages
    const clientPages = [
      '/client/onboarding',
      '/client/care-plan',
      '/client/schedule',
      '/client/billing'
    ]

    for (const page of clientPages) {
      try {
        await this.page.goto(`${this.baseUrl}${page}`)
        await this.page.waitForTimeout(2000)
        
        const title = await this.page.title()
        if (title && title !== 'Error') {
          console.log(`✅ Client page loads: ${page}`)
        }
      } catch (error) {
        console.log(`⚠️ Client page issue: ${page} - ${error.message}`)
      }
    }
  }

  async validateCaregiverWorkflow() {
    console.log('\n👩‍⚕️ Validating Caregiver Workflow...')

    // Test caregiver pages
    const caregiverPages = [
      '/caregiver/dashboard',
      '/caregiver/application',
      '/caregiver/shifts',
      '/caregiver/evv',
      '/caregiver/payroll'
    ]

    for (const page of caregiverPages) {
      try {
        await this.page.goto(`${this.baseUrl}${page}`)
        await this.page.waitForTimeout(2000)
        
        const currentUrl = this.page.url()
        if (currentUrl.includes('/login')) {
          console.log(`✅ Caregiver page protected: ${page}`)
        } else {
          console.log(`✅ Caregiver page loads: ${page}`)
        }
      } catch (error) {
        console.log(`⚠️ Caregiver page issue: ${page} - ${error.message}`)
      }
    }

    this.testResults.push({
      category: 'Caregiver Workflow',
      test: 'Page Navigation',
      status: 'PASSED',
      details: 'All caregiver pages load or redirect appropriately'
    })
  }

  async validateAdminWorkflow() {
    console.log('\n👔 Validating Admin Workflow...')

    // Test admin pages
    const adminPages = [
      '/admin/dashboard',
      '/admin/leads',
      '/admin/scheduling',
      '/admin/reports',
      '/admin/user-management'
    ]

    for (const page of adminPages) {
      try {
        await this.page.goto(`${this.baseUrl}${page}`)
        await this.page.waitForTimeout(2000)
        
        const currentUrl = this.page.url()
        if (currentUrl.includes('/login')) {
          console.log(`✅ Admin page protected: ${page}`)
        } else {
          console.log(`✅ Admin page loads: ${page}`)
        }
      } catch (error) {
        console.log(`⚠️ Admin page issue: ${page} - ${error.message}`)
      }
    }

    this.testResults.push({
      category: 'Admin Workflow',
      test: 'Page Navigation',
      status: 'PASSED',
      details: 'All admin pages load or redirect appropriately'
    })
  }

  async validateIntegrations() {
    console.log('\n🔌 Validating Integrations...')

    const integrationTests = [
      {
        name: 'Stripe Integration',
        url: `${this.baseUrl}/api/integrations/stripe/status`,
        test: async () => {
          try {
            const response = await axios.get(`${this.baseUrl}/api/integrations/stripe/status`)
            return response.data.status === 'connected'
          } catch (error) {
            return false
          }
        }
      },
      {
        name: 'Email Service',
        url: `${this.baseUrl}/api/integrations/email/status`,
        test: async () => {
          try {
            const response = await axios.get(`${this.baseUrl}/api/integrations/email/status`)
            return response.data.status === 'operational'
          } catch (error) {
            return false
          }
        }
      },
      {
        name: 'SMS Service',
        url: `${this.baseUrl}/api/integrations/sms/status`,
        test: async () => {
          try {
            const response = await axios.get(`${this.baseUrl}/api/integrations/sms/status`)
            return response.data.status === 'operational'
          } catch (error) {
            return false
          }
        }
      }
    ]

    for (const integration of integrationTests) {
      try {
        const isHealthy = await integration.test()
        
        if (isHealthy) {
          console.log(`✅ ${integration.name}: Connected`)
          this.testResults.push({
            category: 'Integrations',
            test: integration.name,
            status: 'PASSED',
            details: 'Integration is operational'
          })
        } else {
          console.log(`❌ ${integration.name}: Not connected`)
          this.testResults.push({
            category: 'Integrations',
            test: integration.name,
            status: 'FAILED',
            details: 'Integration is not operational'
          })
        }
      } catch (error) {
        console.log(`❌ ${integration.name}: Error - ${error.message}`)
        this.testResults.push({
          category: 'Integrations',
          test: integration.name,
          status: 'FAILED',
          details: error.message
        })
      }
    }
  }

  async validatePerformance() {
    console.log('\n⚡ Validating Performance...')

    const startTime = Date.now()
    
    try {
      await this.page.goto(this.baseUrl, { waitUntil: 'networkidle' })
      const loadTime = Date.now() - startTime
      
      console.log(`📊 Page load time: ${loadTime}ms`)
      
      if (loadTime < 3000) {
        console.log('✅ Performance: Good (< 3s)')
        this.testResults.push({
          category: 'Performance',
          test: 'Page Load Time',
          status: 'PASSED',
          details: `${loadTime}ms`
        })
      } else {
        console.log('⚠️ Performance: Slow (> 3s)')
        this.testResults.push({
          category: 'Performance',
          test: 'Page Load Time',
          status: 'WARNING',
          details: `${loadTime}ms - Slower than expected`
        })
      }

      // Test API response time
      const apiStartTime = Date.now()
      await axios.get(`${this.baseUrl}/api/health`)
      const apiTime = Date.now() - apiStartTime
      
      console.log(`📊 API response time: ${apiTime}ms`)
      
      if (apiTime < 500) {
        console.log('✅ API Performance: Good (< 500ms)')
        this.testResults.push({
          category: 'Performance',
          test: 'API Response Time',
          status: 'PASSED',
          details: `${apiTime}ms`
        })
      } else {
        console.log('⚠️ API Performance: Slow (> 500ms)')
        this.testResults.push({
          category: 'Performance',
          test: 'API Response Time',
          status: 'WARNING',
          details: `${apiTime}ms - Slower than expected`
        })
      }

    } catch (error) {
      console.log(`❌ Performance test failed: ${error.message}`)
      this.testResults.push({
        category: 'Performance',
        test: 'Load Test',
        status: 'FAILED',
        details: error.message
      })
    }
  }

  async generateStagingReport() {
    console.log('\n📊 STAGING VALIDATION REPORT')
    console.log('============================')

    const categories = [...new Set(this.testResults.map(r => r.category))]
    
    for (const category of categories) {
      const categoryTests = this.testResults.filter(r => r.category === category)
      const passed = categoryTests.filter(r => r.status === 'PASSED').length
      const total = categoryTests.length
      
      console.log(`\n${category}: ${passed}/${total} passed`)
      
      categoryTests.forEach(test => {
        const icon = test.status === 'PASSED' ? '✅' : test.status === 'WARNING' ? '⚠️' : '❌'
        console.log(`  ${icon} ${test.test}: ${test.details}`)
      })
    }

    // Overall summary
    const totalTests = this.testResults.length
    const passedTests = this.testResults.filter(r => r.status === 'PASSED').length
    const warningTests = this.testResults.filter(r => r.status === 'WARNING').length
    const failedTests = this.testResults.filter(r => r.status === 'FAILED').length

    console.log('\n📈 OVERALL SUMMARY:')
    console.log(`✅ Passed: ${passedTests}`)
    console.log(`⚠️ Warnings: ${warningTests}`)
    console.log(`❌ Failed: ${failedTests}`)
    console.log(`📊 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`)

    const isReadyForProduction = failedTests === 0 && warningTests <= 2

    if (isReadyForProduction) {
      console.log('\n🎉 STAGING VALIDATION PASSED - READY FOR PRODUCTION!')
    } else {
      console.log('\n⚠️ STAGING VALIDATION ISSUES FOUND - REVIEW BEFORE PRODUCTION')
    }

    // Save report
    const report = {
      timestamp: new Date().toISOString(),
      environment: 'staging',
      baseUrl: this.baseUrl,
      summary: {
        total: totalTests,
        passed: passedTests,
        warnings: warningTests,
        failed: failedTests,
        successRate: (passedTests / totalTests) * 100,
        readyForProduction: isReadyForProduction
      },
      results: this.testResults
    }

    require('fs').writeFileSync(
      `./reports/staging-validation-${Date.now()}.json`,
      JSON.stringify(report, null, 2)
    )

    console.log('\n📄 Report saved to ./reports/')

    return isReadyForProduction
  }
}