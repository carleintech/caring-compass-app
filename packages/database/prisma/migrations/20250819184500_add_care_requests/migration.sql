-- Create CareRequestStatus enum
CREATE TYPE "CareRequestStatus" AS ENUM (
  'PENDING',
  'CONTACTED',
  'ASSESSMENT_SCHEDULED',
  'ASSESSMENT_COMPLETED',
  'CARE_PLAN_CREATED',
  'SERVICE_STARTED',
  'CANCELLED',
  'CLOSED'
);

-- Create CareRequest table
CREATE TABLE "CareRequest" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "careType" TEXT NOT NULL,
  "startDate" TIMESTAMP(3) NOT NULL,
  "message" TEXT,
  "status" "CareRequestStatus" NOT NULL DEFAULT 'PENDING',
  "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "assignedTo" UUID,
  "notes" TEXT,
  CONSTRAINT "CareRequest_pkey" PRIMARY KEY ("id")
);
