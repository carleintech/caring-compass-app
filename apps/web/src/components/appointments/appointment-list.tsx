"use client"

import { useCallback, useMemo, useState } from "react"
import { format } from "date-fns"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"

interface Appointment {
  id: string
  date: Date
  duration: number
  notes?: string
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED' | 'NO_SHOW'
}

interface AppointmentListProps {
  appointments: Appointment[]
  onEdit: (appointment: Appointment) => void
  onDelete: (id: string) => void
}

export function AppointmentList({
  appointments,
  onEdit,
  onDelete,
}: Readonly<AppointmentListProps>) {
  const [sortField, setSortField] = useState<'date' | 'duration'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Announcement function for live regions
  const announceChange = useCallback((message: string) => {
    const liveRegion = document.createElement('div')
    liveRegion.setAttribute('aria-live', 'polite')
    liveRegion.setAttribute('role', 'status')
    liveRegion.className = 'sr-only'
    liveRegion.textContent = message
    document.body.appendChild(liveRegion)
    setTimeout(() => document.body.removeChild(liveRegion), 1000)
  }, [])

  const handleKeyboardNavigation = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const buttons = Array.from(document.querySelectorAll('button[aria-label*="appointment"]'))
      const currentIndex = buttons.indexOf(document.activeElement as HTMLElement)
      const nextIndex = event.key === 'ArrowDown' 
        ? (currentIndex + 1) % buttons.length 
        : (currentIndex - 1 + buttons.length) % buttons.length
      ;(buttons[nextIndex] as HTMLElement).focus()
    }
  }, [])

  const filteredAndSortedAppointments = useMemo(() => {
    let filtered = [...appointments]

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter)
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(app => 
        app.notes?.toLowerCase().includes(query) ||
        format(new Date(app.date), 'PPP').toLowerCase().includes(query)
      )
    }

    // Sort appointments
    filtered.sort((a, b) => {
      let comparison = 0
      if (sortField === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
      } else if (sortField === 'duration') {
        comparison = a.duration - b.duration
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [appointments, sortField, sortOrder, statusFilter, searchQuery])

  return (
    <section 
      className="space-y-4" 
      aria-label="Appointments List"
      role="region"
      onKeyDown={handleKeyboardNavigation}
    >
      <div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center" role="toolbar" aria-label="Appointment filters and sorting">
          <div>
            <label htmlFor="search-appointments" className="sr-only">
              Search appointments
            </label>
              <Input
                id="search-appointments"
                placeholder="Search appointments..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  announceChange(`Search updated: ${e.target.value || 'empty'}`)
                }}
                className="sm:w-[300px]"
                aria-label="Search appointments"
                role="searchbox"
              />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value)
              announceChange(`Filtered by status: ${value}`)
            }}
            name="status-filter"
          >
            <SelectTrigger className="w-[180px]" aria-label="Filter by status">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="SCHEDULED">Scheduled</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
              <SelectItem value="RESCHEDULED">Rescheduled</SelectItem>
              <SelectItem value="NO_SHOW">No Show</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={sortField}
            onValueChange={(value: 'date' | 'duration') => setSortField(value)}
            name="sort-field"
          >
            <SelectTrigger className="w-[180px]" aria-label="Sort appointments by">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="duration">Duration</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            aria-label={`Sort ${sortOrder === 'asc' ? 'ascending' : 'descending'}`}
            aria-pressed={sortOrder === 'asc'}
          >
            <span aria-hidden="true">{sortOrder === 'asc' ? '↑' : '↓'}</span>
          </Button>
        </div>
        <div className="mt-4">
          {filteredAndSortedAppointments.length === 0 ? (
            <div 
              className="text-center py-8 text-muted-foreground"
              role="alert"
              aria-live="polite"
            >
              No appointments found
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAndSortedAppointments.map((appointment) => (
                <article
                  key={appointment.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                  aria-labelledby={`appointment-${appointment.id}-date`}
                >
                  <div className="flex items-center space-x-4">
                    <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <div>
                      <p className="font-medium" id={`appointment-${appointment.id}-date`}>
                        {format(new Date(appointment.date), 'PPP p')}
                      </p>
                      <p className="text-sm text-muted-foreground" aria-label={`Duration: ${appointment.duration} minutes`}>
                        Duration: {appointment.duration} minutes
                      </p>
                      {appointment.notes && (
                        <p className="text-sm text-muted-foreground">
                          {appointment.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span 
                      className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${appointment.status === 'SCHEDULED' && 'bg-blue-100 text-blue-800'}
                        ${appointment.status === 'COMPLETED' && 'bg-green-100 text-green-800'}
                        ${appointment.status === 'CANCELLED' && 'bg-red-100 text-red-800'}
                        ${appointment.status === 'RESCHEDULED' && 'bg-yellow-100 text-yellow-800'}
                        ${appointment.status === 'NO_SHOW' && 'bg-gray-100 text-gray-800'}
                      `}
                      role="status"
                      aria-label={`Appointment status: ${appointment.status.toLowerCase()}`}
                    >
                      {appointment.status}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(appointment)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          onEdit(appointment)
                        }
                      }}
                      aria-label={`Edit appointment on ${format(new Date(appointment.date), 'PPP p')}`}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(appointment.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          onDelete(appointment.id)
                        }
                      }}
                      aria-label={`Delete appointment on ${format(new Date(appointment.date), 'PPP p')}`}
                    >
                      Delete
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
