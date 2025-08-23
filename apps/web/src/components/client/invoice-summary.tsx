// apps/web/src/components/client/invoice-summary.tsx
'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  DollarSign, 
  Calendar, 
  Download, 
  CreditCard, 
  AlertCircle,
  CheckCircle 
} from 'lucide-react'

interface Invoice {
  id: string
  invoiceNumber: string
  dateIssued: string
  dueDate: string
  amount: number
  status: 'paid' | 'pending' | 'overdue' | 'processing'
  servicesPeriod: {
    start: string
    end: string
  }
  hoursProvided: number
}

interface InvoiceSummaryProps {
  invoice: Invoice
  onPayNow?: () => void
  onDownload?: () => void
}

export function InvoiceSummary({ invoice, onPayNow, onDownload }: InvoiceSummaryProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'success'
      case 'pending': return 'default'
      case 'overdue': return 'destructive'
      case 'processing': return 'secondary'
      default: return 'default'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4" />
      case 'overdue': return <AlertCircle className="h-4 w-4" />
      default: return <DollarSign className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Invoice #{invoice.invoiceNumber}
          </CardTitle>
          <Badge variant={getStatusColor(invoice.status) as any} className="flex items-center gap-1">
            {getStatusIcon(invoice.status)}
            {invoice.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Date Issued:</span>
            <p className="font-medium">{new Date(invoice.dateIssued).toLocaleDateString()}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Due Date:</span>
            <p className="font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Service Period:</span>
            <p className="font-medium">
              {new Date(invoice.servicesPeriod.start).toLocaleDateString()} - {' '}
              {new Date(invoice.servicesPeriod.end).toLocaleDateString()}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Hours Provided:</span>
            <p className="font-medium">{invoice.hoursProvided} hours</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <span className="text-lg font-semibold">Total Amount:</span>
          <span className="text-2xl font-bold text-primary">
            ${invoice.amount.toFixed(2)}
          </span>
        </div>

        <div className="flex gap-2">
          {invoice.status === 'pending' && (
            <Button onClick={onPayNow} className="flex-1">
              <CreditCard className="h-4 w-4 mr-2" />
              Pay Now
            </Button>
          )}
          <Button variant="outline" onClick={onDownload} className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}