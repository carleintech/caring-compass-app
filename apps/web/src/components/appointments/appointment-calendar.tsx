"use client"

import { useState } from "react"
import { addDays, format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Appointment {
  id: string
  date: Date
  clientId: string
  caregiverId: string
  status: 'scheduled' | 'completed' | 'cancelled'
}

interface AppointmentCalendarProps {
  initialAppointments?: Appointment[]
  onAppointmentSelect?: (date: Date) => void
  className?: string
}

export function AppointmentCalendar({ 
  initialAppointments = [],
  onAppointmentSelect,
  className 
}: AppointmentCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>()
  
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    if (date && onAppointmentSelect) {
      onAppointmentSelect(date)
    }
  }

  return (
    <Card className={className}>
      <div className="p-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          disabled={(date) => date < new Date()}
          initialFocus
        />
      </div>
      {selectedDate && (
        <div className="border-t p-4">
          <div className="mb-2">
            <h3 className="font-medium">
              Selected: {format(selectedDate, "PPP")}
            </h3>
          </div>
          <Button 
            onClick={() => onAppointmentSelect?.(selectedDate)}
            className="w-full"
          >
            Schedule Appointment
          </Button>
        </div>
      )}
    </Card>
  )
}
