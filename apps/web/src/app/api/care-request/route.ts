import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@caring-compass/database'

// Validation schema
const careRequestSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  careType: z.enum(['personal', 'companionship', 'household', 'specialized']),
  startDate: z.string(),
  message: z.string().optional()
})

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json()
    
    // Validate request data
    const validData = careRequestSchema.parse(body)
    
    // Save to database
    const careRequest = await db.careRequest.create({
      data: {
        ...validData,
        status: 'PENDING',
        submittedAt: new Date()
      }
    })
    
    // Send email notification (TODO: Implement email service)
    // await sendNotificationEmail(careRequest)
    
    return NextResponse.json({
      message: 'Care request submitted successfully',
      careRequest
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid request data', errors: error.issues },
        { status: 400 }
      )
    }
    
    console.error('Error processing care request:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
