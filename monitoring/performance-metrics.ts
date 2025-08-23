// monitoring/performance-metrics.ts
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, number[]> = new Map()
  
  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }
  
  // Track API response times
  trackApiCall(endpoint: string, duration: number) {
    if (!this.metrics.has(endpoint)) {
      this.metrics.set(endpoint, [])
    }
    
    const times = this.metrics.get(endpoint)!
    times.push(duration)
    
    // Keep only last 100 measurements
    if (times.length > 100) {
      times.shift()
    }
    
    // Alert if response time is too high
    if (duration > 1000) {
      console.warn(`Slow API call detected: ${endpoint} took ${duration}ms`)
      
      // Send to monitoring service
      this.sendAlert('slow_api_call', {
        endpoint,
        duration,
        threshold: 1000
      })
    }
  }
  
  // Track page load times
  trackPageLoad(page: string, metrics: {
    fcp: number
    lcp: number
    fid: number
    cls: number
  }) {
    // Check Core Web Vitals thresholds
    const alerts: string[] = []
    
    if (metrics.lcp > 2500) {
      alerts.push(`LCP too high: ${metrics.lcp}ms`)
    }
    
    if (metrics.fid > 100) {
      alerts.push(`FID too high: ${metrics.fid}ms`)
    }
    
    if (metrics.cls > 0.1) {
      alerts.push(`CLS too high: ${metrics.cls}`)
    }
    
    if (alerts.length > 0) {
      this.sendAlert('poor_web_vitals', {
        page,
        metrics,
        alerts
      })
    }
  }
  
  // Monitor database query performance
  trackDatabaseQuery(query: string, duration: number, rowCount: number) {
    const threshold = rowCount > 1000 ? 500 : 200
    
    if (duration > threshold) {
      this.sendAlert('slow_database_query', {
        query: query.substring(0, 100), // Truncate for privacy
        duration,
        rowCount,
        threshold
      })
    }
  }
  
  // Monitor memory usage
  trackMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      const usedMB = memory.usedJSHeapSize / 1024 / 1024
      const totalMB = memory.totalJSHeapSize / 1024 / 1024
      
      if (usedMB > 100) { // Alert if using more than 100MB
        this.sendAlert('high_memory_usage', {
          usedMB: Math.round(usedMB),
          totalMB: Math.round(totalMB),
          threshold: 100
        })
      }
    }
  }
  
  // Get performance summary
  getPerformanceSummary() {
    const summary: Record<string, any> = {}
    
    for (const [endpoint, times] of this.metrics.entries()) {
      const avg = times.reduce((a, b) => a + b, 0) / times.length
      const max = Math.max(...times)
      const min = Math.min(...times)
      
      summary[endpoint] = {
        averageMs: Math.round(avg),
        maxMs: max,
        minMs: min,
        callCount: times.length
      }
    }
    
    return summary
  }
  
  private sendAlert(type: string, data: any) {
    // Send to Sentry
    Sentry.addBreadcrumb({
      category: 'performance',
      message: `Performance alert: ${type}`,
      data,
      level: 'warning'
    })
    
    // Send to logging service
    console.warn('Performance Alert:', { type, data })
    
    // Could also send to external monitoring service
    if (process.env.NODE_ENV === 'production') {
      // fetch('/api/monitoring/alert', {
      //   method: 'POST',
      //   body: JSON.stringify({ type, data })
      // })
    }
  }
}