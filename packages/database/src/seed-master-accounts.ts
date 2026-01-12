/**
 * Master Accounts Seeder
 * 
 * Creates two permanent system accounts:
 * 1. Admin Master Account - Full system control
 * 2. Coordinator Account - Office staff operations
 * 
 * These accounts are meant to be shared among staff:
 * - Admin login: Used by agency owner/system administrators
 * - Coordinator login: Used by all office coordinators
 * 
 * Run this script to initialize or reset these accounts.
 * 
 * Usage: pnpm --filter database seed:master
 */

import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'

const prisma = new PrismaClient()

// Initialize Supabase Admin Client
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createMasterAccounts() {
  console.log('🔐 Seeding master accounts...\n')

  try {
    // Get credentials from environment
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@caringcompass.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'CaringAdmin2025!'
    const adminFirstName = process.env.ADMIN_FIRST_NAME || 'System'
    const adminLastName = process.env.ADMIN_LAST_NAME || 'Administrator'

    const coordEmail = process.env.COORDINATOR_EMAIL || 'coordinator@caringcompass.com'
    const coordPassword = process.env.COORDINATOR_PASSWORD || 'CaringCoord2025!'
    const coordFirstName = process.env.COORDINATOR_FIRST_NAME || 'Office'
    const coordLastName = process.env.COORDINATOR_LAST_NAME || 'Coordinator'

    // ===== ADMIN MASTER ACCOUNT =====
    console.log('👑 Creating ADMIN master account...')
    
    // Check if admin user exists in Supabase Auth
    let adminAuthUser
    const { data: existingAdmin } = await supabase.auth.admin.listUsers()
    adminAuthUser = existingAdmin?.users?.find(u => u.email === adminEmail)

    if (!adminAuthUser) {
      // Create in Supabase Auth
      console.log('   Creating admin in Supabase Auth...')
      const { data: newAdmin, error: adminAuthError } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          firstName: adminFirstName,
          lastName: adminLastName,
          role: 'ADMIN'
        }
      })

      if (adminAuthError || !newAdmin.user) {
        throw new Error(`Failed to create admin in Supabase Auth: ${adminAuthError?.message}`)
      }
      adminAuthUser = newAdmin.user
    } else {
      console.log('   Admin already exists in Supabase Auth, updating password...')
      // Update password
      await supabase.auth.admin.updateUserById(adminAuthUser.id, {
        password: adminPassword
      })
    }

    // Create or update in Prisma database
    const adminUser = await prisma.users.upsert({
      where: { email: adminEmail },
      update: {
        isActive: true,
        lastLoginAt: null,
        role: 'ADMIN',
        updatedAt: new Date()
      },
      create: {
        id: adminAuthUser.id,
        email: adminEmail,
        role: 'ADMIN',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    // Create or update coordinator profile (Admin uses coordinator_profiles table for name storage)
    const adminProfile = await prisma.coordinator_profiles.upsert({
      where: { userId: adminUser.id },
      update: {
        firstName: adminFirstName,
        lastName: adminLastName,
        title: 'System Administrator',
        department: 'Management',
        updatedAt: new Date()
      },
      create: {
        userId: adminUser.id,
        firstName: adminFirstName,
        lastName: adminLastName,
        title: 'System Administrator',
        department: 'Management',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    console.log('✅ Admin account created/updated')
    console.log(`   📧 Email: ${adminEmail}`)
    console.log(`   🔑 Password: ${adminPassword}`)
    console.log(`   👤 Name: ${adminFirstName} ${adminLastName}`)
    console.log(`   🆔 User ID: ${adminUser.id}`)
    console.log(`   📋 Profile ID: ${adminProfile.id}\n`)

    // ===== COORDINATOR MASTER ACCOUNT =====
    console.log('\n👥 Creating COORDINATOR master account...')
    
    // Check if coordinator user exists in Supabase Auth
    let coordAuthUser
    const { data: existingCoord } = await supabase.auth.admin.listUsers()
    coordAuthUser = existingCoord?.users?.find(u => u.email === coordEmail)

    if (!coordAuthUser) {
      // Create in Supabase Auth
      console.log('   Creating coordinator in Supabase Auth...')
      const { data: newCoord, error: coordAuthError } = await supabase.auth.admin.createUser({
        email: coordEmail,
        password: coordPassword,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          firstName: coordFirstName,
          lastName: coordLastName,
          role: 'COORDINATOR'
        }
      })

      if (coordAuthError || !newCoord.user) {
        throw new Error(`Failed to create coordinator in Supabase Auth: ${coordAuthError?.message}`)
      }
      coordAuthUser = newCoord.user
    } else {
      console.log('   Coordinator already exists in Supabase Auth, updating password...')
      // Update password
      await supabase.auth.admin.updateUserById(coordAuthUser.id, {
        password: coordPassword
      })
    }

    // Create or update in Prisma database
    const coordUser = await prisma.users.upsert({
      where: { email: coordEmail },
      update: {
        isActive: true,
        lastLoginAt: null,
        role: 'COORDINATOR',
        updatedAt: new Date()
      },
      create: {
        id: coordAuthUser.id,
        email: coordEmail,
        role: 'COORDINATOR',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    // Create or update coordinator profile
    const coordProfile = await prisma.coordinator_profiles.upsert({
      where: { userId: coordUser.id },
      update: {
        firstName: coordFirstName,
        lastName: coordLastName,
        title: 'Care Coordinator',
        department: 'Operations',
        updatedAt: new Date()
      },
      create: {
        userId: coordUser.id,
        firstName: coordFirstName,
        lastName: coordLastName,
        title: 'Care Coordinator',
        department: 'Operations',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    console.log('✅ Coordinator account created/updated')
    console.log(`   📧 Email: ${coordEmail}`)
    console.log(`   🔑 Password: ${coordPassword}`)
    console.log(`   👤 Name: ${coordFirstName} ${coordLastName}`)
    console.log(`   🆔 User ID: ${coordUser.id}`)
    console.log(`   📋 Profile ID: ${coordProfile.id}\n`)

    console.log('\n🎉 Master accounts seeding complete!\n')
    console.log('═══════════════════════════════════════════════════════════')
    console.log('📝 LOGIN CREDENTIALS')
    console.log('═══════════════════════════════════════════════════════════\n')
    
    console.log('👑 ADMIN MASTER ACCOUNT')
    console.log(`   📧 Email:    ${adminEmail}`)
    console.log(`   🔑 Password: ${adminPassword}`)
    console.log(`   🌐 URL:      http://localhost:3000/login`)
    console.log(`   ✅ Access:   Full system control\n`)
    
    console.log('👥 COORDINATOR MASTER ACCOUNT')
    console.log(`   📧 Email:    ${coordEmail}`)
    console.log(`   🔑 Password: ${coordPassword}`)
    console.log(`   🌐 URL:      http://localhost:3000/login`)
    console.log(`   ✅ Access:   Operations & scheduling\n`)
    
    console.log('═══════════════════════════════════════════════════════════')
    console.log('📋 IMPORTANT NOTES')
    console.log('═══════════════════════════════════════════════════════════')
    console.log('   • These accounts are for STAFF USE only')
    console.log('   • All admin staff can share the admin login')
    console.log('   • All coordinators can share the coordinator login')
    console.log('   • Credentials are stored securely in Supabase Auth')
    console.log('   • Change passwords via .env file and re-run script')
    console.log('   • Caregivers will have separate personal accounts\n')

  } catch (error) {
    console.error('❌ Error seeding master accounts:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seeder
createMasterAccounts()
  .then(() => {
    console.log('✅ Script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Script failed:', error)
    process.exit(1)
  })
