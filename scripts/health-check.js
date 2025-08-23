// scripts/health-check.js
const axios = require('axios')

async function healthCheck() {
  console.log('🏥 Caring Compass Health Check')
  console.log('==============================')

  const checks = [
    {
      name: 'Web Application',
      url: 'http://localhost:3000/api/health',
      timeout: 5000
    },
    {
      name: 'Database Connection',
      url: 'http://localhost:3000/api/health/database',
      timeout: 10000
    },
    {
      name: 'Redis Connection',
      url: 'http://localhost:3000/api/health/redis',
      timeout: 5000
    },
    {
      name: 'Stripe Integration',
      url: 'http://localhost:3000/api/health/stripe',
      timeout: 5000
    },
    {
      name: 'Email Service',
      url: 'http://localhost:3000/api/health/email',
      timeout: 5000
    }
  ]

  const results = []

  for (const check of checks) {
    console.log(`\n🔍 Checking ${check.name}...`)
    
    try {
      const response = await axios.get(check.url, {
        timeout: check.timeout
      })

      if (response.status === 200) {
        console.log(`✅ ${check.name}: Healthy`)
        results.push({ ...check, status: 'healthy', response: response.data })
      } else {
        console.log(`❌ ${check.name}: Unhealthy (Status: ${response.status})`)
        results.push({ ...check, status: 'unhealthy', error: `HTTP ${response.status}` })
      }
    } catch (error) {
      console.log(`❌ ${check.name}: Failed (${error.message})`)
      results.push({ ...check, status: 'failed', error: error.message })
    }
  }

  // Summary
  const healthy = results.filter(r => r.status === 'healthy').length
  const total = results.length

  console.log('\n📊 Health Check Summary:')
  console.log(`✅ Healthy: ${healthy}/${total}`)
  console.log(`❌ Unhealthy: ${total - healthy}/${total}`)

  if (healthy === total) {
    console.log('\n🎉 All systems operational!')
    process.exit(0)
  } else {
    console.log('\n⚠️ Some systems require attention.')
    process.exit(1)
  }
}

if (require.main === module) {
  healthCheck().catch(console.error)
}

module.exports = { healthCheck }