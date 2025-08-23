import type { User } from '@prisma/client';
/**
 * Pagination utilities
 */
export interface PaginationInput {
    page: number;
    limit: number;
}
export interface PaginationResult {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}
export declare function calculatePagination(page: number, limit: number, total: number): PaginationResult;
export declare function getPaginationSkip(page: number, limit: number): number;
/**
 * Error handling utilities
 */
export declare function handlePrismaError(error: any): never;
/**
 * Date and time utilities
 */
export declare function isDateInPast(date: Date): boolean;
export declare function isDateInFuture(date: Date): boolean;
export declare function addDays(date: Date, days: number): Date;
export declare function addHours(date: Date, hours: number): Date;
export declare function getStartOfDay(date: Date): Date;
export declare function getEndOfDay(date: Date): Date;
export declare function getWeekStart(date: Date): Date;
export declare function getWeekEnd(date: Date): Date;
/**
 * Validation utilities
 */
export declare function validateEmail(email: string): boolean;
export declare function validatePhone(phone: string): boolean;
export declare function validateZipCode(zipCode: string): boolean;
/**
 * Business logic utilities
 */
export declare function checkUserAccess(userId: string, resourceType: 'CLIENT' | 'CAREGIVER' | 'VISIT' | 'INVOICE', resourceId: string, user: User): Promise<boolean>;
/**
 * Audit logging utility
 */
export declare function createAuditLog(userId: string, action: string, resourceType: string, resourceId: string, details?: string, metadata?: any, ipAddress?: string, userAgent?: string): Promise<void>;
/**
 * File upload utilities
 */
export declare function validateFileType(filename: string, allowedTypes: string[]): boolean;
export declare function generateFileName(originalName: string, prefix?: string): string;
/**
 * Search utilities
 */
export declare function buildSearchFilter(searchTerm: string, fields: string[]): any;
/**
 * Distance calculation utilities
 */
export declare function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number;
/**
 * Matching engine utilities
 */
export interface MatchingCriteria {
    skills: string[];
    languages: string[];
    gender?: 'MALE' | 'FEMALE';
    maxDistance: number;
    clientLat: number;
    clientLon: number;
    requiredDate: Date;
    visitDuration: number;
}
export interface CaregiverMatch {
    caregiverId: string;
    score: number;
    reasons: string[];
    distance: number;
    availability: boolean;
}
export declare function findCaregiverMatches(criteria: MatchingCriteria): Promise<CaregiverMatch[]>;
/**
 * Notification utilities
 */
export interface NotificationData {
    type: 'EMAIL' | 'SMS' | 'PUSH';
    recipient: string;
    subject?: string;
    message: string;
    templateId?: string;
    templateData?: Record<string, any>;
}
export declare function queueNotification(notification: NotificationData): Promise<void>;
/**
 * Cache utilities
 */
export declare class SimpleCache {
    private cache;
    set(key: string, data: any, ttlMinutes?: number): void;
    get<T>(key: string): T | null;
    delete(key: string): void;
    clear(): void;
}
export declare const apiCache: SimpleCache;
//# sourceMappingURL=index.d.ts.map