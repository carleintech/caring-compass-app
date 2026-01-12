'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarDays, CheckCircle2, Clock, Users } from 'lucide-react'
import { trpc } from '@/lib/trpc'

export default function AdminDashboardPage() {
  // Fetch real dashboard stats
  const { data: dashboardData, isLoading } = (trpc as any).admin.getDashboardStats.useQuery()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const stats = [
    {
      label: 'Active Caregivers',
      value: dashboardData?.caregivers?.active || 0,
      trend: `${dashboardData?.caregivers?.total || 0} total`,
      icon: Users,
    },
    {
      label: 'Active Clients',
      value: dashboardData?.clients?.active || 0,
      trend: `${dashboardData?.clients?.total || 0} total`,
      icon: CalendarDays,
    },
    {
      label: 'Visits Today',
      value: dashboardData?.visits?.today || 0,
      trend: 'scheduled visits',
      icon: Clock,
    },
    {
      label: 'Pending Invoices',
      value: dashboardData?.billing?.pendingInvoices || 0,
      trend: 'require attention',
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
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-slate-500">
                  {item.label}
                </CardTitle>
                <Icon className="h-4 w-4 text-indigo-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-slate-900">
                  {item.value}
                </div>
                <p className="text-xs text-emerald-600 mt-1">{item.trend}</p>
              </CardContent>
            </Card>
          )
        })}
      </section>

      {/* Two-column layout */}
      <section className="grid gap-6 lg:grid-cols-3">
        {/* Left: upcoming shifts & alerts */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-slate-900">
                Today&apos;s Schedule Snapshot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Placeholder rows – later, bind to TRPC */}
              {[
                {
                  client: 'Mrs. Johnson',
                  caregiver: 'Sarah M.',
                  time: '09:00–13:00',
                  status: 'In Progress',
                },
                {
                  client: 'Mr. Lopez',
                  caregiver: 'Daniel R.',
                  time: '10:00–12:00',
                  status: 'Open Shift',
                },
                {
                  client: 'Mr. Smith',
                  caregiver: 'Angela K.',
                  time: '14:00–18:00',
                  status: 'Assigned',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-3 text-sm"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900">
                      {item.client}
                    </span>
                    <span className="text-xs text-slate-500">
                      Caregiver: {item.caregiver}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500">{item.time}</div>
                    <span
                      className={
                        item.status === 'Open Shift'
                          ? 'inline-flex mt-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700'
                          : 'inline-flex mt-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700'
                      }
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-slate-900">
                Compliance & Documentation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-lg bg-amber-50 px-3 py-2">
                <div className="text-amber-800">
                  2 caregivers with expiring certifications in 30 days
                </div>
                <button className="text-xs font-medium text-amber-800 underline">
                  Review
                </button>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                <div className="text-slate-700">
                  1 client file missing signed HIPAA consent
                </div>
                <button className="text-xs font-medium text-indigo-700 underline">
                  View
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: quick actions */}
        <div className="space-y-4">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-slate-900">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <button className="w-full rounded-xl border border-slate-200 px-3 py-2 text-left hover:bg-slate-50 transition-colors">
                + Add new caregiver
              </button>
              <button className="w-full rounded-xl border border-slate-200 px-3 py-2 text-left hover:bg-slate-50 transition-colors">
                + Add new client intake
              </button>
              <button className="w-full rounded-xl border border-slate-200 px-3 py-2 text-left hover:bg-slate-50 transition-colors">
                View open shifts
              </button>
              <button className="w-full rounded-xl border border-slate-200 px-3 py-2 text-left hover:bg-slate-50 transition-colors">
                Download weekly report
              </button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
