import { render, screen } from "@testing-library/react"
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

  describe("keyboard navigation", () => {
    it("supports keyboard navigation through appointments", async () => {
      render(
        <AppointmentList
          appointments={mockAppointments}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      )

      // Tab to the search input
      await userEvent.tab()
      expect(screen.getByLabelText(/search appointments/i)).toHaveFocus()

      // Tab to status filter
      await userEvent.tab()
      expect(screen.getByLabelText(/filter by status/i)).toHaveFocus()

      // Tab to sort field
      await userEvent.tab()
      expect(screen.getByLabelText(/sort appointments by/i)).toHaveFocus()

      // Tab to sort direction button
      await userEvent.tab()
      expect(screen.getByRole("button", { name: /sort (ascending|descending)/i })).toHaveFocus()

      // Tab through edit buttons
      for (const appointment of mockAppointments) {
        await userEvent.tab()
        const editButton = screen.getByRole("button", {
          name: new RegExp(`Edit appointment on ${format(appointment.date, "PPP p")}`, "i")
        })
        expect(editButton).toHaveFocus()
      }

      // Tab through delete buttons
      for (const appointment of mockAppointments) {
        await userEvent.tab()
        const deleteButton = screen.getByRole("button", {
          name: new RegExp(`Delete appointment on ${format(appointment.date, "PPP p")}`, "i")
        })
        expect(deleteButton).toHaveFocus()
      }
    })

    it("triggers actions with keyboard", async () => {
      render(
        <AppointmentList
          appointments={mockAppointments}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      )

      // Test Edit button with Enter key
      const editButton = screen.getAllByRole("button", { name: /edit appointment/i })[0]
      editButton.focus()
      await userEvent.keyboard("{Enter}")
      expect(mockOnEdit).toHaveBeenCalledWith(mockAppointments[0])

      // Test Edit button with Space key
      await userEvent.keyboard(" ")
      expect(mockOnEdit).toHaveBeenCalledTimes(2)

      // Test Delete button with Enter key
      const deleteButton = screen.getAllByRole("button", { name: /delete appointment/i })[0]
      deleteButton.focus()
      await userEvent.keyboard("{Enter}")
      expect(mockOnDelete).toHaveBeenCalledWith(mockAppointments[0].id)

      // Test Delete button with Space key
      await userEvent.keyboard(" ")
      expect(mockOnDelete).toHaveBeenCalledTimes(2)
    })

    it("supports keyboard navigation in filter dropdowns", async () => {
      render(
        <AppointmentList
          appointments={mockAppointments}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      )

      // Open status filter with keyboard
      const statusFilter = screen.getByLabelText(/filter by status/i)
      statusFilter.focus()
      await userEvent.keyboard("{Enter}")
      
      // Navigate through options
      await userEvent.keyboard("{ArrowDown}")
      expect(screen.getByRole("option", { name: "Scheduled" })).toHaveFocus()
      
      await userEvent.keyboard("{ArrowDown}")
      expect(screen.getByRole("option", { name: "Completed" })).toHaveFocus()

      // Select option with Enter
      await userEvent.keyboard("{Enter}")
      expect(screen.queryByText("Regular checkup")).not.toBeInTheDocument()
      expect(screen.getByText("Follow-up appointment")).toBeInTheDocument()
    })

    it("handles keyboard shortcuts for sorting", async () => {
      render(
        <AppointmentList
          appointments={mockAppointments}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      )

      const sortButton = screen.getByRole("button", { name: /sort (ascending|descending)/i })
      sortButton.focus()

      // Toggle sort direction with space
      await userEvent.keyboard(" ")
      expect(sortButton.getAttribute("aria-pressed")).toBe("false")

      // Toggle back with enter
      await userEvent.keyboard("{Enter}")
      expect(sortButton.getAttribute("aria-pressed")).toBe("true")
    })
  })

  describe("screen reader announcements", () => {
    it("announces filter changes", async () => {
      render(
        <AppointmentList
          appointments={mockAppointments}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      )

      const statusSelect = screen.getByLabelText(/filter by status/i)
      await userEvent.click(statusSelect)
      await userEvent.click(screen.getByRole("option", { name: "Completed" }))

      // Verify the status announcement
      const statusIndicator = screen.getByRole("status", {
        name: /appointment status: completed/i
      })
      expect(statusIndicator).toBeInTheDocument()
    })

    it("announces sort changes", async () => {
      render(
        <AppointmentList
          appointments={mockAppointments}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      )

      const sortButton = screen.getByRole("button", { name: /sort (ascending|descending)/i })
      await userEvent.click(sortButton)

      expect(sortButton).toHaveAccessibleDescription(/descending/i)
    })

    it("announces when no results are found", async () => {
      render(
        <AppointmentList
          appointments={mockAppointments}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      )

      const searchInput = screen.getByLabelText(/search appointments/i)
      await userEvent.type(searchInput, "nonexistent")

      const noResults = screen.getByText(/no appointments found/i)
      expect(noResults).toHaveAttribute("role", "alert")
    })
  })
})
