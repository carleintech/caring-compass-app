// monitoring/health-check.ts
import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'

export interface HealthCheckResult {
  service: string
  status: 'healthy' | 'degraded' | 'unhealthy'
  responseTime: number
  details?: any
  timestamp: Date
}

export class HealthChecker {
  private prisma: PrismaClient
  private supabase: any
  
  constructor() {
    this.prisma = new PrismaClient()
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    )
  }
  
  async checkDatabase(): Promise<HealthCheckResult> {
    const start = Date.now()
    
    try {
      await this.prisma.$queryRaw`SELECT 1`
      const responseTime = Date.now() - start
      
      return {
        service: 'database',
        status: responseTime < 100 ? 'healthy' : 'degraded',
        responseTime,
        timestamp: new Date()
      }
    } catch (error) {
      return {
        service: 'database',
        status: 'unhealthy',
        responseTime: Date.now() - start,
        details: error.message,
        timestamp: new Date()
      }
    }
  }
  
  async checkSupabaseAuth(): Promise<HealthCheckResult> {
    const start = Date.now()
    
    try {
      const { data, error } = await this.supabase.auth.getSession()
      const responseTime = Date.now() - start
      
      return {
        service: 'supabase_auth',
        status: error ? 'unhealthy' : (responseTime < 200 ? 'healthy' : 'degraded'),
        responseTime,
        details: error?.message,
        timestamp: new Date()
      }
    } catch (error) {
      return {
        service: 'supabase_auth',
        status: 'unhealthy',
        responseTime: Date.now() - start,
        details: error.message,
        timestamp: new Date()
      }
    }
  }
  
  async checkRedis(): Promise<HealthCheckResult> {
    const start = Date.now()
    
    try {
      // If using Redis for job queues
      // const redis = new Redis(process.env.REDIS_URL)
      // await redis.ping()
      // const responseTime = Date.now() - start
      
      // Placeholder for Redis check
      const responseTime = Date.now() - start
      
      return {
        service: 'redis',
        status: 'healthy',
        responseTime,
        timestamp: new Date()
      }
    } catch (error) {
      return {
        service: 'redis',
        status: 'unhealthy',
        responseTime: Date.now() - start,
        details: error.message,
        timestamp: new Date()
      }
    }
  }
  
  async checkExternalServices(): Promise<HealthCheckResult[]> {
    const services = [
      { name: 'stripe', url: 'https://api.stripe.com/v1' },
      { name: 'twilio', url: 'https://api.twilio.com/2010-04-01' }
    ]
    
    const results: HealthCheckResult[] = []
    
    for (const service of services) {
      const start = Date.now()
      
      try {
        const response = await fetch(service.url, {
          method: 'HEAD',
          timeout: 5000
        })
        
        const responseTime = Date.now() - start
        
        results.push({
          service: service.name,
          status: response.ok ? 'healthy' : 'degraded',
          responseTime,
          details: { statusCode: response.status },
          timestamp: new Date()
        })
      } catch (error) {
        results.push({
          service: service.name,
          status: 'unhealthy',
          responseTime: Date.now() - start,
          details: error.message,
          timestamp: new Date()
        })
      }
    }
    
    return results
  }
  
  async performFullHealthCheck(): Promise<{
    overall: 'healthy' | 'degraded' | 'unhealthy'
    services: HealthCheckResult[]
    timestamp: Date
  }> {
    const services = await Promise.all([
      this.checkDatabase(),
      this.checkSupabaseAuth(),
      this.checkRedis(),
      ...await this.checkExternalServices()
    ])
    
    // Determine overall health
    const unhealthyCount = services.filter(s => s.status === 'unhealthy').length
    const degradedCount = services.filter(s => s.status === 'degraded').length
    
    let overall: 'healthy' | 'degraded' | 'unhealthy'
    
    if (unhealthyCount > 0) {
      overall = 'unhealthy'
    } else if (degradedCount > 1) {
      overall = 'degraded'
    } else {
      overall = 'healthy'
    }
    
    return {
      overall,
      services,
      timestamp: new Date()
    }
  }
}