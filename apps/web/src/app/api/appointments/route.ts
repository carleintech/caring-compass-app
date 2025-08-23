import { auth } from "@caring-compass/auth"
import { db } from "@caring-compass/database"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
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

    const appointment = await db.appointment.create({
      data: {
        date: appointmentDate,
        duration,
        notes,
        createdById: session.user.id,
        status: "scheduled",
      },
    })

    return NextResponse.json(appointment)
  } catch (error) {
    console.error("Error creating appointment:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const start = searchParams.get("start")
    const end = searchParams.get("end")

    const appointments = await db.appointment.findMany({
      where: {
        date: {
          gte: start ? new Date(start) : undefined,
          lte: end ? new Date(end) : undefined,
        },
        OR: [
          { createdById: session.user.id },
          { caregiverId: session.user.id },
          { clientId: session.user.id },
        ],
      },
      include: {
        client: true,
        caregiver: true,
      },
    })

    return NextResponse.json(appointments)
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
