// apps/web/src/components/caregiver/certification-status.tsx
'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Award, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Calendar,
  Download
} from 'lucide-react'

interface CertificationStatusProps {
  certifications: Array<{
    id: string
    name: string
    status: 'active' | 'expiring' | 'expired'
    expirationDate: string
    daysToExpiration: number
    issuer: string
  }>
}

export function CertificationStatus({ certifications }: CertificationStatusProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success'
      case 'expiring': return 'secondary'
      case 'expired': return 'destructive'
      default: return 'outline'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />
      case 'expiring': return <Clock className="h-4 w-4" />
      case 'expired': return <AlertTriangle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const activeCerts = certifications.filter(c => c.status === 'active').length
  const expiringCerts = certifications.filter(c => c.status === 'expiring').length
  const expiredCerts = certifications.filter(c => c.status === 'expired').length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Certification Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <p className="text-2xl font-bold text-green-600">{activeCerts}</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-yellow-600">{expiringCerts}</p>
            <p className="text-xs text-muted-foreground">Expiring Soon</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-red-600">{expiredCerts}</p>
            <p className="text-xs text-muted-foreground">Expired</p>
          </div>
        </div>

        {/* Certification List */}
        <div className="space-y-3">
          {certifications.map((cert) => (
            <div key={cert.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`p-1 rounded-full ${
                  cert.status === 'active' ? 'bg-green-100 text-green-600' :
                  cert.status === 'expiring' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  {getStatusIcon(cert.status)}
                </div>
                <div>
                  <p className="font-medium text-sm">{cert.name}</p>
                  <p className="text-xs text-muted-foreground">{cert.issuer}</p>
                  <p className="text-xs text-muted-foreground">
                    Expires: {new Date(cert.expirationDate).toLocaleDateString()}
                    {cert.status === 'expiring' && ` (${cert.daysToExpiration} days)`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={getStatusColor(cert.status) as any}>
                  {cert.status}
                </Badge>
                {cert.status === 'expired' || cert.status === 'expiring' ? (
                  <Button size="sm" variant={cert.status === 'expired' ? 'destructive' : 'default'}>
                    Renew
                  </Button>
                ) : (
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {expiredCerts > 0 && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <p className="font-medium text-red-900">Action Required</p>
                <p className="text-sm text-red-800">
                  You have {expiredCerts} expired certification{expiredCerts > 1 ? 's' : ''}. 
                  Please renew immediately to continue providing care.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}