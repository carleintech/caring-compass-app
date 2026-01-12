'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarDays, CheckCircle2, Clock, Users } from 'lucide-react'
import { trpc } from '@/lib/trpc'

export default function CoordinatorDashboardPage() {
  // Fetch real dashboard stats for coordinator
  const { data: dashboardData, isLoading: statsLoading } = (trpc as any).coordinator.getDashboardStats.useQuery()
  const { data: visitsData } = (trpc as any).coordinator.getTodayVisits.useQuery()

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-2 border-sky-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-600">Loading coordinator dashboard...</p>
        </div>
      </div>
    )
  }

  const stats = [
    {
      label: 'Caregivers Assigned',
      value: dashboardData?.caregivers || 0,
      sub: 'under your supervision',
      icon: Users,
    },
    {
      label: 'Clients Managed',
      value: dashboardData?.clients || 0,
      sub: 'active care plans',
      icon: CalendarDays,
    },
    {
      label: 'Visits Today',
      value: dashboardData?.visitsToday || 0,
      sub: `${visitsData?.filter((v: any) => v.status === 'SCHEDULED').length || 0} not started`,
      icon: Clock,
    },
    {
      label: 'Scheduled Visits',
      value: dashboardData?.tasks || 0,
      sub: 'upcoming assignments',
      icon: CheckCircle2,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Stats */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon
          return (
            <Card key={item.label} className="border-none shadow-sm bg-white">
              <CardHeader className="space-y-1 pb-2">
                <CardTitle className="text-xs font-medium text-slate-500">
                  {item.label}
                </CardTitle>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-semibold text-slate-900">
                    {item.value}
                  </div>
                  <Icon className="h-4 w-4 text-sky-500" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-500">{item.sub}</p>
              </CardContent>
            </Card>
          )
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {/* Left: Today's visits */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-slate-900">
                Today&apos;s Visits (Your Team)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {visitsData && visitsData.length > 0 ? (
                visitsData.map((visit: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-3"
                  >
                    <div>
                      <p className="font-medium text-slate-900">
                        {visit.caregiver}
                      </p>
                      <p className="text-xs text-slate-500">
                        Client: {visit.client}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">{visit.time}</p>
                      <span
                        className={
                          visit.status === 'SCHEDULED'
                            ? 'inline-flex mt-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700'
                            : visit.status === 'IN_PROGRESS'
                            ? 'inline-flex mt-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700'
                            : 'inline-flex mt-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700'
                        }
                      >
                        {visit.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500">
                  No visits scheduled for today
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-slate-900">
                Follow-ups & Issues
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="rounded-lg bg-rose-50 px-3 py-2 text-rose-800">
                Missed visit yesterday · Client: Mrs. Brooks · Caregiver: TBA
              </div>
              <div className="rounded-lg bg-amber-50 px-3 py-2 text-amber-800">
                Late clock-in today · Client: Mr. Lopez · Caregiver: James
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: coordinator tasks */}
        <div className="space-y-4">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-slate-900">
                Your Tasks Today
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <button className="w-full rounded-xl border border-slate-200 px-3 py-2 text-left hover:bg-slate-50 transition-colors">
                Call family of Mrs. Johnson to confirm new schedule
              </button>
              <button className="w-full rounded-xl border border-slate-200 px-3 py-2 text-left hover:bg-slate-50 transition-colors">
                Assign caregiver for Saturday open shift
              </button>
              <button className="w-full rounded-xl border border-slate-200 px-3 py-2 text-left hover:bg-slate-50 transition-colors">
                Review notes from Emily&apos;s last three visits
              </button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
