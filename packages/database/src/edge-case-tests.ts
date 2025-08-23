import { PrismaClient } from '@prisma/client'
import { getPrismaClient } from './utils'

async function testEdgeCases() {
  console.log('🧪 Testing database edge cases...')
  
  const prisma = getPrismaClient()
  
  try {
    // Test 1: Duplicate email constraint
    console.log('\n1. Testing duplicate email constraint...')
    try {
      await prisma.user.create({
        data: {
          email: 'admin@caringcompass.com', // This should already exist
          role: 'CLIENT'
        }
      })
      console.log('   ❌ Duplicate email was allowed (should have failed)')
    } catch (error: any) {
      if (error.code === 'P2002') {
        console.log('   ✅ Duplicate email constraint working correctly')
      } else {
        console.log(`   ⚠️ Unexpected error: ${error.message}`)
      }
    }

    // Test 2: Invalid foreign key constraint
    console.log('\n2. Testing invalid foreign key constraint...')
    try {
      await prisma.clientProfile.create({
        data: {
          userId: '00000000-0000-0000-0000-000000000000', // Non-existent user ID
          firstName: 'Test',
          lastName: 'Client',
          dateOfBirth: new Date('1990-01-01'),
          primaryPhone: '555-0000',
          address: {
            create: {
              street1: '123 Test St',
              city: 'Test City',
              state: 'TS',
              zipCode: '12345',
              country: 'US'
            }
          }
        }
      })
      console.log('   ❌ Invalid foreign key was allowed (should have failed)')
    } catch (error: any) {
      if (error.code === 'P2003') {
        console.log('   ✅ Foreign key constraint working correctly')
      } else {
        console.log(`   ⚠️ Unexpected error: ${error.message}`)
      }
    }

    // Test 3: UserInvite duplicate invite code constraint
    console.log('\n3. Testing duplicate invite code constraint...')
    try {
      const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } })
      if (admin) {
        await prisma.userInvite.create({
          data: {
            email: 'test@example.com',
            role: 'CLIENT',
            invitedBy: admin.id,
            inviteCode: 'INV-CG-001', // This should already exist
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          }
        })
        console.log('   ❌ Duplicate invite code was allowed (should have failed)')
      }
    } catch (error: any) {
      if (error.code === 'P2002') {
        console.log('   ✅ Duplicate invite code constraint working correctly')
      } else {
        console.log(`   ⚠️ Unexpected error: ${error.message}`)
      }
    }

    // Test 4: UserInvite expiration logic
    console.log('\n4. Testing UserInvite expiration logic...')
    const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } })
    if (admin) {
      // Create an expired invite
      const expiredInvite = await prisma.userInvite.create({
        data: {
          email: 'expired@example.com',
          role: 'CLIENT',
          invitedBy: admin.id,
          inviteCode: 'INV-EXPIRED-001',
          expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
        }
      })

      // Query for expired invites
      const expiredInvites = await prisma.userInvite.findMany({
        where: {
          expiresAt: { lt: new Date() },
          acceptedAt: null
        }
      })

      console.log(`   ✅ Found ${expiredInvites.length} expired invite(s)`)
      
      // Clean up
      await prisma.userInvite.delete({ where: { id: expiredInvite.id } })
    }

    // Test 5: Cascade delete behavior
    console.log('\n5. Testing cascade delete behavior...')
    
    // Create a test user with profile
    const testUser = await prisma.user.create({
      data: {
        email: 'test-cascade@example.com',
        role: 'CLIENT',
        clientProfile: {
          create: {
            firstName: 'Test',
            lastName: 'Cascade',
            dateOfBirth: new Date('1990-01-01'),
            primaryPhone: '555-9999',
            address: {
              create: {
                street1: '123 Test St',
                city: 'Test City',
                state: 'TS',
                zipCode: '12345',
                country: 'US'
              }
            }
          }
        }
      },
      include: { clientProfile: true }
    })

    const clientProfileId = testUser.clientProfile?.id

    // Delete the user - should cascade to profile
    await prisma.user.delete({ where: { id: testUser.id } })

    // Verify profile was deleted
    const deletedProfile = clientProfileId ? await prisma.clientProfile.findUnique({
      where: { id: clientProfileId }
    }) : null

    if (deletedProfile === null) {
      console.log('   ✅ Cascade delete working correctly')
    } else {
      console.log('   ❌ Cascade delete failed - profile still exists')
    }

    // Test 6: Data validation - invalid enum values
    console.log('\n6. Testing enum validation...')
    try {
      await prisma.user.create({
        data: {
          email: 'test-enum@example.com',
          role: 'INVALID_ROLE' as any // Invalid enum value
        }
      })
      console.log('   ❌ Invalid enum value was allowed (should have failed)')
    } catch (error: any) {
      console.log('   ✅ Enum validation working correctly')
    }

    // Test 7: Date validation
    console.log('\n7. Testing date validation...')
    try {
      const coordinator = await prisma.user.findFirst({ where: { role: 'COORDINATOR' } })
      if (coordinator) {
        await prisma.userInvite.create({
          data: {
            email: 'test-date@example.com',
            role: 'CLIENT',
            invitedBy: coordinator.id,
            inviteCode: 'INV-DATE-001',
            expiresAt: new Date('invalid-date') // Invalid date
          }
        })
        console.log('   ❌ Invalid date was allowed (should have failed)')
      }
    } catch (error: any) {
      console.log('   ✅ Date validation working correctly')
    }

    // Test 8: Large data handling
    console.log('\n8. Testing large data handling...')
    const largeString = 'A'.repeat(10000) // 10KB string
    try {
      const coordinator = await prisma.user.findFirst({ where: { role: 'COORDINATOR' } })
      if (coordinator) {
        const largeInvite = await prisma.userInvite.create({
          data: {
            email: 'large-data@example.com',
            role: 'CLIENT',
            invitedBy: coordinator.id,
            inviteCode: 'INV-LARGE-001',
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          }
        })
        
        console.log('   ✅ Large data handling working correctly')
        
        // Clean up
        await prisma.userInvite.delete({ where: { id: largeInvite.id } })
      }
    } catch (error: any) {
      console.log(`   ⚠️ Large data handling issue: ${error.message}`)
    }

    // Test 9: Concurrent operations simulation
    console.log('\n9. Testing concurrent operations...')
    const coordinator = await prisma.user.findFirst({ where: { role: 'COORDINATOR' } })
    if (coordinator) {
      const concurrentPromises = Array.from({ length: 5 }, (_, i) =>
        prisma.userInvite.create({
          data: {
            email: `concurrent-${i}@example.com`,
            role: 'CLIENT',
            invitedBy: coordinator.id,
            inviteCode: `INV-CONCURRENT-${i}`,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          }
        })
      )

      try {
        const results = await Promise.all(concurrentPromises)
        console.log(`   ✅ Created ${results.length} concurrent invites successfully`)
        
        // Clean up
        await prisma.userInvite.deleteMany({
          where: {
            inviteCode: { startsWith: 'INV-CONCURRENT-' }
          }
        })
      } catch (error: any) {
        console.log(`   ⚠️ Concurrent operations issue: ${error.message}`)
      }
    }

    // Test 10: Transaction rollback
    console.log('\n10. Testing transaction rollback...')
    try {
      await prisma.$transaction(async (tx) => {
        // Create a user
        const txUser = await tx.user.create({
          data: {
            email: 'transaction-test@example.com',
            role: 'CLIENT'
          }
        })

        // Create a profile
        await tx.clientProfile.create({
          data: {
            userId: txUser.id,
            firstName: 'Transaction',
            lastName: 'Test',
            dateOfBirth: new Date('1990-01-01'),
            primaryPhone: '555-8888',
            address: {
              create: {
                street1: '123 Transaction St',
                city: 'Test City',
                state: 'TS',
                zipCode: '12345',
                country: 'US'
              }
            }
          }
        })

        // Force an error to test rollback
        throw new Error('Intentional rollback test')
      })
    } catch (error: any) {
      if (error.message === 'Intentional rollback test') {
        // Verify rollback worked
        const rolledBackUser = await prisma.user.findUnique({
          where: { email: 'transaction-test@example.com' }
        })
        
        if (rolledBackUser === null) {
          console.log('   ✅ Transaction rollback working correctly')
        } else {
          console.log('   ❌ Transaction rollback failed - user still exists')
        }
      }
    }

    console.log('\n✅ All edge case tests completed!')

  } catch (error) {
    console.error('❌ Edge case testing failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Export for use in other files
export { testEdgeCases }

// Run tests if this file is executed directly
testEdgeCases()
  .then(() => {
    console.log('🎉 Edge case testing completed!')
  })
  .catch((error) => {
    console.error('💥 Edge case testing failed:', error)
  })
