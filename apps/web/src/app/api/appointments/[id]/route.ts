import { auth } from "@caring-compass/auth"
import { db } from "@caring-compass/database"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const appointment = await db.appointment.findUnique({
      where: { id: params.id },
      include: {
        client: true,
        caregiver: true,
      },
    })

    if (!appointment) {
      return new NextResponse("Appointment not found", { status: 404 })
    }

    return NextResponse.json(appointment)
  } catch (error) {
    console.error("Error fetching appointment:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const data = await req.json()
    const { date, time, duration, notes } = data

    // Convert date and time strings to a Date object
    const appointmentDate = new Date(date)
    const [hours, minutes] = time.split(":")
    appointmentDate.setHours(parseInt(hours), parseInt(minutes))

    const appointment = await db.appointment.update({
      where: { id: params.id },
      data: {
        date: appointmentDate,
        duration,
        notes,
      },
    })

    return NextResponse.json(appointment)
  } catch (error) {
    console.error("Error updating appointment:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    await db.appointment.delete({
      where: { id: params.id },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error deleting appointment:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
