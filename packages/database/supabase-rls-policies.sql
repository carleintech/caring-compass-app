-- Caring Compass Row Level Security Policies
-- Run this in Supabase SQL Editor

-- ===== HELPER FUNCTIONS =====

-- Function to get current user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
BEGIN
  RETURN (
    SELECT role 
    FROM users 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is admin or coordinator
CREATE OR REPLACE FUNCTION is_admin_or_coordinator()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN get_user_role() IN ('ADMIN', 'COORDINATOR');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get client ID for current user
CREATE OR REPLACE FUNCTION get_client_id()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT id 
    FROM client_profiles 
    WHERE "userId" = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get caregiver ID for current user
CREATE OR REPLACE FUNCTION get_caregiver_id()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT id 
    FROM caregiver_profiles 
    WHERE "userId" = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has access to client
CREATE OR REPLACE FUNCTION has_client_access(client_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_role user_role;
  current_user_id UUID;
BEGIN
  current_user_id := auth.uid();
  user_role := get_user_role();
  
  -- Admin and Coordinator have access to all clients
  IF user_role IN ('ADMIN', 'COORDINATOR') THEN
    RETURN TRUE;
  END IF;
  
  -- Client can access their own profile
  IF user_role = 'CLIENT' THEN
    RETURN EXISTS (
      SELECT 1 FROM client_profiles 
      WHERE id = client_id AND "userId" = current_user_id
    );
  END IF;
  
  -- Family members can access their associated client
  IF user_role = 'FAMILY' THEN
    RETURN EXISTS (
      SELECT 1 FROM family_profiles 
      WHERE "clientId" = client_id AND "userId" = current_user_id
    );
  END IF;
  
  -- Caregivers can access clients they are assigned to
  IF user_role = 'CAREGIVER' THEN
    RETURN EXISTS (
      SELECT 1 FROM visits v
      JOIN caregiver_profiles cp ON v."caregiverId" = cp.id
      WHERE v."clientId" = client_id 
        AND cp."userId" = current_user_id
        AND v."scheduledStart" >= NOW() - INTERVAL '30 days'
    );
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===== ENABLE RLS ON ALL TABLES =====

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE caregiver_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE coordinator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE caregiver_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE caregiver_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE caregiver_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE caregiver_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans_of_care ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE visit_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE evv_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE timesheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE thread_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE incident_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE caregiver_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE caregiver_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE date_ranges ENABLE ROW LEVEL SECURITY;

-- ===== USER POLICIES =====

-- Users can view their own profile and related users
CREATE POLICY "users_select_policy" ON users
  FOR SELECT
  USING (
    id = auth.uid() OR 
    is_admin_or_coordinator() OR
    -- Family can see client user
    (role = 'CLIENT' AND EXISTS (
      SELECT 1 FROM family_profiles fp 
      WHERE fp."userId" = auth.uid() AND fp."clientId" IN (
        SELECT cp.id FROM client_profiles cp WHERE cp."userId" = users.id
      )
    )) OR
    -- Caregivers can see assigned client users
    (role = 'CLIENT' AND EXISTS (
      SELECT 1 FROM visits v
      JOIN caregiver_profiles cgp ON v."caregiverId" = cgp.id
      JOIN client_profiles cp ON v."clientId" = cp.id
      WHERE cgp."userId" = auth.uid() AND cp."userId" = users.id
    ))
  );

-- Users can update their own profile
CREATE POLICY "users_update_policy" ON users
  FOR UPDATE
  USING (id = auth.uid() OR is_admin_or_coordinator());

-- Only admins can insert/delete users
CREATE POLICY "users_insert_policy" ON users
  FOR INSERT
  WITH CHECK (is_admin_or_coordinator());

CREATE POLICY "users_delete_policy" ON users
  FOR DELETE
  USING (is_admin_or_coordinator());

-- ===== CLIENT PROFILE POLICIES =====

-- Client profiles are viewable by the client, family, assigned caregivers, and staff
CREATE POLICY "client_profiles_select_policy" ON client_profiles
  FOR SELECT
  USING (has_client_access(id));

-- Only clients and staff can update client profiles
CREATE POLICY "client_profiles_update_policy" ON client_profiles
  FOR UPDATE
  USING (
    "userId" = auth.uid() OR 
    is_admin_or_coordinator()
  );

-- Only staff can create client profiles
CREATE POLICY "client_profiles_insert_policy" ON client_profiles
  FOR INSERT
  WITH CHECK (is_admin_or_coordinator());

-- Only admins can delete client profiles
CREATE POLICY "client_profiles_delete_policy" ON client_profiles
  FOR DELETE
  USING (get_user_role() = 'ADMIN');

-- ===== FAMILY PROFILE POLICIES =====

-- Family members can view profiles for their associated client
CREATE POLICY "family_profiles_select_policy" ON family_profiles
  FOR SELECT
  USING (
    "userId" = auth.uid() OR 
    has_client_access("clientId") OR
    is_admin_or_coordinator()
  );

-- Family members can update their own profile, staff can update any
CREATE POLICY "family_profiles_update_policy" ON family_profiles
  FOR UPDATE
  USING (
    "userId" = auth.uid() OR 
    is_admin_or_coordinator()
  );

-- Staff and clients can create family profiles
CREATE POLICY "family_profiles_insert_policy" ON family_profiles
  FOR INSERT
  WITH CHECK (
    is_admin_or_coordinator() OR
    has_client_access("clientId")
  );

-- ===== CAREGIVER PROFILE POLICIES =====

-- Caregivers can view their own profile, staff can view all
CREATE POLICY "caregiver_profiles_select_policy" ON caregiver_profiles
  FOR SELECT
  USING (
    "userId" = auth.uid() OR 
    is_admin_or_coordinator()
  );

-- Caregivers can update their own profile, staff can update any
CREATE POLICY "caregiver_profiles_update_policy" ON caregiver_profiles
  FOR UPDATE
  USING (
    "userId" = auth.uid() OR 
    is_admin_or_coordinator()
  );

-- Only staff can create/delete caregiver profiles
CREATE POLICY "caregiver_profiles_insert_policy" ON caregiver_profiles
  FOR INSERT
  WITH CHECK (is_admin_or_coordinator());

CREATE POLICY "caregiver_profiles_delete_policy" ON caregiver_profiles
  FOR DELETE
  USING (is_admin_or_coordinator());

-- ===== CAREGIVER RELATED POLICIES =====

-- Caregiver credentials, skills, languages, availability
CREATE POLICY "caregiver_credentials_policy" ON caregiver_credentials
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM caregiver_profiles cp 
      WHERE cp.id = "caregiverId" 
        AND (cp."userId" = auth.uid() OR is_admin_or_coordinator())
    )
  );

CREATE POLICY "caregiver_skills_policy" ON caregiver_skills
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM caregiver_profiles cp 
      WHERE cp.id = "caregiverId" 
        AND (cp."userId" = auth.uid() OR is_admin_or_coordinator())
    )
  );

CREATE POLICY "caregiver_languages_policy" ON caregiver_languages
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM caregiver_profiles cp 
      WHERE cp.id = "caregiverId" 
        AND (cp."userId" = auth.uid() OR is_admin_or_coordinator())
    )
  );

CREATE POLICY "caregiver_availability_policy" ON caregiver_availability
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM caregiver_profiles cp 
      WHERE cp.id = "caregiverId" 
        AND (cp."userId" = auth.uid() OR is_admin_or_coordinator())
    )
  );

-- ===== COORDINATOR PROFILE POLICIES =====

-- Coordinators can view their own profile, admins can view all
CREATE POLICY "coordinator_profiles_select_policy" ON coordinator_profiles
  FOR SELECT
  USING (
    "userId" = auth.uid() OR 
    get_user_role() = 'ADMIN'
  );

CREATE POLICY "coordinator_profiles_update_policy" ON coordinator_profiles
  FOR UPDATE
  USING (
    "userId" = auth.uid() OR 
    get_user_role() = 'ADMIN'
  );

-- Only admins can create/delete coordinator profiles
CREATE POLICY "coordinator_profiles_insert_policy" ON coordinator_profiles
  FOR INSERT
  WITH CHECK (get_user_role() = 'ADMIN');

CREATE POLICY "coordinator_profiles_delete_policy" ON coordinator_profiles
  FOR DELETE
  USING (get_user_role() = 'ADMIN');

-- ===== PLAN OF CARE POLICIES =====

-- Plans of care are viewable by client, family, assigned caregivers, and staff
CREATE POLICY "plans_of_care_select_policy" ON plans_of_care
  FOR SELECT
  USING (has_client_access("clientId"));

-- Only staff can modify plans of care
CREATE POLICY "plans_of_care_modify_policy" ON plans_of_care
  FOR ALL
  USING (is_admin_or_coordinator())
  WITH CHECK (is_admin_or_coordinator());

-- Care goals and service tasks follow plan of care access
CREATE POLICY "care_goals_policy" ON care_goals
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM plans_of_care poc 
      WHERE poc.id = "planOfCareId" AND has_client_access(poc."clientId")
    )
  )
  WITH CHECK (
    is_admin_or_coordinator() AND
    EXISTS (
      SELECT 1 FROM plans_of_care poc 
      WHERE poc.id = "planOfCareId"
    )
  );

CREATE POLICY "service_tasks_policy" ON service_tasks
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM plans_of_care poc 
      WHERE poc.id = "planOfCareId" AND has_client_access(poc."clientId")
    )
  )
  WITH CHECK (
    is_admin_or_coordinator() AND
    EXISTS (
      SELECT 1 FROM plans_of_care poc 
      WHERE poc.id = "planOfCareId"
    )
  );

-- ===== VISIT POLICIES =====

-- Visits are viewable by client, family, assigned caregiver, and staff
CREATE POLICY "visits_select_policy" ON visits
  FOR SELECT
  USING (
    has_client_access("clientId") OR
    EXISTS (
      SELECT 1 FROM caregiver_profiles cp 
      WHERE cp.id = "caregiverId" AND cp."userId" = auth.uid()
    ) OR
    is_admin_or_coordinator()
  );

-- Caregivers can update their assigned visits (for EVV, notes, etc.)
-- Staff can modify any visit
CREATE POLICY "visits_update_policy" ON visits
  FOR UPDATE
  USING (
    (EXISTS (
      SELECT 1 FROM caregiver_profiles cp 
      WHERE cp.id = "caregiverId" AND cp."userId" = auth.uid()
    )) OR
    is_admin_or_coordinator()
  );

-- Only staff can create/delete visits
CREATE POLICY "visits_insert_policy" ON visits
  FOR INSERT
  WITH CHECK (is_admin_or_coordinator());

CREATE POLICY "visits_delete_policy" ON visits
  FOR DELETE
  USING (is_admin_or_coordinator());

-- Visit tasks and EVV events follow visit access
CREATE POLICY "visit_tasks_policy" ON visit_tasks
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM visits v 
      WHERE v.id = "visitId" 
        AND (has_client_access(v."clientId") OR 
             EXISTS (SELECT 1 FROM caregiver_profiles cp 
                    WHERE cp.id = v."caregiverId" AND cp."userId" = auth.uid()) OR
             is_admin_or_coordinator())
    )
  );

CREATE POLICY "evv_events_policy" ON evv_events
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM visits v 
      WHERE v.id = "visitId" 
        AND (EXISTS (SELECT 1 FROM caregiver_profiles cp 
                    WHERE cp.id = v."caregiverId" AND cp."userId" = auth.uid()) OR
             is_admin_or_coordinator())
    )
  );

-- ===== BILLING POLICIES =====

-- Invoices are viewable by client, family, and staff
CREATE POLICY "invoices_select_policy" ON invoices
  FOR SELECT
  USING (has_client_access("clientId"));

-- Only staff can modify invoices
CREATE POLICY "invoices_modify_policy" ON invoices
  FOR ALL
  USING (is_admin_or_coordinator())
  WITH CHECK (is_admin_or_coordinator());

-- Invoice line items and payments follow invoice access
CREATE POLICY "invoice_line_items_policy" ON invoice_line_items
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM invoices i 
      WHERE i.id = "invoiceId" AND has_client_access(i."clientId")
    )
  );

CREATE POLICY "payments_policy" ON payments
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM invoices i 
      WHERE i.id = "invoiceId" AND has_client_access(i."clientId")
    )
  );

-- ===== TIMESHEET POLICIES =====

-- Timesheets are viewable by the caregiver and staff
CREATE POLICY "timesheets_select_policy" ON timesheets
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM caregiver_profiles cp 
      WHERE cp.id = "caregiverId" AND cp."userId" = auth.uid()
    ) OR
    is_admin_or_coordinator()
  );

-- Caregivers can update their own timesheets, staff can modify any
CREATE POLICY "timesheets_update_policy" ON timesheets
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM caregiver_profiles cp 
      WHERE cp.id = "caregiverId" AND cp."userId" = auth.uid()
    ) OR
    is_admin_or_coordinator()
  );

-- Only staff can create/delete timesheets
CREATE POLICY "timesheets_insert_policy" ON timesheets
  FOR INSERT
  WITH CHECK (is_admin_or_coordinator());

CREATE POLICY "timesheets_delete_policy" ON timesheets
  FOR DELETE
  USING (is_admin_or_coordinator());

-- ===== MESSAGING POLICIES =====

-- Users can view threads they participate in
CREATE POLICY "message_threads_policy" ON message_threads
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM thread_participants tp 
      WHERE tp."threadId" = id AND tp."userId" = auth.uid()
    ) OR
    is_admin_or_coordinator()
  );

-- Thread participants can only see their own participation records
CREATE POLICY "thread_participants_policy" ON thread_participants
  FOR SELECT
  USING (
    "userId" = auth.uid() OR
    is_admin_or_coordinator() OR
    EXISTS (
      SELECT 1 FROM thread_participants tp2 
      WHERE tp2."threadId" = "threadId" AND tp2."userId" = auth.uid()
    )
  );

-- Messages are viewable by thread participants
CREATE POLICY "messages_select_policy" ON messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM thread_participants tp 
      WHERE tp."threadId" = "threadId" AND tp."userId" = auth.uid()
    ) OR
    is_admin_or_coordinator()
  );

-- Users can send messages to threads they participate in
CREATE POLICY "messages_insert_policy" ON messages
  FOR INSERT
  WITH CHECK (
    "senderId" = auth.uid() AND
    EXISTS (
      SELECT 1 FROM thread_participants tp 
      WHERE tp."threadId" = "threadId" AND tp."userId" = auth.uid()
    )
  );

-- Message reads and attachments follow message access
CREATE POLICY "message_reads_policy" ON message_reads
  FOR ALL
  USING ("userId" = auth.uid());

CREATE POLICY "message_attachments_policy" ON message_attachments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM messages m
      JOIN thread_participants tp ON m."threadId" = tp."threadId"
      WHERE m.id = "messageId" AND tp."userId" = auth.uid()
    ) OR
    is_admin_or_coordinator()
  );

-- ===== DOCUMENT POLICIES =====

-- Documents are viewable by owner, associated client/family, and staff
CREATE POLICY "documents_select_policy" ON documents
  FOR SELECT
  USING (
    "uploadedById" = auth.uid() OR
    ("clientId" IS NOT NULL AND has_client_access("clientId")) OR
    is_admin_or_coordinator()
  );

-- Users can upload documents, staff can manage any
CREATE POLICY "documents_insert_policy" ON documents
  FOR INSERT
  WITH CHECK (
    "uploadedById" = auth.uid() OR
    is_admin_or_coordinator()
  );

CREATE POLICY "documents_update_policy" ON documents
  FOR UPDATE
  USING (
    "uploadedById" = auth.uid() OR
    is_admin_or_coordinator()
  );

-- ===== INCIDENT REPORT POLICIES =====

-- Incident reports are viewable by client, family, and staff
CREATE POLICY "incident_reports_select_policy" ON incident_reports
  FOR SELECT
  USING (
    has_client_access("clientId") OR
    "reportedById" = auth.uid()
  );

-- Anyone can create incident reports, only staff can modify
CREATE POLICY "incident_reports_insert_policy" ON incident_reports
  FOR INSERT
  WITH CHECK ("reportedById" = auth.uid());

CREATE POLICY "incident_reports_update_policy" ON incident_reports
  FOR UPDATE
  USING (is_admin_or_coordinator());

-- ===== CAREGIVER RATING POLICIES =====

-- Ratings are viewable by the caregiver, client, and staff
CREATE POLICY "caregiver_ratings_select_policy" ON caregiver_ratings
  FOR SELECT
  USING (
    has_client_access("clientId") OR
    EXISTS (
      SELECT 1 FROM caregiver_profiles cp 
      WHERE cp.id = "caregiverId" AND cp."userId" = auth.uid()
    ) OR
    is_admin_or_coordinator()
  );

-- Only clients and family can create ratings
CREATE POLICY "caregiver_ratings_insert_policy" ON caregiver_ratings
  FOR INSERT
  WITH CHECK (has_client_access("clientId"));

-- ===== AUDIT LOG POLICIES =====

-- Only admins can view audit logs
CREATE POLICY "audit_logs_select_policy" ON audit_logs
  FOR SELECT
  USING (get_user_role() = 'ADMIN');

-- System can insert audit logs
CREATE POLICY "audit_logs_insert_policy" ON audit_logs
  FOR INSERT
  WITH CHECK (true); -- Allow system to insert audit logs

-- ===== SHARED TABLE POLICIES =====

-- Addresses are viewable by related profiles
CREATE POLICY "addresses_policy" ON addresses
  FOR ALL
  USING (
    ("clientProfileId" IS NOT NULL AND has_client_access("clientProfileId")) OR
    ("caregiverProfileId" IS NOT NULL AND EXISTS (
      SELECT 1 FROM caregiver_profiles cp 
      WHERE cp.id = "caregiverProfileId" 
        AND (cp."userId" = auth.uid() OR is_admin_or_coordinator())
    )) OR
    ("emergencyContactId" IS NOT NULL AND EXISTS (
      SELECT 1 FROM emergency_contacts ec
      JOIN client_profiles cp ON ec."clientProfileId" = cp.id
      WHERE ec.id = "emergencyContactId" AND has_client_access(cp.id)
    )) OR
    is_admin_or_coordinator()
  );

-- Emergency contacts follow client access
CREATE POLICY "emergency_contacts_policy" ON emergency_contacts
  FOR ALL
  USING (
    ("clientProfileId" IS NOT NULL AND has_client_access("clientProfileId")) OR
    ("caregiverProfileId" IS NOT NULL AND EXISTS (
      SELECT 1 FROM caregiver_profiles cp 
      WHERE cp.id = "caregiverProfileId" 
        AND (cp."userId" = auth.uid() OR is_admin_or_coordinator())
    )) OR
    is_admin_or_coordinator()
  );

-- Medical info, preferences follow client access
CREATE POLICY "medical_info_policy" ON medical_info
  FOR ALL
  USING (
    ("clientProfileId" IS NOT NULL AND has_client_access("clientProfileId")) OR
    is_admin_or_coordinator()
  );

CREATE POLICY "client_preferences_policy" ON client_preferences
  FOR ALL
  USING (
    ("clientProfileId" IS NOT NULL AND has_client_access("clientProfileId")) OR
    is_admin_or_coordinator()
  );

CREATE POLICY "caregiver_preferences_policy" ON caregiver_preferences
  FOR ALL
  USING (
    ("caregiverProfileId" IS NOT NULL AND EXISTS (
      SELECT 1 FROM caregiver_profiles cp 
      WHERE cp.id = "caregiverProfileId" 
        AND (cp."userId" = auth.uid() OR is_admin_or_coordinator())
    )) OR
    is_admin_or_coordinator()
  );

CREATE POLICY "schedule_preferences_policy" ON schedule_preferences
  FOR ALL
  USING (
    ("caregiverProfileId" IS NOT NULL AND EXISTS (
      SELECT 1 FROM caregiver_profiles cp 
      WHERE cp.id = "caregiverProfileId" 
        AND (cp."userId" = auth.uid() OR is_admin_or_coordinator())
    )) OR
    ("planOfCareId" IS NOT NULL AND EXISTS (
      SELECT 1 FROM plans_of_care poc 
      WHERE poc.id = "planOfCareId" AND has_client_access(poc."clientId")
    )) OR
    is_admin_or_coordinator()
  );

-- Date ranges are viewable by staff
CREATE POLICY "date_ranges_policy" ON date_ranges
  FOR ALL
  USING (is_admin_or_coordinator());

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';
