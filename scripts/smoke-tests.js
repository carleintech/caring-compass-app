// scripts/smoke-tests.js
class SmokeTests {
  constructor(baseUrl) {
    this.baseUrl = baseUrl
  }

  async runSmokeTests() {
    console.log('💨 RUNNING SMOKE TESTS')
    console.log('======================')

    const tests = [
      () => this.testHomePage(),
      () => this.testHealthEndpoint(),
      () => this.testLoginPage(),
      () => this.testRegistrationPage(),
      () => this.testAPIResponsiveness(),
      () => this.testDatabaseConnection(),
      () => this.testFileUpload(),
      () => this.testEmailService(),
      () => this.testPaymentService()
    ]

    let passed = 0
    const total = tests.length

    for (const test of tests) {
      try {
        await test()
        passed++
      } catch (error) {
        console.log(`❌ Test failed: ${error.message}`)
      }
    }

    console.log(`\n📊 Smoke Tests: ${passed}/${total} passed`)
    
    if (passed === total) {
      console.log('✅ All smoke tests passed - System is operational')
      return true
    } else {
      console.log('❌ Some smoke tests failed - System may have issues')
      return false
    }
  }

  async testHomePage() {
    const response = await axios.get(this.baseUrl, { timeout: 5000 })
    if (response.status !== 200) {
      throw new Error(`Home page returned ${response.status}`)
    }
    console.log('✅ Home page loads')
  }

  async testHealthEndpoint() {
    const response = await axios.get(`${this.baseUrl}/api/health`, { timeout: 5000 })
    if (response.status !== 200) {
      throw new Error(`Health endpoint returned ${response.status}`)
    }
    console.log('✅ Health endpoint responds')
  }

  async testLoginPage() {
    const response = await axios.get(`${this.baseUrl}/login`, { timeout: 5000 })
    if (response.status !== 200) {
      throw new Error(`Login page returned ${response.status}`)
    }
    console.log('✅ Login page loads')
  }

  async testRegistrationPage() {
    const response = await axios.get(`${this.baseUrl}/register`, { timeout: 5000 })
    if (response.status !== 200) {
      throw new Error(`Registration page returned ${response.status}`)
    }
    console.log('✅ Registration page loads')
  }

  async testAPIResponsiveness() {
    const startTime = Date.now()
    await axios.get(`${this.baseUrl}/api/health`, { timeout: 5000 })
    const responseTime = Date.now() - startTime
    
    if (responseTime > 2000) {
      throw new Error(`API too slow: ${responseTime}ms`)
    }
    console.log(`✅ API responds in ${responseTime}ms`)
  }

  async testDatabaseConnection() {
    const response = await axios.get(`${this.baseUrl}/api/health/database`, { timeout: 10000 })
    if (response.status !== 200) {
      throw new Error(`Database health check failed`)
    }
    console.log('✅ Database connection healthy')
  }

  async testFileUpload() {
    // Test file upload endpoint exists (not actual upload)
    try {
      await axios.options(`${this.baseUrl}/api/upload`, { timeout: 5000 })
      console.log('✅ File upload endpoint available')
    } catch (error) {
      if (error.response?.status === 405) {
        console.log('✅ File upload endpoint available (METHOD_NOT_ALLOWED expected)')
      } else {
        throw error
      }
    }
  }

  async testEmailService() {
    const response = await axios.get(`${this.baseUrl}/api/health/email`, { timeout: 5000 })
    if (response.status !== 200) {
      throw new Error(`Email service health check failed`)
    }
    console.log('✅ Email service healthy')
  }

  async testPaymentService() {
    const response = await axios.get(`${this.baseUrl}/api/health/stripe`, { timeout: 5000 })
    if (response.status !== 200) {
      throw new Error(`Payment service health check failed`)
    }
    console.log('✅ Payment service healthy')
  }
}

module.exports = { StagingValidator, SmokeTests }