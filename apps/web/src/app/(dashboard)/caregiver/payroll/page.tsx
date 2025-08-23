'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  DollarSign, 
  Download, 
  Clock, 
  TrendingUp, 
  Calendar, 
  FileText,
  Eye,
  Receipt,
  Calculator,
  MapPin,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

// Mock data for payroll information
const mockPayStubs = [
  {
    id: '1',
    payPeriod: {
      start: '2025-01-13',
      end: '2025-01-19'
    },
    payDate: '2025-01-24',
    status: 'paid',
    hours: {
      regular: 32,
      overtime: 0,
      holiday: 0,
      total: 32
    },
    rates: {
      regular: 24.00,
      overtime: 36.00,
      holiday: 48.00
    },
    earnings: {
      gross: 768.00,
      net: 621.44,
      deductions: 146.56
    },
    shifts: 8,
    mileage: {
      miles: 45,
      rate: 0.65,
      reimbursement: 29.25
    }
  },
  {
    id: '2',
    payPeriod: {
      start: '2025-01-06',
      end: '2025-01-12'
    },
    payDate: '2025-01-17',
    status: 'paid',
    hours: {
      regular: 28,
      overtime: 4,
      holiday: 0,
      total: 32
    },
    rates: {
      regular: 24.00,
      overtime: 36.00,
      holiday: 48.00
    },
    earnings: {
      gross: 816.00,
      net: 657.92,
      deductions: 158.08
    },
    shifts: 7,
    mileage: {
      miles: 52,
      rate: 0.65,
      reimbursement: 33.80
    }
  },
  {
    id: '3',
    payPeriod: {
      start: '2024-12-30',
      end: '2025-01-05'
    },
    payDate: '2025-01-10',
    status: 'paid',
    hours: {
      regular: 30,
      overtime: 0,
      holiday: 8,
      total: 38
    },
    rates: {
      regular: 24.00,
      overtime: 36.00,
      holiday: 48.00
    },
    earnings: {
      gross: 1104.00,
      net: 880.20,
      deductions: 223.80
    },
    shifts: 9,
    mileage: {
      miles: 68,
      rate: 0.65,
      reimbursement: 44.20
    }
  }
]

const mockCurrentEarnings = {
  currentPeriod: {
    start: '2025-01-20',
    end: '2025-01-26'
  },
  hoursWorked: 18,
  estimatedGross: 432.00,
  shiftsCompleted: 4,
  pendingHours: 6
}

const mockYearToDate = {
  totalEarnings: 2688.00,
  totalHours: 198,
  averageWeekly: 672.00,
  shiftsCompleted: 67,
  mileageReimbursed: 214.50,
  totalMiles: 330
}

const mockTaxDocuments = [
  {
    id: '1',
    year: 2024,
    type: 'W-2',
    status: 'available',
    dateIssued: '2025-01-15'
  },
  {
    id: '2',
    year: 2024,
    type: '1099-NEC',
    status: 'available',
    dateIssued: '2025-01-15'
  }
]

export default function PayrollPage() {
  const [selectedYear, setSelectedYear] = useState('2025')
  const [selectedPeriod, setSelectedPeriod] = useState('all')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'success'
      case 'pending': return 'secondary'
      case 'processing': return 'default'
      default: return 'outline'
    }
  }

  const calculateTotalDeductions = (earnings: any) => {
    return {
      federalTax: earnings.gross * 0.12,
      stateTax: earnings.gross * 0.05,
      socialSecurity: earnings.gross * 0.062,
      medicare: earnings.gross * 0.0145,
      other: 0
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Payroll & Earnings</h1>
          <p className="text-muted-foreground">
            View your pay stubs, earnings history, and tax documents
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Period</p>
                <p className="text-2xl font-bold">${mockCurrentEarnings.estimatedGross}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {mockCurrentEarnings.hoursWorked}h worked • {mockCurrentEarnings.shiftsCompleted} shifts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Year to Date</p>
                <p className="text-2xl font-bold">${mockYearToDate.totalEarnings.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {mockYearToDate.totalHours}h total • {mockYearToDate.shiftsCompleted} shifts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Weekly Average</p>
                <p className="text-2xl font-bold">${mockYearToDate.averageWeekly}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Based on last 4 weeks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Mileage YTD</p>
                <p className="text-2xl font-bold">${mockYearToDate.mileageReimbursed}</p>
              </div>
              <MapPin className="h-8 w-8 text-orange-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {mockYearToDate.totalMiles} miles
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="paystubs" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="paystubs">Pay Stubs</TabsTrigger>
          <TabsTrigger value="current">Current Period</TabsTrigger>
          <TabsTrigger value="summary">Earnings Summary</TabsTrigger>
          <TabsTrigger value="taxes">Tax Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="paystubs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Pay Stub History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPayStubs.map((payStub) => (
                  <div key={payStub.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">
                            Pay Period: {new Date(payStub.payPeriod.start).toLocaleDateString()} - {new Date(payStub.payPeriod.end).toLocaleDateString()}
                          </h3>
                          <Badge variant={getStatusColor(payStub.status) as any}>
                            {payStub.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Paid on {new Date(payStub.payDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">${payStub.earnings.net}</p>
                        <p className="text-sm text-muted-foreground">Net Pay</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Total Hours:</span>
                        <p className="font-medium">{payStub.hours.total}h</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Gross Pay:</span>
                        <p className="font-medium">${payStub.earnings.gross}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Deductions:</span>
                        <p className="font-medium">${payStub.earnings.deductions}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Shifts:</span>
                        <p className="font-medium">{payStub.shifts}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t">
                      <div className="text-sm text-muted-foreground">
                        Regular: {payStub.hours.regular}h @ ${payStub.rates.regular}/hr
                        {payStub.hours.overtime > 0 && ` • OT: ${payStub.hours.overtime}h @ $${payStub.rates.overtime}/hr`}
                        {payStub.hours.holiday > 0 && ` • Holiday: ${payStub.hours.holiday}h @ $${payStub.rates.holiday}/hr`}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="current" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Current Pay Period
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div>
                  <p className="font-medium text-blue-900">
                    Pay Period: {new Date(mockCurrentEarnings.currentPeriod.start).toLocaleDateString()} - {new Date(mockCurrentEarnings.currentPeriod.end).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-blue-700">
                    Next payday: {new Date('2025-01-31').toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-900">${mockCurrentEarnings.estimatedGross}</p>
                  <p className="text-sm text-blue-700">Estimated Gross</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Hours Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Hours Worked:</span>
                      <span className="font-medium">{mockCurrentEarnings.hoursWorked}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pending Hours:</span>
                      <span className="font-medium text-yellow-600">{mockCurrentEarnings.pendingHours}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shifts Completed:</span>
                      <span className="font-medium">{mockCurrentEarnings.shiftsCompleted}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-medium">Total Hours:</span>
                      <span className="font-bold">{mockCurrentEarnings.hoursWorked + mockCurrentEarnings.pendingHours}h</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Earnings Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Regular Hours:</span>
                      <span className="font-medium">${(mockCurrentEarnings.hoursWorked * 24).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Overtime Hours:</span>
                      <span className="font-medium">$0.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Holiday Hours:</span>
                      <span className="font-medium">$0.00</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-medium">Estimated Gross:</span>
                      <span className="font-bold">${mockCurrentEarnings.estimatedGross}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800">Pending Hours</p>
                    <p className="text-sm text-yellow-700">
                      You have {mockCurrentEarnings.pendingHours} hours pending approval. These will be included in your next paycheck once approved by your coordinator.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Earnings Summary - {selectedYear}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Total Earnings</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Regular Hours:</span>
                      <span className="font-medium">${(mockYearToDate.totalHours * 24).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Overtime Premium:</span>
                      <span className="font-medium">$624.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Holiday Premium:</span>
                      <span className="font-medium">$384.00</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-medium">Total Gross:</span>
                      <span className="font-bold">${mockYearToDate.totalEarnings.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Hours Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Regular Hours:</span>
                      <span className="font-medium">{mockYearToDate.totalHours - 26}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Overtime Hours:</span>
                      <span className="font-medium">18h</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Holiday Hours:</span>
                      <span className="font-medium">8h</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-medium">Total Hours:</span>
                      <span className="font-bold">{mockYearToDate.totalHours}h</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Additional Compensation</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Mileage Reimbursement:</span>
                      <span className="font-medium">${mockYearToDate.mileageReimbursed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Performance Bonuses:</span>
                      <span className="font-medium">$150.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Referral Bonuses:</span>
                      <span className="font-medium">$100.00</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-medium">Total Additional:</span>
                      <span className="font-bold">$464.50</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h4 className="font-medium text-green-900">Performance Summary</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-green-700">Average Rating:</span>
                    <p className="font-medium text-green-900">4.8/5.0</p>
                  </div>
                  <div>
                    <span className="text-green-700">On-Time Rate:</span>
                    <p className="font-medium text-green-900">98.5%</p>
                  </div>
                  <div>
                    <span className="text-green-700">Completion Rate:</span>
                    <p className="font-medium text-green-900">99.2%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="taxes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Tax Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockTaxDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{doc.type} - {doc.year}</span>
                      <Badge variant={doc.status === 'available' ? 'success' : 'secondary'}>
                        {doc.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Issued: {new Date(doc.dateIssued).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">Tax Information</p>
                    <p className="text-sm text-blue-800">
                      Tax documents are typically available by January 31st. Please consult with a tax professional for guidance on filing your taxes.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}