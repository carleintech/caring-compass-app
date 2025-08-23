import { PrismaClient, UserRole, ClientStatus, CaregiverStatus, VisitStatus } from '@prisma/client'

const prisma = new PrismaClient()

// Declare process for Node.js environment
declare const process: {
  exit(code?: number): never
}

async function main() {
  console.log('🌱 Starting database seed...')

  // Clean existing data (in development only)
  await prisma.auditLog.deleteMany()
  await prisma.userInvite.deleteMany()
  await prisma.visit.deleteMany()
  await prisma.caregiverRating.deleteMany()
  await prisma.caregiverAvailability.deleteMany()
  await prisma.caregiverSkill.deleteMany()
  await prisma.caregiverCredential.deleteMany()
  await prisma.caregiverLanguage.deleteMany()
  await prisma.serviceTask.deleteMany()
  await prisma.careGoal.deleteMany()
  await prisma.planOfCare.deleteMany()
  await prisma.familyProfile.deleteMany()
  await prisma.caregiverProfile.deleteMany()
  await prisma.clientProfile.deleteMany()
  await prisma.coordinatorProfile.deleteMany()
  await prisma.user.deleteMany()

  // Create Admin User
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@caringcompass.com',
      role: UserRole.ADMIN,
      coordinatorProfile: {
        create: {
          firstName: 'System',
          lastName: 'Administrator',
          title: 'System Admin',
          department: 'IT',
        }
      }
    }
  })

  // Create Coordinator Users
  const coordinator1 = await prisma.user.create({
    data: {
      email: 'sarah.coordinator@caringcompass.com',
      role: UserRole.COORDINATOR,
      coordinatorProfile: {
        create: {
          firstName: 'Sarah',
          lastName: 'Johnson',
          title: 'Senior Care Coordinator',
          department: 'Care Management',
        }
      }
    }
  })

  const coordinator2 = await prisma.user.create({
    data: {
      email: 'mike.coordinator@caringcompass.com',
      role: UserRole.COORDINATOR,
      coordinatorProfile: {
        create: {
          firstName: 'Mike',
          lastName: 'Rodriguez',
          title: 'Care Coordinator',
          department: 'Care Management',
        }
      }
    }
  })

  // Create Sample Clients
  const clients: any[] = []
  
  const client1 = await prisma.user.create({
    data: {
      email: 'margaret.smith@email.com',
      role: UserRole.CLIENT,
      clientProfile: {
        create: {
          firstName: 'Margaret',
          lastName: 'Smith',
          dateOfBirth: new Date('1935-05-15'),
          gender: 'FEMALE',
          primaryPhone: '757-555-0101',
          status: ClientStatus.ACTIVE,
          enrollmentDate: new Date('2024-01-15'),
          address: {
            create: {
              street1: '123 Ocean View Dr',
              city: 'Virginia Beach',
              state: 'VA',
              zipCode: '23451',
              country: 'US'
            }
          },
          emergencyContact: {
            create: {
              name: 'David Smith',
              relationship: 'Son',
              primaryPhone: '757-555-0102',
              address: {
                create: {
                  street1: '456 Elm Street',
                  city: 'Norfolk',
                  state: 'VA',
                  zipCode: '23502',
                  country: 'US'
                }
              }
            }
          },
          preferences: {
            create: {
              genderPreference: 'Female',
              languagePreference: ['English'],
              petAllergies: false,
              smokingPolicy: 'No smoking',
              specialRequests: 'Prefers morning appointments'
            }
          },
          planOfCare: {
            create: {
              effectiveDate: new Date('2024-01-15'),
              expirationDate: new Date('2024-07-15'),
              totalWeeklyHours: 20,
              status: 'ACTIVE',
              approvedAt: new Date('2024-01-15'),
              goals: {
                create: [
                  {
                    title: 'Maintain Independence in Daily Activities',
                    description: 'Support client in maintaining independence in ADLs while ensuring safety',
                    priority: 'HIGH',
                    status: 'IN_PROGRESS'
                  },
                  {
                    title: 'Social Engagement',
                    description: 'Encourage participation in social activities and community events',
                    priority: 'MEDIUM',
                    status: 'IN_PROGRESS'
                  }
                ]
              },
              tasks: {
                create: [
                  {
                    name: 'Personal Care Assistance',
                    description: 'Assist with bathing, grooming, and dressing as needed',
                    category: 'PERSONAL_CARE',
                    frequency: 'DAILY',
                    estimatedDuration: 45,
                    requiredSkills: ['PERSONAL_CARE'],
                    isRequired: true
                  },
                  {
                    name: 'Meal Preparation',
                    description: 'Prepare nutritious meals according to dietary preferences',
                    category: 'NUTRITION',
                    frequency: 'DAILY',
                    estimatedDuration: 60,
                    requiredSkills: ['MEAL_PREPARATION'],
                    isRequired: true
                  },
                  {
                    name: 'Light Housekeeping',
                    description: 'Maintain clean and safe living environment',
                    category: 'HOUSEHOLD_TASKS',
                    frequency: 'WEEKLY',
                    estimatedDuration: 90,
                    requiredSkills: ['LIGHT_HOUSEKEEPING'],
                    isRequired: false
                  }
                ]
              }
            }
          }
        }
      }
    }
  })
  
  // Fetch the client with profile to get the ID
  const client1WithProfile = await prisma.user.findUnique({
    where: { id: client1.id },
    include: { clientProfile: true }
  })
  clients.push(client1WithProfile)

  const client2 = await prisma.user.create({
    data: {
      email: 'robert.jones@email.com',
      role: UserRole.CLIENT,
      clientProfile: {
        create: {
          firstName: 'Robert',
          lastName: 'Jones',
          dateOfBirth: new Date('1942-11-20'),
          gender: 'MALE',
          primaryPhone: '757-555-0201',
          status: ClientStatus.ACTIVE,
          enrollmentDate: new Date('2024-02-01'),
          address: {
            create: {
              street1: '789 Chesapeake Bay Rd',
              city: 'Chesapeake',
              state: 'VA',
              zipCode: '23320',
              country: 'US'
            }
          },
          emergencyContact: {
            create: {
              name: 'Lisa Jones',
              relationship: 'Daughter',
              primaryPhone: '757-555-0202'
            }
          },
          preferences: {
            create: {
              languagePreference: ['English'],
              petAllergies: true,
              specialRequests: 'Prefers male caregivers for personal care'
            }
          },
          planOfCare: {
            create: {
              effectiveDate: new Date('2024-02-01'),
              totalWeeklyHours: 30,
              status: 'ACTIVE',
              approvedAt: new Date('2024-02-01'),
              goals: {
                create: [
                  {
                    title: 'Mobility and Safety',
                    description: 'Improve mobility and prevent falls',
                    priority: 'HIGH',
                    status: 'IN_PROGRESS'
                  }
                ]
              },
              tasks: {
                create: [
                  {
                    name: 'Medication Reminders',
                    description: 'Remind client to take prescribed medications',
                    category: 'MEDICATION_MANAGEMENT',
                    frequency: 'DAILY',
                    estimatedDuration: 15,
                    requiredSkills: ['MEDICATION_REMINDERS'],
                    isRequired: true
                  },
                  {
                    name: 'Mobility Assistance',
                    description: 'Assist with walking and transfers',
                    category: 'EXERCISE_MOBILITY',
                    frequency: 'DAILY',
                    estimatedDuration: 30,
                    requiredSkills: ['MOBILITY_ASSISTANCE', 'TRANSFER_ASSISTANCE'],
                    isRequired: true
                  }
                ]
              }
            }
          }
        }
      }
    }
  })
  
  // Fetch the client with profile to get the ID
  const client2WithProfile = await prisma.user.findUnique({
    where: { id: client2.id },
    include: { clientProfile: true }
  })
  clients.push(client2WithProfile)

  // Create Family Members
  const familyMember1 = await prisma.user.create({
    data: {
      email: 'david.smith@email.com',
      role: UserRole.FAMILY,
      familyProfile: {
        create: {
          clientId: client1WithProfile!.clientProfile!.id,
          firstName: 'David',
          lastName: 'Smith',
          relationship: 'Son',
          primaryPhone: '757-555-0102',
          email: 'david.smith@email.com',
          canViewSchedule: true,
          canViewBilling: true,
          canReceiveUpdates: true,
          preferredContact: 'EMAIL'
        }
      }
    }
  })

  // Create Sample Caregivers
  const caregivers: any[] = []

  const caregiver1 = await prisma.user.create({
    data: {
      email: 'maria.garcia@caringcompass.com',
      role: UserRole.CAREGIVER,
      caregiverProfile: {
        create: {
          firstName: 'Maria',
          lastName: 'Garcia',
          dateOfBirth: new Date('1985-03-10'),
          gender: 'FEMALE',
          primaryPhone: '757-555-0301',
          employeeId: 'CG001',
          hireDate: new Date('2023-11-01'),
          status: CaregiverStatus.ACTIVE,
          employmentType: 'PART_TIME',
          address: {
            create: {
              street1: '321 Hampton Blvd',
              city: 'Norfolk',
              state: 'VA',
              zipCode: '23505',
              country: 'US'
            }
          },
          preferences: {
            create: {
              maxTravelDistance: 20,
              availableForEmergency: true,
              transportationAvailable: true
            }
          },
          credentials: {
            create: [
              {
                type: 'CNA',
                credentialNumber: 'CNA123456',
                issuingOrganization: 'Virginia Board of Nursing',
                issueDate: new Date('2023-01-15'),
                expirationDate: new Date('2025-01-15'),
                status: 'VERIFIED'
              },
              {
                type: 'CPR',
                issuingOrganization: 'American Heart Association',
                issueDate: new Date('2023-10-01'),
                expirationDate: new Date('2025-10-01'),
                status: 'VERIFIED'
              },
              {
                type: 'BACKGROUND_CHECK',
                issuingOrganization: 'Caring Compass HR',
                issueDate: new Date('2023-10-15'),
                status: 'VERIFIED'
              }
            ]
          },
          skills: {
            create: [
              { skill: 'PERSONAL_CARE', level: 'ADVANCED' },
              { skill: 'MEDICATION_REMINDERS', level: 'INTERMEDIATE' },
              { skill: 'MEAL_PREPARATION', level: 'ADVANCED' },
              { skill: 'LIGHT_HOUSEKEEPING', level: 'INTERMEDIATE' },
              { skill: 'COMPANIONSHIP', level: 'EXPERT' },
              { skill: 'MOBILITY_ASSISTANCE', level: 'ADVANCED' }
            ]
          },
          languages: {
            create: [
              { language: 'English', proficiency: 'FLUENT' },
              { language: 'Spanish', proficiency: 'NATIVE' }
            ]
          },
          availability: {
            create: [
              { dayOfWeek: 'MONDAY', startTime: '08:00', endTime: '16:00' },
              { dayOfWeek: 'TUESDAY', startTime: '08:00', endTime: '16:00' },
              { dayOfWeek: 'WEDNESDAY', startTime: '08:00', endTime: '16:00' },
              { dayOfWeek: 'THURSDAY', startTime: '08:00', endTime: '16:00' },
              { dayOfWeek: 'FRIDAY', startTime: '08:00', endTime: '16:00' }
            ]
          }
        }
      }
    }
  })
  
  // Fetch the caregiver with profile to get the ID
  const caregiver1WithProfile = await prisma.user.findUnique({
    where: { id: caregiver1.id },
    include: { caregiverProfile: true }
  })
  caregivers.push(caregiver1WithProfile)

  const caregiver2 = await prisma.user.create({
    data: {
      email: 'james.wilson@caringcompass.com',
      role: UserRole.CAREGIVER,
      caregiverProfile: {
        create: {
          firstName: 'James',
          lastName: 'Wilson',
          dateOfBirth: new Date('1978-08-25'),
          gender: 'MALE',
          primaryPhone: '757-555-0401',
          employeeId: 'CG002',
          hireDate: new Date('2023-12-15'),
          status: CaregiverStatus.ACTIVE,
          employmentType: 'FULL_TIME',
          address: {
            create: {
              street1: '654 Military Hwy',
              city: 'Chesapeake',
              state: 'VA',
              zipCode: '23322',
              country: 'US'
            }
          },
          preferences: {
            create: {
              maxTravelDistance: 30,
              availableForEmergency: true,
              transportationAvailable: true
            }
          },
          credentials: {
            create: [
              {
                type: 'PCA',
                credentialNumber: 'PCA789012',
                issuingOrganization: 'Virginia Department of Health',
                issueDate: new Date('2023-06-01'),
                expirationDate: new Date('2025-06-01'),
                status: 'VERIFIED'
              },
              {
                type: 'CPR',
                issuingOrganization: 'American Red Cross',
                issueDate: new Date('2023-11-15'),
                expirationDate: new Date('2025-11-15'),
                status: 'VERIFIED'
              }
            ]
          },
          skills: {
            create: [
              { skill: 'PERSONAL_CARE', level: 'INTERMEDIATE' },
              { skill: 'MEDICATION_REMINDERS', level: 'ADVANCED' },
              { skill: 'TRANSPORTATION', level: 'EXPERT' },
              { skill: 'COMPANIONSHIP', level: 'ADVANCED' },
              { skill: 'MOBILITY_ASSISTANCE', level: 'EXPERT' },
              { skill: 'TRANSFER_ASSISTANCE', level: 'EXPERT' }
            ]
          },
          languages: {
            create: [
              { language: 'English', proficiency: 'NATIVE' }
            ]
          },
          availability: {
            create: [
              { dayOfWeek: 'MONDAY', startTime: '06:00', endTime: '18:00' },
              { dayOfWeek: 'TUESDAY', startTime: '06:00', endTime: '18:00' },
              { dayOfWeek: 'WEDNESDAY', startTime: '06:00', endTime: '18:00' },
              { dayOfWeek: 'THURSDAY', startTime: '06:00', endTime: '18:00' },
              { dayOfWeek: 'FRIDAY', startTime: '06:00', endTime: '18:00' },
              { dayOfWeek: 'SATURDAY', startTime: '08:00', endTime: '16:00' }
            ]
          }
        }
      }
    }
  })
  
  // Fetch the caregiver with profile to get the ID
  const caregiver2WithProfile = await prisma.user.findUnique({
    where: { id: caregiver2.id },
    include: { caregiverProfile: true }
  })
  caregivers.push(caregiver2WithProfile)

  // Create Sample Visits
  const visit1 = await prisma.visit.create({
    data: {
      clientId: client1WithProfile!.clientProfile!.id,
      caregiverId: caregiver1WithProfile!.caregiverProfile!.id,
      scheduledStart: new Date('2024-01-20T09:00:00Z'),
      scheduledEnd: new Date('2024-01-20T13:00:00Z'),
      actualStart: new Date('2024-01-20T09:05:00Z'),
      actualEnd: new Date('2024-01-20T13:00:00Z'),
      status: VisitStatus.COMPLETED,
      visitType: 'REGULAR_CARE',
      billableHours: 4.0,
      notes: 'Client was in good spirits. Completed all scheduled tasks without issues.',
      tasks: {
        create: [
          {
            taskName: 'Personal Care Assistance',
            category: 'PERSONAL_CARE',
            isCompleted: true,
            completedAt: new Date('2024-01-20T09:45:00Z'),
            notes: 'Assisted with shower and dressing'
          },
          {
            taskName: 'Meal Preparation',
            category: 'NUTRITION',
            isCompleted: true,
            completedAt: new Date('2024-01-20T11:30:00Z'),
            notes: 'Prepared lunch according to dietary preferences'
          }
        ]
      },
      evvEvents: {
        create: [
          {
            eventType: 'CLOCK_IN',
            timestamp: new Date('2024-01-20T09:05:00Z'),
            latitude: 36.8508,
            longitude: -75.9776
          },
          {
            eventType: 'CLOCK_OUT',
            timestamp: new Date('2024-01-20T13:00:00Z'),
            latitude: 36.8508,
            longitude: -75.9776
          }
        ]
      }
    }
  })

  const visit2 = await prisma.visit.create({
    data: {
      clientId: client2WithProfile!.clientProfile!.id,
      caregiverId: caregiver2WithProfile!.caregiverProfile!.id,
      scheduledStart: new Date('2024-01-21T10:00:00Z'),
      scheduledEnd: new Date('2024-01-21T16:00:00Z'),
      status: VisitStatus.SCHEDULED,
      visitType: 'REGULAR_CARE',
      tasks: {
        create: [
          {
            taskName: 'Medication Reminders',
            category: 'MEDICATION_MANAGEMENT',
            isCompleted: false
          },
          {
            taskName: 'Mobility Assistance',
            category: 'EXERCISE_MOBILITY',
            isCompleted: false
          }
        ]
      }
    }
  })

  // Create Sample Audit Logs
  await prisma.auditLog.create({
    data: {
      userId: adminUser.id,
      action: 'CREATE',
      resourceType: 'ClientProfile',
      resourceId: client1WithProfile!.clientProfile!.id,
      newValues: { firstName: 'Margaret', lastName: 'Smith' },
      ipAddress: '192.168.1.100'
    }
  })

  await prisma.auditLog.create({
    data: {
      userId: coordinator1.id,
      action: 'UPDATE',
      resourceType: 'Visit',
      resourceId: visit1.id,
      oldValues: { status: 'SCHEDULED' },
      newValues: { status: 'COMPLETED' },
      ipAddress: '192.168.1.101'
    }
  })

  // Create Sample User Invites
  await prisma.userInvite.createMany({
    data: [
      {
        email: 'newcaregiver@example.com',
        role: 'CAREGIVER',
        invitedBy: coordinator1.id,
        inviteCode: 'INV-CG-001',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
      {
        email: 'newclient@example.com',
        role: 'CLIENT',
        invitedBy: adminUser.id,
        inviteCode: 'INV-CL-001',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
      {
        email: 'familymember@example.com',
        role: 'FAMILY',
        invitedBy: coordinator1.id,
        inviteCode: 'INV-FM-001',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        acceptedAt: new Date(), // This one has been accepted
      },
    ],
  });

  console.log('✅ Database seeded successfully!')
  console.log(`Created:`)
  console.log(`- ${caregivers.length + 2} Users (Admin, Coordinators, Caregivers)`)
  console.log(`- ${clients.length} Clients`)
  console.log(`- 1 Family Member`)
  console.log(`- 2 Care Plans with Goals and Tasks`)
  console.log(`- 2 Visits (1 completed, 1 scheduled)`)
  console.log(`- Multiple Credentials, Skills, and Availability records`)
  console.log(`- 3 User Invites (1 accepted, 2 pending)`)
  console.log(`- Sample Audit Logs`)
}

main()
  .catch((e) => {
    console.error(e)
    if (typeof process !== 'undefined') {
      process.exit(1)
    }
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
