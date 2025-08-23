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
import { messagingSchemas } from '../schemas'

export const messagingRouter = createTRPCRouter({
  // ===== MESSAGE THREAD MANAGEMENT =====

  /**
   * Create a new message thread
   */
  createThread: protectedProcedure
    .input(messagingSchemas.messageThreadCreate)
    .output(messagingSchemas.threadWithDetails)
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await ctx.prisma.$transaction(async (tx) => {
          // Verify all participants exist and user has permission to message them
          const participants = await tx.user.findMany({
            where: { id: { in: input.participantIds } }
          })

          if (participants.length !== input.participantIds.length) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'One or more participants not found'
            })
          }

          // Check if current user can message all participants
          for (const participant of participants) {
            const canMessage = await canUserMessageUser(ctx, ctx.user.id, participant.id)
            if (!canMessage) {
              throw new TRPCError({
                code: 'FORBIDDEN',
                message: `Cannot message user ${participant.email}`
              })
            }
          }

          // Create thread
          const thread = await tx.messageThread.create({
            data: {
              subject: input.subject,
              threadType: input.threadType,
              isActive: true
            }
          })

          // Add participants
          await tx.threadParticipant.createMany({
            data: input.participantIds.map(userId => ({
              threadId: thread.id,
              userId,
              joinedAt: new Date()
            }))
          })

          // Create initial message
          const message = await tx.message.create({
            data: {
              threadId: thread.id,
              senderId: ctx.user.id,
              content: input.initialMessage.content,
              messageType: input.initialMessage.messageType,
              isUrgent: input.isUrgent
            }
          })

          // Create attachments if any
          if (input.initialMessage.attachments) {
            await tx.messageAttachment.createMany({
              data: input.initialMessage.attachments.map(attachment => ({
                messageId: message.id,
                fileName: attachment.fileName,
                fileSize: attachment.fileSize,
                mimeType: attachment.mimeType,
                fileUrl: attachment.fileUrl
              }))
            })
          }

          return thread.id
        })

        // Return thread with details
        return await getThreadWithDetails(ctx, result)
      } catch (error) {
        if (error instanceof TRPCError) throw error
        handleDatabaseError(error)
      }
    }),

  /**
   * Get thread by ID
   */
  getThreadById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .output(messagingSchemas.threadWithDetails)
    .query(async ({ ctx, input }) => {
      try {
        const thread = await getThreadWithDetails(ctx, input.id)

        if (!thread) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Thread not found'
          })
        }

        // Check if user is participant
        const isParticipant = thread.participants.some(p => p.userId === ctx.user.id)
        const isStaff = [UserRole.ADMIN, UserRole.COORDINATOR].includes(ctx.user.role)

        if (!isParticipant && !isStaff) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Access denied'
          })
        }

        return thread
      } catch (error) {
        if (error instanceof TRPCError) throw error
        handleDatabaseError(error)
      }
    }),

  /**
   * Search message threads
   */
  searchThreads: protectedProcedure
    .input(messagingSchemas.messageThreadSearch)
    .query(async ({ ctx, input }) => {
      try {
        const { page, limit, participantId, threadType, clientId, hasUnreadMessages, isUrgent, dateRange, query } = input
        const { skip, take } = createPaginationQuery(page, limit)

        let where: any = {}

        // User can only see threads they participate in (unless staff)
        if (![UserRole.ADMIN, UserRole.COORDINATOR].includes(ctx.user.role)) {
          where.participants = {
            some: { userId: ctx.user.id }
          }
        }

        // Apply filters
        if (participantId) {
          where.participants = {
            some: { userId: participantId }
          }
        }
        if (threadType) where.threadType = threadType
        if (dateRange) {
          where.createdAt = {
            gte: dateRange.from,
            lte: dateRange.to
          }
        }
        if (query) {
          where.OR = [
            { subject: { contains: query, mode: 'insensitive' as const } },
            { 
              messages: {
                some: {
                  content: { contains: query, mode: 'insensitive' as const }
                }
              }
            }
          ]
        }

        const [threads, totalCount] = await Promise.all([
          ctx.prisma.messageThread.findMany({
            where,
            skip,
            take,
            include: {
              participants: {
                include: {
                  user: {
                    select: {
                      id: true,
                      email: true,
                      role: true,
                      clientProfile: { select: { firstName: true, lastName: true } },
                      caregiverProfile: { select: { firstName: true, lastName: true } },
                      coordinatorProfile: { select: { firstName: true, lastName: true } }
                    }
                  }
                }
              },
              messages: {
                take: 1,
                orderBy: { createdAt: 'desc' },
                include: {
                  sender: {
                    select: {
                      id: true,
                      clientProfile: { select: { firstName: true, lastName: true } },
                      caregiverProfile: { select: { firstName: true, lastName: true } },
                      coordinatorProfile: { select: { firstName: true, lastName: true } }
                    }
                  },
                  readBy: { where: { userId: ctx.user.id } }
                }
              },
              _count: {
                select: {
                  messages: true
                }
              }
            },
            orderBy: { updatedAt: 'desc' }
          }),
          ctx.prisma.messageThread.count({ where })
        ])

        // Calculate unread count for each thread
        const threadsWithUnreadCount = await Promise.all(
          threads.map(async (thread) => {
            const unreadCount = await ctx.prisma.message.count({
              where: {
                threadId: thread.id,
                senderId: { not: ctx.user.id },
                NOT: {
                  readBy: {
                    some: { userId: ctx.user.id }
                  }
                }
              }
            })

            return {
              ...thread,
              lastMessage: thread.messages[0] || null,
              unreadCount,
              totalMessages: thread._count.messages
            }
          })
        )

        return createPaginatedResponse(threadsWithUnreadCount, totalCount, page, limit)
      } catch (error) {
        handleDatabaseError(error)
      }
    }),

  // ===== MESSAGE MANAGEMENT =====

  /**
   * Send a message
   */
  sendMessage: protectedProcedure
    .input(messagingSchemas.messageCreate)
    .output(messagingSchemas.messageWithDetails)
    .mutation(async ({ ctx, input }) => {
      try {
        // Verify user is participant in thread
        const participant = await ctx.prisma.threadParticipant.findFirst({
          where: {
            threadId: input.threadId,
            userId: ctx.user.id,
            leftAt: null
          }
        })

        if (!participant && ![UserRole.ADMIN, UserRole.COORDINATOR].includes(ctx.user.role)) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You are not a participant in this thread'
          })
        }

        const result = await ctx.prisma.$transaction(async (tx) => {
          // Create message
          const message = await tx.message.create({
            data: {
              threadId: input.threadId,
              senderId: ctx.user.id,
              content: input.content,
              messageType: input.messageType,
              isUrgent: input.isUrgent,
              replyToMessageId: input.replyToMessageId,
              scheduledFor: input.scheduledFor,
              expiresAt: input.expiresAt
            }
          })

          // Create attachments if any
          if (input.attachments && input.attachments.length > 0) {
            await tx.messageAttachment.createMany({
              data: input.attachments.map(attachment => ({
                messageId: message.id,
                fileName: attachment.fileName,
                fileSize: attachment.fileSize,
                mimeType: attachment.mimeType,
                fileUrl: attachment.fileUrl
              }))
            })
          }

          // Update thread timestamp
          await tx.messageThread.update({
            where: { id: input.threadId },
            data: { updatedAt: new Date() }
          })

          return message.id
        })

        // Send notifications to other participants
        await sendMessageNotifications(ctx, input.threadId, result, input.isUrgent)

        // Return message with details
        return await getMessageWithDetails(ctx, result)
      } catch (error) {
        if (error instanceof TRPCError) throw error
        handleDatabaseError(error)
      }
    }),

  /**
   * Get messages in thread
   */
  getThreadMessages: protectedProcedure
    .input(z.object({
      threadId: z.string().uuid(),
      page: z.number().default(1),
      limit: z.number().default(50)
    }))
    .query(async ({ ctx, input }) => {
      try {
        // Verify user is participant
        const participant = await ctx.prisma.threadParticipant.findFirst({
          where: {
            threadId: input.threadId,
            userId: ctx.user.id,
            leftAt: null
          }
        })

        if (!participant && ![UserRole.ADMIN, UserRole.COORDINATOR].includes(ctx.user.role)) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You are not a participant in this thread'
          })
        }

        const { skip, take } = createPaginationQuery(input.page, input.limit)

        const [messages, totalCount] = await Promise.all([
          ctx.prisma.message.findMany({
            where: { threadId: input.threadId },
            skip,
            take,
            include: {
              sender: {
                select: {
                  id: true,
                  role: true,
                  clientProfile: { select: { firstName: true, lastName: true } },
                  caregiverProfile: { select: { firstName: true, lastName: true } },
                  coordinatorProfile: { select: { firstName: true, lastName: true } }
                }
              },
              attachments: true,
              readBy: true,
              replyTo: {
                select: {
                  id: true,
                  content: true,
                  sender: {
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
          ctx.prisma.message.count({ where: { threadId: input.threadId } })
        ])

        return createPaginatedResponse(messages, totalCount, input.page, input.limit)
      } catch (error) {
        if (error instanceof TRPCError) throw error
        handleDatabaseError(error)
      }
    }),

  /**
   * Mark messages as read
   */
  markMessagesRead: protectedProcedure
    .input(messagingSchemas.markMultipleRead)
    .mutation(async ({ ctx, input }) => {
      try {
        // Verify user has access to these messages
        const messages = await ctx.prisma.message.findMany({
          where: { id: { in: input.messageIds } },
          include: {
            thread: {
              include: {
                participants: {
                  where: { userId: ctx.user.id }
                }
              }
            }
          }
        })

        // Check access for each message
        for (const message of messages) {
          if (message.thread.participants.length === 0 && ![UserRole.ADMIN, UserRole.COORDINATOR].includes(ctx.user.role)) {
            throw new TRPCError({
              code: 'FORBIDDEN',
              message: 'Access denied to one or more messages'
            })
          }
        }

        // Mark as read (upsert to avoid duplicates)
        const readPromises = input.messageIds.map(messageId =>
          ctx.prisma.messageRead.upsert({
            where: {
              messageId_userId: {
                messageId,
                userId: ctx.user.id
              }
            },
            create: {
              messageId,
              userId: ctx.user.id,
              readAt: input.readAt
            },
            update: {
              readAt: input.readAt
            }
          })
        )

        await Promise.all(readPromises)

        return { success: true }
      } catch (error) {
        if (error instanceof TRPCError) throw error
        handleDatabaseError(error)
      }
    }),

  /**
   * Mark thread as read
   */
  markThreadRead: protectedProcedure
    .input(messagingSchemas.markThreadRead)
    .mutation(async ({ ctx, input }) => {
      try {
        // Verify user is participant
        const participant = await ctx.prisma.threadParticipant.findFirst({
          where: {
            threadId: input.threadId,
            userId: ctx.user.id,
            leftAt: null
          }
        })

        if (!participant) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You are not a participant in this thread'
          })
        }

        // Get all unread messages in thread
        const unreadMessages = await ctx.prisma.message.findMany({
          where: {
            threadId: input.threadId,
            senderId: { not: ctx.user.id },
            ...(input.readUpToMessageId && { id: { lte: input.readUpToMessageId } }),
            NOT: {
              readBy: {
                some: { userId: ctx.user.id }
              }
            }
          },
          select: { id: true }
        })

        // Mark all as read
        if (unreadMessages.length > 0) {
          await ctx.prisma.messageRead.createMany({
            data: unreadMessages.map(message => ({
              messageId: message.id,
              userId: ctx.user.id,
              readAt: input.readAt
            })),
            skipDuplicates: true
          })
        }

        return { success: true, markedCount: unreadMessages.length }
      } catch (error) {
        if (error instanceof TRPCError) throw error
        handleDatabaseError(error)
      }
    }),

  // ===== PARTICIPANT MANAGEMENT =====

  /**
   * Add participant to thread
   */
  addParticipant: protectedProcedure
    .input(messagingSchemas.addParticipant)
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if user can add participants (staff or thread participant with permissions)
        const canAdd = await canUserAddParticipants(ctx, ctx.user.id, input.threadId)
        if (!canAdd) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You cannot add participants to this thread'
          })
        }

        // Check if user already exists in thread
        const existingParticipant = await ctx.prisma.threadParticipant.findFirst({
          where: {
            threadId: input.threadId,
            userId: input.userId,
            leftAt: null
          }
        })

        if (existingParticipant) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'User is already a participant'
          })
        }

        await ctx.prisma.threadParticipant.create({
          data: {
            threadId: input.threadId,
            userId: input.userId,
            joinedAt: new Date()
          }
        })

        return { success: true }
      } catch (error) {
        if (error instanceof TRPCError) throw error
        handleDatabaseError(error)
      }
    }),

  /**
   * Remove participant from thread
   */
  removeParticipant: protectedProcedure
    .input(messagingSchemas.removeParticipant)
    .mutation(async ({ ctx, input }) => {
      try {
        // Check permissions
        const canRemove = 
          [UserRole.ADMIN, UserRole.COORDINATOR].includes(ctx.user.role) ||
          ctx.user.id === input.userId || // Users can remove themselves
          await canUserRemoveParticipants(ctx, ctx.user.id, input.threadId)

        if (!canRemove) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You cannot remove participants from this thread'
          })
        }

        await ctx.prisma.threadParticipant.updateMany({
          where: {
            threadId: input.threadId,
            userId: input.userId,
            leftAt: null
          },
          data: {
            leftAt: new Date()
          }
        })

        return { success: true }
      } catch (error) {
        if (error instanceof TRPCError) throw error
        handleDatabaseError(error)
      }
    }),

  // ===== NOTIFICATIONS =====

  /**
   * Send notification
   */
  sendNotification: staffProcedure
    .input(messagingSchemas.sendNotification)
    .mutation(async ({ ctx, input }) => {
      try {
        // Create notification records
        const notifications = await ctx.prisma.$transaction(async (tx) => {
          const createdNotifications = []

          for (const recipientId of input.recipientIds) {
            // Check user's notification preferences
            const preferences = await getUserNotificationPreferences(ctx, recipientId)
            
            const notification = await tx.notification.create({
              data: {
                recipientId,
                type: input.type,
                title: input.title,
                message: input.message,
                relatedEntityType: input.relatedEntityType,
                relatedEntityId: input.relatedEntityId,
                priority: input.priority,
                isRead: false
              }
            })

            createdNotifications.push(notification)

            // Send via appropriate channels based on preferences
            if (input.channels.email && preferences.emailNotifications) {
              await sendEmailNotification(recipientId, notification)
            }

            if (input.channels.sms && preferences.smsNotifications) {
              await sendSMSNotification(recipientId, notification)
            }

            if (input.channels.push && preferences.pushNotifications) {
              await sendPushNotification(recipientId, notification)
            }
          }

          return createdNotifications
        })

        return { success: true, notificationIds: notifications.map(n => n.id) }
      } catch (error) {
        handleDatabaseError(error)
      }
    }),

  /**
   * Get user notifications
   */
  getNotifications: protectedProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(20),
      unreadOnly: z.boolean().default(false)
    }))
    .query(async ({ ctx, input }) => {
      try {
        const { skip, take } = createPaginationQuery(input.page, input.limit)
        
        const where: any = { recipientId: ctx.user.id }
        if (input.unreadOnly) {
          where.isRead = false
        }

        const [notifications, totalCount] = await Promise.all([
          ctx.prisma.notification.findMany({
            where,
            skip,
            take,
            orderBy: { createdAt: 'desc' }
          }),
          ctx.prisma.notification.count({ where })
        ])

        return createPaginatedResponse(notifications, totalCount, input.page, input.limit)
      } catch (error) {
        handleDatabaseError(error)
      }
    }),

  /**
   * Mark notification as read
   */
  markNotificationRead: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const notification = await ctx.prisma.notification.findUnique({
          where: { id: input.id }
        })

        if (!notification || notification.recipientId !== ctx.user.id) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Notification not found'
          })
        }

        await ctx.prisma.notification.update({
          where: { id: input.id },
          data: {
            isRead: true,
            readAt: new Date()
          }
        })

        return { success: true }
      } catch (error) {
        if (error instanceof TRPCError) throw error
        handleDatabaseError(error)
      }
    }),

  // ===== MESSAGING STATISTICS =====

  /**
   * Get messaging statistics
   */
  getMessagingStats: protectedProcedure
    .input(z.object({
      dateRange: z.object({
        from: z.date(),
        to: z.date()
      }).optional()
    }))
    .output(messagingSchemas.messagingStats)
    .query(async ({ ctx, input }) => {
      try {
        const { dateRange } = input
        
        // Build where clause for user's accessible threads
        const threadWhere: any = {}
        if (![UserRole.ADMIN, UserRole.COORDINATOR].includes(ctx.user.role)) {
          threadWhere.participants = {
            some: { userId: ctx.user.id }
          }
        }

        const messageWhere: any = {
          thread: threadWhere
        }
        
        if (dateRange) {
          messageWhere.createdAt = {
            gte: dateRange.from,
            lte: dateRange.to
          }
        }

        const [
          totalThreads,
          activeThreads,
          totalMessages,
          unreadMessages,
          messagesToday,
          threadsByType
        ] = await Promise.all([
          ctx.prisma.messageThread.count({ where: threadWhere }),
          ctx.prisma.messageThread.count({ 
            where: { ...threadWhere, isActive: true }
          }),
          ctx.prisma.message.count({ where: messageWhere }),
          ctx.prisma.message.count({
            where: {
              ...messageWhere,
              senderId: { not: ctx.user.id },
              NOT: {
                readBy: {
                  some: { userId: ctx.user.id }
                }
              }
            }
          }),
          ctx.prisma.message.count({
            where: {
              ...messageWhere,
              createdAt: {
                gte: new Date(new Date().setHours(0, 0, 0, 0))
              }
            }
          }),
          ctx.prisma.messageThread.groupBy({
            by: ['threadType'],
            where: threadWhere,
            _count: true
          })
        ])

        // Get daily activity
        const dailyActivity = await getDailyMessageActivity(ctx, dateRange, threadWhere)

        return {
          totalThreads,
          activeThreads,
          totalMessages,
          unreadMessages,
          messagesSentToday: messagesToday,
          averageResponseTime: 0, // Would calculate from message timestamps
          threadsByType: threadsByType.reduce((acc, item) => {
            acc[item.threadType] = item._count
            return acc
          }, {} as Record<string, number>),
          dailyActivity
        }
      } catch (error) {
        handleDatabaseError(error)
      }
    })
})

// Helper functions
async function getThreadWithDetails(ctx: any, threadId: string) {
  return await ctx.prisma.messageThread.findUnique({
    where: { id: threadId },
    include: {
      participants: {
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
              clientProfile: { select: { firstName: true, lastName: true } },
              caregiverProfile: { select: { firstName: true, lastName: true } },
              coordinatorProfile: { select: { firstName: true, lastName: true } }
            }
          }
        }
      },
      messages: {
        take: 1,
        orderBy: { createdAt: 'desc' },
        include: {
          sender: {
            select: {
              id: true,
              clientProfile: { select: { firstName: true, lastName: true } },
              caregiverProfile: { select: { firstName: true, lastName: true } },
              coordinatorProfile: { select: { firstName: true, lastName: true } }
            }
          }
        }
      }
    }
  })
}

async function getMessageWithDetails(ctx: any, messageId: string) {
  return await ctx.prisma.message.findUnique({
    where: { id: messageId },
    include: {
      sender: {
        select: {
          id: true,
          role: true,
          clientProfile: { select: { firstName: true, lastName: true } },
          caregiverProfile: { select: { firstName: true, lastName: true } },
          coordinatorProfile: { select: { firstName: true, lastName: true } }
        }
      },
      attachments: true,
      readBy: true,
      replyTo: {
        select: {
          id: true,
          content: true,
          sender: {
            select: {
              clientProfile: { select: { firstName: true, lastName: true } },
              caregiverProfile: { select: { firstName: true, lastName: true } },
              coordinatorProfile: { select: { firstName: true, lastName: true } }
            }
          }
        }
      }
    }
  })
}

async function canUserMessageUser(ctx: any, fromUserId: string, toUserId: string): Promise<boolean> {
  // Implementation to check if user can message another user
  // Based on relationships (client-caregiver, client-coordinator, etc.)
  return true // Simplified for demo
}

async function canUserAddParticipants(ctx: any, userId: string, threadId: string): Promise<boolean> {
  // Check if user has permission to add participants
  return [UserRole.ADMIN, UserRole.COORDINATOR].includes(ctx.user.role)
}

async function canUserRemoveParticipants(ctx: any, userId: string, threadId: string): Promise<boolean> {
  // Check if user has permission to remove participants
  return [UserRole.ADMIN, UserRole.COORDINATOR].includes(ctx.user.role)
}

async function sendMessageNotifications(ctx: any, threadId: string, messageId: string, isUrgent: boolean) {
  // Implementation to send notifications to thread participants
  console.log(`Sending notifications for message ${messageId} in thread ${threadId}`)
}

async function getUserNotificationPreferences(ctx: any, userId: string) {
  // Get user's notification preferences
  return {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true
  }
}

async function sendEmailNotification(recipientId: string, notification: any) {
  // Implementation to send email notification
  console.log(`Sending email notification to ${recipientId}`)
}

async function sendSMSNotification(recipientId: string, notification: any) {
  // Implementation to send SMS notification
  console.log(`Sending SMS notification to ${recipientId}`)
}

async function sendPushNotification(recipientId: string, notification: any) {
  // Implementation to send push notification
  console.log(`Sending push notification to ${recipientId}`)
}

async function getDailyMessageActivity(ctx: any, dateRange: any, threadWhere: any) {
  // Implementation to get daily message activity
  return []
}