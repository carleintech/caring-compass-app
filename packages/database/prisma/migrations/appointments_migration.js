// Run Prisma migration
async function main() {
  console.log("Running Prisma migration for appointments...")
  
  try {
    const { PrismaClient } = require('@prisma/client')
    const prisma = new PrismaClient()
    
    // Clean up any existing model
    await prisma.$executeRaw`DROP TYPE IF EXISTS "AppointmentStatus" CASCADE;`
    await prisma.$executeRaw`DROP TABLE IF EXISTS "appointments" CASCADE;`
    
    // Create AppointmentStatus enum
    await prisma.$executeRaw`
      CREATE TYPE "AppointmentStatus" AS ENUM (
        'SCHEDULED',
        'COMPLETED',
        'CANCELLED',
        'RESCHEDULED',
        'NO_SHOW'
      );
    `
    
    // Create appointments table
    await prisma.$executeRaw`
      CREATE TABLE "appointments" (
        "id" UUID NOT NULL DEFAULT gen_random_uuid(),
        "date" TIMESTAMP(3) NOT NULL,
        "duration" INTEGER NOT NULL,
        "notes" TEXT,
        "status" "AppointmentStatus" NOT NULL DEFAULT 'SCHEDULED',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "createdById" UUID NOT NULL,
        "clientId" UUID,
        "caregiverId" UUID,
        CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
      );
    `
    
    // Add indexes
    await prisma.$executeRaw`CREATE INDEX "appointments_date_idx" ON "appointments"("date");`
    await prisma.$executeRaw`CREATE INDEX "appointments_clientId_idx" ON "appointments"("clientId");`
    await prisma.$executeRaw`CREATE INDEX "appointments_caregiverId_idx" ON "appointments"("caregiverId");`
    
    // Add foreign key constraints
    await prisma.$executeRaw`
      ALTER TABLE "appointments" ADD CONSTRAINT "appointments_createdById_fkey"
      FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    `
    
    await prisma.$executeRaw`
      ALTER TABLE "appointments" ADD CONSTRAINT "appointments_clientId_fkey"
      FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    `
    
    await prisma.$executeRaw`
      ALTER TABLE "appointments" ADD CONSTRAINT "appointments_caregiverId_fkey"
      FOREIGN KEY ("caregiverId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    `
    
    console.log("Migration completed successfully")
  } catch (error) {
    console.error("Migration failed:", error)
    process.exit(1)
  }
}

main()
