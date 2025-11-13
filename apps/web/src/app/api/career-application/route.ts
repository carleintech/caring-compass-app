import { NextResponse } from 'next/server'
import { z } from 'zod'
import { UserRole, CaregiverStatus } from '@caring-compass/database'
import { db } from '@/lib/db'

// Career application schema
const careerApplicationSchema = z.object({
  // Personal Information
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number required'),
  
  // Address Information
  address: z.object({
    street: z.string().min(1, 'Street address required'),
    city: z.string().min(1, 'City required'),
    state: z.string().min(2, 'State required'),
    zipCode: z.string().min(5, 'ZIP code required')
  }),
  
  // Application Details
  position: z.string().min(1, 'Position selection required'),
  experience: z.string().min(1, 'Experience description required'),
  availability: z.string().min(1, 'Availability selection required'),
  certifications: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([]),
  
  // Additional Information
  message: z.string().optional(),
  whyCaregiver: z.string().optional(),
  transportation: z.string().optional(),
  
  // References
  references: z.array(z.object({
    name: z.string().min(1, 'Reference name required'),
    relationship: z.string().min(1, 'Relationship required'),
    phone: z.string().min(10, 'Valid phone number required'),
    email: z.string().email().optional(),
    yearsKnown: z.string().optional()
  })).min(2, 'At least 2 references required').optional(),

  // Emergency Contact
  emergencyContact: z.object({
    name: z.string().min(1, 'Emergency contact name required'),
    relationship: z.string().min(1, 'Relationship required'),
    phone: z.string().min(10, 'Valid phone number required')
  }).optional(),

  // Consent
  backgroundCheckConsent: z.boolean().default(false),
  drugTestConsent: z.boolean().default(false)
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate request data
    const validData = careerApplicationSchema.parse(body)
    
    // Create the career application in database
    const result = await db.$transaction(async (tx) => {
      // First, create a user account with minimal info
      const user = await tx.user.create({
        data: {
          email: validData.email,
          role: UserRole.CAREGIVER,
          isActive: false // Will be activated after review
        }
      })

      // Create address record
      const address = await tx.address.create({
        data: {
          userId: user.id,
          street1: validData.address.street,
          city: validData.address.city,
          state: validData.address.state,
          zipCode: validData.address.zipCode,
          country: 'US',
          isDefault: true
        }
      })

      // Create caregiver profile with application data
      const caregiverProfile = await tx.caregiverProfile.create({
        data: {
          userId: user.id,
          firstName: validData.firstName,
          lastName: validData.lastName,
          primaryPhone: validData.phone,
          status: CaregiverStatus.APPLICATION_SUBMITTED,
          employmentType: 'PART_TIME', // Default, can be updated later
          
          // Store application data as JSON for now
          applicationData: {
            position: validData.position,
            experience: validData.experience,
            availability: validData.availability,
            certifications: validData.certifications,
            skills: validData.skills,
            message: validData.message,
            whyCaregiver: validData.whyCaregiver,
            transportation: validData.transportation,
            references: validData.references || [],
            emergencyContact: validData.emergencyContact,
            backgroundCheckConsent: validData.backgroundCheckConsent,
            drugTestConsent: validData.drugTestConsent,
            submittedAt: new Date().toISOString()
          }
        }
      })

      // Add skills if provided
      if (validData.skills && validData.skills.length > 0) {
        await tx.caregiverSkill.createMany({
          data: validData.skills.map(skill => ({
            caregiverId: caregiverProfile.id,
            skill: skill as any, // Type assertion for skill enum
            level: 'BASIC' // Default level
          }))
        })
      }

      // Add emergency contact if provided
      if (validData.emergencyContact) {
        await tx.emergencyContact.create({
          data: {
            caregiverId: caregiverProfile.id,
            name: validData.emergencyContact.name,
            relationship: validData.emergencyContact.relationship,
            phone: validData.emergencyContact.phone,
            isPrimary: true
          }
        })
      }

      return {
        applicationId: caregiverProfile.id,
        user,
        caregiverProfile
      }
    })
    
    // TODO: Send confirmation email to applicant
    // TODO: Send notification email to HR team
    
    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      applicationId: result.applicationId,
      data: {
        firstName: validData.firstName,
        lastName: validData.lastName,
        email: validData.email,
        position: validData.position,
        submittedAt: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error('Career application error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Invalid application data', 
          errors: error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
          }))
        },
        { status: 400 }
      )
    }
    
    // Handle database constraint errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { 
          success: false,
          message: 'An application with this email already exists. Please contact us if you need to update your application.' 
        },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to submit application. Please try again or contact us directly.' 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Career Application API - Use POST to submit applications',
    endpoints: {
      'POST /api/career-application': 'Submit a new career application'
    }
  })
}
