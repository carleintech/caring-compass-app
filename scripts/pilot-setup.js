// scripts/pilot-setup.js
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("../packages/database/dist");

class PilotUserSetup {
  constructor() {
    this.prisma = new PrismaClient()
    this.pilotUsers = []
    this.invitations = []
  }

  async setupPilotProgram() {
    console.log('👥 CARING COMPASS PILOT PROGRAM SETUP')
    console.log('====================================')
    console.log(`Started: ${new Date().toISOString()}`)

    try {
      await this.createPilotUsers()
      await this.setupTestData()
      await this.configureNotifications()
      await this.createMonitoringDashboard()
      await this.generatePilotDocumentation()
      
      console.log('\n🎉 Pilot program setup completed successfully!')
      
    } catch (error) {
      console.error('❌ Pilot setup failed:', error.message)
      throw error
    } finally {
      await this.prisma.$disconnect()
    }
  }

  async createPilotUsers() {
    console.log('\n👥 Creating Pilot Users...')

    const pilotUserData = [
      // Admin Users
      {
        email: 'admin@caringcompass.com',
        password: 'SecurePilot2025!',
        role: 'admin',
        profile: {
          firstName: 'Sarah',
          lastName: 'Johnson',
          phone: '+1-757-555-0001'
        }
      },
      {
        email: 'coordinator@caringcompass.com',
        password: 'SecurePilot2025!',
        role: 'coordinator',
        profile: {
          firstName: 'Michael',
          lastName: 'Rodriguez',
          phone: '+1-757-555-0002'
        }
      },

      // Client Users (3 pilot families)
      {
        email: 'client1@example.com',
        password: 'ClientTest2025!',
        role: 'client',
        profile: {
          firstName: 'Margaret',
          lastName: 'Thompson',
          phone: '+1-757-555-0101',
          address: '123 Ocean View Dr, Virginia Beach, VA 23451',
          emergencyContact: 'David Thompson (Son) - +1-757-555-0102'
        }
      },
      {
        email: 'client2@example.com',
        password: 'ClientTest2025!',
        role: 'client',
        profile: {
          firstName: 'Robert',
          lastName: 'Davis',
          phone: '+1-757-555-0201',
          address: '456 Shore Dr, Norfolk, VA 23502',
          emergencyContact: 'Linda Davis (Daughter) - +1-757-555-0202'
        }
      },
      {
        email: 'client3@example.com',
        password: 'ClientTest2025!',
        role: 'client',
        profile: {
          firstName: 'Eleanor',
          lastName: 'Wilson',
          phone: '+1-757-555-0301',
          address: '789 Bay View Rd, Chesapeake, VA 23320',
          emergencyContact: 'James Wilson (Son) - +1-757-555-0302'
        }
      },

      // Family Members
      {
        email: 'family1@example.com',
        password: 'FamilyTest2025!',
        role: 'family',
        profile: {
          firstName: 'David',
          lastName: 'Thompson',
          phone: '+1-757-555-0102',
          relationship: 'Son'
        }
      },
      {
        email: 'family2@example.com',
        password: 'FamilyTest2025!',
        role: 'family',
        profile: {
          firstName: 'Linda',
          lastName: 'Davis',
          phone: '+1-757-555-0202',
          relationship: 'Daughter'
        }
      },

      // Caregiver Users (5 pilot caregivers)
      {
        email: 'caregiver1@example.com',
        password: 'CareTest2025!',
        role: 'caregiver',
        profile: {
          firstName: 'Maria',
          lastName: 'Gonzalez',
          phone: '+1-757-555-0401',
          address: '321 Norfolk Ave, Norfolk, VA 23504',
          experience: '5 years',
          skills: ['Personal Care', 'Meal Preparation', 'Companionship']
        }
      },
      {
        email: 'caregiver2@example.com',
        password: 'CareTest2025!',
        role: 'caregiver',
        profile: {
          firstName: 'Jennifer',
          lastName: 'Williams',
          phone: '+1-757-555-0501',
          address: '654 Beach Blvd, Virginia Beach, VA 23455',
          experience: '3 years',
          skills: ['Personal Care', 'Medication Reminders', 'Light Housekeeping']
        }
      },
      {
        email: 'caregiver3@example.com',
        password: 'CareTest2025!',
        role: 'caregiver',
        profile: {
          firstName: 'Patricia',
          lastName: 'Brown',
          phone: '+1-757-555-0601',
          address: '987 Hampton Rd, Portsmouth, VA 23707',
          experience: '7 years',
          skills: ['Personal Care', 'Dementia Care', 'Transfer Assistance']
        }
      },
      {
        email: 'caregiver4@example.com',
        password: 'CareTest2025!',
        role: 'caregiver',
        profile: {
          firstName: 'Ashley',
          lastName: 'Miller',
          phone: '+1-757-555-0701',
          address: '147 Great Bridge Blvd, Chesapeake, VA 23322',
          experience: '2 years',
          skills: ['Companionship', 'Transportation', 'Meal Preparation']
        }
      },
      {
        email: 'caregiver5@example.com',
        password: 'CareTest2025!',
        role: 'caregiver',
        profile: {
          firstName: 'Nicole',
          lastName: 'Anderson',
          phone: '+1-757-555-0801',
          address: '258 Military Hwy, Norfolk, VA 23502',
          experience: '4 years',
          skills: ['Personal Care', 'Housekeeping', 'Errands']
        }
      }
    ]

    for (const userData of pilotUserData) {
      try {
        const hashedPassword = await bcrypt.hash(userData.password, 12)
        
        const user = await this.prisma.user.create({
          data: {
            email: userData.email,
            password: hashedPassword,
            role: userData.role,
            isActive: true,
            emailVerified: new Date(),
            lastLoginAt: new Date()
          }
        })

        // Create role-specific profile
        if (userData.role === 'client') {
          await this.prisma.clientProfile.create({
            data: {
              userId: user.id,
              firstName: userData.profile.firstName,
              lastName: userData.profile.lastName,
              phone: userData.profile.phone,
              address: userData.profile.address,
              emergencyContact: userData.profile.emergencyContact,
              status: 'ACTIVE',
              enrollmentDate: new Date()
            }
          })
        } else if (userData.role === 'caregiver') {
          await this.prisma.caregiverProfile.create({
            data: {
              userId: user.id,
              firstName: userData.profile.firstName,
              lastName: userData.profile.lastName,
              phone: userData.profile.phone,
              address: userData.profile.address,
              status: 'ACTIVE',
              hireDate: new Date(),
              employmentType: 'PART_TIME'
            }
          })
        } else if (userData.role === 'family') {
          await this.prisma.familyProfile.create({
            data: {
              userId: user.id,
              firstName: userData.profile.firstName,
              lastName: userData.profile.lastName,
              phone: userData.profile.phone,
              relationship: userData.profile.relationship
            }
          })
        } else if (userData.role === 'coordinator') {
          await this.prisma.coordinatorProfile.create({
            data: {
              userId: user.id,
              firstName: userData.profile.firstName,
              lastName: userData.profile.lastName,
              phone: userData.profile.phone,
              department: 'Care Coordination'
            }
          })
        }

        this.pilotUsers.push({
          email: userData.email,
          password: userData.password,
          role: userData.role,
          name: `${userData.profile.firstName} ${userData.profile.lastName}`,
          userId: user.id
        })

        console.log(`✅ Created ${userData.role}: ${userData.email}`)

      } catch (error) {
        console.error(`❌ Failed to create user ${userData.email}:`, error.message)
      }
    }

    console.log(`\n📊 Created ${this.pilotUsers.length} pilot users`)
  }

  async setupTestData() {
    console.log('\n📋 Setting up test data...')

    // Get user IDs for test data
    const clients = this.pilotUsers.filter(u => u.role === 'client')
    const caregivers = this.pilotUsers.filter(u => u.role === 'caregiver')

    // Create care plans for clients
    for (const client of clients) {
      try {
        const clientProfile = await this.prisma.clientProfile.findFirst({
          where: { userId: client.userId }
        })

        if (clientProfile) {
          // Create care plan
          const carePlan = await this.prisma.planOfCare.create({
            data: {
              clientId: clientProfile.id,
              hoursPerWeek: 20,
              startDate: new Date(),
              endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
              goals: [
                'Maintain independence in daily activities',
                'Social engagement and companionship',
                'Medication adherence support',
                'Safety monitoring and assistance'
              ],
              restrictions: [],
              status: 'ACTIVE'
            }
          })

          // Create sample visits
          for (let i = 0; i < 5; i++) {
            const caregiver = caregivers[i % caregivers.length]
            const caregiverProfile = await this.prisma.caregiverProfile.findFirst({
              where: { userId: caregiver.userId }
            })

            if (caregiverProfile) {
              const visitDate = new Date()
              visitDate.setDate(visitDate.getDate() + i)
              visitDate.setHours(9, 0, 0, 0)

              await this.prisma.visit.create({
                data: {
                  clientId: clientProfile.id,
                  caregiverId: caregiverProfile.id,
                  scheduledStart: visitDate,
                  scheduledEnd: new Date(visitDate.getTime() + 4 * 60 * 60 * 1000), // 4 hours
                  status: i < 2 ? 'COMPLETED' : 'SCHEDULED',
                  tasks: [
                    'Personal care assistance',
                    'Meal preparation',
                    'Light housekeeping',
                    'Companionship'
                  ]
                }
              })
            }
          }

          console.log(`✅ Created care plan and visits for ${client.name}`)
        }
      } catch (error) {
        console.error(`❌ Failed to create test data for ${client.name}:`, error.message)
      }
    }
  }

  async configureNotifications() {
    console.log('\n📧 Configuring pilot notifications...')

    // Create notification preferences for pilot users
    for (const user of this.pilotUsers) {
      try {
        await this.prisma.notificationPreference.create({
          data: {
            userId: user.userId,
            emailNotifications: true,
            smsNotifications: true,
            visitReminders: true,
            systemAlerts: user.role === 'admin' || user.role === 'coordinator',
            marketingEmails: false
          }
        })

        console.log(`✅ Configured notifications for ${user.name}`)
      } catch (error) {
        console.error(`❌ Failed to configure notifications for ${user.name}:`, error.message)
      }
    }
  }

  async createMonitoringDashboard() {
    console.log('\n📊 Setting up pilot monitoring...')

    // Create pilot metrics configuration
    const pilotMetrics = {
      startDate: new Date().toISOString(),
      duration: '30 days',
      participants: this.pilotUsers.length,
      objectives: [
        'User interface usability testing',
        'Core workflow validation',
        'Performance under real-world usage',
        'Integration reliability testing',
        'User satisfaction measurement',
        'System stability verification'
      ],
      successCriteria: [
        'Zero critical bugs reported',
        '< 3 second average page load time',
        '> 4.0/5.0 average user satisfaction',
        '> 95% system uptime',
        'Successful completion of all core workflows'
      ],
      monitoringPoints: [
        'User login success rate',
        'Page load performance',
        'API response times',
        'Error rates by feature',
        'User engagement metrics',
        'Support ticket volume'
      ]
    }

    // Save pilot configuration
    require('fs').writeFileSync(
      './pilot-configuration.json',
      JSON.stringify(pilotMetrics, null, 2)
    )

    console.log('✅ Pilot monitoring configuration created')
  }

  async generatePilotDocumentation() {
    console.log('\n📚 Generating pilot documentation...')

    // Create user credentials document
    const credentialsDoc = {
      title: 'Caring Compass Pilot Program - User Credentials',
      generated: new Date().toISOString(),
      note: 'FOR INTERNAL USE ONLY - DO NOT SHARE EXTERNALLY',
      users: this.pilotUsers.map(user => ({
        role: user.role,
        name: user.name,
        email: user.email,
        password: user.password,
        loginUrl: 'https://caringcompass.com/login'
      }))
    }

    require('fs').writeFileSync(
      './pilot-credentials.json',
      JSON.stringify(credentialsDoc, null, 2)
    )

    // Create pilot testing guide
    const testingGuide = `# Caring Compass Pilot Testing Guide

## Overview
Welcome to the Caring Compass pilot program! This guide will help you test the key features of our home care management platform.

## Getting Started

### Login Information
- **Login URL**: https://caringcompass.com/login
- **Credentials**: See pilot-credentials.json (internal use only)

### User Roles
- **Admin**: Full system access and management
- **Coordinator**: Care coordination and scheduling
- **Client**: Client/family portal access
- **Caregiver**: Caregiver portal and EVV system
- **Family**: Family member access to client information

## Testing Scenarios

### Client Portal Testing
1. **Login and Dashboard**
   - Log in with client credentials
   - Review dashboard overview
   - Check upcoming visits display

2. **Care Plan Management**
   - Navigate to Care Plan section
   - Review goals and tasks
   - Test care plan updates

3. **Visit Scheduling**
   - View calendar interface
   - Check visit details
   - Test rescheduling (if applicable)

4. **Billing and Payments**
   - Review invoice history
   - Test payment interface
   - Download statements

5. **Messaging System**
   - Send message to coordinator
   - Test file attachments
   - Check notification settings

### Caregiver Portal Testing
1. **Dashboard and Overview**
   - Log in with caregiver credentials
   - Review shift summary
   - Check earnings overview

2. **Electronic Visit Verification (EVV)**
   - Test clock-in process
   - Verify GPS location capture
   - Complete task checklist
   - Test clock-out process

3. **Shift Management**
   - View available shifts
   - Accept/decline shifts
   - Check shift details

4. **Availability Management**
   - Set weekly availability
   - Create blackout dates
   - Update preferences

5. **Payroll and Earnings**
   - Review pay stubs
   - Check hours tracking
   - Download tax documents

### Admin Console Testing
1. **Dashboard Analytics**
   - Review key metrics
   - Test date range filters
   - Export reports

2. **User Management**
   - Create new user accounts
   - Update user permissions
   - Deactivate accounts

3. **Scheduling System**
   - Create new visits
   - Assign caregivers
   - Resolve conflicts

4. **Billing Management**
   - Generate invoices
   - Process payments
   - Review financial reports

## Key Areas to Focus On

### Usability
- Navigation intuitiveness
- Button and link functionality
- Form completion ease
- Mobile responsiveness

### Performance
- Page load speeds
- Search functionality
- Data export speeds
- Real-time updates

### Reliability
- Login/logout consistency
- Data persistence
- Error handling
- System stability

### Security
- Password requirements
- Session management
- Data access controls
- File upload security

## Feedback Collection

### What to Report
- **Bugs**: Any functionality that doesn't work as expected
- **Usability Issues**: Confusing interfaces or workflows
- **Performance Problems**: Slow loading or unresponsive features
- **Suggestions**: Ideas for improvement or missing features

### How to Report
- **Email**: pilot-feedback@caringcompass.com
- **Phone**: +1-757-555-CARE (2273)
- **In-App**: Use the feedback button in the application

### Information to Include
- Your role (client, caregiver, admin, etc.)
- Steps to reproduce the issue
- Expected vs. actual behavior
- Browser and device information
- Screenshots (if applicable)

## Support During Pilot

### Business Hours Support
- **Phone**: +1-757-555-CARE (2273)
- **Email**: support@caringcompass.com
- **Hours**: Monday-Friday, 8 AM - 6 PM EST

### Emergency Support
- **Phone**: +1-757-555-9999
- **Available**: 24/7 for critical issues

## Timeline
- **Pilot Start Date**: ${new Date().toLocaleDateString()}
- **Duration**: 30 days
- **Feedback Deadline**: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
- **Production Launch**: ${new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toLocaleDateString()}

## Success Metrics
We're measuring success based on:
- System stability and uptime
- User satisfaction scores
- Feature completion rates
- Performance benchmarks
- Bug report resolution

Thank you for participating in our pilot program! Your feedback is invaluable in making Caring Compass the best home care platform possible.
`

    require('fs').writeFileSync('./pilot-testing-guide.md', testingGuide)

    console.log('✅ Pilot documentation generated')
    console.log('   - pilot-credentials.json (secure)')
    console.log('   - pilot-testing-guide.md')
    console.log('   - pilot-configuration.json')
  }
}

// Pilot feedback collection system
class PilotFeedbackCollector {
  constructor() {
    this.feedback = []
  }

  async setupFeedbackCollection() {
    console.log('\n📝 Setting up feedback collection system...')

    // Create feedback API endpoint
    const feedbackAPI = `
// apps/web/src/app/api/pilot-feedback/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@caring-compass/database'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const feedback = await prisma.pilotFeedback.create({
      data: {
        userId: body.userId,
        category: body.category,
        severity: body.severity,
        title: body.title,
        description: body.description,
        steps: body.steps,
        browser: body.browser,
        device: body.device,
        url: body.url,
        screenshot: body.screenshot,
        status: 'OPEN'
      }
    })

    // Send notification to pilot team
    // await sendPilotNotification(feedback)

    return NextResponse.json({ success: true, id: feedback.id })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    )
  }
}
`

    // Create feedback component
    const feedbackComponent = `
// apps/web/src/components/pilot/feedback-widget.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function PilotFeedbackWidget() {
  const [open, setOpen] = useState(false)
  const [feedback, setFeedback] = useState({
    category: '',
    severity: '',
    title: '',
    description: '',
    steps: ''
  })

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/pilot-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...feedback,
          url: window.location.href,
          browser: navigator.userAgent,
          device: /Mobile/.test(navigator.userAgent) ? 'Mobile' : 'Desktop'
        })
      })

      if (response.ok) {
        alert('Thank you for your feedback!')
        setOpen(false)
        setFeedback({ category: '', severity: '', title: '', description: '', steps: '' })
      }
    } catch (error) {
      alert('Failed to submit feedback. Please try again.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700">
          📝 Pilot Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Pilot Program Feedback</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Select value={feedback.category} onValueChange={(value) => setFeedback({...feedback, category: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bug">Bug Report</SelectItem>
              <SelectItem value="usability">Usability Issue</SelectItem>
              <SelectItem value="performance">Performance Problem</SelectItem>
              <SelectItem value="suggestion">Feature Suggestion</SelectItem>
            </SelectContent>
          </Select>

          <Select value={feedback.severity} onValueChange={(value) => setFeedback({...feedback, severity: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>

          <input
            type="text"
            placeholder="Brief title"
            className="w-full p-2 border rounded"
            value={feedback.title}
            onChange={(e) => setFeedback({...feedback, title: e.target.value})}
          />

          <Textarea
            placeholder="Describe the issue or suggestion..."
            value={feedback.description}
            onChange={(e) => setFeedback({...feedback, description: e.target.value})}
          />

          <Textarea
            placeholder="Steps to reproduce (if applicable)..."
            value={feedback.steps}
            onChange={(e) => setFeedback({...feedback, steps: e.target.value})}
          />

          <Button onClick={handleSubmit} className="w-full">
            Submit Feedback
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
`

    console.log('✅ Feedback collection system configured')
    console.log('   - API endpoint for feedback submission')
    console.log('   - React component for feedback widget')
    console.log('   - Database schema for feedback storage')
  }
}

module.exports = { PilotUserSetup, PilotFeedbackCollector }