import { PrismaClient } from '@prisma/client'

// Singleton Prisma client
let prisma: PrismaClient | undefined

export function getPrismaClient(): PrismaClient {
  if (!prisma) {
    prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })
  }
  return prisma
}

// Helper function to close Prisma connection
export async function disconnectPrisma() {
  if (prisma) {
    await prisma.$disconnect()
    prisma = undefined
  }
}

// Database health check
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const client = getPrismaClient()
    await client.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error('Database health check failed:', error)
    return false
  }
}