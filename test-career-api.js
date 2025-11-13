// Simple test for the career application API
const testApplication = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "5551234567",
  address: {
    street: "123 Main Street",
    city: "Norfolk",
    state: "VA",
    zipCode: "23456"
  },
  position: "Certified Nursing Assistant (CNA)",
  experience: "2 years of experience in home care",
  availability: "Full-time (40+ hours/week)",
  skills: ["Personal Care Assistance", "Medication Reminders"],
  certifications: ["CPR Certification"],
  whyCaregiver: "I have a passion for helping seniors maintain their independence.",
  references: [
    {
      name: "Jane Smith",
      relationship: "Supervisor",
      phone: "5559876543",
      email: "jane.smith@homecare.com"
    },
    {
      name: "Bob Johnson",
      relationship: "Client Family Member",
      phone: "5555551234",
      email: "bob.johnson@email.com"
    }
  ],
  emergencyContact: {
    name: "Mary Doe",
    relationship: "Spouse",
    phone: "5554567890"
  },
  backgroundCheckConsent: true,
  drugTestConsent: true
}

async function testCareerApplication() {
  try {
    console.log('Testing career application API...')
    
    const response = await fetch('http://localhost:3000/api/career-application', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testApplication),
    })

    const result = await response.json()
    
    console.log('Response Status:', response.status)
    console.log('Response Data:', JSON.stringify(result, null, 2))
    
    if (result.success) {
      console.log('✅ Application submitted successfully!')
      console.log('Application ID:', result.applicationId)
    } else {
      console.log('❌ Application failed:', result.message)
      if (result.errors) {
        console.log('Validation errors:', result.errors)
      }
    }
  } catch (error) {
    console.error('❌ Network error:', error.message)
  }
}

// Run the test
testCareerApplication()
