import { describe, expect, test, beforeAll, afterAll, beforeEach } from '@jest/globals'
import { appRouter } from '../routers'
import { createTRPCContext } from '../trpc/context'
import { getPrismaClient } from '@caring-compass/database/src/utils'

const prisma = getPrismaClient()

// Integration tests for the complete API layer
describe('API Integration Tests', () => {
  let testUsers: any[] = []
  let testClients: any[] = []
  let testCaregivers: any[] = []

  beforeAll(async () => {
    // Clean up any existing test data
    await cleanupTestData()
    
    // Create test users for different roles
    testUsers = await createTestUsers()
  })

  afterAll(async () => {
    await cleanupTestData()
    await prisma.$disconnect()
  })

  beforeEach(async () => {
    // Reset any test state if needed
  })

  describe('Complete User Registration Flow', () => {
    test('should handle client registration end-to-end', async () => {
      const ctx = createMockContext()
      const caller = appRouter.createCaller(ctx)

      // Step 1: Register new client
      const registrationData = {
        email: 'integration.client@test.com',
        password: 'SecurePass123!',
        role: 'CLIENT' as const,
        profile: {
          firstName: 'Integration',
          lastName: 'Client',
          phone: '555-INT-TEST',
          address: '123 Integration St',
          city: 'Virginia Beach',
          state: 'VA',
          zipCode: '23451',
          dateOfBirth: new Date('1950-01-01'),
          emergencyContactName: 'Emergency Contact',
          emergencyContactPhone: '555-EMERGENCY'
        }
      }

      const registrationResult = await caller.auth.register(registrationData)
      
      expect(registrationResult.user.email).toBe(registrationData.email)
      expect(registrationResult.user.role).toBe('CLIENT')
      expect(registrationResult.session).toBeDefined()

      // Step 2: Login with new credentials
      const loginResult = await caller.auth.login({
        email: registrationData.email,
        password: registrationData.password
      })

      expect(loginResult.user.id).toBe(registrationResult.user.id)
      expect(loginResult.session.accessToken).toBeDefined()

      // Step 3: Get profile information
      const newCtx = createMockContext({ user: loginResult.user })
      const authenticatedCaller = appRouter.createCaller(newCtx)
      
      const profileResult = await authenticatedCaller.auth.getProfile()
      expect(profileResult.profile.firstName).toBe(registrationData.profile.firstName)

      // Step 4: Update profile
      const updateData = {
        firstName: 'Updated',
        phone: '555-UPDATED'
      }

      const updateResult = await authenticatedCaller.auth.updateProfile(updateData)
      expect(updateResult.firstName).toBe(updateData.firstName)
      expect(updateResult.phone).toBe(updateData.phone)
    })

    test('should handle caregiver registration and application', async () => {
      const ctx = createMockContext()
      const caller = appRouter.createCaller(ctx)

      // Step 1: Register caregiver
      const registrationData = {
        email: 'caregiver@test.com',
        password: 'SecurePass123!',
        role: 'CAREGIVER' as const,
        profile: {
          firstName: 'Test',
          lastName: 'Caregiver',
          phone: '555-CARE-GIVE',
          address: '456 Care St',
          city: 'Norfolk',
          state: 'VA',
          zipCode: '23501',
          dateOfBirth: new Date('1990-01-01'),
          gender: 'FEMALE' as const,
          primaryLanguage: 'English',
          yearsExperience: 3,
          hourlyRate: 18.50,
          preferredSchedule: 'DAY_SHIFT' as const,
          willingToTravel: true,
          maxTravelDistance: 15
        }
      }

      const registrationResult = await caller.auth.register(registrationData)
      expect(registrationResult.user.role).toBe('CAREGIVER')

      // Step 2: Login as caregiver
      const loginResult = await caller.auth.login({
        email: registrationData.email,
        password: registrationData.password
      })

      const caregiverCtx = createMockContext({ user: loginResult.user })
      const caregiverCaller = appRouter.createCaller(caregiverCtx)

      // Step 3: Set availability
      const availabilityData = [
        {
          dayOfWeek: 1, // Monday
          startTime: 8,
          endTime: 16,
          effectiveDate: new Date()
        },
        {
          dayOfWeek: 2, // Tuesday
          startTime: 8,
          endTime: 16,
          effectiveDate: new Date()
        }
      ]

      const availabilityResult = await caregiverCaller.caregivers.setAvailability({
        availability: availabilityData
      })

      expect(availabilityResult.length).toBe(2)

      // Step 4: Add skills
      const skillsData = {
        skills: ['Personal Care', 'Medication Reminders', 'Companionship']
      }

      const skillsResult = await caregiverCaller.caregivers.updateSkills(skillsData)
      expect(skillsResult.length).toBe(3)
    })
  })

  describe('Client-Caregiver Matching Flow', () => {
    test('should create visit and find caregiver matches', async () => {
      // Setup: Create coordinator context
      const coordinatorUser = testUsers.find(u => u.role === 'COORDINATOR')
      const coordinatorCtx = createMockContext({ user: coordinatorUser })
      const coordinatorCaller = appRouter.createCaller(coordinatorCtx)

      // Setup: Get test client and caregiver IDs
      const clientId = testClients[0]?.id
      const caregiverId = testCaregivers[0]?.id

      if (!clientId || !caregiverId) {
        throw new Error('Test data not properly initialized')
      }

      // Step 1: Create a visit request
      const visitData = {
        clientId,
        scheduledStart: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        scheduledEnd: new Date(Date.now() + 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // +4 hours
        serviceType: 'Personal Care',
        tasks: ['Bathing assistance', 'Medication reminder'],
        notes: 'Regular weekly visit'
      }

      const visitResult = await coordinatorCaller.visits.create(visitData)
      expect(visitResult.id).toBeDefined()
      expect(visitResult.status).toBe('SCHEDULED')

      // Step 2: Find caregiver matches
      const matchingCriteria = {
        visitId: visitResult.id,
        requiredSkills: ['Personal Care'],
        maxDistance: 20,
        preferredLanguages: ['English']
      }

      const matchesResult = await coordinatorCaller.visits.findCaregiverMatches(matchingCriteria)
      expect(Array.isArray(matchesResult)).toBe(true)

      // Step 3: Assign caregiver to visit
      if (matchesResult.length > 0) {
        const assignmentData = {
          visitId: visitResult.id,
          caregiverId: matchesResult[0].caregiverId,
          assignedBy: coordinatorUser.id
        }

        const assignmentResult = await coordinatorCaller.visits.assignCaregiver(assignmentData)
        expect(assignmentResult.caregiverId).toBe(matchesResult[0].caregiverId)
        expect(assignmentResult.status).toBe('ASSIGNED')
      }
    })
  })

  describe('EVV (Electronic Visit Verification) Flow', () => {
    test('should handle complete EVV clock-in/clock-out flow', async () => {
      // Setup: Create visit with assigned caregiver
      const caregiverUser = testUsers.find(u => u.role === 'CAREGIVER')
      const caregiverCtx = createMockContext({ user: caregiverUser })
      const caregiverCaller = appRouter.createCaller(caregiverCtx)

      // Assume we have a visit assigned to this caregiver
      const visitId = 'test-visit-id' // In real test, this would be created

      // Step 1: Clock in
      const clockInData = {
        visitId,
        location: {
          latitude: 36.8508,
          longitude: -75.9776
        },
        deviceInfo: {
          deviceId: 'test-device-123',
          platform: 'mobile'
        }
      }

      const clockInResult = await caregiverCaller.visits.clockIn(clockInData)
      expect(clockInResult.eventType).toBe('CLOCK_IN')
      expect(clockInResult.timestamp).toBeDefined()

      // Step 2: Update visit tasks during the visit
      const taskUpdateData = {
        visitId,
        completedTasks: ['Bathing assistance'],
        notes: 'Client was cooperative, bathing completed successfully'
      }

      const taskResult = await caregiverCaller.visits.updateTasks(taskUpdateData)
      expect(taskResult.completedTasks).toContain('Bathing assistance')

      // Step 3: Clock out
      const clockOutData = {
        visitId,
        location: {
          latitude: 36.8508,
          longitude: -75.9776
        },
        summary: 'Visit completed successfully. All tasks performed.',
        mileage: 5.2
      }

      const clockOutResult = await caregiverCaller.visits.clockOut(clockOutData)
      expect(clockOutResult.eventType).toBe('CLOCK_OUT')
      expect(clockOutResult.timestamp).toBeDefined()

      // Step 4: Verify visit status changed to completed
      const updatedVisit = await caregiverCaller.visits.getById({ visitId })
      expect(updatedVisit.status).toBe('COMPLETED')
      expect(updatedVisit.actualStart).toBeDefined()
      expect(updatedVisit.actualEnd).toBeDefined()
    })
  })

  describe('Billing and Invoice Flow', () => {
    test('should generate invoice and process payment', async () => {
      const coordinatorUser = testUsers.find(u => u.role === 'COORDINATOR')
      const coordinatorCtx = createMockContext({ user: coordinatorUser })
      const coordinatorCaller = appRouter.createCaller(coordinatorCtx)

      const clientUser = testUsers.find(u => u.role === 'CLIENT')
      const clientCtx = createMockContext({ user: clientUser })
      const clientCaller = appRouter.createCaller(clientCtx)

      // Assume we have completed visits for billing
      const clientId = testClients[0]?.id

      // Step 1: Generate invoice
      const invoiceData = {
        clientId,
        billingPeriod: {
          startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last week
          endDate: new Date()
        },
        includeVisits: true
      }

      const invoiceResult = await coordinatorCaller.billing.generateInvoice(invoiceData)
      expect(invoiceResult.id).toBeDefined()
      expect(invoiceResult.status).toBe('PENDING')
      expect(invoiceResult.totalAmount).toBeGreaterThan(0)

      // Step 2: Client views invoice
      const clientInvoices = await clientCaller.billing.getInvoices({
        page: 1,
        limit: 10,
        status: 'PENDING'
      })

      expect(clientInvoices.invoices.length).toBeGreaterThan(0)

      // Step 3: Process payment
      const paymentData = {
        invoiceId: invoiceResult.id,
        amount: invoiceResult.totalAmount,
        paymentMethod: 'STRIPE' as const,
        stripePaymentIntentId: 'pi_test_payment_intent'
      }

      const paymentResult = await clientCaller.billing.processPayment(paymentData)
      expect(paymentResult.status).toBe('COMPLETED')

      // Step 4: Verify invoice is marked as paid
      const paidInvoice = await clientCaller.billing.getInvoiceById({
        invoiceId: invoiceResult.id
      })

      expect(paidInvoice.status).toBe('PAID')
      expect(paidInvoice.paidAt).toBeDefined()
    })
  })

  describe('Messaging System Flow', () => {
    test('should handle secure messaging between client and coordinator', async () => {
      const clientUser = testUsers.find(u => u.role === 'CLIENT')
      const clientCtx = createMockContext({ user: clientUser })
      const clientCaller = appRouter.createCaller(clientCtx)

      const coordinatorUser = testUsers.find(u => u.role === 'COORDINATOR')
      const coordinatorCtx = createMockContext({ user: coordinatorUser })
      const coordinatorCaller = appRouter.createCaller(coordinatorCtx)

      // Step 1: Client starts conversation
      const threadData = {
        subject: 'Question about my care plan',
        participantIds: [coordinatorUser.id],
        initialMessage: 'I have some questions about my upcoming visits.'
      }

      const threadResult = await clientCaller.messaging.createThread(threadData)
      expect(threadResult.id).toBeDefined()
      expect(threadResult.subject).toBe(threadData.subject)

      // Step 2: Coordinator responds
      const responseData = {
        threadId: threadResult.id,
        content: 'I\'d be happy to help answer your questions. What specific information do you need?'
      }

      const responseResult = await coordinatorCaller.messaging.sendMessage(responseData)
      expect(responseResult.content).toBe(responseData.content)

      // Step 3: Client sends follow-up
      const followUpData = {
        threadId: threadResult.id,
        content: 'When will my new caregiver start, and what should I prepare?'
      }

      const followUpResult = await clientCaller.messaging.sendMessage(followUpData)
      expect(followUpResult.threadId).toBe(threadResult.id)

      // Step 4: Retrieve conversation history
      const messagesResult = await clientCaller.messaging.getMessages({
        threadId: threadResult.id,
        page: 1,
        limit: 10
      })

      expect(messagesResult.messages.length).toBe(3) // Initial + 2 responses
      expect(messagesResult.messages[0].content).toBe(followUpData.content) // Most recent first
    })
  })
})

// Test helper functions
function createMockContext(overrides: any = {}) {
  return {
    prisma,
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
      role: 'CLIENT',
      isActive: true,
      ...overrides.user
    },
    session: {
      accessToken: 'mock-token',
      refreshToken: 'mock-refresh',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    },
    req: {
      headers: {},
      ip: '127.0.0.1',
      userAgent: 'test-agent'
    },
    ...overrides
  }
}

async function createTestUsers() {
  const users = [
    {
      email: 'admin@test.com',
      role: 'ADMIN',
      passwordHash: 'hashed-password'
    },
    {
      email: 'coordinator@test.com',
      role: 'COORDINATOR',
      passwordHash: 'hashed-password'
    },
    {
      email: 'client1@test.com',
      role: 'CLIENT',
      passwordHash: 'hashed-password'
    },
    {
      email: 'caregiver1@test.com',
      role: 'CAREGIVER',
      passwordHash: 'hashed-password'
    }
  ]

  // In a real test, you would create these users in the database
  // For now, return mock data
  return users.map((user, index) => ({
    id: `test-user-${index + 1}`,
    ...user,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }))
}

async function cleanupTestData() {
  // In a real implementation, clean up test data
  // await prisma.user.deleteMany({ where: { email: { contains: '@test.com' } } })
  console.log('Cleanup test data (placeholder)')
}