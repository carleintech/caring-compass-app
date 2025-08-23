# Caring Compass Database Documentation

## Overview
This document provides comprehensive documentation for the Caring Compass home care management system database schema. The system is designed to manage all aspects of home care delivery including client management, caregiver coordination, care planning, scheduling, billing, and compliance.

## Architecture Overview

### Core Entities
- **Users**: Central identity management across all user types
- **Clients**: Individuals receiving care services
- **Caregivers**: Staff providing care services
- **Care Plans**: Structured care delivery plans
- **Visits**: Scheduled care delivery instances
- **Billing**: Financial management and invoicing

### Key Relationships
- Users can have multiple roles (Client, Caregiver, Coordinator, Admin)
- Clients have dedicated care plans with specific goals and tasks
- Caregivers have credentials, skills, and availability schedules
- Visits are linked to care plans and tracked with EVV (Electronic Visit Verification)
- Billing is automatically generated from completed visits

## Detailed Schema Documentation

### 1. User Management

#### User
**Purpose**: Central identity management for all system users
**Key Fields**:
- `id`: UUID primary key
- `email`: Unique email address
- `role`: User type (CLIENT, FAMILY, CAREGIVER, COORDINATOR, ADMIN)
- `firstName`, `lastName`: Personal information
- `phone`: Contact number
- `isActive`: Account status
- `createdAt`, `updatedAt`: Audit timestamps

**Relationships**:
- One-to-one with Client, Caregiver, or Coordinator profiles
- One-to-many with Messages (as sender/recipient)
- One-to-many with Documents
- One-to-many with AuditLogs

#### UserPreferences
**Purpose**: Store user-specific settings and preferences
**Key Fields**:
- `notifications`: Email/SMS notification preferences
- `timezone`: User's preferred timezone
- `language`: Interface language preference

### 2. Client Management

#### Client
**Purpose**: Comprehensive profile for care recipients
**Key Fields**:
- `userId`: Links to User table
- `dateOfBirth`: Client's birth date
- `emergencyContact`: Primary emergency contact
- `emergencyContactPhone`: Emergency contact number
- `medicalConditions`: JSON array of medical conditions
- `medications`: JSON array of current medications
- `allergies`: JSON array of known allergies
- `mobilityLevel`: Mobility assistance needs
- `cognitiveStatus`: Mental/cognitive assessment
- `preferredLanguage`: Communication language
- `dietaryRestrictions`: Dietary limitations
- `livingArrangement`: Home type (OWN_HOME, ASSISTED_LIVING, etc.)
- `insuranceProvider`: Insurance information
- `insuranceNumber`: Policy number
- `careLevel`: Required care intensity

**Relationships**:
- One-to-one with User
- One-to-many with CarePlans
- One-to-many with Documents
- One-to-many with FamilyMembers
- One-to-many with Messages

#### FamilyMember
**Purpose**: Manage client's family/support network
**Key Fields**:
- `clientId`: Associated client
- `userId`: Linked user (if family member has system access)
- `relationship`: Family relationship type
- `isEmergencyContact`: Emergency contact designation
- `canAccessRecords`: Authorization for medical records

### 3. Caregiver Management

#### Caregiver
**Purpose**: Comprehensive caregiver profile and management
**Key Fields**:
- `userId`: Links to User table
- `licenseNumber`: Professional license
- `licenseExpiry`: License expiration date
- `backgroundCheckStatus`: Background verification
- `backgroundCheckExpiry`: Verification expiration
- `yearsOfExperience`: Professional experience
- `specializations`: JSON array of specializations
- `hourlyRate`: Standard billing rate
- `availability`: JSON schedule availability
- `maxHoursPerWeek`: Work hour limitations
- `preferredClientTypes`: Preferred client demographics
- `transportation`: Reliable transportation indicator
- `canLift25Lbs`: Physical capability indicator

**Relationships**:
- One-to-one with User
- One-to-many with Credentials
- One-to-many with Skills
- One-to-many with Availability
- One-to-many with Timesheets
- One-to-many with Visits (as assigned caregiver)

#### Credential
**Purpose**: Track professional certifications and licenses
**Key Fields**:
- `caregiverId`: Associated caregiver
- `type`: Certification type (CNA, HHA, CPR, etc.)
- `number`: Certification number
- `issuingOrganization`: Certifying body
- `issueDate`: Certification date
- `expiryDate`: Expiration date
- `status`: Current validity status
- `documentUrl`: Digital certificate storage

#### Skill
**Purpose**: Track caregiver competencies and specializations
**Key Fields**:
- `caregiverId`: Associated caregiver
- `name`: Skill name (DEMENTIA_CARE, MOBILITY_ASSISTANCE, etc.)
- `level`: Proficiency level (BASIC, INTERMEDIATE, ADVANCED)
- `verified`: Skill verification status

#### CaregiverAvailability
**Purpose**: Manage caregiver scheduling availability
**Key Fields**:
- `caregiverId`: Associated caregiver
- `dayOfWeek`: Available days
- `startTime`: Daily availability start
- `endTime`: Daily availability end
- `isAvailable`: Active availability flag

### 4. Care Planning

#### CarePlan
**Purpose**: Comprehensive care delivery plans
**Key Fields**:
- `clientId`: Associated client
- `title`: Plan name/description
- `description`: Detailed care objectives
- `startDate`: Plan initiation
- `endDate`: Plan completion (if applicable)
- `status`: Current plan status
- `totalHours`: Planned care hours
- `frequency`: Service frequency
- `createdBy`: Plan author
- `approvedBy`: Approving authority

**Relationships**:
- Many-to-one with Client
- One-to-many with CarePlanGoals
- One-to-many with ServiceTasks
- One-to-many with Visits

#### CarePlanGoal
**Purpose**: Measurable care objectives
**Key Fields**:
- `carePlanId`: Associated care plan
- `description`: Goal description
- `targetDate`: Achievement deadline
- `status`: Current progress status
- `outcomeMeasures`: Success metrics
- `achievedDate`: Completion date (if achieved)

#### ServiceTask
**Purpose**: Individual care delivery tasks
**Key Fields**:
- `carePlanId`: Associated care plan
- `title`: Task name
- `description`: Detailed task instructions
- `category`: Task type (MEDICATION, MOBILITY, etc.)
- `frequency`: How often performed
- `duration`: Expected time required
- `instructions`: Step-by-step guidance
- `specialRequirements`: Equipment or skill needs
- `isBillable`: Billing eligibility
- `billingCode`: Service billing code

### 5. Scheduling and Visits

#### Visit
**Purpose**: Individual care delivery instances
**Key Fields**:
- `carePlanId`: Associated care plan
- `clientId`: Service recipient
- `caregiverId`: Assigned caregiver
- `scheduledStartTime`: Planned start
- `scheduledEndTime`: Planned end
- `actualStartTime`: Actual start (EVV)
- `actualEndTime`: Actual end (EVV)
- `status`: Visit status
- `evvCode`: Electronic verification code
- `notes`: Care notes
- `incidents`: Reported incidents
- `mileage`: Travel distance
- `clockInLocation`: GPS check-in
- `clockOutLocation`: GPS check-out

**Relationships**:
- Many-to-one with CarePlan, Client, Caregiver
- One-to-many with VisitTasks
- One-to-one with BillingRecord

#### VisitTask
**Purpose**: Track completion of individual service tasks
**Key Fields**:
- `visitId`: Associated visit
- `serviceTaskId`: Related service task
- `completed`: Task completion status
- `completionTime`: When completed
- `notes`: Task-specific notes

### 6. Billing and Payments

#### BillingRecord
**Purpose**: Automated billing from completed visits
**Key Fields**:
- `visitId`: Associated visit
- `amount`: Billed amount
- `billingCode`: Service billing code
- `status`: Billing status
- `submittedDate`: Submission date
- `paidDate`: Payment date
- `paymentAmount`: Actual payment
- `adjustmentReason`: Any billing adjustments

#### Invoice
**Purpose**: Client billing statements
**Key Fields**:
- `clientId`: Billed client
- `billingPeriodStart`: Statement period start
- `billingPeriodEnd`: Statement period end
- `totalAmount`: Total charges
- `status`: Invoice status
- `dueDate`: Payment due date
- `paidAmount`: Amount paid
- `balance`: Outstanding balance

#### Payment
**Purpose**: Track client payments
**Key Fields**:
- `invoiceId`: Associated invoice
- `amount`: Payment amount
- `paymentMethod`: How paid
- `transactionId`: Payment reference
- `paymentDate`: When paid

### 7. Timesheet and Payroll

#### Timesheet
**Purpose**: Caregiver work hour tracking
**Key Fields**:
- `caregiverId`: Associated caregiver
- `visitId`: Related visit
- `hoursWorked`: Actual hours
- `hourlyRate`: Pay rate
- `totalPay`: Calculated pay
- `status`: Approval status
- `submittedAt`: Submission time
- `approvedAt`: Approval time
- `approvedBy`: Approving manager

### 8. Communication

#### Message
**Purpose**: Internal communication system
**Key Fields**:
- `senderId`: Message sender
- `recipientId`: Message recipient
- `subject`: Message subject
- `body`: Message content
- `isRead`: Read status
- `priority`: Message priority
- `parentMessageId`: Thread grouping

#### MessageAttachment
**Purpose**: File attachments to messages
**Key Fields**:
- `messageId`: Associated message
- `filename`: Attachment name
- `fileUrl`: Storage location
- `fileSize`: Attachment size
- `mimeType`: File type

### 9. Document Management

#### Document
**Purpose**: Secure document storage
**Key Fields**:
- `userId`: Document owner
- `clientId`: Associated client (if applicable)
- `filename`: Document name
- `fileUrl`: Storage location
- `fileSize`: Document size
- `mimeType`: Document type
- `category`: Document category
- `isEncrypted`: Security flag
- `accessLevel`: Who can access

### 10. Compliance and Auditing

#### AuditLog
**Purpose**: Comprehensive system audit trail
**Key Fields**:
- `userId`: Acting user
- `action`: Performed action
- `entityType`: Affected entity type
- `entityId`: Affected entity ID
- `changes`: JSON of changes made
- `ipAddress`: User IP
- `userAgent`: Browser/device info

#### IncidentReport
**Purpose**: Track care incidents
**Key Fields**:
- `visitId`: Associated visit
- `reportedBy`: Reporting user
- `incidentType`: Incident category
- `severity`: Incident severity
- `description`: Detailed incident description
- `clientCondition`: Client status
- `actionsTaken`: Immediate response
- `followUpRequired`: Further action needed
- `status`: Report status

## Business Rules and Constraints

### Data Integrity Rules
1. **User Uniqueness**: Email addresses must be unique across all users
2. **Caregiver Licensing**: All active caregivers must have valid, unexpired licenses
3. **Visit Validation**: All visits must have valid client-caregiver assignments
4. **Billing Accuracy**: Billing records must match actual completed visits
5. **Audit Trail**: All data modifications must be logged in AuditLog

### Business Logic Rules
1. **Care Plan Approval**: Care plans must be approved by authorized coordinators
2. **Visit Verification**: All visits require EVV (Electronic Visit Verification)
3. **Billing Automation**: Completed visits automatically generate billing records
4. **Caregiver Availability**: Scheduling respects caregiver availability and limitations
5. **Client Consent**: Document access requires appropriate client/family consent

### Security Rules
1. **Role-Based Access**: Users can only access data appropriate to their role
2. **Data Encryption**: Sensitive data (SSN, medical info) must be encrypted at rest
3. **Audit Compliance**: All PHI access must be logged for HIPAA compliance
4. **Document Security**: Documents have access controls and encryption
5. **Communication Privacy**: Messages containing PHI must be encrypted

## Performance Considerations

### Indexing Strategy
- Primary keys: All `id` fields
- Foreign keys: All relation fields (ending with `Id`)
- Search fields: `email`, `name` fields for user searches
- Date fields: `createdAt`, `updatedAt` for temporal queries
- Status fields: All `status` enum fields for filtering

### Partitioning Strategy
- Audit logs: Partition by date for historical data
- Messages: Partition by conversation/thread
- Documents: Partition by client for data isolation

### Archival Strategy
- Completed visits: Archive after 2 years
- Audit logs: Archive after 7 years (regulatory requirement)
- Messages: Archive after 1 year
- Documents: Retain according to regulatory requirements

## Data Retention Policies

### Regulatory Compliance
- **HIPAA**: Medical records retained for 6 years minimum
- **State Regulations**: Follow state-specific retention requirements
- **Medicare/Medicaid**: 7-year retention for billing records
- **Labor Records**: 3-year retention for timesheet/payroll data

### Operational Retention
- **Active Clients**: All data retained while active
- **Discharged Clients**: 6-year retention post-discharge
- **Former Caregivers**: 3-year retention post-employment
- **Financial Records**: 7-year retention for tax purposes

## Integration Points

### External Systems
- **EVV Systems**: Integration with state EVV requirements
- **Billing Systems**: Integration with insurance clearinghouses
- **Payroll Systems**: Integration with payroll providers
- **State Reporting**: Automated state compliance reporting

### API Considerations
- **RESTful Design**: Standard REST API patterns
- **GraphQL**: Consider GraphQL for complex queries
- **Webhooks**: Real-time updates for external systems
- **Rate Limiting**: API usage limits and throttling

## Future Considerations

### Scalability
- **Multi-tenancy**: Support for multiple agencies
- **Geographic Expansion**: Support for multiple states/regions
- **Service Expansion**: Additional service types
- **Integration Growth**: More external system connections

### Technology Evolution
- **AI/ML Integration**: Predictive analytics for care optimization
- **IoT Integration**: Health monitoring device data
- **Telehealth**: Virtual visit capabilities
- **Mobile Enhancement**: Enhanced mobile caregiver experience
