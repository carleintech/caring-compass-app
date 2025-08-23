-- CreateEnum
CREATE TYPE "EmailStatus" AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'BOUNCED', 'FAILED', 'OPENED', 'CLICKED');

-- CreateEnum
CREATE TYPE "SmsStatus" AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'FAILED', 'UNDELIVERED');

-- CreateEnum
CREATE TYPE "MessagePriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'ACTIVE', 'COMPLETED', 'FAILED', 'DELAYED', 'CANCELLED');

-- CreateTable
CREATE TABLE "user_invites" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "invitedBy" UUID NOT NULL,
    "inviteCode" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_invites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "to" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "templateId" TEXT,
    "templateData" JSONB,
    "htmlContent" TEXT,
    "textContent" TEXT,
    "status" "EmailStatus" NOT NULL DEFAULT 'PENDING',
    "deliveryStatus" TEXT,
    "errorMessage" TEXT,
    "provider" TEXT NOT NULL DEFAULT 'SENDGRID',
    "messageId" TEXT,
    "priority" "MessagePriority" NOT NULL DEFAULT 'NORMAL',
    "sentAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "openedAt" TIMESTAMP(3),
    "clickedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sms_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "to" TEXT NOT NULL,
    "from" TEXT,
    "message" TEXT NOT NULL,
    "templateId" TEXT,
    "templateData" JSONB,
    "status" "SmsStatus" NOT NULL DEFAULT 'PENDING',
    "deliveryStatus" TEXT,
    "errorMessage" TEXT,
    "provider" TEXT NOT NULL DEFAULT 'TWILIO',
    "messageId" TEXT,
    "priority" "MessagePriority" NOT NULL DEFAULT 'NORMAL',
    "sentAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sms_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_metrics" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "metricType" TEXT NOT NULL,
    "metricName" TEXT NOT NULL,
    "value" DECIMAL(15,4) NOT NULL,
    "unit" TEXT,
    "tags" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_executions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "jobId" TEXT NOT NULL,
    "jobName" TEXT NOT NULL,
    "queueName" TEXT NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'PENDING',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "jobData" JSONB,
    "result" JSONB,
    "error" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 3,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_executions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_settings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL DEFAULT 'GENERAL',
    "isEncrypted" BOOLEAN NOT NULL DEFAULT false,
    "isReadOnly" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_invites_inviteCode_key" ON "user_invites"("inviteCode");

-- CreateIndex
CREATE INDEX "system_metrics_metricType_metricName_timestamp_idx" ON "system_metrics"("metricType", "metricName", "timestamp");

-- CreateIndex
CREATE INDEX "job_executions_queueName_status_idx" ON "job_executions"("queueName", "status");

-- CreateIndex
CREATE INDEX "job_executions_jobName_status_idx" ON "job_executions"("jobName", "status");

-- CreateIndex
CREATE UNIQUE INDEX "system_settings_key_key" ON "system_settings"("key");

-- AddForeignKey
ALTER TABLE "user_invites" ADD CONSTRAINT "user_invites_invitedBy_fkey" FOREIGN KEY ("invitedBy") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
