import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns'

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format currency values
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format phone numbers
 */
export function formatPhoneNumber(phoneNumber: string): string {
  const cleaned = phoneNumber.replace(/\D/g, '')
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`
  }
  
  return phoneNumber
}

/**
 * Format dates for healthcare contexts
 */
export function formatDate(
  date: string | Date,
  formatString: string = 'MMM d, yyyy'
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatString)
}

export function formatDateTime(
  date: string | Date,
  formatString: string = 'MMM d, yyyy h:mm a'
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatString)
}

export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  
  if (isToday(dateObj)) {
    return `Today at ${format(dateObj, 'h:mm a')}`
  }
  
  if (isYesterday(dateObj)) {
    return `Yesterday at ${format(dateObj, 'h:mm a')}`
  }
  
  return formatDistanceToNow(dateObj, { addSuffix: true })
}

/**
 * Calculate duration between two dates
 */
export function calculateDuration(
  startDate: string | Date,
  endDate: string | Date
): string {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate
  
  const diffInMinutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes} min`
  }
  
  const hours = Math.floor(diffInMinutes / 60)
  const minutes = diffInMinutes % 60
  
  if (minutes === 0) {
    return `${hours} hr${hours !== 1 ? 's' : ''}`
  }
  
  return `${hours} hr${hours !== 1 ? 's' : ''} ${minutes} min`
}

/**
 * Generate initials from a name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Validate email addresses
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate phone numbers
 */
export function isValidPhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.length >= 10 && cleaned.length <= 11
}

/**
 * Generate a random ID
 */
export function generateId(prefix: string = ''): string {
  const timestamp = Date.now().toString(36)
  const randomPart = Math.random().toString(36).substr(2, 5)
  return prefix ? `${prefix}_${timestamp}_${randomPart}` : `${timestamp}_${randomPart}`
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Throttle function for performance
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), wait)
    }
  }
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T
  if (typeof obj === 'object') {
    const clonedObj = {} as { [key: string]: any }
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj as T
  }
  return obj
}

/**
 * Sleep function for delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Capitalize first letter of each word
 */
export function capitalizeWords(str: string): string {
  return str.replace(/\w\S*/g, txt => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  )
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

/**
 * Convert file size to human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
}

/**
 * Check if file is an image
 */
export function isImageFile(filename: string): boolean {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp']
  const extension = getFileExtension(filename).toLowerCase()
  return imageExtensions.includes(extension)
}

/**
 * Generate avatar URL or return initials
 */
export function getAvatarUrl(
  name: string,
  email?: string,
  size: number = 40
): { type: 'url' | 'initials'; value: string } {
  // If we have an email, we could generate a Gravatar URL
  if (email) {
    // For now, just return initials, but this could be expanded to use Gravatar
    return {
      type: 'initials',
      value: getInitials(name)
    }
  }
  
  return {
    type: 'initials',
    value: getInitials(name)
  }
}

/**
 * Healthcare-specific utilities
 */
export const healthcareUtils = {
  /**
   * Format medical record number
   */
  formatMRN(mrn: string): string {
    return mrn.replace(/(.{3})/g, '$1-').slice(0, -1)
  },

  /**
   * Calculate age from date of birth
   */
  calculateAge(dateOfBirth: string | Date): number {
    const today = new Date()
    const dob = typeof dateOfBirth === 'string' ? parseISO(dateOfBirth) : dateOfBirth
    let age = today.getFullYear() - dob.getFullYear()
    const monthDiff = today.getMonth() - dob.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--
    }
    
    return age
  },

  /**
   * Format visit status for display
   */
  formatVisitStatus(status: string): { label: string; color: string } {
    const statusMap = {
      SCHEDULED: { label: 'Scheduled', color: 'blue' },
      ASSIGNED: { label: 'Assigned', color: 'purple' },
      IN_PROGRESS: { label: 'In Progress', color: 'yellow' },
      COMPLETED: { label: 'Completed', color: 'green' },
      CANCELLED: { label: 'Cancelled', color: 'red' },
      NO_SHOW: { label: 'No Show', color: 'orange' },
    }
    
    return statusMap[status as keyof typeof statusMap] || { label: status, color: 'gray' }
  },

  /**
   * Format caregiver availability
   */
  formatAvailability(dayOfWeek: number, startTime: number, endTime: number): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const formatTime = (hour: number) => {
      const ampm = hour >= 12 ? 'PM' : 'AM'
      const hour12 = hour % 12 || 12
      return `${hour12}:00 ${ampm}`
    }
    
    return `${days[dayOfWeek]} ${formatTime(startTime)} - ${formatTime(endTime)}`
  },
}

/**
 * Form validation utilities
 */
export const validationUtils = {
  required: (value: any) => !!value || 'This field is required',
  
  email: (value: string) => 
    isValidEmail(value) || 'Please enter a valid email address',
  
  phone: (value: string) => 
    isValidPhoneNumber(value) || 'Please enter a valid phone number',
  
  minLength: (min: number) => (value: string) =>
    value.length >= min || `Must be at least ${min} characters`,
  
  maxLength: (max: number) => (value: string) =>
    value.length <= max || `Must be no more than ${max} characters`,
  
  number: (value: string) => 
    !isNaN(Number(value)) || 'Must be a valid number',
  
  positiveNumber: (value: string) => 
    (!isNaN(Number(value)) && Number(value) > 0) || 'Must be a positive number',
  
  zipCode: (value: string) => 
    /^\d{5}(-\d{4})?$/.test(value) || 'Please enter a valid ZIP code',
}

/**
 * Local storage utilities with error handling
 */
export const storageUtils = {
  set: (key: string, value: any): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error('Error saving to localStorage:', error)
      return false
    }
  },
  
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue || null
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return defaultValue || null
    }
  },
  
  remove: (key: string): boolean => {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('Error removing from localStorage:', error)
      return false
    }
  },
  
  clear: (): boolean => {
    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error('Error clearing localStorage:', error)
      return false
    }
  }
}