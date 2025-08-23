import { PrismaClient } from '@prisma/client'
import { getPrismaClient, checkDatabaseHealth } from './utils'

async function testDatabaseQueries() {
  console.log('🧪 Testing database queries...')
  
  const prisma = getPrismaClient()
  
  try {
    // Test 1: Database health check
    console.log('\n1. Testing database connection...')
    const isHealthy = await checkDatabaseHealth()
    console.log(`   Database health: ${isHealthy ? '✅ Healthy' : '❌ Failed'}`)
    
    // Test 2: User queries
    console.log('\n2. Testing user queries...')
    const userCount = await prisma.user.count()
    console.log(`   Total users: ${userCount}`)
    
    const adminUsers = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: { email: true, role: true }
    })
    console.log(`   Admin users: ${adminUsers.length}`)
    
    // Test 3: Client profile queries with relationships
    console.log('\n3. Testing client profile queries...')
    const activeClients = await prisma.clientProfile.findMany({
      where: { status: 'ACTIVE' },
      include: {
        user: { select: { email: true } },
        planOfCare: {
          include: {
            goals: true,
            tasks: true
          }
        },
        familyMembers: {
          include: {
            user: { select: { email: true } }
          }
        }
      }
    })
    console.log(`   Active clients: ${activeClients.length}`)
    
    activeClients.forEach(client => {
      console.log(`   - ${client.firstName} ${client.lastName} (${client.user.email})`)
      console.log(`     Plan of Care: ${client.planOfCare ? 'Yes' : 'No'}`)
      console.log(`     Family Members: ${client.familyMembers.length}`)
      if (client.planOfCare) {
        console.log(`     Goals: ${client.planOfCare.goals.length}`)
        console.log(`     Tasks: ${client.planOfCare.tasks.length}`)
      }
    })
    
    // Test 4: Caregiver queries with skills and availability
    console.log('\n4. Testing caregiver queries...')
    const activeCaregiversByID = prisma.caregiverProfile.findMany({
      where: { status: 'ACTIVE' },
      include: {
        user: { select: { email: true } },
        skills: true,
        languages: true,
        availability: true,
        credentials: {
          where: { status: 'VERIFIED' }
        }
      }
    })
    const activeCaregivers = await activeCaregiversByID
    console.log(`   Active caregivers: ${activeCaregivers.length}`)
    
    activeCaregivers.forEach(caregiver => {
      console.log(`   - ${caregiver.firstName} ${caregiver.lastName} (${caregiver.user.email})`)
      console.log(`     Skills: ${caregiver.skills.length}`)
      console.log(`     Languages: ${caregiver.languages.map(l => l.language).join(', ')}`)
      console.log(`     Verified Credentials: ${caregiver.credentials.length}`)
      console.log(`     Availability Days: ${caregiver.availability.length}`)
    })
    
    // Test 5: Visit queries with EVV events
    console.log('\n5. Testing visit queries...')
    const recentVisits = await prisma.visit.findMany({
      where: {
        scheduledStart: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      },
      include: {
        client: { select: { firstName: true, lastName: true } },
        caregiver: { select: { firstName: true, lastName: true } },
        tasks: true,
        evvEvents: true
      },
      orderBy: { scheduledStart: 'desc' }
    })
    console.log(`   Visits in last 7 days: ${recentVisits.length}`)
    
    recentVisits.forEach(visit => {
      console.log(`   - ${visit.client.firstName} ${visit.client.lastName} ↔ ${visit.caregiver?.firstName || 'TBD'} ${visit.caregiver?.lastName || ''}`)
      console.log(`     Status: ${visit.status}`)
      console.log(`     Tasks: ${visit.tasks.length}`)
      console.log(`     EVV Events: ${visit.evvEvents.length}`)
    })
    
    // Test 6: Credential expiration monitoring
    console.log('\n6. Testing credential expiration monitoring...')
    const expiringCredentials = await prisma.caregiverCredential.findMany({
      where: {
        status: 'VERIFIED',
        expirationDate: {
          lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Next 30 days
          gte: new Date()
        }
      },
      include: {
        caregiver: { select: { firstName: true, lastName: true } }
      },
      orderBy: { expirationDate: 'asc' }
    })
    console.log(`   Credentials expiring in next 30 days: ${expiringCredentials.length}`)
    
    expiringCredentials.forEach(credential => {
      console.log(`   - ${credential.caregiver.firstName} ${credential.caregiver.lastName}: ${credential.type} (expires ${credential.expirationDate?.toDateString()})`)
    })
    
    // Test 7: Matching query simulation
    console.log('\n7. Testing caregiver matching simulation...')
    const clientNeedingCare = activeClients[0]
    if (clientNeedingCare?.planOfCare) {
      const requiredSkills = clientNeedingCare.planOfCare.tasks.flatMap(task => task.requiredSkills)
      console.log(`   Client: ${clientNeedingCare.firstName} ${clientNeedingCare.lastName}`)
      console.log(`   Required skills: ${requiredSkills.join(', ')}`)
      
      const matchingCaregivers = await prisma.caregiverProfile.findMany({
        where: {
          status: 'ACTIVE',
          skills: {
            some: {
              skill: { in: requiredSkills }
            }
          }
        },
        include: {
          skills: {
            where: { skill: { in: requiredSkills } }
          },
          user: { select: { email: true } }
        }
      })
      
      console.log(`   Matching caregivers: ${matchingCaregivers.length}`)
      matchingCaregivers.forEach(caregiver => {
        const matchedSkills = caregiver.skills.map(s => s.skill)
        console.log(`   - ${caregiver.firstName} ${caregiver.lastName}: ${matchedSkills.join(', ')}`)
      })
    }
    
    // Test 8: Performance test - complex query
    console.log('\n8. Testing complex query performance...')
    const startTime = Date.now()
    
    const complexQuery = await prisma.visit.findMany({
      where: {
        AND: [
          { scheduledStart: { gte: new Date('2024-01-01') } },
          { status: { in: ['COMPLETED', 'SCHEDULED'] } }
        ]
      },
      include: {
        client: {
          include: {
            planOfCare: {
              include: { tasks: true }
            }
          }
        },
        caregiver: {
          include: {
            skills: true,
            credentials: { where: { status: 'VERIFIED' } }
          }
        },
        tasks: true,
        evvEvents: true
      },
      orderBy: { scheduledStart: 'desc' }
    })
    
    const queryTime = Date.now() - startTime
    console.log(`   Complex query returned ${complexQuery.length} results in ${queryTime}ms`)
    console.log(`   Performance: ${queryTime < 1000 ? '✅ Good' : '⚠️ Slow'}`)
    
    // Test 9: Audit log test
    console.log('\n9. Testing audit logs...')
    const auditLogs = await prisma.auditLog.findMany({
      take: 5,
      orderBy: { timestamp: 'desc' },
      include: {
        user: { select: { email: true, role: true } }
      }
    })
    console.log(`   Recent audit logs: ${auditLogs.length}`)
    
    auditLogs.forEach(log => {
      console.log(`   - ${log.action} ${log.resourceType} by ${log.user?.email || 'System'} at ${log.timestamp.toISOString()}`)
    })
    
    // Test 10: User invites test
    console.log('\n10. Testing user invites...')
    const userInvites = await prisma.userInvite.findMany({
      include: {
        inviter: {
          select: { email: true, role: true }
        }
      }
    })
    const pendingInvites = userInvites.filter(invite => !invite.acceptedAt)
    const acceptedInvites = userInvites.filter(invite => invite.acceptedAt)
    const expiredInvites = userInvites.filter(invite => invite.expiresAt < new Date())
    
    console.log(`   Total invites: ${userInvites.length}`)
    console.log(`   Pending invites: ${pendingInvites.length}`)
    console.log(`   Accepted invites: ${acceptedInvites.length}`)
    console.log(`   Expired invites: ${expiredInvites.length}`)
    
    userInvites.forEach(invite => {
      const status = invite.acceptedAt ? 'Accepted' : (invite.expiresAt < new Date() ? 'Expired' : 'Pending')
      console.log(`   - ${invite.email} (${invite.role}) invited by ${invite.inviter.email} - ${status}`)
    })
    
    console.log('\n✅ All database tests completed successfully!')
    
    // Summary
    console.log('\n📊 Database Summary:')
    console.log(`   Users: ${userCount}`)
    console.log(`   Active Clients: ${activeClients.length}`)
    console.log(`   Active Caregivers: ${activeCaregivers.length}`)
    console.log(`   Recent Visits: ${recentVisits.length}`)
    console.log(`   Expiring Credentials: ${expiringCredentials.length}`)
    console.log(`   User Invites: ${userInvites.length} (${pendingInvites.length} pending, ${acceptedInvites.length} accepted)`)
    
  } catch (error) {
    console.error('❌ Database test failed:', error)
    throw error
  }
}

// Export for use in other files
export { testDatabaseQueries }

// Run tests if this file is executed directly
testDatabaseQueries()
  .then(() => {
    console.log('🎉 Database testing completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Database testing failed:', error)
    process.exit(1)
  })
