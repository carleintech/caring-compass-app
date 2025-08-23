"use client"

import { useState } from "react"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const appointmentFormSchema = z.object({
  date: z.date(),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  duration: z.number().min(30).max(480),
  notes: z.string().optional(),
})

type AppointmentFormData = z.infer<typeof appointmentFormSchema>

interface AppointmentFormProps {
  mode: 'create' | 'edit'
  date: Date
  onSubmit: (data: AppointmentFormData) => void
  className?: string
  isLoading?: boolean
  error?: string | null
  appointment?: {
    id: string
    date: Date
    duration: number
    notes?: string
    status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED' | 'NO_SHOW'
  }
}

export function AppointmentForm({ 
  mode = 'create',
  date, 
  onSubmit, 
  className,
  isLoading = false,
  error = null,
  appointment
}: Readonly<AppointmentFormProps>) {
  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      date: appointment?.date || date,
      time: appointment ? format(new Date(appointment.date), 'HH:mm') : "09:00",
      duration: appointment?.duration || 60,
      notes: appointment?.notes || "",
    },
  })

  return (
    <Card className={className}>
      <div className="p-4">
        <h3 className="text-lg font-medium mb-4">
          Schedule Appointment for {format(date, "PPP")}
        </h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (minutes)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={30} 
                      max={480} 
                      step={15} 
                      {...field} 
                      onChange={e => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && (
              <div className="text-destructive text-sm mb-2">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {(() => {
                if (isLoading) {
                  return mode === 'create' ? "Creating..." : "Updating..."
                }
                return mode === 'create' ? "Create Appointment" : "Update Appointment"
              })()}
            </Button>
          </form>
        </Form>
      </div>
    </Card>
  )
}
