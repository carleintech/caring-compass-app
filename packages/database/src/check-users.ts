import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkUsers() {
  try {
    console.log('🔍 Checking for master account users...\n')
    
    const users = await prisma.users.findMany({
      where: {
        email: {
          in: ['admin@caringcompass.com', 'coordinator@caringcompass.com']
        }
      },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    })
    
    if (users.length === 0) {
      console.log('❌ No master accounts found in database!')
      console.log('   Run: pnpm --filter database seed:master')
    } else {
      console.log(`✅ Found ${users.length} master account(s):\n`)
      users.forEach(user => {
        console.log(`   📧 ${user.email}`)
        console.log(`   🆔 ID: ${user.id}`)
        console.log(`   👤 Role: ${user.role}`)
        console.log(`   ✓ Active: ${user.isActive}`)
        console.log(`   📅 Created: ${user.createdAt}`)
        console.log()
      })
    }
  } catch (error) {
    console.error('❌ Error checking users:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUsers()
