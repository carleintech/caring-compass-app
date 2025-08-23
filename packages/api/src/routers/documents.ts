import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { UserRole } from '@caring-compass/database'
import { 
  createTRPCRouter, 
  protectedProcedure, 
  staffProcedure,
  createCRUDProcedures,
  handleDatabaseError,
  createPaginationQuery,
  createPaginatedResponse,
  checkResourceAccess
} from '../trpc/trpc'
import { documentSchemas } from '../schemas'

export const documentsRouter = createTRPCRouter({
  // ===== DOCUMENT MANAGEMENT =====

  /**
   * Upload a new document
   */
  upload: protectedProcedure
    .input(documentSchemas.documentUpload)
    .output(documentSchemas.documentWithDetails)
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if user has permission to upload documents for the specified client/caregiver
        if (input.clientId) {
          const hasAccess = await canUserAccessClient(ctx, ctx.user.id, input.clientId)
          if (!hasAccess) {
            throw new TRPCError({
              code: 'FORBIDDEN',
              message: 'Access denied to client documents'
            })
          }
        }

        if (input.caregiverId) {
          const hasAccess = await canUserAccessCaregiver(ctx, ctx.user.id, input.caregiverId)
          if (!hasAccess) {
            throw new TRPCError({
              code: 'FORBIDDEN',
              message: 'Access denied to caregiver documents'
            })
          }
        }

        const document = await ctx.prisma.document.create({
          data: {
            uploadedById: ctx.user.id,
            clientId: input.clientId,
            fileName: input.fileName,
            originalName: input.originalName,
            fileSize: input.fileSize,
            mimeType: input.mimeType,
            fileUrl: input.fileUrl,
            documentType: input.documentType,
            tags: input.tags,
            description: input.description,
            status: 'ACTIVE',
            isEncrypted: input.isEncrypted,
            accessLevel: input.accessLevel
          }
        })

        // Create initial version
        await ctx.prisma.documentVersion.create({
          data: {
            documentId: document.id,
            versionNumber: '1.0',
            fileName: input.fileName,
            fileSize: input.fileSize,
            mimeType: input.mimeType,
            fileUrl: input.fileUrl,
            isLatest: true
          }
        })

        return await getDocumentWithDetails(ctx, document.id)
      } catch (error) {
        if (error instanceof TRPCError) throw error
        handleDatabaseError(error)
      }
    }),

  /**
   * Get document by ID
   */
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .output(documentSchemas.documentWithDetails)
    .query(async ({ ctx, input }) => {
      try {
        const document = await getDocumentWithDetails(ctx, input.id)

        if (!document) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Document not found'
          })
        }

        // Check access permissions
        const hasAccess = await canUserAccessDocument(ctx, ctx.user.id, document)
        if (!hasAccess) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Access denied'
          })
        }

        // Log document access for audit
        await logDocumentAccess(ctx, document.id, ctx.user.id, 'VIEW')

        return document
      } catch (error) {
        if (error instanceof TRPCError) throw error
        handleDatabaseError(error)
      }
    }),

  /**
   * Update document metadata
   */
  update: protectedProcedure
    .input(z.object({
      id: z.string().uuid(),
      data: documentSchemas.documentUpdate
    }))
    .output(documentSchemas.document)
    .mutation(async ({ ctx, input }) => {
      try {
        const existingDocument = await ctx.prisma.document.findUnique({
          where: { id: input.id }
        })

        if (!existingDocument) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Document not found'
          })
        }

        // Check permissions
        const canEdit = 
          existingDocument.uploadedById === ctx.user.id ||
          [UserRole.ADMIN, UserRole.COORDINATOR].includes(ctx.user.role) ||
          await hasDocumentEditPermission(ctx, ctx.user.id, existingDocument)

        if (!canEdit) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have permission to edit this document'
          })
        }

        const updatedDocument = await ctx.prisma.document.update({
          where: { id: input.id },
          data: input.data
        })

        await logDocumentAccess(ctx, input.id, ctx.user.id, 'UPDATE')

        return updatedDocument
      } catch (error) {
        if (error instanceof TRPCError) throw error
        handleDatabaseError(error)
      }
    }),

  /**
   * Search documents
   */
  search: protectedProcedure
    .input(documentSchemas.documentSearch)
    .query(async ({ ctx, input }) => {
      try {
        const { 
          page, limit, query, documentType, tags, clientId, caregiverId, 
          uploadedBy, accessLevel, status, uploadDateRange, fileSizeRange, mimeTypes 
        } = input
        const { skip, take } = createPaginationQuery(page, limit)

        let where: any = { status: 'ACTIVE' }

        // Role-based filtering
        if (ctx.user.role === UserRole.CLIENT) {
          const userClientId = await getClientIdForUser(ctx, ctx.user.id)
          where.OR = [
            { clientId: userClientId },
            { uploadedById: ctx.user.id }
          ]
        } else if (ctx.user.role === UserRole.CAREGIVER) {
          const userCaregiverId = await getCaregiverIdForUser(ctx, ctx.user.id)
          where.OR = [
            { caregiverId: userCaregiverId },
            { uploadedById: ctx.user.id },
            { accessLevel: 'PUBLIC' }
          ]
        } else if (ctx.user.role === UserRole.FAMILY) {
          const familyClientId = await getFamilyMemberClientId(ctx, ctx.user.id)
          where.OR = [
            { clientId: familyClientId },
            { uploadedById: ctx.user.id }
          ]
        }

        // Apply search filters
        if (query) {
          where.OR = [
            ...(where.OR || []),
            { fileName: { contains: query, mode: 'insensitive' as const } },
            { description: { contains: query, mode: 'insensitive' as const } },
            { tags: { has: query } }
          ]
        }

        if (documentType) where.documentType = documentType
        if (tags && tags.length > 0) {
          where.tags = { hasSome: tags }
        }
        if (clientId) where.clientId = clientId
        if (caregiverId) where.caregiverId = caregiverId
        if (uploadedBy) where.uploadedById = uploadedBy
        if (accessLevel) where.accessLevel = accessLevel
        if (status) where.status = status
        if (uploadDateRange) {
          where.createdAt = {
            gte: uploadDateRange.from,
            lte: uploadDateRange.to
          }
        }
        if (fileSizeRange) {
          where.fileSize = {
            gte: fileSizeRange.min,
            lte: fileSizeRange.max
          }
        }
        if (mimeTypes && mimeTypes.length > 0) {
          where.mimeType = { in: mimeTypes }
        }

        const [documents, totalCount] = await Promise.all([
          ctx.prisma.document.findMany({
            where,
            skip,
            take,
            include: {
              uploadedBy: {
                select: {
                  id: true,
                  role: true,
                  clientProfile: { select: { firstName: true, lastName: true } },
                  caregiverProfile: { select: { firstName: true, lastName: true } },
                  coordinatorProfile: { select: { firstName: true, lastName: true } }
                }
              },
              client: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true
                }
              },
              _count: {
                select: {
                  versions: true,
                  shares: true,
                  comments: true
                }
              }
            },
            orderBy: { createdAt: 'desc' }
          }),
          ctx.prisma.document.count({ where })
        ])

        return createPaginatedResponse(documents, totalCount, page, limit)
      } catch (error) {
        handleDatabaseError(error)
      }
    }),

  /**
   * Download document
   */
  download: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const document = await ctx.prisma.document.findUnique({
          where: { id: input.id }
        })

        if (!document) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Document not found'
          })
        }

        // Check access permissions
        const hasAccess = await canUserAccessDocument(ctx, ctx.user.id, document)
        if (!hasAccess) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Access denied'
          })
        }

        // Log download
        await logDocumentAccess(ctx, document.id, ctx.user.id, 'DOWNLOAD')

        // Generate signed URL for secure download
        const downloadUrl = await generateSecureDownloadUrl(document.fileUrl)

        return { 
          success: true, 
          downloadUrl,
          fileName: document.fileName,
          fileSize: document.fileSize
        }
      } catch (error) {
        if (error instanceof TRPCError) throw error
        handleDatabaseError(error)
      }
    }),

  /**
   * Delete document (soft delete)
   */
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const document = await ctx.prisma.document.findUnique({
          where: { id: input.id }
        })

        if (!document) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Document not found'
          })
        }

        // Check permissions
        const canDelete = 
          document.uploadedById === ctx.user.id ||
          [UserRole.ADMIN, UserRole.COORDINATOR].includes(ctx.user.role)

        if (!canDelete) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have permission to delete this document'
          })
        }

        await ctx.prisma.document.update({
          where: { id: input.id },
          data: { status: 'DELETED' }
        })

        await logDocumentAccess(ctx, input.id, ctx.user.id, 'DELETE')

        return { success: true }
      } catch (error) {
        if (error instanceof TRPCError) throw error
        handleDatabaseError(error)
      }
    }),

  // ===== DOCUMENT SHARING =====

  /**
   * Share document with users
   */
  shareDocument: protectedProcedure
    .input(documentSchemas.documentShare)
    .mutation(async ({ ctx, input }) => {
      try {
        const document = await ctx.prisma.document.findUnique({
          where: { id: input.documentId }
        })

        if (!document) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Document not found'
          })
        }

        // Check permissions
        const canShare = 
          document.uploadedById === ctx.user.id ||
          [UserRole.ADMIN, UserRole.COORDINATOR].includes(ctx.user.role) ||
          await hasDocumentSharePermission(ctx, ctx.user.id, document)

        if (!canShare) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have permission to share this document'
          })
        }

        // Create share records
        const shares = await ctx.prisma.documentShare.createMany({
          data: input.shareWithUserIds.map(userId => ({
            documentId: input.documentId,
            sharedById: ctx.user.id,
            sharedWithUserId: userId,
            permissions: input.permissions,
            expiresAt: input.expiresAt
          })),
          skipDuplicates: true
        })

        // Send notifications if requested
        if (input.notifyUsers) {
          await sendShareNotifications(ctx, input.documentId, input.shareWithUserIds, input.shareMessage)
        }

        return { success: true, sharesCreated: shares.count }
      } catch (error) {
        if (error instanceof TRPCError) throw error
        handleDatabaseError(error)
      }
    }),

  /**
   * Create shareable link
   */
  createShareLink: protectedProcedure
    .input(documentSchemas.documentShareLink)
    .mutation(async ({ ctx, input }) => {
      try {
        const document = await ctx.prisma.document.findUnique({
          where: { id: input.documentId }
        })

        if (!document) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Document not found'
          })
        }

        // Check permissions
        const canShare = 
          document.uploadedById === ctx.user.id ||
          [UserRole.ADMIN, UserRole.COORDINATOR].includes(ctx.user.role)

        if (!canShare) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have permission to create share links'
          })
        }

        // Generate secure share token
        const shareToken = generateShareToken()
        
        // Store share link details (would need a separate table)
        const shareLink = await ctx.prisma.$executeRaw`
          INSERT INTO document_share_links (
            id, document_id, created_by, share_token, expires_at, max_downloads, 
            requires_password, password_hash, track_downloads, track_views, created_at
          ) VALUES (
            gen_random_uuid(), ${input.documentId}, ${ctx.user.id}, ${shareToken},
            ${input.expiresAt}, ${input.maxDownloads}, ${input.requiresPassword},
            ${input.password ? await hashPassword(input.password) : null},
            ${input.trackDownloads}, ${input.trackViews}, NOW()
          ) RETURNING *
        `

        const shareUrl = `${process.env.FRONTEND_URL}/shared/${shareToken}`

        return { 
          success: true, 
          shareUrl,
          shareToken,
          expiresAt: input.expiresAt
        }
      } catch (error) {
        if (error instanceof TRPCError) throw error
        handleDatabaseError(error)
      }
    }),

  // ===== DOCUMENT COMMENTS =====

  /**
   * Add comment to document
   */
  addComment: protectedProcedure
    .input(documentSchemas.documentCommentCreate)
    .output(documentSchemas.documentComment)
    .mutation(async ({ ctx, input }) => {
      try {
        const document = await ctx.prisma.document.findUnique({
          where: { id: input.documentId }
        })

        if (!document) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Document not found'
          })
        }

        // Check access permissions
        const hasAccess = await canUserAccessDocument(ctx, ctx.user.id, document)
        if (!hasAccess) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Access denied'
          })
        }

        const comment = await ctx.prisma.documentComment.create({
          data: {
            documentId: input.documentId,
            userId: ctx.user.id,
            content: input.content,
            commentType: input.commentType,
            page: input.page,
            x: input.x,
            y: input.y,
            replyToCommentId: input.replyToCommentId,
            isPrivate: input.isPrivate,
            status: input.status
          }
        })

        return comment
      } catch (error) {
        if (error instanceof TRPCError) throw error
        handleDatabaseError(error)
      }
    }),

  /**
   * Get document comments
   */
  getComments: protectedProcedure
    .input(z.object({
      documentId: z.string().uuid(),
      page: z.number().default(1),
      limit: z.number().default(50)
    }))
    .query(async ({ ctx, input }) => {
      try {
        const document = await ctx.prisma.document.findUnique({
          where: { id: input.documentId }
        })

        if (!document) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Document not found'
          })
        }

        // Check access
        const hasAccess = await canUserAccessDocument(ctx, ctx.user.id, document)
        if (!hasAccess) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Access denied'
          })
        }

        const { skip, take } = createPaginationQuery(input.page, input.limit)

        const where: any = { 
          documentId: input.documentId 
        }

        // Only show public comments unless user is document owner or staff
        if (
          document.uploadedById !== ctx.user.id && 
          ![UserRole.ADMIN, UserRole.COORDINATOR].includes(ctx.user.role)
        ) {
          where.isPrivate = false
        }

        const [comments, totalCount] = await Promise.all([
          ctx.prisma.documentComment.findMany({
            where,
            skip,
            take,
            include: {
              user: {
                select: {
                  id: true,
                  role: true,
                  clientProfile: { select: { firstName: true, lastName: true } },
                  caregiverProfile: { select: { firstName: true, lastName: true } },
                  coordinatorProfile: { select: { firstName: true, lastName: true } }
                }
              },
              replyTo: {
                select: {
                  id: true,
                  content: true,
                  user: {
                    select: {
                      clientProfile: { select: { firstName: true, lastName: true } },
                      caregiverProfile: { select: { firstName: true, lastName: true } },
                      coordinatorProfile: { select: { firstName: true, lastName: true } }
                    }
                  }
                }
              }
            },
            orderBy: { createdAt: 'desc' }
          }),
          ctx.prisma.documentComment.count({ where })
        ])

        return createPaginatedResponse(comments, totalCount, input.page, input.limit)
      } catch (error) {
        if (error instanceof TRPCError) throw error
        handleDatabaseError(error)
      }
    }),

  // ===== DOCUMENT STATISTICS =====

  /**
   * Get document statistics
   */
  getStats: protectedProcedure
    .input(z.object({
      dateRange: z.object({
        from: z.date(),
        to: z.date()
      }).optional(),
      clientId: z.string().uuid().optional()
    }))
    .output(documentSchemas.documentStats)
    .query(async ({ ctx, input }) => {
      try {
        const { dateRange, clientId } = input
        
        let where: any = { status: 'ACTIVE' }
        
        // Role-based filtering
        if (ctx.user.role === UserRole.CLIENT) {
          const userClientId = await getClientIdForUser(ctx, ctx.user.id)
          where.clientId = userClientId
        } else if (ctx.user.role === UserRole.CAREGIVER) {
          const userCaregiverId = await getCaregiverIdForUser(ctx, ctx.user.id)
          where.OR = [
            { caregiverId: userCaregiverId },
            { uploadedById: ctx.user.id }
          ]
        } else if (ctx.user.role === UserRole.FAMILY) {
          const familyClientId = await getFamilyMemberClientId(ctx, ctx.user.id)
          where.clientId = familyClientId
        }

        if (clientId) where.clientId = clientId
        if (dateRange) {
          where.createdAt = {
            gte: dateRange.from,
            lte: dateRange.to
          }
        }

        const [
          totalDocuments,
          documentsByType,
          documentsByStatus,
          totalStorage,
          documentsThisMonth
        ] = await Promise.all([
          ctx.prisma.document.count({ where }),
          ctx.prisma.document.groupBy({
            by: ['documentType'],
            where,
            _count: true
          }),
          ctx.prisma.document.groupBy({
            by: ['status'],
            where: { ...where, status: undefined },
            _count: true
          }),
          ctx.prisma.document.aggregate({
            where,
            _sum: { fileSize: true }
          }),
          ctx.prisma.document.count({
            where: {
              ...where,
              createdAt: {
                gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
              }
            }
          })
        ])

        return {
          totalDocuments,
          documentsByType: documentsByType.reduce((acc, item) => {
            acc[item.documentType] = item._count
            return acc
          }, {} as Record<string, number>),
          documentsByStatus: documentsByStatus.reduce((acc, item) => {
            acc[item.status] = item._count
            return acc
          }, {} as Record<string, number>),
          totalStorage: totalStorage._sum.fileSize || 0,
          documentsUploadedThisMonth: documentsThisMonth,
          pendingApprovals: 0, // Would implement with approval workflow
          expiringDocuments: 0, // Would implement with retention policies
          mostDownloadedDocuments: [], // Would implement with download tracking
          dailyUploads: [] // Would implement with daily activity tracking
        }
      } catch (error) {
        handleDatabaseError(error)
      }
    })
})

// Helper functions
async function getDocumentWithDetails(ctx: any, documentId: string) {
  return await ctx.prisma.document.findUnique({
    where: { id: documentId },
    include: {
      uploadedBy: {
        select: {
          id: true,
          role: true,
          clientProfile: { select: { firstName: true, lastName: true } },
          caregiverProfile: { select: { firstName: true, lastName: true } },
          coordinatorProfile: { select: { firstName: true, lastName: true } }
        }
      },
      client: {
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      },
      versions: {
        orderBy: { createdAt: 'desc' }
      },
      shares: {
        include: {
          sharedWithUser: {
            select: {
              id: true,
              clientProfile: { select: { firstName: true, lastName: true } },
              caregiverProfile: { select: { firstName: true, lastName: true } },
              coordinatorProfile: { select: { firstName: true, lastName: true } }
            }
          }
        }
      },
      comments: {
        include: {
          user: {
            select: {
              id: true,
              clientProfile: { select: { firstName: true, lastName: true } },
              caregiverProfile: { select: { firstName: true, lastName: true } },
              coordinatorProfile: { select: { firstName: true, lastName: true } }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  })
}

async function canUserAccessDocument(ctx: any, userId: string, document: any): Promise<boolean> {
  // Document owner has access
  if (document.uploadedById === userId) return true

  // Staff have access to all documents
  if ([UserRole.ADMIN, UserRole.COORDINATOR].includes(ctx.user.role)) return true

  // Public documents are accessible to all
  if (document.accessLevel === 'PUBLIC') return true

  // Check client/caregiver associations
  if (document.clientId) {
    return await canUserAccessClient(ctx, userId, document.clientId)
  }

  if (document.caregiverId) {
    return await canUserAccessCaregiver(ctx, userId, document.caregiverId)
  }

  // Check if document is shared with user
  const share = await ctx.prisma.documentShare.findFirst({
    where: {
      documentId: document.id,
      sharedWithUserId: userId,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } }
      ]
    }
  })

  return !!share
}

async function canUserAccessClient(ctx: any, userId: string, clientId: string): Promise<boolean> {
  // Implementation to check if user can access client
  return true // Simplified for demo
}

async function canUserAccessCaregiver(ctx: any, userId: string, caregiverId: string): Promise<boolean> {
  // Implementation to check if user can access caregiver
  return true // Simplified for demo
}

async function hasDocumentEditPermission(ctx: any, userId: string, document: any): Promise<boolean> {
  // Check if user has edit permission through sharing
  const share = await ctx.prisma.documentShare.findFirst({
    where: {
      documentId: document.id,
      sharedWithUserId: userId,
      permissions: { path: ['canEdit'], equals: true }
    }
  })
  return !!share
}

async function hasDocumentSharePermission(ctx: any, userId: string, document: any): Promise<boolean> {
  // Check if user has share permission
  const share = await ctx.prisma.documentShare.findFirst({
    where: {
      documentId: document.id,
      sharedWithUserId: userId,
      permissions: { path: ['canShare'], equals: true }
    }
  })
  return !!share
}

async function logDocumentAccess(ctx: any, documentId: string, userId: string, action: string) {
  // Log document access for audit purposes
  await ctx.prisma.auditLog.create({
    data: {
      userId,
      action: action as any,
      resourceType: 'Document',
      resourceId: documentId,
      ipAddress: ctx.req?.headers.get('x-forwarded-for') || undefined,
      userAgent: ctx.req?.headers.get('user-agent') || undefined,
      timestamp: new Date()
    }
  })
}

async function generateSecureDownloadUrl(fileUrl: string): Promise<string> {
  // Implementation to generate signed/secure download URL
  // Would integrate with your file storage service (AWS S3, etc.)
  return fileUrl // Simplified for demo
}

function generateShareToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import('bcryptjs')
  return await bcrypt.hash(password, 10)
}

async function sendShareNotifications(ctx: any, documentId: string, userIds: string[], message?: string) {
  // Implementation to send notifications about document sharing
  console.log(`Sending share notifications for document ${documentId} to users: ${userIds.join(', ')}`)
}

// Helper functions for getting user's associated IDs
async function getClientIdForUser(ctx: any, userId: string): Promise<string | null> {
  const client = await ctx.prisma.clientProfile.findUnique({
    where: { userId }
  })
  return client?.id || null
}

async function getCaregiverIdForUser(ctx: any, userId: string): Promise<string | null> {
  const caregiver = await ctx.prisma.caregiverProfile.findUnique({
    where: { userId }
  })
  return caregiver?.id || null
}

async function getFamilyMemberClientId(ctx: any, userId: string): Promise<string | null> {
  const familyMember = await ctx.prisma.familyProfile.findUnique({
    where: { userId }
  })
  return familyMember?.clientId || null
}