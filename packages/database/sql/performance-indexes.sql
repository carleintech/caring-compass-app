-- Additional performance indexes for Caring Compass
-- Run this in Supabase SQL Editor after the main migration
-- Note: CONCURRENTLY removed to allow execution in transaction blocks

-- User and authentication indexes
CREATE INDEX IF NOT EXISTS idx_users_active_role ON users("isActive", role) WHERE "isActive" = true;
CREATE INDEX IF NOT EXISTS idx_users_last_login ON users("lastLoginAt") WHERE "lastLoginAt" IS NOT NULL;

-- Client profile indexes
CREATE INDEX IF NOT EXISTS idx_client_profiles_status ON client_profiles(status);
CREATE INDEX IF NOT EXISTS idx_client_profiles_enrollment ON client_profiles("enrollmentDate") WHERE "enrollmentDate" IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_client_profiles_user ON client_profiles("userId");

-- Caregiver profile indexes
CREATE INDEX IF NOT EXISTS idx_caregiver_profiles_status ON caregiver_profiles(status);
CREATE INDEX IF NOT EXISTS idx_caregiver_profiles_hire_date ON caregiver_profiles("hireDate") WHERE "hireDate" IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_caregiver_profiles_employment ON caregiver_profiles("employmentType", status);
CREATE INDEX IF NOT EXISTS idx_caregiver_profiles_user ON caregiver_profiles("userId");

-- Visit scheduling indexes
CREATE INDEX IF NOT EXISTS idx_visits_client_scheduled ON visits("clientId", "scheduledStart", status);
CREATE INDEX IF NOT EXISTS idx_visits_caregiver_scheduled ON visits("caregiverId", "scheduledStart", status) WHERE "caregiverId" IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_visits_status_date ON visits(status, "scheduledStart");
CREATE INDEX IF NOT EXISTS idx_visits_date_range ON visits("scheduledStart", "scheduledEnd");

-- EVV indexes for compliance reporting
CREATE INDEX IF NOT EXISTS idx_evv_events_visit_type ON evv_events("visitId", "eventType", timestamp);
CREATE INDEX IF NOT EXISTS idx_evv_events_timestamp ON evv_events(timestamp);

-- Billing indexes
CREATE INDEX IF NOT EXISTS idx_invoices_client_status ON invoices("clientId", status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices("dueDate", status) WHERE "dueDate" IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_billing_period ON invoices("billingPeriodId");

-- Payment indexes
CREATE INDEX IF NOT EXISTS idx_payments_invoice_status ON payments("invoiceId", status);
CREATE INDEX IF NOT EXISTS idx_payments_processed_date ON payments("processedAt") WHERE "processedAt" IS NOT NULL;

-- Timesheet indexes
CREATE INDEX IF NOT EXISTS idx_timesheets_caregiver_period ON timesheets("caregiverId", "payPeriodId", status);
CREATE INDEX IF NOT EXISTS idx_timesheets_status ON timesheets(status);

-- Messaging indexes
CREATE INDEX IF NOT EXISTS idx_messages_thread_created ON messages("threadId", "createdAt");
CREATE INDEX IF NOT EXISTS idx_message_threads_updated ON message_threads("updatedAt", "isActive") WHERE "isActive" = true;
CREATE INDEX IF NOT EXISTS idx_thread_participants_user ON thread_participants("userId");
CREATE INDEX IF NOT EXISTS idx_thread_participants_thread ON thread_participants("threadId");

-- Document indexes
CREATE INDEX IF NOT EXISTS idx_documents_client_type ON documents("clientId", "documentType") WHERE "clientId" IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_documents_uploader_date ON documents("uploadedById", "createdAt");
CREATE INDEX IF NOT EXISTS idx_documents_status_access ON documents(status, "accessLevel");

-- Credential expiration monitoring
CREATE INDEX IF NOT EXISTS idx_caregiver_credentials_expiry ON caregiver_credentials("expirationDate", status) 
  WHERE "expirationDate" IS NOT NULL AND status = 'VERIFIED';
CREATE INDEX IF NOT EXISTS idx_caregiver_credentials_caregiver ON caregiver_credentials("caregiverId");

-- Skills and availability lookup optimization
CREATE INDEX IF NOT EXISTS idx_caregiver_skills_caregiver ON caregiver_skills("caregiverId");
CREATE INDEX IF NOT EXISTS idx_caregiver_skills_skill_level ON caregiver_skills(skill, level);
CREATE INDEX IF NOT EXISTS idx_caregiver_availability_day_time ON caregiver_availability("dayOfWeek", "startTime", "endTime", "effectiveDate");
CREATE INDEX IF NOT EXISTS idx_caregiver_availability_caregiver ON caregiver_availability("caregiverId");

-- Plan of care indexes
CREATE INDEX IF NOT EXISTS idx_plans_of_care_client ON plans_of_care("clientId");
CREATE INDEX IF NOT EXISTS idx_plans_of_care_status ON plans_of_care(status);
CREATE INDEX IF NOT EXISTS idx_care_goals_plan ON care_goals("planOfCareId");
CREATE INDEX IF NOT EXISTS idx_service_tasks_plan ON service_tasks("planOfCareId");

-- Family profile indexes
CREATE INDEX IF NOT EXISTS idx_family_profiles_client ON family_profiles("clientId");
CREATE INDEX IF NOT EXISTS idx_family_profiles_user ON family_profiles("userId");

-- Coordinator assignment indexes
CREATE INDEX IF NOT EXISTS idx_client_coordinators_client ON client_coordinators("clientId");
CREATE INDEX IF NOT EXISTS idx_client_coordinators_coordinator ON client_coordinators("coordinatorId");
CREATE INDEX IF NOT EXISTS idx_caregiver_coordinators_caregiver ON caregiver_coordinators("caregiverId");
CREATE INDEX IF NOT EXISTS idx_caregiver_coordinators_coordinator ON caregiver_coordinators("coordinatorId");

-- Incident report indexes
CREATE INDEX IF NOT EXISTS idx_incident_reports_client ON incident_reports("clientId");
CREATE INDEX IF NOT EXISTS idx_incident_reports_reporter ON incident_reports("reportedById");
CREATE INDEX IF NOT EXISTS idx_incident_reports_date_severity ON incident_reports("incidentDate", severity);

-- Caregiver rating indexes
CREATE INDEX IF NOT EXISTS idx_caregiver_ratings_caregiver ON caregiver_ratings("caregiverId");
CREATE INDEX IF NOT EXISTS idx_caregiver_ratings_client ON caregiver_ratings("clientId");
CREATE INDEX IF NOT EXISTS idx_caregiver_ratings_date ON caregiver_ratings("createdAt");

-- Audit log performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs("resourceType", "resourceId", timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_action ON audit_logs("userId", action, timestamp) WHERE "userId" IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);

-- Address and contact indexes
CREATE INDEX IF NOT EXISTS idx_addresses_client_profile ON addresses("clientProfileId") WHERE "clientProfileId" IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_addresses_caregiver_profile ON addresses("caregiverProfileId") WHERE "caregiverProfileId" IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_client_profile ON emergency_contacts("clientProfileId") WHERE "clientProfileId" IS NOT NULL;

-- Preferences indexes
CREATE INDEX IF NOT EXISTS idx_client_preferences_client ON client_preferences("clientProfileId");
CREATE INDEX IF NOT EXISTS idx_caregiver_preferences_caregiver ON caregiver_preferences("caregiverProfileId");
CREATE INDEX IF NOT EXISTS idx_schedule_preferences_caregiver ON schedule_preferences("caregiverProfileId") WHERE "caregiverProfileId" IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_schedule_preferences_plan ON schedule_preferences("planOfCareId") WHERE "planOfCareId" IS NOT NULL;

-- Date range indexes for billing periods and pay periods
CREATE INDEX IF NOT EXISTS idx_date_ranges_dates ON date_ranges("startDate", "endDate");

-- Full-text search indexes for names (using proper camelCase column names)
CREATE INDEX IF NOT EXISTS idx_client_profiles_name_search ON client_profiles 
  USING gin(to_tsvector('english', "firstName" || ' ' || "lastName"));
CREATE INDEX IF NOT EXISTS idx_caregiver_profiles_name_search ON caregiver_profiles 
  USING gin(to_tsvector('english', "firstName" || ' ' || "lastName"));

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_visits_client_date_status ON visits("clientId", "scheduledStart", status);
CREATE INDEX IF NOT EXISTS idx_visits_caregiver_date_status ON visits("caregiverId", "scheduledStart", status) WHERE "caregiverId" IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_caregiver_credentials_type_status ON caregiver_credentials("caregiverId", type, status);
CREATE INDEX IF NOT EXISTS idx_invoices_client_date_status ON invoices("clientId", "createdAt", status);

-- Performance optimization for RLS policies
CREATE INDEX IF NOT EXISTS idx_users_id_role ON users(id, role);
CREATE INDEX IF NOT EXISTS idx_client_profiles_id_user ON client_profiles(id, "userId");
CREATE INDEX IF NOT EXISTS idx_caregiver_profiles_id_user ON caregiver_profiles(id, "userId");
CREATE INDEX IF NOT EXISTS idx_family_profiles_client_user ON family_profiles("clientId", "userId");

-- Refresh statistics after creating indexes
ANALYZE;
