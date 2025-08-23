// tests/security/penetration-test.js
class PenetrationTest {
  async runBasicPenTest() {
    console.log('\n🎯 Basic Penetration Testing')
    console.log('=============================')

    await this.testRateLimiting()
    await this.testInputValidation()
    await this.testErrorHandling()
    await this.testFileUploadSecurity()
  }

  async testRateLimiting() {
    console.log('\n⏱️ Testing Rate Limiting...')
    
    const requests = []
    for (let i = 0; i < 100; i++) {
      requests.push(
        axios.post('http://localhost:3000/api/trpc/auth.login', {
          email: 'test@test.com',
          password: 'wrong-password'
        }).catch(err => err.response)
      )
    }

    const responses = await Promise.all(requests)
    const rateLimited = responses.some(res => res?.status === 429)
    
    if (rateLimited) {
      console.log('✅ Rate limiting is working')
    } else {
      console.log('❌ Rate limiting may not be configured')
    }
  }

  async testInputValidation() {
    console.log('\n✅ Testing Input Validation...')
    
    const maliciousInputs = [
      { email: '', password: '' },
      { email: 'a'.repeat(1000), password: 'test' },
      { email: '../../../etc/passwd', password: 'test' },
      { email: 'test@test.com', password: null }
    ]

    for (const input of maliciousInputs) {
      try {
        await axios.post('http://localhost:3000/api/trpc/auth.login', input)
        console.log('❌ Input validation failed for:', input)
      } catch (error) {
        if (error.response?.status === 400) {
          console.log('✅ Input validation working')
        }
      }
    }
  }

  async testErrorHandling() {
    console.log('\n🚫 Testing Error Handling...')
    
    try {
      await axios.get('http://localhost:3000/nonexistent-endpoint')
    } catch (error) {
      if (error.response?.status === 404 && 
          !error.response.data.includes('stack trace')) {
        console.log('✅ Error handling secure (no stack traces exposed)')
      } else {
        console.log('❌ Potential information disclosure in error messages')
      }
    }
  }

  async testFileUploadSecurity() {
    console.log('\n📁 Testing File Upload Security...')
    
    // Test file upload with malicious file types
    const maliciousFiles = [
      { name: 'test.exe', type: 'application/exe' },
      { name: 'test.php', type: 'application/php' },
      { name: '../../../evil.js', type: 'application/javascript' }
    ]

    for (const file of maliciousFiles) {
      try {
        const formData = new FormData()
        formData.append('file', new Blob(['test content']), file.name)
        
        await axios.post('http://localhost:3000/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        
        console.log(`❌ Malicious file upload succeeded: ${file.name}`)
      } catch (error) {
        if (error.response?.status === 400) {
          console.log(`✅ File upload security working for: ${file.name}`)
        }
      }
    }
  }
}

module.exports = { SecurityAudit, HIPAAComplianceAudit, PenetrationTest }