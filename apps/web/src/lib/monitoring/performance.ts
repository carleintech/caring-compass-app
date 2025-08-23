// apps/web/src/lib/monitoring/performance.ts
export class PerformanceMonitor {
  private static timers: Map<string, number> = new Map()

  static startTimer(operation: string): void {
    this.timers.set(operation, Date.now())
  }

  static endTimer(operation: string, metadata?: any): number {
    const startTime = this.timers.get(operation)
    if (!startTime) {
      console.warn(`Timer not found for operation: ${operation}`)
      return 0
    }

    const duration = Date.now() - startTime
    this.timers.delete(operation)

    // Log performance metric
    careLogger.system.performance(operation, duration, metadata)

    // Send to analytics if enabled
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'timing_complete', {
        name: operation,
        value: duration,
        custom_map: metadata
      })
    }

    return duration
  }

  static measureAsync<T>(operation: string, fn: () => Promise<T>, metadata?: any): Promise<T> {
    this.startTimer(operation)
    return fn().finally(() => {
      this.endTimer(operation, metadata)
    })
  }

  static measureSync<T>(operation: string, fn: () => T, metadata?: any): T {
    this.startTimer(operation)
    try {
      return fn()
    } finally {
      this.endTimer(operation, metadata)
    }
  }
}

// API endpoint monitoring middleware
export function withPerformanceMonitoring(handler: any) {
  return async (req: any, res: any) => {
    const operation = `api.${req.url?.replace('/api/', '').replace(/\//g, '.')}`
    const startTime = Date.now()

    try {
      const result = await handler(req, res)
      
      const duration = Date.now() - startTime
      careLogger.system.performance(operation, duration, {
        method: req.method,
        statusCode: res.statusCode,
        userAgent: req.headers['user-agent']
      })

      return result
    } catch (error) {
      const duration = Date.now() - startTime
      careLogger.system.error(error as Error, {
        operation,
        duration,
        method: req.method,
        url: req.url
      })
      throw error
    }
  }
}