-- Migration: add_appointments

-- Create AppointmentStatus enum
DO $$ BEGIN
    CREATE TYPE "AppointmentStatus" AS ENUM (
        'SCHEDULED',
        'COMPLETED',
        'CANCELLED',
        'RESCHEDULED',
        'NO_SHOW'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create appointments table
CREATE TABLE IF NOT EXISTS "appointments" (
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

-- Add indexes
CREATE INDEX IF NOT EXISTS "appointments_date_idx" ON "appointments"("date");
CREATE INDEX IF NOT EXISTS "appointments_clientId_idx" ON "appointments"("clientId");
CREATE INDEX IF NOT EXISTS "appointments_caregiverId_idx" ON "appointments"("caregiverId");

-- Add foreign key constraints
ALTER TABLE "appointments" 
    ADD CONSTRAINT "appointments_createdById_fkey"
    FOREIGN KEY ("createdById") REFERENCES "users"("id") 
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "appointments" 
    ADD CONSTRAINT "appointments_clientId_fkey"
    FOREIGN KEY ("clientId") REFERENCES "users"("id") 
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "appointments" 
    ADD CONSTRAINT "appointments_caregiverId_fkey"
    FOREIGN KEY ("caregiverId") REFERENCES "users"("id") 
    ON DELETE SET NULL ON UPDATE CASCADE;
