'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { 
  CreditCardIcon,
  DollarSignIcon,
  DownloadIcon,
  EyeIcon,
  CalendarIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  ClockIcon,
  PlusIcon,
  FileTextIcon,
  TrendingUpIcon,
  Wallet
} from 'lucide-react'

// Mock data - in real app, this would come from API
const mockBillingData = {
  account: {
    balance: 0,
    creditLimit: 5000,
    paymentMethod: {
      type: 'card',
      last4: '4242',
      brand: 'Visa',
      expiresAt: '12/26'
    },
    autoPayEnabled: true,
    nextPaymentDate: '2024-02-01',
    billingCycle: 'monthly'
  },
  invoices: [
    {
      id: 'INV-2024-001',
      date: '2024-01-15',
      dueDate: '2024-02-01',
      amount: 1240.00,
      status: 'pending',
      services: [
        { description: 'Personal Care Services', hours: 24, rate: 25.00, amount: 600.00 },
        { description: 'Companionship Services', hours: 12, rate: 22.00, amount: 264.00 },
        { description: 'Light Housekeeping', hours: 8, rate: 20.00, amount: 160.00 },
        { description: 'Transportation Services', hours: 6, rate: 18.00, amount: 108.00 },
        { description: 'Meal Preparation', hours: 10, rate: 20.00, amount: 200.00 }
      ],
      subtotal: 1332.00,
      discounts: 92.00,
      taxes: 0,
      total: 1240.00,
      billingPeriod: 'January 1-15, 2024'
    },
    {
      id: 'INV-2023-012',
      date: '2023-12-31',
      dueDate: '2024-01-15',
      amount: 1890.50,
      status: 'paid',
      paidDate: '2024-01-10',
      services: [
        { description: 'Personal Care Services', hours: 40, rate: 25.00, amount: 1000.00 },
        { description: 'Companionship Services', hours: 20, rate: 22.00, amount: 440.00 },
        { description: 'Light Housekeeping', hours: 16, rate: 20.00, amount: 320.00 },
        { description: 'Holiday Premium (Dec 25)', hours: 4, rate: 37.50, amount: 150.00 }
      ],
      subtotal: 1910.00,
      discounts: 19.50,
      taxes: 0,
      total: 1890.50,
      billingPeriod: 'December 2023'
    },
    {
      id: 'INV-2023-011',
      date: '2023-11-30',
      dueDate: '2023-12-15',
      amount: 1456.75,
      status: 'paid',
      paidDate: '2023-12-12',
      services: [
        { description: 'Personal Care Services', hours: 32, rate: 25.00, amount: 800.00 },
        { description: 'Companionship Services', hours: 16, rate: 22.00, amount: 352.00 },
        { description: 'Light Housekeeping', hours: 12, rate: 20.00, amount: 240.00 },
        { description: 'Transportation Services', hours: 8, rate: 18.00, amount: 144.00 }
      ],
      subtotal: 1536.00,
      discounts: 79.25,
      taxes: 0,
      total: 1456.75,
      billingPeriod: 'November 2023'
    }
  ],
  paymentMethods: [
    {
      id: 'pm_1',
      type: 'card',
      brand: 'Visa',
      last4: '4242',
      expiresAt: '12/26',
      isDefault: true
    },
    {
      id: 'pm_2',
      type: 'bank',
      bankName: 'Wells Fargo',
      last4: '1234',
      accountType: 'Checking',
      isDefault: false
    }
  ],
  paymentHistory: [
    {
      id: 'pay_001',
      date: '2024-01-10',
      amount: 1890.50,
      method: 'Visa ****4242',
      status: 'completed',
      invoiceId: 'INV-2023-012'
    },
    {
      id: 'pay_002',
      date: '2023-12-12',
      amount: 1456.75,
      method: 'Visa ****4242',
      status: 'completed',
      invoiceId: 'INV-2023-011'
    },
    {
      id: 'pay_003',
      date: '2023-11-08',
      amount: 1320.00,
      method: 'Wells Fargo ****1234',
      status: 'completed',
      invoiceId: 'INV-2023-010'
    }
  ]
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'paid': return 'bg-green-100 text-green-800'
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    case 'overdue': return 'bg-red-100 text-red-800'
    case 'processing': return 'bg-blue-100 text-blue-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'paid': return <CheckCircleIcon className="h-4 w-4" />
    case 'pending': return <ClockIcon className="h-4 w-4" />
    case 'overdue': return <AlertCircleIcon className="h-4 w-4" />
    case 'processing': return <ClockIcon className="h-4 w-4" />
    default: return <FileTextIcon className="h-4 w-4" />
  }
}

const InvoiceDetailsDialog = ({ invoice }: any) => {
  return (
    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Invoice {invoice.id}</DialogTitle>
        <DialogDescription>
          Billing period: {invoice.billingPeriod}
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-6">
        {/* Invoice Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">Caring Compass Home Care LLC</h3>
            <p className="text-sm text-gray-600">Virginia Beach, VA 23451</p>
            <p className="text-sm text-gray-600">Phone: (757) 555-0123</p>
          </div>
          <div className="text-right">
            <Badge className={getStatusColor(invoice.status)}>
              {getStatusIcon(invoice.status)}
              <span className="ml-1">{invoice.status.toUpperCase()}</span>
            </Badge>
            <p className="text-sm text-gray-600 mt-2">Invoice Date: {invoice.date}</p>
            <p className="text-sm text-gray-600">Due Date: {invoice.dueDate}</p>
            {invoice.paidDate && (
              <p className="text-sm text-green-600">Paid: {invoice.paidDate}</p>
            )}
          </div>
        </div>

        {/* Services Table */}
        <div>
          <h4 className="font-medium mb-3">Service Details</h4>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 text-sm font-medium">Service</th>
                  <th className="text-right p-3 text-sm font-medium">Hours</th>
                  <th className="text-right p-3 text-sm font-medium">Rate</th>
                  <th className="text-right p-3 text-sm font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.services.map((service: any, index: number) => (
                  <tr key={index} className="border-t">
                    <td className="p-3">{service.description}</td>
                    <td className="p-3 text-right">{service.hours}</td>
                    <td className="p-3 text-right">${service.rate.toFixed(2)}</td>
                    <td className="p-3 text-right">${service.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="border-t pt-4">
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${invoice.subtotal.toFixed(2)}</span>
              </div>
              {invoice.discounts > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discounts:</span>
                  <span>-${invoice.discounts.toFixed(2)}</span>
                </div>
              )}
              {invoice.taxes > 0 && (
                <div className="flex justify-between">
                  <span>Taxes:</span>
                  <span>${invoice.taxes.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>${invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between">
          <Button variant="outline">
            <DownloadIcon className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          
          {invoice.status === 'pending' && (
            <Button>
              <CreditCardIcon className="h-4 w-4 mr-2" />
              Pay Now
            </Button>
          )}
        </div>
      </div>
    </DialogContent>
  )
}

const PaymentMethodCard = ({ method, isDefault }: any) => {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {method.type === 'card' ? (
            <CreditCardIcon className="h-8 w-8 text-gray-400" />
          ) : (
            <Wallet className="h-8 w-8 text-gray-400" />
          )}
          <div>
            {method.type === 'card' ? (
              <>
                <p className="font-medium">{method.brand} ****{method.last4}</p>
                <p className="text-sm text-gray-600">Expires {method.expiresAt}</p>
              </>
            ) : (
              <>
                <p className="font-medium">{method.bankName} ****{method.last4}</p>
                <p className="text-sm text-gray-600">{method.accountType} Account</p>
              </>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {isDefault && (
            <Badge variant="secondary">Default</Badge>
          )}
          <Button variant="outline" size="sm">
            Edit
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState('invoices')
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(null)

  const pendingInvoices = mockBillingData.invoices.filter(inv => inv.status === 'pending')
  const paidInvoices = mockBillingData.invoices.filter(inv => inv.status === 'paid')
  const totalPending = pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Billing & Payments</h1>
          <p className="text-gray-600 mt-1">
            Manage your invoices and payment methods
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <DownloadIcon className="h-4 w-4 mr-2" />
            Download Statements
          </Button>
          <Button size="sm">
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Payment Method
          </Button>
        </div>
      </div>

      {/* Account Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mockBillingData.account.balance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              All caught up!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPending.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Due {mockBillingData.account.nextPaymentDate}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Method</CardTitle>
            <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockBillingData.account.paymentMethod.brand} ****{mockBillingData.account.paymentMethod.last4}
            </div>
            <p className="text-xs text-muted-foreground">
              Auto-pay {mockBillingData.account.autoPayEnabled ? 'enabled' : 'disabled'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,240</div>
            <p className="text-xs text-muted-foreground">
              50 hours of care
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Outstanding Balance Alert */}
      {totalPending > 0 && (
        <Alert>
          <AlertCircleIcon className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              You have ${totalPending.toFixed(2)} pending. Payment is due on {mockBillingData.account.nextPaymentDate}.
            </span>
            <Button size="sm" onClick={() => setIsPaymentDialogOpen(true)}>
              Pay Now
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="settings">Billing Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Invoices</CardTitle>
              <CardDescription>
                View and manage your care service invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockBillingData.invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <Badge className={getStatusColor(invoice.status)}>
                          {getStatusIcon(invoice.status)}
                          <span className="ml-1">{invoice.status.toUpperCase()}</span>
                        </Badge>
                      </div>
                      <div>
                        <h3 className="font-semibold">{invoice.id}</h3>
                        <p className="text-sm text-gray-600">{invoice.billingPeriod}</p>
                        <p className="text-xs text-gray-500">
                          Issued: {invoice.date} • Due: {invoice.dueDate}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-bold text-lg">${invoice.amount.toFixed(2)}</p>
                        {invoice.status === 'paid' && invoice.paidDate && (
                          <p className="text-xs text-green-600">Paid on {invoice.paidDate}</p>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <EyeIcon className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </DialogTrigger>
                          <InvoiceDetailsDialog invoice={invoice} />
                        </Dialog>
                        
                        <Button variant="outline" size="sm">
                          <DownloadIcon className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        
                        {invoice.status === 'pending' && (
                          <Button size="sm">
                            <CreditCardIcon className="h-4 w-4 mr-1" />
                            Pay
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>
                Track all your payment transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockBillingData.paymentHistory.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <CheckCircleIcon className="h-8 w-8 text-green-500" />
                      <div>
                        <h3 className="font-semibold">Payment to Invoice {payment.invoiceId}</h3>
                        <p className="text-sm text-gray-600">{payment.method}</p>
                        <p className="text-xs text-gray-500">{payment.date}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold text-lg">${payment.amount.toFixed(2)}</p>
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="methods" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Manage your saved payment methods
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockBillingData.paymentMethods.map((method) => (
                  <PaymentMethodCard 
                    key={method.id} 
                    method={method} 
                    isDefault={method.isDefault} 
                  />
                ))}
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <CreditCardIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Add Payment Method</h3>
                  <p className="text-gray-500 mb-4">Add a credit card or bank account for payments</p>
                  <Button>
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Payment Method
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing Settings</CardTitle>
              <CardDescription>
                Configure your billing preferences and notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="billingCycle">Billing Cycle</Label>
                  <Select defaultValue={mockBillingData.account.billingCycle}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Auto-pay</h3>
                    <p className="text-sm text-gray-600">
                      Automatically pay invoices when they&apos;re due
                    </p>
                  </div>
                  <Button variant={mockBillingData.account.autoPayEnabled ? "default" : "outline"}>
                    {mockBillingData.account.autoPayEnabled ? "Enabled" : "Disabled"}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-gray-600">
                      Get notified about new invoices and payment confirmations
                    </p>
                  </div>
                  <Button variant="default">
                    Enabled
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">SMS Notifications</h3>
                    <p className="text-sm text-gray-600">
                      Get text reminders about upcoming payments
                    </p>
                  </div>
                  <Button variant="outline">
                    Disabled
                  </Button>
                </div>
              </div>

              <div className="pt-6 border-t">
                <Button className="w-full">
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Make Payment</DialogTitle>
            <DialogDescription>
              Pay your outstanding balance of ${totalPending.toFixed(2)}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select defaultValue="pm_1">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pm_1">Visa ****4242</SelectItem>
                  <SelectItem value="pm_2">Wells Fargo ****1234</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Payment Amount</Label>
              <Input
                id="amount"
                type="number"
                defaultValue={totalPending.toFixed(2)}
                min="0.01"
                step="0.01"
              />
            </div>

            <Alert>
              <CheckCircleIcon className="h-4 w-4" />
              <AlertDescription>
                Your payment will be processed securely using 256-bit SSL encryption.
              </AlertDescription>
            </Alert>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsPaymentDialogOpen(false)}>
                <CreditCardIcon className="h-4 w-4 mr-2" />
                Pay ${totalPending.toFixed(2)}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}