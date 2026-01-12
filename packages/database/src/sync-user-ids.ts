import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'

const prisma = new PrismaClient()

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function syncUserIds() {
  try {
    console.log('🔄 Syncing user IDs between Supabase Auth and Prisma database...\n')

    const emails = ['admin@caringcompass.com', 'coordinator@caringcompass.com']

    for (const email of emails) {
      console.log(`📧 Processing ${email}...`)

      // Get Supabase Auth user
      const { data: { users }, error } = await supabase.auth.admin.listUsers()
      if (error) {
        console.error('❌ Error listing Supabase users:', error)
        continue
      }

      const supabaseUser = users.find(u => u.email === email)
      if (!supabaseUser) {
        console.log(`   ⚠️  User not found in Supabase Auth`)
        continue
      }

      console.log(`   🆔 Supabase Auth ID: ${supabaseUser.id}`)

      // Get current Prisma user
      const prismaUser = await prisma.users.findUnique({
        where: { email },
        include: {
          coordinator_profiles: true
        }
      })

      if (!prismaUser) {
        console.log(`   ⚠️  User not found in Prisma database`)
        continue
      }

      console.log(`   🆔 Current Prisma ID: ${prismaUser.id}`)

      if (prismaUser.id === supabaseUser.id) {
        console.log(`   ✅ IDs already match!\n`)
        continue
      }

      // Update the IDs
      console.log(`   🔄 Updating Prisma record to match Supabase Auth ID...`)

      // Delete old record and create new one with correct ID
      await prisma.$transaction(async (tx: any) => {
        // If there's a coordinator profile, delete it first
        if (prismaUser.coordinator_profiles) {
          await tx.coordinator_profiles.delete({
            where: { userId: prismaUser.id }
          })
        }

        // Delete old user record
        await tx.users.delete({
          where: { id: prismaUser.id }
        })

        // Create new user record with correct ID
        await tx.users.create({
          data: {
            id: supabaseUser.id,
            email: prismaUser.email,
            role: prismaUser.role,
            isActive: prismaUser.isActive,
            createdAt: prismaUser.createdAt,
            updatedAt: new Date()
          }
        })

        // Recreate coordinator profile if it existed
        if (prismaUser.coordinator_profiles) {
          await tx.coordinator_profiles.create({
            data: {
              userId: supabaseUser.id,
              firstName: prismaUser.coordinator_profiles.firstName,
              lastName: prismaUser.coordinator_profiles.lastName,
              title: prismaUser.coordinator_profiles.title,
              department: prismaUser.coordinator_profiles.department,
              createdAt: prismaUser.coordinator_profiles.createdAt,
              updatedAt: new Date()
            }
          })
        }
      })

      console.log(`   ✅ Successfully synced ID for ${email}\n`)
    }

    console.log('✅ All user IDs synced successfully!')
  } catch (error) {
    console.error('❌ Error syncing user IDs:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

syncUserIds()
