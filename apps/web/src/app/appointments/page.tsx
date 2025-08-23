"use client"

import { useState, useEffect } from "react"
import { AppointmentCalendar } from "@/components/appointments/appointment-calendar"
import { AppointmentForm } from "@/components/appointments/appointment-form"
import { AppointmentDetails } from "@/components/appointments/appointment-details"
import { toast } from "@/components/ui/use-toast"

export default function AppointmentsPage() {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [appointments, setAppointments] = useState<any[]>([])
  const [editingAppointment, setEditingAppointment] = useState<any>(null)

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/appointments')
      if (!response.ok) throw new Error('Failed to fetch appointments')
      const data = await response.json()
      setAppointments(data)
    } catch (err: unknown) {
      console.error('Error fetching appointments:', err)
      toast({
        title: "Error",
        description: "Failed to fetch appointments",
        variant: "destructive",
      })
    }
  }

  // Fetch appointments on component mount
  useEffect(() => {
    void fetchAppointments()
  }, [])

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setError(null)
    setEditingAppointment(null)
  }

  const handleAppointmentSubmit = async (data: any) => {
    setIsLoading(true)
    setError(null)
    
    const endpoint = editingAppointment
      ? `/api/appointments/${editingAppointment.id}`
      : '/api/appointments'
    
    const method = editingAppointment ? 'PUT' : 'POST'
    
    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${editingAppointment ? 'update' : 'create'} appointment`)
      }

      // Reset form and show success message
      setSelectedDate(undefined)
      setEditingAppointment(null)
      await fetchAppointments()
      
      toast({
        title: "Success",
        description: `Appointment ${editingAppointment ? 'updated' : 'created'} successfully`,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      toast({
        title: "Error",
        description: `Failed to ${editingAppointment ? 'update' : 'create'} appointment`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (appointment: any) => {
    setEditingAppointment(appointment)
    setSelectedDate(new Date(appointment.date))
  }

  const handleDelete = async (id: string) => {
    // This is handled by the AppointmentDetails component
    await fetchAppointments()
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Appointments</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <AppointmentCalendar 
            onAppointmentSelect={handleDateSelect}
            className="md:sticky md:top-6"
          />
          <div className="mt-6 space-y-4">
            {appointments.map((appointment) => (
              <AppointmentDetails
                key={appointment.id}
                appointment={appointment}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
        {selectedDate && (
          <AppointmentForm
            mode={editingAppointment ? 'edit' : 'create'}
            date={selectedDate}
            onSubmit={handleAppointmentSubmit}
            isLoading={isLoading}
            error={error}
            appointment={editingAppointment}
          />
        )}
      </div>
    </div>
  )
}
