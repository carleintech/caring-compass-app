// apps/web/src/app/api/health/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { HealthChecker } from '@/monitoring/health-check'

export async function GET(request: NextRequest) {
  const healthChecker = new HealthChecker()
  
  try {
    const healthCheck = await healthChecker.performFullHealthCheck()
    
    const statusCode = healthCheck.overall === 'healthy' ? 200 : 
                      healthCheck.overall === 'degraded' ? 207 : 503
    
    return NextResponse.json(healthCheck, { status: statusCode })
  } catch (error) {
    return NextResponse.json({
      overall: 'unhealthy',
      error: error.message,
      timestamp: new Date()
    }, { status: 503 })
  }
}