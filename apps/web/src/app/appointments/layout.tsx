import { Toaster } from "@/components/ui/toaster"

export default function AppointmentsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen bg-background">
      {children}
      <Toaster />
    </div>
  )
}
