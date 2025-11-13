// Stub for monitoring health check
export const healthCheck = {
  status: 'ok',
  timestamp: new Date().toISOString(),
  checks: {
    database: 'ok',
    api: 'ok'
  }
}

export function checkHealth() {
  return Promise.resolve(healthCheck)
}

export class HealthChecker {
  static async checkAll() {
    return healthCheck
  }
  
  static async checkDatabase() {
    return { status: 'ok' }
  }
  
  static async checkAPI() {
    return { status: 'ok' }
  }
}
