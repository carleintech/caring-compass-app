// scripts/performance-test.js
#!/usr/bin/env node

const { spawn } = require('child_process')
const lighthouse = require('lighthouse')
const chromeLauncher = require('chrome-launcher')

async function runPerformanceTests() {
  console.log('🔍 Caring Compass Performance Test Suite')
  console.log('=========================================')
  
  // 1. Start Next.js application
  console.log('🚀 Starting Next.js application...')
  const nextProcess = spawn('pnpm', ['dev'], {
    cwd: 'apps/web',
    stdio: 'pipe'
  })
  
  // Wait for app to start
  await new Promise(resolve => setTimeout(resolve, 10000))
  
  try {
    // 2. Run Lighthouse tests
    console.log('💡 Running Lighthouse Performance Tests...')
    const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] })
    
    const options = {
      logLevel: 'info',
      output: 'html',
      onlyCategories: ['performance', 'accessibility', 'best-practices'],
      port: chrome.port
    }
    
    const runnerResult = await lighthouse('http://localhost:3000', options)
    
    // Performance assertions
    const { lhr } = runnerResult
    const scores = {
      performance: lhr.categories.performance.score * 100,
      accessibility: lhr.categories.accessibility.score * 100,
      bestPractices: lhr.categories['best-practices'].score * 100
    }
    
    console.log('📊 Lighthouse Scores:')
    console.log(`   Performance: ${scores.performance}`)
    console.log(`   Accessibility: ${scores.accessibility}`)
    console.log(`   Best Practices: ${scores.bestPractices}`)
    
    await chrome.kill()
    
    // 3. Run database performance tests
    await require('./tests/performance/database-performance')()
    
    // 4. Run load tests
    await require('./tests/performance/load-test').runLoadTests()
    
    // 5. Check Core Web Vitals
    const webVitals = lhr.audits
    console.log('\n🎯 Core Web Vitals:')
    console.log(`   LCP: ${webVitals['largest-contentful-paint'].displayValue}`)
    console.log(`   FID: ${webVitals['max-potential-fid'].displayValue}`)
    console.log(`   CLS: ${webVitals['cumulative-layout-shift'].displayValue}`)
    
    // Performance Gates
    const performanceGates = {
      lighthouse: scores.performance >= 80,
      accessibility: scores.accessibility >= 90,
      lcp: parseFloat(webVitals['largest-contentful-paint'].numericValue) < 2500,
      cls: parseFloat(webVitals['cumulative-layout-shift'].numericValue) < 0.1
    }
    
    const allPassed = Object.values(performanceGates).every(Boolean)
    
    if (allPassed) {
      console.log('\n✅ All performance gates passed!')
    } else {
      console.log('\n❌ Some performance gates failed:')
      Object.entries(performanceGates).forEach(([gate, passed]) => {
        if (!passed) console.log(`   - ${gate}: FAILED`)
      })
    }
    
  } finally {
    nextProcess.kill()
  }
}

if (require.main === module) {
  runPerformanceTests().catch(console.error)
}

module.exports = { runPerformanceTests }