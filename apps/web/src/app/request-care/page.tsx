"use client"

import { MarketingLayout } from '@/components/layout/page-layout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/components/ui/use-toast'

export default function RequestCarePage() {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    // Get form data
    const formData = new FormData(event.currentTarget)
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      careType: formData.get('careType'),
      startDate: formData.get('startDate'),
      message: formData.get('message')
    }
    
    try {
      // Send data to API
      const response = await fetch('/api/care-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.message || 'Error submitting request')
      }
      
      toast({
        title: "Request Submitted!",
        description: "We'll contact you within 24 hours to discuss your care needs.",
      })
      
      // Reset form
      event.currentTarget.reset()
      
    } catch (error) {
      console.error('Error submitting care request:', error)
      toast({
        title: "Error",
        description: "There was a problem submitting your request. Please try again.",
        variant: "destructive"
      })
    }
  }

  return (
    <MarketingLayout>
      <div className="container-responsive py-12">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-8 text-center text-4xl font-bold">Request Care Assessment</h1>
          
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" required />
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" type="tel" required />
                </div>
                
                <div>
                  <Label htmlFor="careType">Type of Care Needed</Label>
                  <Select name="careType" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select care type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal">Personal Care</SelectItem>
                      <SelectItem value="companionship">Companionship</SelectItem>
                      <SelectItem value="household">Household Support</SelectItem>
                      <SelectItem value="specialized">Specialized Care</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="startDate">Preferred Start Date</Label>
                  <Input id="startDate" name="startDate" type="date" required />
                </div>
                
                <div>
                  <Label htmlFor="message">Additional Information</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Please tell us about any specific care needs or concerns..."
                    className="h-32"
                  />
                </div>
              </div>
              
              <Button type="submit" size="lg" className="w-full">
                Submit Care Request
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </MarketingLayout>
  )
}
