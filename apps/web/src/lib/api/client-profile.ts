import { apiClient } from '@/lib/api-client';
import { z } from 'zod';

// Validation schemas
export const addressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(2, 'State is required').max(2),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format'),
  country: z.string().default('United States'),
});

export const emergencyContactSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Contact name is required'),
  relationship: z.string().min(1, 'Relationship is required'),
  phone: z.string().regex(/^[\d\s\-\(\)]+$/, 'Invalid phone number format'),
  email: z.string().email('Invalid email format').optional(),
  isPrimary: z.boolean().default(false),
});

export const profileSchema = z.object({
  id: z.string(),
  userId: z.string(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().regex(/^[\d\s\-\(\)]+$/, 'Invalid phone number format'),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
  avatar: z.string().url().optional(),
  address: addressSchema.optional(),
  emergencyContacts: z.array(emergencyContactSchema).max(3),
  preferences: z.object({
    language: z.string().default('en'),
    timezone: z.string().default('America/New_York'),
    notifications: z.object({
      email: z.boolean().default(true),
      sms: z.boolean().default(false),
      push: z.boolean().default(true),
    }),
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ClientProfile = z.infer<typeof profileSchema>;
export type Address = z.infer<typeof addressSchema>;
export type EmergencyContact = z.infer<typeof emergencyContactSchema>;

// API service
export const clientProfileApi = {
  async getProfile(): Promise<ClientProfile> {
    const response = await apiClient.get('/api/client/profile');
    return profileSchema.parse(response.data);
  },

  async updateProfile(data: Partial<ClientProfile>): Promise<ClientProfile> {
    const response = await apiClient.patch('/api/client/profile', data);
    return profileSchema.parse(response.data);
  },

  async uploadAvatar(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await apiClient.post('/api/client/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    
    return response.data.avatarUrl;
  },

  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> {
    await apiClient.post('/api/client/profile/change-password', data);
  },
};
