// tests/performance/database-performance.js
const { PrismaClient } = require('@caring-compass/database')
const prisma = new PrismaClient()

async function testDatabasePerformance() {
  console.log('🗄️ Testing Database Performance...')
  
  const tests = [
    {
      name: 'User Authentication Query',
      query: () => prisma.user.findUnique({
        where: { email: 'test@example.com' },
        include: { clientProfile: true, caregiverProfile: true }
      })
    },
    {
      name: 'Client Visits Query',
      query: () => prisma.visit.findMany({
        where: { clientId: 'test-client-id' },
        include: { caregiver: true, evvEvents: true },
        take: 20,
        orderBy: { scheduledStart: 'desc' }
      })
    },
    {
      name: 'Caregiver Availability Query',
      query: () => prisma.caregiverAvailability.findMany({
        where: { 
          caregiverId: 'test-caregiver-id',
          effectiveDate: { lte: new Date() }
        },
        orderBy: { dayOfWeek: 'asc' }
      })
    },
    {
      name: 'Admin Analytics Query',
      query: () => prisma.$queryRaw`
        SELECT 
          COUNT(*) as total_visits,
          AVG(EXTRACT(EPOCH FROM (actual_end - actual_start))/3600) as avg_hours,
          COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) as completed_visits
        FROM visits 
        WHERE scheduled_start >= NOW() - INTERVAL '30 days'
      `
    }
  ]
  
  for (const test of tests) {
    const startTime = Date.now()
    
    try {
      await test.query()
      const duration = Date.now() - startTime
      
      console.log(`✅ ${test.name}: ${duration}ms`)
      
      if (duration > 1000) {
        console.warn(`⚠️  Warning: ${test.name} took ${duration}ms (>1000ms)`)
      }
    } catch (error) {
      console.error(`❌ ${test.name} failed:`, error.message)
    }
  }
  
  await prisma.$disconnect()
}