import { render, screen, fireEvent, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { AppointmentList } from "../appointment-list"
import { format } from "date-fns"

const mockAppointments = [
  {
    id: "1",
    date: new Date("2025-08-20T10:00:00"),
    duration: 30,
    notes: "Regular checkup",
    status: "SCHEDULED" as const,
  },
  {
    id: "2",
    date: new Date("2025-08-21T14:00:00"),
    duration: 60,
    notes: "Follow-up appointment",
    status: "COMPLETED" as const,
  },
  {
    id: "3",
    date: new Date("2025-08-19T09:00:00"),
    duration: 45,
    notes: "Emergency consultation",
    status: "CANCELLED" as const,
  },
]

describe("AppointmentList", () => {
  const mockOnEdit = jest.fn()
  const mockOnDelete = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders all appointments initially", () => {
    render(
      <AppointmentList
        appointments={mockAppointments}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    mockAppointments.forEach((appointment) => {
      expect(screen.getByText(format(appointment.date, "PPP p"))).toBeInTheDocument()
      expect(screen.getByText(`Duration: ${appointment.duration} minutes`)).toBeInTheDocument()
      expect(screen.getByText(appointment.notes!)).toBeInTheDocument()
      expect(screen.getByText(appointment.status)).toBeInTheDocument()
    })
  })

  it("filters appointments by search query", async () => {
    render(
      <AppointmentList
        appointments={mockAppointments}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    const searchInput = screen.getByPlaceholderText("Search appointments...")
    await userEvent.type(searchInput, "checkup")

    expect(screen.getByText("Regular checkup")).toBeInTheDocument()
    expect(screen.queryByText("Follow-up appointment")).not.toBeInTheDocument()
    expect(screen.queryByText("Emergency consultation")).not.toBeInTheDocument()
  })

  it("filters appointments by status", async () => {
    render(
      <AppointmentList
        appointments={mockAppointments}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    const statusSelect = screen.getByRole("combobox", { name: /filter by status/i })
    await userEvent.click(statusSelect)
    
    const completedOption = screen.getByRole("option", { name: "Completed" })
    await userEvent.click(completedOption)

    expect(screen.queryByText("Regular checkup")).not.toBeInTheDocument()
    expect(screen.getByText("Follow-up appointment")).toBeInTheDocument()
    expect(screen.queryByText("Emergency consultation")).not.toBeInTheDocument()
  })

  it("sorts appointments by date", async () => {
    render(
      <AppointmentList
        appointments={mockAppointments}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    const sortSelect = screen.getByRole("combobox", { name: /sort by/i })
    await userEvent.click(sortSelect)
    
    const dateOption = screen.getByRole("option", { name: "Date" })
    await userEvent.click(dateOption)

    const appointments = screen.getAllByRole("article")
    expect(appointments).toHaveLength(3)
    
    // Check if dates are in ascending order
    const dates = appointments.map(app => 
      within(app).getByText(/202\d/).textContent
    )
    const sortedDates = [...dates].sort()
    expect(dates).toEqual(sortedDates)
  })

  it("sorts appointments by duration", async () => {
    render(
      <AppointmentList
        appointments={mockAppointments}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    const sortSelect = screen.getByRole("combobox", { name: /sort by/i })
    await userEvent.click(sortSelect)
    
    const durationOption = screen.getByRole("option", { name: "Duration" })
    await userEvent.click(durationOption)

    const appointments = screen.getAllByRole("article")
    const durations = appointments.map(app => 
      parseInt(within(app).getByText(/Duration/).textContent!.match(/\d+/)![0])
    )
    
    // Check if durations are in ascending order
    expect(durations).toEqual([30, 45, 60])
  })

  it("toggles sort order", async () => {
    render(
      <AppointmentList
        appointments={mockAppointments}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    const sortOrderButton = screen.getByRole("button", { name: /↑|↓/ })
    await userEvent.click(sortOrderButton)

    const appointments = screen.getAllByRole("article")
    const dates = appointments.map(app => 
      within(app).getByText(/202\d/).textContent
    )
    
    // Check if dates are in descending order
    const sortedDates = [...dates].sort().reverse()
    expect(dates).toEqual(sortedDates)
  })

  it("calls onEdit when edit button is clicked", async () => {
    render(
      <AppointmentList
        appointments={mockAppointments}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    const editButtons = screen.getAllByRole("button", { name: /edit/i })
    await userEvent.click(editButtons[0])

    expect(mockOnEdit).toHaveBeenCalledWith(mockAppointments[0])
  })

  it("calls onDelete when delete button is clicked", async () => {
    render(
      <AppointmentList
        appointments={mockAppointments}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    const deleteButtons = screen.getAllByRole("button", { name: /delete/i })
    await userEvent.click(deleteButtons[0])

    expect(mockOnDelete).toHaveBeenCalledWith(mockAppointments[0].id)
  })

  it("shows empty state when no appointments match filters", async () => {
    render(
      <AppointmentList
        appointments={mockAppointments}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    const searchInput = screen.getByPlaceholderText("Search appointments...")
    await userEvent.type(searchInput, "nonexistent appointment")

    expect(screen.getByText("No appointments found")).toBeInTheDocument()
  })

  it("handles appointments without notes", () => {
    const appointmentsWithoutNotes = [
      {
        id: "1",
        date: new Date("2025-08-20T10:00:00"),
        duration: 30,
        status: "SCHEDULED" as const,
      },
    ]

    render(
      <AppointmentList
        appointments={appointmentsWithoutNotes}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getByText(format(appointmentsWithoutNotes[0].date, "PPP p"))).toBeInTheDocument()
    expect(screen.getByText(`Duration: ${appointmentsWithoutNotes[0].duration} minutes`)).toBeInTheDocument()
  })

  describe("accessibility", () => {
    it("has correct ARIA labels and roles", () => {
      render(
        <AppointmentList
          appointments={mockAppointments}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      )

      // Check main section
      expect(screen.getByRole("region", { name: /appointments list/i })).toBeInTheDocument()

      // Check toolbar
      expect(screen.getByRole("toolbar", { name: /appointment filters and sorting/i })).toBeInTheDocument()

      // Check form controls
      expect(screen.getByLabelText(/search appointments/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/filter by status/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/sort appointments by/i)).toBeInTheDocument()

      // Check sort direction button
      const sortButton = screen.getByRole("button", { name: /sort (ascending|descending)/i })
      expect(sortButton).toBeInTheDocument()
      expect(sortButton).toHaveAttribute("aria-pressed")

      // Check appointments
      const articles = screen.getAllByRole("article")
      articles.forEach((article, index) => {
        expect(article).toHaveAttribute(
          "aria-labelledby",
          `appointment-${mockAppointments[index].id}-date`
        )
      })
    })

    it("maintains focus management when filtering and sorting", async () => {
      render(
        <AppointmentList
          appointments={mockAppointments}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      )

      // Test focus handling for search input
      const searchInput = screen.getByLabelText(/search appointments/i)
      await userEvent.type(searchInput, "checkup")
      expect(searchInput).toHaveFocus()

      // Test focus handling for status filter
      const statusSelect = screen.getByLabelText(/filter by status/i)
      await userEvent.click(statusSelect)
      expect(statusSelect).toHaveFocus()

      // Test focus handling for sort button
      const sortButton = screen.getByRole("button", { name: /sort (ascending|descending)/i })
      await userEvent.click(sortButton)
      expect(sortButton).toHaveFocus()
    })

    it("announces status changes appropriately", () => {
      render(
        <AppointmentList
          appointments={mockAppointments}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      )

      mockAppointments.forEach(appointment => {
        const statusElement = screen.getByText(appointment.status)
        const getStatusClass = (status: string) => {
          switch (status) {
            case "SCHEDULED":
              return "bg-blue-100"
            case "COMPLETED":
              return "bg-green-100"
            case "CANCELLED":
              return "bg-red-100"
            case "RESCHEDULED":
              return "bg-yellow-100"
            default:
              return "bg-gray-100"
          }
        }
        expect(statusElement).toHaveClass(getStatusClass(appointment.status))
      })
    })

    it("provides clear feedback when no results are found", async () => {
      render(
        <AppointmentList
          appointments={mockAppointments}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      )

      const searchInput = screen.getByLabelText(/search appointments/i)
      await userEvent.type(searchInput, "nonexistent")

      const noResultsMessage = screen.getByText(/no appointments found/i)
      expect(noResultsMessage).toBeInTheDocument()
      expect(noResultsMessage).toHaveClass("text-muted-foreground")
    })
  })
})
