import { TRPCError } from '@trpc/server';
import { getPrismaClient } from '@caring-compass/database/src/utils';
const prisma = getPrismaClient();
export function calculatePagination(page, limit, total) {
    const totalPages = Math.ceil(total / limit);
    return {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
    };
}
export function getPaginationSkip(page, limit) {
    return (page - 1) * limit;
}
/**
 * Error handling utilities
 */
export function handlePrismaError(error) {
    console.error('Prisma error:', error);
    if (error.code === 'P2002') {
        throw new TRPCError({
            code: 'CONFLICT',
            message: 'A record with this information already exists'
        });
    }
    if (error.code === 'P2025') {
        throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Record not found'
        });
    }
    if (error.code === 'P2003') {
        throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Referenced record does not exist'
        });
    }
    throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Database operation failed'
    });
}
/**
 * Date and time utilities
 */
export function isDateInPast(date) {
    return date < new Date();
}
export function isDateInFuture(date) {
    return date > new Date();
}
export function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
export function addHours(date, hours) {
    const result = new Date(date);
    result.setHours(result.getHours() + hours);
    return result;
}
export function getStartOfDay(date) {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
}
export function getEndOfDay(date) {
    const result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
}
export function getWeekStart(date) {
    const result = new Date(date);
    const day = result.getDay();
    const diff = result.getDate() - day;
    result.setDate(diff);
    return getStartOfDay(result);
}
export function getWeekEnd(date) {
    const result = new Date(date);
    const day = result.getDay();
    const diff = result.getDate() - day + 6;
    result.setDate(diff);
    return getEndOfDay(result);
}
/**
 * Validation utilities
 */
export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
export function validatePhone(phone) {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}
export function validateZipCode(zipCode) {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zipRegex.test(zipCode);
}
/**
 * Business logic utilities
 */
export async function checkUserAccess(userId, resourceType, resourceId, user) {
    // Admin and coordinators have access to everything
    if (user.role === 'ADMIN' || user.role === 'COORDINATOR') {
        return true;
    }
    switch (resourceType) {
        case 'CLIENT':
            // Clients can only access their own profile
            if (user.role === 'CLIENT') {
                const clientProfile = await prisma.clientProfile.findFirst({
                    where: { userId: user.id, id: resourceId }
                });
                return !!clientProfile;
            }
            // Family members can access client if they're linked
            if (user.role === 'FAMILY') {
                const familyProfile = await prisma.familyProfile.findFirst({
                    where: {
                        userId: user.id,
                        clientId: resourceId
                    }
                });
                return !!familyProfile;
            }
            // Caregivers can access clients they're assigned to
            if (user.role === 'CAREGIVER') {
                const assignment = await prisma.visit.findFirst({
                    where: {
                        clientId: resourceId,
                        caregiver: { userId: user.id }
                    }
                });
                return !!assignment;
            }
            break;
        case 'CAREGIVER':
            // Caregivers can only access their own profile
            if (user.role === 'CAREGIVER') {
                const caregiverProfile = await prisma.caregiverProfile.findFirst({
                    where: { userId: user.id, id: resourceId }
                });
                return !!caregiverProfile;
            }
            break;
        case 'VISIT':
            // Users can access visits they're involved in
            const visit = await prisma.visit.findFirst({
                where: { id: resourceId },
                include: {
                    client: { include: { user: true } },
                    caregiver: { include: { user: true } }
                }
            });
            if (!visit)
                return false;
            if (user.role === 'CLIENT' && visit.client.userId === user.id)
                return true;
            if (user.role === 'CAREGIVER' && visit.caregiver?.userId === user.id)
                return true;
            if (user.role === 'FAMILY') {
                const familyAccess = await prisma.familyProfile.findFirst({
                    where: { userId: user.id, clientId: visit.clientId }
                });
                return !!familyAccess;
            }
            break;
        case 'INVOICE':
            // Clients can access their own invoices
            if (user.role === 'CLIENT') {
                const invoice = await prisma.invoice.findFirst({
                    where: {
                        id: resourceId,
                        client: { userId: user.id }
                    }
                });
                return !!invoice;
            }
            // Family members can access client invoices they're linked to
            if (user.role === 'FAMILY') {
                const invoice = await prisma.invoice.findFirst({
                    where: {
                        id: resourceId,
                        client: {
                            familyProfiles: {
                                some: { userId: user.id }
                            }
                        }
                    }
                });
                return !!invoice;
            }
            break;
    }
    return false;
}
/**
 * Audit logging utility
 */
export async function createAuditLog(userId, action, resourceType, resourceId, details, metadata, ipAddress, userAgent) {
    try {
        await prisma.auditLog.create({
            data: {
                userId,
                action,
                resourceType,
                resourceId,
                details,
                metadata,
                ipAddress,
                userAgent,
                timestamp: new Date()
            }
        });
    }
    catch (error) {
        // Don't let audit log failures break the main operation
        console.error('Failed to create audit log:', error);
    }
}
/**
 * File upload utilities
 */
export function validateFileType(filename, allowedTypes) {
    const extension = filename.split('.').pop()?.toLowerCase();
    return extension ? allowedTypes.includes(extension) : false;
}
export function generateFileName(originalName, prefix) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const extension = originalName.split('.').pop();
    const baseName = originalName.replace(/\.[^/.]+$/, '');
    return `${prefix ? prefix + '_' : ''}${baseName}_${timestamp}_${random}.${extension}`;
}
/**
 * Search utilities
 */
export function buildSearchFilter(searchTerm, fields) {
    if (!searchTerm.trim())
        return undefined;
    return {
        OR: fields.map(field => ({
            [field]: {
                contains: searchTerm,
                mode: 'insensitive'
            }
        }))
    };
}
/**
 * Distance calculation utilities
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 3959; // Earth's radius in miles
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
            Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}
export async function findCaregiverMatches(criteria) {
    // Get all active caregivers with their profiles and availability
    const caregivers = await prisma.caregiverProfile.findMany({
        where: {
            status: 'ACTIVE'
        },
        include: {
            skills: true,
            availability: {
                where: {
                    effectiveDate: {
                        lte: criteria.requiredDate
                    }
                },
                orderBy: {
                    effectiveDate: 'desc'
                }
            },
            visits: {
                where: {
                    scheduledStart: {
                        gte: getStartOfDay(criteria.requiredDate),
                        lte: getEndOfDay(criteria.requiredDate)
                    },
                    status: {
                        not: 'CANCELLED'
                    }
                }
            }
        }
    });
    const matches = [];
    for (const caregiver of caregivers) {
        let score = 0;
        const reasons = [];
        // Calculate distance
        const distance = calculateDistance(criteria.clientLat, criteria.clientLon, caregiver.latitude || 0, caregiver.longitude || 0);
        // Skip if too far away
        if (distance > criteria.maxDistance) {
            continue;
        }
        // Distance scoring (closer is better)
        if (distance <= 5) {
            score += 20;
            reasons.push('Very close location');
        }
        else if (distance <= 10) {
            score += 15;
            reasons.push('Close location');
        }
        else if (distance <= 15) {
            score += 10;
            reasons.push('Reasonable distance');
        }
        // Skills matching
        const caregiverSkills = caregiver.skills.map(s => s.skillName);
        const matchingSkills = criteria.skills.filter(skill => caregiverSkills.includes(skill));
        if (matchingSkills.length === criteria.skills.length) {
            score += 25;
            reasons.push('All required skills');
        }
        else if (matchingSkills.length > 0) {
            score += Math.floor((matchingSkills.length / criteria.skills.length) * 25);
            reasons.push(`${matchingSkills.length}/${criteria.skills.length} skills matched`);
        }
        // Language matching
        if (criteria.languages.includes(caregiver.primaryLanguage)) {
            score += 15;
            reasons.push('Language preference match');
        }
        // Gender preference
        if (criteria.gender && caregiver.gender === criteria.gender) {
            score += 10;
            reasons.push('Gender preference match');
        }
        // Check availability for the requested time
        const dayOfWeek = criteria.requiredDate.getDay();
        const requestedHour = criteria.requiredDate.getHours();
        const availability = caregiver.availability.find(avail => avail.dayOfWeek === dayOfWeek &&
            avail.startTime <= requestedHour &&
            avail.endTime >= (requestedHour + Math.ceil(criteria.visitDuration)));
        const hasAvailability = !!availability;
        if (hasAvailability) {
            score += 20;
            reasons.push('Available at requested time');
        }
        // Check for scheduling conflicts
        const hasConflict = caregiver.visits.some(visit => {
            const visitStart = visit.scheduledStart.getTime();
            const visitEnd = visit.scheduledEnd?.getTime() || (visitStart + 4 * 60 * 60 * 1000);
            const requestStart = criteria.requiredDate.getTime();
            const requestEnd = requestStart + (criteria.visitDuration * 60 * 60 * 1000);
            return (requestStart < visitEnd && requestEnd > visitStart);
        });
        if (hasConflict) {
            score -= 30;
            reasons.push('Scheduling conflict');
        }
        // Add to matches if score is above threshold
        if (score > 20) {
            matches.push({
                caregiverId: caregiver.id,
                score,
                reasons,
                distance,
                availability: hasAvailability && !hasConflict
            });
        }
    }
    // Sort by score descending
    return matches.sort((a, b) => b.score - a.score);
}
export async function queueNotification(notification) {
    // In a real implementation, this would queue the notification
    // using BullMQ or similar job queue system
    console.log('Notification queued:', notification);
    // For now, just log the notification
    // Later this will integrate with email/SMS services
}
/**
 * Cache utilities
 */
export class SimpleCache {
    cache = new Map();
    set(key, data, ttlMinutes = 10) {
        const expires = Date.now() + (ttlMinutes * 60 * 1000);
        this.cache.set(key, { data, expires });
    }
    get(key) {
        const item = this.cache.get(key);
        if (!item)
            return null;
        if (Date.now() > item.expires) {
            this.cache.delete(key);
            return null;
        }
        return item.data;
    }
    delete(key) {
        this.cache.delete(key);
    }
    clear() {
        this.cache.clear();
    }
}
export const apiCache = new SimpleCache();
//# sourceMappingURL=index.js.map