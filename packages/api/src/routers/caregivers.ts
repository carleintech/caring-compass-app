import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { UserRole } from '@caring-compass/database'
import { 
  createTRPCRouter, 
  protectedProcedure, 
  staffProcedure,
  caregiverProcedure,
  createCRUDProcedures,
  handleDatabaseError,
  createPaginationQuery,
  createPaginatedResponse,
  checkResourceAccess
} from '../trpc/trpc'
import { caregiverSchemas } from '../schemas'

export const caregiversRouter = createTRPCRouter({
  // ===== CAREGIVER PROFILE MANAGEMENT =====

  /**
   * Create a new caregiver
   */
  create: staffProcedure
    .input(caregiverSchemas.caregiverCreate)
    .output(caregiverSchemas.caregiverProfile)
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await ctx.prisma.$transaction(async (tx) => {
          // Create user account first
          const user = await tx.user.create({
            data: {
              email: input.email,
              role: UserRole.CAREGIVER,
              isActive: true
            }
          })

          // Create caregiver profile
          const caregiverProfile = await tx.caregiverProfile.create({
            data: {
              userId: user.id,
              firstName: input.firstName,
              lastName: input.lastName,
              dateOfBirth: input.dateOfBirth,
              gender: input.gender,
              primaryPhone: input.primaryPhone,
              secondaryPhone: input.secondaryPhone,
              address: input.address,
              employeeId: input.employeeId,
              hireDate: input.hireDate,
              status: input.status,
              employmentType: input.employmentType,
              preferences: input.preferences
            }
          })

          return caregiverProfile
        })

        // Register user with Supabase Auth
        await ctx.authService.signUp({
          email: input.email,
          password: input.password,
          firstName: input.firstName,
          lastName: input.lastName,
          role: UserRole.CAREGIVER
        })

        return result
      } catch (error) {
        handleDatabaseError(error)
      }
    }),

  /**
   * Get caregiver by ID
   */
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .output(caregiverSchemas.caregiverWithRelations)
    .query(async ({ ctx, input }) => {
      try {
        const caregiver = await ctx.prisma.caregiverProfile.findUnique({
          where: { id: input.id },
          include: {
            user: { select: { email: true, role: true, isActive: true } },
            credentials: true,
            skills: true,
            languages: true,
            availability: true,
            visits: {
              where: { status: 'COMPLETED' },
              select: { id: true, scheduledStart: true }
            },
            ratings: {
              select: { overallRating: true }
            }
          }
        })

        if (!caregiver) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Caregiver not found'
          })
        }

        // Check access permissions
        const hasAccess = checkResourceAccess(
          ctx.user,
          caregiver.userId,
          [UserRole.ADMIN, UserRole.COORDINATOR]
        )

        if (!hasAccess) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Access denied'
          })
        }

        // Calculate statistics
        const totalVisits = caregiver.visits.length
        const activeVisits = await ctx.prisma.visit.count({
          where: {
            caregiverId: input.id,
            status: { in: ['SCHEDULED', 'IN_PROGRESS'] }
          }
        })

        const averageRating = caregiver.ratings.length > 0
          ? caregiver.ratings.reduce((sum, rating) => sum + rating.overallRating, 0) / caregiver.ratings.length
          : null

        const lastVisitDate = caregiver.visits[0]?.scheduledStart || null

        return {
          ...caregiver,
          email: caregiver.user.email,
          activeVisits,
          totalVisits,
          averageRating,
          lastVisitDate
        }
      } catch (error) {
        if (error instanceof TRPCError) throw error
        handleDatabaseError(error)
      }
    }),

  /**
   * Update caregiver profile
   */
  update: protectedProcedure
    .input(z.object({
      id: z.string().uuid(),
      data: caregiverSchemas.caregiverUpdate
    }))
    .output(caregiverSchemas.caregiverProfile)
    .mutation(async ({ ctx, input }) => {
      try {
        const existingCaregiver = await ctx.prisma.caregiverProfile.findUnique({
          where: { id: input.id }
        })

        if (!existingCaregiver) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Caregiver not found'
          })
        }

        const hasAccess = checkResourceAccess(
          ctx.user,
          existingCaregiver.userId,
          [UserRole.ADMIN, UserRole.COORDINATOR]
        )

        if (!hasAccess) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Access denied'
          })
        }

        const updatedCaregiver = await ctx.prisma.caregiverProfile.update({
          where: { id: input.id },
          data: input.data,
          include: {
            user: { select: { email: true } }
          }
        })

        return {
          ...updatedCaregiver,
          email: updatedCaregiver.user.email
        }
      } catch (error) {
        if (error instanceof TRPCError) throw error
        handleDatabaseError(error)
      }
    }),

  /**
   * Search caregivers
   */
  search: protectedProcedure
    .input(caregiverSchemas.caregiverSearch)
    .query(async ({ ctx, input }) => {
      try {
        const { 
          page, limit, query, status, employmentType, skills, 
          languages, availableOn, hireDateRange, location 
        } = input
        const { skip, take } = createPaginationQuery(page, limit)

        let where: any = {}

        // Role-based filtering
        if (ctx.user.role === UserRole.CAREGIVER) {
          where.userId = ctx.user.id
        }

        // Apply search filters
        if (query) {
          where.OR = [
            { firstName: { contains: query, mode: 'insensitive' as const } },
            { lastName: { contains: query, mode: 'insensitive' as const } },
            { employeeId: { contains: query } },
            { primaryPhone: { contains: query } },
            { user: { email: { contains: query, mode: 'insensitive' as const } } }
          ]
        }

        if (status) where.status = status
        if (employmentType) where.employmentType = employmentType
        if (hireDateRange) {
          where.hireDate = {
            gte: hireDateRange.from,
            lte: hireDateRange.to
          }
        }

        if (skills && skills.length > 0) {
          where.skills = {
            some: {
              skill: { in: skills }
            }
          }
        }

        if (languages && languages.length > 0) {
          where.languages = {
            some: {
              language: { in: languages }
            }
          }
        }

        if (availableOn) {
          where.availability = {
            some: {
              dayOfWeek: availableOn
            }
          }
        }

        if (location) {
          const locationWhere: any = {}
          if (location.city) locationWhere['address.city'] = location.city
          if (location.state) locationWhere['address.state'] = location.state
          if (location.zipCode) locationWhere['address.zipCode'] = location.zipCode
          where = { ...where, ...locationWhere }
        }

        const [caregivers, totalCount] = await Promise.all([
          ctx.prisma.caregiverProfile.findMany({
            where,
            skip,
            take,
            include: {
              user: { select: { email: true, isActive: true } },
              skills: { select: { skill: true, level: true } },
              languages: { select: { language: true, proficiency: true } },
              credentials: {
                where: { status: 'VERIFIED' },
                select: { type: true, expirationDate: true }
              },
              _count: {
                select: {
                  visits: { where: { status: 'COMPLETED' } }
                }
              }
            },
            orderBy: { createdAt: 'desc' }
          }),
          ctx.prisma.caregiverProfile.count({ where })
        ])

        const caregiversWithCounts = caregivers.map(caregiver => ({
          ...caregiver,
          email: caregiver.user.email,
          totalVisits: caregiver._count.visits
        }))

        return createPaginatedResponse(caregiversWithCounts, totalCount, page, limit)
      } catch (error) {
        handleDatabaseError(error)
      }
    }),

  // ===== CREDENTIAL MANAGEMENT =====

  /**
   * Add credential
   */
  addCredential: staffProcedure
    .input(caregiverSchemas.credentialCreate)
    .output(caregiverSchemas.credential)
    .mutation(async ({ ctx, input }) => {
      try {
        const credential = await ctx.prisma.caregiverCredential.create({
          data: input
        })

        return credential
      } catch (error) {
        handleDatabaseError(error)
      }
    }),

  /**
   * Update credential
   */
  updateCredential: staffProcedure
    .input(z.object({
      id: z.string().uuid(),
      data: caregiverSchemas.credentialUpdate
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const updatedCredential = await ctx.prisma.caregiverCredential.update({
          where: { id: input.id },
          data: input.data
        })

        return updatedCredential
      } catch (error) {
        handleDatabaseError(error)
      }
    }),

  /**
   * Verify credential
   */
  verifyCredential: staffProcedure
    .input(caregiverSchemas.credentialVerify)
    .mutation(async ({ ctx, input }) => {
      try {
        const verifiedCredential = await ctx.prisma.caregiverCredential.update({
          where: { id: input.credentialId },
          data: {
            status: input.status,
            // Store verification details in a separate verification log if needed
          }
        })

        return verifiedCredential
      } catch (error) {
        handleDatabaseError(error)
      }
    }),

  /**
   * Get expiring credentials
   */
  getExpiringCredentials: staffProcedure
    .input(z.object({
      daysAhead: z.number().int().min(1).max(365).default(30)
    }))
    .query(async ({ ctx, input }) => {
      try {
        const expirationDate = new Date()
        expirationDate.setDate(expirationDate.getDate() + input.daysAhead)

        const expiringCredentials = await ctx.prisma.caregiverCredential.findMany({
          where: {
            status: 'VERIFIED',
            expirationDate: {
              lte: expirationDate,
              gte: new Date()
            }
          },
          include: {
            caregiver: {
              select: {
                firstName: true,
                lastName: true,
                primaryPhone: true,
                user: { select: { email: true } }
              }
            }
          },
          orderBy: { expirationDate: 'asc' }
        })

        return expiringCredentials
      } catch (error) {
        handleDatabaseError(error)
      }
    }),

  // ===== SKILLS MANAGEMENT =====

  /**
   * Update caregiver skills (bulk)
   */
  updateSkills: protectedProcedure
    .input(caregiverSchemas.skillBulkUpdate)
    .mutation(async ({ ctx, input }) => {
      try {
        const existingCaregiver = await ctx.prisma.caregiverProfile.findUnique({
          where: { id: input.caregiverId }
        })

        if (!existingCaregiver) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Caregiver not found'
          })
        }

        const hasAccess = checkResourceAccess(
          ctx.user,
          existingCaregiver.userId,
          [UserRole.ADMIN, UserRole.COORDINATOR]
        )

        if (!hasAccess) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Access denied'
          })
        }

        // Replace all skills
        await ctx.prisma.$transaction(async (tx) => {
          // Delete existing skills
          await tx.caregiverSkill.deleteMany({
            where: { caregiverId: input.caregiverId }
          })

          // Create new skills
          await tx.caregiverSkill.createMany({
            data: input.skills.map(skill => ({
              caregiverId: input.caregiverId,
              ...skill
            }))
          })
        })

        return { success: true }
      } catch (error) {
        if (error instanceof TRPCError) throw error
        handleDatabaseError(error)
      }
    }),

  // ===== AVAILABILITY MANAGEMENT =====

  /**
   * Update caregiver availability (bulk)
   */
  updateAvailability: protectedProcedure
    .input(caregiverSchemas.availabilityBulkUpdate)
    .mutation(async ({ ctx, input }) => {
      try {
        const existingCaregiver = await ctx.prisma.caregiverProfile.findUnique({
          where: { id: input.caregiverId }
        })

        if (!existingCaregiver) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Caregiver not found'
          })
        }

        const hasAccess = checkResourceAccess(
          ctx.user,
          existingCaregiver.userId,
          [UserRole.ADMIN, UserRole.COORDINATOR]
        )

        if (!hasAccess) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Access denied'
          })
        }

        // Replace all availability
        await ctx.prisma.$transaction(async (tx) => {
          // Delete existing availability
          await tx.caregiverAvailability.deleteMany({
            where: { caregiverId: input.caregiverId }
          })

          // Create new availability
          await tx.caregiverAvailability.createMany({
            data: input.availability.map(avail => ({
              caregiverId: input.caregiverId,
              ...avail
            }))
          })
        })

        return { success: true }
      } catch (error) {
        if (error instanceof TRPCError) throw error
        handleDatabaseError(error)
      }
    }),

  /**
   * Add blackout dates
   */
  addBlackoutDate: protectedProcedure
    .input(caregiverSchemas.blackoutDate)
    .mutation(async ({ ctx, input }) => {
      try {
        const existingCaregiver = await ctx.prisma.caregiverProfile.findUnique({
          where: { id: input.caregiverId }
        })

        if (!existingCaregiver) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Caregiver not found'
          })
        }

        const hasAccess = checkResourceAccess(
          ctx.user,
          existingCaregiver.userId,
          [UserRole.ADMIN, UserRole.COORDINATOR]
        )

        if (!hasAccess) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Access denied'
          })
        }

        // For now, we'll store blackout dates as special availability records
        // In a full implementation, you might want a separate blackout_dates table
        const blackoutRecord = await ctx.prisma.caregiverAvailability.create({
          data: {
            caregiverId: input.caregiverId,
            dayOfWeek: 'MONDAY', // Placeholder - blackouts span multiple days
            startTime: input.startTime || '00:00',
            endTime: input.endTime || '23:59',
            isRecurring: false,
            effectiveDate: input.startDate,
            endDate: input.endDate
            // Additional fields would be stored in a JSON column or separate table
          }
        })

        return blackoutRecord
      } catch (error) {
        if (error instanceof TRPCError) throw error
        handleDatabaseError(error)
      }
    }),

  // ===== CAREGIVER MATCHING =====

  /**
   * Find matching caregivers for a client
   */
  findMatches: staffProcedure
    .input(caregiverSchemas.caregiverMatchRequest)
    .output(z.array(caregiverSchemas.caregiverMatchResult))
    .query(async ({ ctx, input }) => {
      try {
        // Get client information
        const client = await ctx.prisma.clientProfile.findUnique({
          where: { id: input.clientId },
          include: {
            planOfCare: { include: { tasks: true } },
            preferences: true
          }
        })

        if (!client) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Client not found'
          })
        }

        // Build caregiver search criteria
        const where: any = {
          status: 'ACTIVE',
          user: { isActive: true }
        }

        // Filter by required skills
        if (input.requiredSkills && input.requiredSkills.length > 0) {
          where.skills = {
            some: {
              skill: { in: input.requiredSkills }
            }
          }
        }

        // Filter by languages
        if (input.preferredLanguages && input.preferredLanguages.length > 0) {
          where.languages = {
            some: {
              language: { in: input.preferredLanguages }
            }
          }
        }

        // Get potential caregivers
        const caregivers = await ctx.prisma.caregiverProfile.findMany({
          where,
          include: {
            skills: true,
            languages: true,
            availability: true,
            visits: {
              where: { clientId: input.clientId },
              select: { id: true }
            }
          }
        })

        // Calculate match scores
        const matches = caregivers.map(caregiver => {
          let score = 0
          const factors = {
            skillsMatch: 0,
            languageMatch: 0,
            genderMatch: 0,
            distanceScore: 0,
            availabilityMatch: 0,
            continuityBonus: 0,
            experienceBonus: 0
          }

          // Skills matching (max 25 points)
          if (input.requiredSkills) {
            const caregiverSkills = caregiver.skills.map(s => s.skill)
            const matchedSkills = input.requiredSkills.filter(skill => 
              caregiverSkills.includes(skill)
            )
            factors.skillsMatch = (matchedSkills.length / input.requiredSkills.length) * 25
          }

          // Language matching (max 15 points)
          if (input.preferredLanguages) {
            const caregiverLanguages = caregiver.languages.map(l => l.language)
            const hasLanguageMatch = input.preferredLanguages.some(lang => 
              caregiverLanguages.includes(lang)
            )
            factors.languageMatch = hasLanguageMatch ? 15 : 0
          }

          // Gender preference (max 10 points)
          if (input.genderPreference && caregiver.gender === input.genderPreference) {
            factors.genderMatch = 10
          }

          // Distance calculation would go here (max 10 points)
          // For now, we'll assign a default score
          factors.distanceScore = 8

          // Availability matching (max 20 points)
          if (input.availabilityNeeded) {
            const availabilityScore = calculateAvailabilityMatch(
              caregiver.availability,
              input.availabilityNeeded
            )
            factors.availabilityMatch = availabilityScore
          } else {
            factors.availabilityMatch = 20 // Default if no specific availability needed
          }

          // Continuity of care bonus (max 10 points)
          if (caregiver.visits.length > 0) {
            factors.continuityBonus = 10
          }

          // Experience bonus (max 10 points)
          // This would be calculated based on total visits, ratings, etc.
          factors.experienceBonus = Math.min(caregiver.visits.length * 2, 10)

          score = Object.values(factors).reduce((sum, value) => sum + value, 0)

          return {
            caregiverId: caregiver.id,
            caregiver: {
              firstName: caregiver.firstName,
              lastName: caregiver.lastName,
              photo: null // Would be implemented with actual photo storage
            },
            matchScore: Math.round(score),
            matchFactors: factors,
            distance: null, // Would be calculated with actual addresses
            availability: caregiver.availability.map(a => a.dayOfWeek),
            languages: caregiver.languages.map(l => l.language),
            skills: caregiver.skills.map(s => s.skill),
            reasonsToChoose: generateReasons(caregiver, factors),
            potentialConcerns: generateConcerns(caregiver, factors)
          }
        })

        // Sort by match score and return top matches
        return matches
          .sort((a, b) => b.matchScore - a.matchScore)
          .slice(0, 10) // Return top 10 matches
      } catch (error) {
        if (error instanceof TRPCError) throw error
        handleDatabaseError(error)
      }
    }),

  // ===== CAREGIVER STATISTICS =====

  /**
   * Get caregiver statistics
   */
  getStats: staffProcedure
    .query(async ({ ctx }) => {
      try {
        const [
          totalCaregivers,
          activeCaregivers,
          newCaregiversThisMonth,
          caregiversByStatus
        ] = await Promise.all([
          ctx.prisma.caregiverProfile.count(),
          ctx.prisma.caregiverProfile.count({
            where: { status: 'ACTIVE' }
          }),
          ctx.prisma.caregiverProfile.count({
            where: {
              hireDate: {
                gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
              }
            }
          }),
          ctx.prisma.caregiverProfile.groupBy({
            by: ['status'],
            _count: true
          })
        ])

        return {
          totalCaregivers,
          activeCaregivers,
          newCaregiversThisMonth,
          statusDistribution: caregiversByStatus.reduce((acc, item) => {
            acc[item.status] = item._count
            return acc
          }, {} as Record<string, number>)
        }
      } catch (error) {
        handleDatabaseError(error)
      }
    })
})

// Helper functions
function calculateAvailabilityMatch(
  caregiverAvailability: any[],
  neededAvailability: any[]
): number {
  // Simplified availability matching logic
  // In a real implementation, this would be more sophisticated
  let matchedSlots = 0
  
  for (const needed of neededAvailability) {
    const hasMatch = caregiverAvailability.some(avail => 
      avail.dayOfWeek === needed.dayOfWeek &&
      avail.startTime <= needed.startTime &&
      avail.endTime >= needed.endTime
    )
    if (hasMatch) matchedSlots++
  }
  
  return neededAvailability.length > 0 
    ? (matchedSlots / neededAvailability.length) * 20 
    : 20
}

function generateReasons(caregiver: any, factors: any): string[] {
  const reasons = []
  
  if (factors.skillsMatch > 20) reasons.push('Strong skills match')
  if (factors.languageMatch > 0) reasons.push('Language compatibility')
  if (factors.continuityBonus > 0) reasons.push('Previous experience with client')
  if (factors.experienceBonus > 8) reasons.push('Experienced caregiver')
  if (factors.availabilityMatch > 15) reasons.push('Good availability match')
  
  return reasons
}

function generateConcerns(caregiver: any, factors: any): string[] {
  const concerns = []
  
  if (factors.skillsMatch < 15) concerns.push('Limited skills match')
  if (factors.distanceScore < 5) concerns.push('Long travel distance')
  if (factors.availabilityMatch < 10) concerns.push('Limited availability')
  
  return concerns
}