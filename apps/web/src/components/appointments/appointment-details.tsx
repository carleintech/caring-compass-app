"use client"

import { useState } from "react"
import { format } from "date-fns"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface AppointmentDetailsProps {
  appointment: {
    id: string
    date: Date
    duration: number
    notes?: string
    status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED' | 'NO_SHOW'
  }
  onEdit: (appointment: AppointmentDetailsProps['appointment']) => void
  onDelete: (id: string) => void
}

export function AppointmentDetails({ 
  appointment, 
  onEdit, 
  onDelete 
}: Readonly<AppointmentDetailsProps>) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/appointments/${appointment.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete appointment')
      }

      onDelete(appointment.id)
      toast({
        title: "Success",
        description: "Appointment deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete appointment",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  return (
    <div className="rounded-lg border p-4 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <h4 className="font-medium">
              {format(new Date(appointment.date), "PPP")}
            </h4>
          </div>
          <p className="text-sm text-muted-foreground">
            Duration: {appointment.duration} minutes
          </p>
          {appointment.notes && (
            <p className="text-sm text-muted-foreground">
              Notes: {appointment.notes}
            </p>
          )}
          <div className="flex items-center space-x-2">
            <div className={`
              px-2 py-1 rounded-full text-xs font-medium
              ${appointment.status === 'SCHEDULED' && 'bg-blue-100 text-blue-800'}
              ${appointment.status === 'COMPLETED' && 'bg-green-100 text-green-800'}
              ${appointment.status === 'CANCELLED' && 'bg-red-100 text-red-800'}
              ${appointment.status === 'RESCHEDULED' && 'bg-yellow-100 text-yellow-800'}
              ${appointment.status === 'NO_SHOW' && 'bg-gray-100 text-gray-800'}
            `}>
              {appointment.status}
            </div>
          </div>
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(appointment)}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
          >
            Delete
          </Button>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this appointment. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
