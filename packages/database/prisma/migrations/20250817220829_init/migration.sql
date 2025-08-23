-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CLIENT', 'FAMILY', 'CAREGIVER', 'COORDINATOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY');

-- CreateEnum
CREATE TYPE "ClientStatus" AS ENUM ('INQUIRY', 'ASSESSMENT_SCHEDULED', 'ASSESSMENT_COMPLETED', 'PENDING_APPROVAL', 'ACTIVE', 'ON_HOLD', 'DISCHARGED');

-- CreateEnum
CREATE TYPE "ContactMethod" AS ENUM ('EMAIL', 'PHONE', 'SMS', 'MAIL');

-- CreateEnum
CREATE TYPE "CaregiverStatus" AS ENUM ('APPLICATION_SUBMITTED', 'BACKGROUND_CHECK_PENDING', 'BACKGROUND_CHECK_APPROVED', 'BACKGROUND_CHECK_FAILED', 'CREDENTIALS_PENDING', 'TRAINING_REQUIRED', 'TRAINING_COMPLETED', 'ACTIVE', 'INACTIVE', 'TERMINATED');

-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('FULL_TIME', 'PART_TIME', 'ON_CALL', 'CONTRACT');

-- CreateEnum
CREATE TYPE "CredentialType" AS ENUM ('CNA', 'PCA', 'HHA', 'CPR', 'FIRST_AID', 'TB_TEST', 'BACKGROUND_CHECK', 'DRIVERS_LICENSE', 'AUTO_INSURANCE', 'PROFESSIONAL_LIABILITY');

-- CreateEnum
CREATE TYPE "CredentialStatus" AS ENUM ('PENDING_VERIFICATION', 'VERIFIED', 'EXPIRED', 'REJECTED');

-- CreateEnum
CREATE TYPE "SkillType" AS ENUM ('PERSONAL_CARE', 'MEDICATION_REMINDERS', 'MEAL_PREPARATION', 'LIGHT_HOUSEKEEPING', 'TRANSPORTATION', 'COMPANIONSHIP', 'DEMENTIA_CARE', 'MOBILITY_ASSISTANCE', 'TRANSFER_ASSISTANCE', 'INCONTINENCE_CARE', 'WOUND_CARE', 'VITAL_SIGNS', 'OXYGEN_THERAPY');

-- CreateEnum
CREATE TYPE "SkillLevel" AS ENUM ('BASIC', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');

-- CreateEnum
CREATE TYPE "LanguageProficiency" AS ENUM ('BASIC', 'CONVERSATIONAL', 'FLUENT', 'NATIVE');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "PlanStatus" AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'ACTIVE', 'SUSPENDED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "GoalStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'DISCONTINUED');

-- CreateEnum
CREATE TYPE "TaskCategory" AS ENUM ('PERSONAL_CARE', 'MEDICATION_MANAGEMENT', 'HOUSEHOLD_TASKS', 'NUTRITION', 'TRANSPORTATION', 'COMPANIONSHIP', 'SAFETY_SUPERVISION', 'EXERCISE_MOBILITY');

-- CreateEnum
CREATE TYPE "TaskFrequency" AS ENUM ('EVERY_VISIT', 'DAILY', 'WEEKLY', 'BI_WEEKLY', 'MONTHLY', 'AS_NEEDED');

-- CreateEnum
CREATE TYPE "VisitStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW_CLIENT', 'NO_SHOW_CAREGIVER', 'LATE_CANCELLATION');

-- CreateEnum
CREATE TYPE "VisitType" AS ENUM ('REGULAR_CARE', 'RESPITE_CARE', 'EMERGENCY_CARE', 'ASSESSMENT', 'SUPERVISION');

-- CreateEnum
CREATE TYPE "EVVEventType" AS ENUM ('CLOCK_IN', 'CLOCK_OUT', 'BREAK_START', 'BREAK_END', 'LOCATION_UPDATE');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'ISSUED', 'PAID', 'OVERDUE', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CREDIT_CARD', 'ACH', 'CHECK', 'CASH', 'INSURANCE', 'OTHER');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "TimesheetStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'PROCESSED');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'SYSTEM', 'INCIDENT_REPORT', 'REMINDER');

-- CreateEnum
CREATE TYPE "ThreadType" AS ENUM ('GENERAL', 'INCIDENT', 'COORDINATION', 'FAMILY_UPDATES', 'BILLING');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('SERVICE_AGREEMENT', 'CARE_PLAN', 'ASSESSMENT', 'INCIDENT_REPORT', 'CREDENTIAL', 'IDENTIFICATION', 'INSURANCE_CARD', 'EMERGENCY_CONTACT', 'MEDICAL_FORM', 'PHOTO', 'OTHER');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('ACTIVE', 'ARCHIVED', 'DELETED');

-- CreateEnum
CREATE TYPE "AccessLevel" AS ENUM ('PUBLIC', 'INTERNAL', 'PRIVATE', 'CONFIDENTIAL');

-- CreateEnum
CREATE TYPE "IncidentType" AS ENUM ('FALL', 'MEDICATION_ERROR', 'INJURY', 'EMERGENCY_ROOM_VISIT', 'HOSPITALIZATION', 'EQUIPMENT_MALFUNCTION', 'THEFT', 'ABUSE_ALLEGATION', 'BEHAVIORAL_INCIDENT', 'OTHER');

-- CreateEnum
CREATE TYPE "IncidentSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "IncidentStatus" AS ENUM ('REPORTED', 'UNDER_INVESTIGATION', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT', 'IMPORT');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_profiles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" "Gender",
    "preferredName" TEXT,
    "profilePhoto" TEXT,
    "primaryPhone" TEXT NOT NULL,
    "secondaryPhone" TEXT,
    "status" "ClientStatus" NOT NULL DEFAULT 'INQUIRY',
    "enrollmentDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "client_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "family_profiles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "clientId" UUID NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "primaryPhone" TEXT NOT NULL,
    "secondaryPhone" TEXT,
    "email" TEXT NOT NULL,
    "canViewSchedule" BOOLEAN NOT NULL DEFAULT true,
    "canViewBilling" BOOLEAN NOT NULL DEFAULT false,
    "canReceiveUpdates" BOOLEAN NOT NULL DEFAULT true,
    "preferredContact" "ContactMethod" NOT NULL DEFAULT 'EMAIL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "family_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "caregiver_profiles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" "Gender",
    "profilePhoto" TEXT,
    "primaryPhone" TEXT NOT NULL,
    "secondaryPhone" TEXT,
    "employeeId" TEXT,
    "hireDate" TIMESTAMP(3),
    "status" "CaregiverStatus" NOT NULL DEFAULT 'APPLICATION_SUBMITTED',
    "employmentType" "EmploymentType" NOT NULL DEFAULT 'PART_TIME',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "caregiver_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "caregiver_credentials" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "caregiverId" UUID NOT NULL,
    "type" "CredentialType" NOT NULL,
    "credentialNumber" TEXT,
    "issuingOrganization" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "expirationDate" TIMESTAMP(3),
    "documentUrl" TEXT,
    "status" "CredentialStatus" NOT NULL DEFAULT 'PENDING_VERIFICATION',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "caregiver_credentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "caregiver_skills" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "caregiverId" UUID NOT NULL,
    "skill" "SkillType" NOT NULL,
    "level" "SkillLevel" NOT NULL DEFAULT 'BASIC',
    "certifiedAt" TIMESTAMP(3),

    CONSTRAINT "caregiver_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "caregiver_languages" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "caregiverId" UUID NOT NULL,
    "language" TEXT NOT NULL,
    "proficiency" "LanguageProficiency" NOT NULL,

    CONSTRAINT "caregiver_languages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "caregiver_availability" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "caregiverId" UUID NOT NULL,
    "dayOfWeek" "DayOfWeek" NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "isRecurring" BOOLEAN NOT NULL DEFAULT true,
    "effectiveDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "caregiver_availability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coordinator_profiles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "title" TEXT,
    "department" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "coordinator_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_coordinators" (
    "clientId" UUID NOT NULL,
    "coordinatorId" UUID NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isPrimary" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "client_coordinators_pkey" PRIMARY KEY ("clientId","coordinatorId")
);

-- CreateTable
CREATE TABLE "caregiver_coordinators" (
    "caregiverId" UUID NOT NULL,
    "coordinatorId" UUID NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "caregiver_coordinators_pkey" PRIMARY KEY ("caregiverId","coordinatorId")
);

-- CreateTable
CREATE TABLE "plans_of_care" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "clientId" UUID NOT NULL,
    "effectiveDate" TIMESTAMP(3) NOT NULL,
    "expirationDate" TIMESTAMP(3),
    "totalWeeklyHours" INTEGER NOT NULL,
    "status" "PlanStatus" NOT NULL DEFAULT 'DRAFT',
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plans_of_care_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "care_goals" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "planOfCareId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "targetDate" TIMESTAMP(3),
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "status" "GoalStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "care_goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_tasks" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "planOfCareId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" "TaskCategory" NOT NULL,
    "frequency" "TaskFrequency" NOT NULL,
    "estimatedDuration" INTEGER NOT NULL,
    "requiredSkills" "SkillType"[],
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visits" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "clientId" UUID NOT NULL,
    "caregiverId" UUID,
    "scheduledStart" TIMESTAMP(3) NOT NULL,
    "scheduledEnd" TIMESTAMP(3) NOT NULL,
    "actualStart" TIMESTAMP(3),
    "actualEnd" TIMESTAMP(3),
    "status" "VisitStatus" NOT NULL DEFAULT 'SCHEDULED',
    "visitType" "VisitType" NOT NULL DEFAULT 'REGULAR_CARE',
    "notes" TEXT,
    "clientSignature" TEXT,
    "caregiverNotes" TEXT,
    "billableHours" DECIMAL(4,2),
    "mileage" DECIMAL(6,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "visits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visit_tasks" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "visitId" UUID NOT NULL,
    "taskName" TEXT NOT NULL,
    "category" "TaskCategory" NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "visit_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evv_events" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "visitId" UUID NOT NULL,
    "eventType" "EVVEventType" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "deviceId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "telephony" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evv_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "clientId" UUID NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "billingPeriodId" UUID NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "taxAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
    "issuedAt" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_line_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "invoiceId" UUID NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" DECIMAL(6,2) NOT NULL,
    "unitPrice" DECIMAL(8,2) NOT NULL,
    "totalPrice" DECIMAL(10,2) NOT NULL,
    "visitId" UUID,

    CONSTRAINT "invoice_line_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "invoiceId" UUID NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "stripePaymentId" TEXT,
    "stripeChargeId" TEXT,
    "processedAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timesheets" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "caregiverId" UUID NOT NULL,
    "payPeriodId" UUID NOT NULL,
    "regularHours" DECIMAL(6,2) NOT NULL DEFAULT 0,
    "overtimeHours" DECIMAL(6,2) NOT NULL DEFAULT 0,
    "holidayHours" DECIMAL(6,2) NOT NULL DEFAULT 0,
    "totalMileage" DECIMAL(8,2) NOT NULL DEFAULT 0,
    "mileageRate" DECIMAL(4,3) NOT NULL DEFAULT 0.67,
    "status" "TimesheetStatus" NOT NULL DEFAULT 'DRAFT',
    "submittedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "timesheets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "threadId" UUID NOT NULL,
    "senderId" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "messageType" "MessageType" NOT NULL DEFAULT 'TEXT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_threads" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "subject" TEXT,
    "threadType" "ThreadType" NOT NULL DEFAULT 'GENERAL',
    "clientId" UUID,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "message_threads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "thread_participants" (
    "threadId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" TIMESTAMP(3),

    CONSTRAINT "thread_participants_pkey" PRIMARY KEY ("threadId","userId")
);

-- CreateTable
CREATE TABLE "message_reads" (
    "messageId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_reads_pkey" PRIMARY KEY ("messageId","userId")
);

-- CreateTable
CREATE TABLE "message_attachments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "messageId" UUID NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "uploadedById" UUID NOT NULL,
    "clientId" UUID,
    "fileName" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "documentType" "DocumentType" NOT NULL,
    "tags" TEXT[],
    "description" TEXT,
    "status" "DocumentStatus" NOT NULL DEFAULT 'ACTIVE',
    "isEncrypted" BOOLEAN NOT NULL DEFAULT false,
    "accessLevel" "AccessLevel" NOT NULL DEFAULT 'PRIVATE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incident_reports" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "clientId" UUID NOT NULL,
    "reportedById" UUID NOT NULL,
    "incidentType" "IncidentType" NOT NULL,
    "severity" "IncidentSeverity" NOT NULL,
    "incidentDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT,
    "injuryOccurred" BOOLEAN NOT NULL DEFAULT false,
    "medicalAttention" BOOLEAN NOT NULL DEFAULT false,
    "actionsTaken" TEXT,
    "followUpRequired" BOOLEAN NOT NULL DEFAULT false,
    "status" "IncidentStatus" NOT NULL DEFAULT 'REPORTED',
    "investigatedAt" TIMESTAMP(3),
    "investigatedBy" TEXT,
    "resolution" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "incident_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "caregiver_ratings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "caregiverId" UUID NOT NULL,
    "clientId" UUID NOT NULL,
    "visitId" UUID,
    "overallRating" INTEGER NOT NULL,
    "punctualityRating" INTEGER,
    "qualityRating" INTEGER,
    "communicationRating" INTEGER,
    "comments" TEXT,
    "wouldRecommend" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "caregiver_ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID,
    "action" "AuditAction" NOT NULL,
    "resourceType" TEXT NOT NULL,
    "resourceId" TEXT,
    "oldValues" JSONB,
    "newValues" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "street1" TEXT NOT NULL,
    "street2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'US',
    "clientProfileId" UUID,
    "caregiverProfileId" UUID,
    "emergencyContactId" UUID,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emergency_contacts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "primaryPhone" TEXT NOT NULL,
    "secondaryPhone" TEXT,
    "clientProfileId" UUID,
    "caregiverProfileId" UUID,

    CONSTRAINT "emergency_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical_info" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "allergies" TEXT[],
    "medications" TEXT[],
    "conditions" TEXT[],
    "physicians" JSONB[],
    "insuranceInfo" JSONB,
    "clientProfileId" UUID,

    CONSTRAINT "medical_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_preferences" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "genderPreference" TEXT,
    "languagePreference" TEXT[],
    "petAllergies" BOOLEAN NOT NULL DEFAULT false,
    "smokingPolicy" TEXT,
    "specialRequests" TEXT,
    "clientProfileId" UUID,

    CONSTRAINT "client_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "caregiver_preferences" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "maxTravelDistance" INTEGER NOT NULL DEFAULT 25,
    "preferredClients" TEXT[],
    "availableForEmergency" BOOLEAN NOT NULL DEFAULT false,
    "transportationAvailable" BOOLEAN NOT NULL DEFAULT true,
    "caregiverProfileId" UUID,

    CONSTRAINT "caregiver_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedule_preferences" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "dayOfWeek" "DayOfWeek" NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "caregiverProfileId" UUID,
    "planOfCareId" UUID,

    CONSTRAINT "schedule_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "date_ranges" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "date_ranges_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "client_profiles_userId_key" ON "client_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "family_profiles_userId_key" ON "family_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "caregiver_profiles_userId_key" ON "caregiver_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "caregiver_profiles_employeeId_key" ON "caregiver_profiles"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "caregiver_skills_caregiverId_skill_key" ON "caregiver_skills"("caregiverId", "skill");

-- CreateIndex
CREATE UNIQUE INDEX "caregiver_languages_caregiverId_language_key" ON "caregiver_languages"("caregiverId", "language");

-- CreateIndex
CREATE UNIQUE INDEX "coordinator_profiles_userId_key" ON "coordinator_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "plans_of_care_clientId_key" ON "plans_of_care"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoiceNumber_key" ON "invoices"("invoiceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "medical_info_clientProfileId_key" ON "medical_info"("clientProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "client_preferences_clientProfileId_key" ON "client_preferences"("clientProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "caregiver_preferences_caregiverProfileId_key" ON "caregiver_preferences"("caregiverProfileId");

-- AddForeignKey
ALTER TABLE "client_profiles" ADD CONSTRAINT "client_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "family_profiles" ADD CONSTRAINT "family_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "family_profiles" ADD CONSTRAINT "family_profiles_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caregiver_profiles" ADD CONSTRAINT "caregiver_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caregiver_credentials" ADD CONSTRAINT "caregiver_credentials_caregiverId_fkey" FOREIGN KEY ("caregiverId") REFERENCES "caregiver_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caregiver_skills" ADD CONSTRAINT "caregiver_skills_caregiverId_fkey" FOREIGN KEY ("caregiverId") REFERENCES "caregiver_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caregiver_languages" ADD CONSTRAINT "caregiver_languages_caregiverId_fkey" FOREIGN KEY ("caregiverId") REFERENCES "caregiver_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caregiver_availability" ADD CONSTRAINT "caregiver_availability_caregiverId_fkey" FOREIGN KEY ("caregiverId") REFERENCES "caregiver_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coordinator_profiles" ADD CONSTRAINT "coordinator_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_coordinators" ADD CONSTRAINT "client_coordinators_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_coordinators" ADD CONSTRAINT "client_coordinators_coordinatorId_fkey" FOREIGN KEY ("coordinatorId") REFERENCES "coordinator_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caregiver_coordinators" ADD CONSTRAINT "caregiver_coordinators_caregiverId_fkey" FOREIGN KEY ("caregiverId") REFERENCES "caregiver_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caregiver_coordinators" ADD CONSTRAINT "caregiver_coordinators_coordinatorId_fkey" FOREIGN KEY ("coordinatorId") REFERENCES "coordinator_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plans_of_care" ADD CONSTRAINT "plans_of_care_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "care_goals" ADD CONSTRAINT "care_goals_planOfCareId_fkey" FOREIGN KEY ("planOfCareId") REFERENCES "plans_of_care"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_tasks" ADD CONSTRAINT "service_tasks_planOfCareId_fkey" FOREIGN KEY ("planOfCareId") REFERENCES "plans_of_care"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visits" ADD CONSTRAINT "visits_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visits" ADD CONSTRAINT "visits_caregiverId_fkey" FOREIGN KEY ("caregiverId") REFERENCES "caregiver_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visit_tasks" ADD CONSTRAINT "visit_tasks_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "visits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evv_events" ADD CONSTRAINT "evv_events_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "visits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_billingPeriodId_fkey" FOREIGN KEY ("billingPeriodId") REFERENCES "date_ranges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_line_items" ADD CONSTRAINT "invoice_line_items_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timesheets" ADD CONSTRAINT "timesheets_caregiverId_fkey" FOREIGN KEY ("caregiverId") REFERENCES "caregiver_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timesheets" ADD CONSTRAINT "timesheets_payPeriodId_fkey" FOREIGN KEY ("payPeriodId") REFERENCES "date_ranges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "message_threads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_threads" ADD CONSTRAINT "message_threads_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "thread_participants" ADD CONSTRAINT "thread_participants_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "message_threads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_reads" ADD CONSTRAINT "message_reads_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_attachments" ADD CONSTRAINT "message_attachments_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incident_reports" ADD CONSTRAINT "incident_reports_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incident_reports" ADD CONSTRAINT "incident_reports_reportedById_fkey" FOREIGN KEY ("reportedById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caregiver_ratings" ADD CONSTRAINT "caregiver_ratings_caregiverId_fkey" FOREIGN KEY ("caregiverId") REFERENCES "caregiver_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caregiver_ratings" ADD CONSTRAINT "caregiver_ratings_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_clientProfileId_fkey" FOREIGN KEY ("clientProfileId") REFERENCES "client_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_caregiverProfileId_fkey" FOREIGN KEY ("caregiverProfileId") REFERENCES "caregiver_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_emergencyContactId_fkey" FOREIGN KEY ("emergencyContactId") REFERENCES "emergency_contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emergency_contacts" ADD CONSTRAINT "emergency_contacts_clientProfileId_fkey" FOREIGN KEY ("clientProfileId") REFERENCES "client_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emergency_contacts" ADD CONSTRAINT "emergency_contacts_caregiverProfileId_fkey" FOREIGN KEY ("caregiverProfileId") REFERENCES "caregiver_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_info" ADD CONSTRAINT "medical_info_clientProfileId_fkey" FOREIGN KEY ("clientProfileId") REFERENCES "client_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_preferences" ADD CONSTRAINT "client_preferences_clientProfileId_fkey" FOREIGN KEY ("clientProfileId") REFERENCES "client_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caregiver_preferences" ADD CONSTRAINT "caregiver_preferences_caregiverProfileId_fkey" FOREIGN KEY ("caregiverProfileId") REFERENCES "caregiver_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule_preferences" ADD CONSTRAINT "schedule_preferences_caregiverProfileId_fkey" FOREIGN KEY ("caregiverProfileId") REFERENCES "caregiver_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule_preferences" ADD CONSTRAINT "schedule_preferences_planOfCareId_fkey" FOREIGN KEY ("planOfCareId") REFERENCES "plans_of_care"("id") ON DELETE SET NULL ON UPDATE CASCADE;
