'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { 
  FileTextIcon,
  DownloadIcon,
  UploadIcon,
  EyeIcon,
  SearchIcon,
  FilterIcon,
  FileIcon,
  ImageIcon,
  PdfIcon,
  FolderIcon,
  CalendarIcon,
  UserIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  ClockIcon,
  PlusIcon,
  ShareIcon,
  EditIcon,
  TrashIcon,
  MoreVerticalIcon
} from 'lucide-react'

// Mock data - in real app, this would come from API
const mockDocuments = [
  {
    id: 'doc_001',
    name: 'Service Agreement - Signed',
    type: 'agreement',
    category: 'Contracts',
    fileType: 'pdf',
    size: 245760, // bytes
    uploadedAt: '2024-01-15T10:30:00Z',
    uploadedBy: {
      name: 'Maria Rodriguez',
      role: 'Care Coordinator'
    },
    status: 'signed',
    isRequired: true,
    expiresAt: '2025-01-15T00:00:00Z',
    description: 'Main service agreement outlining care services and terms',
    accessLevel: 'client_family',
    tags: ['signed', 'contract', 'active']
  },
  {
    id: 'doc_002',
    name: 'Insurance Authorization Form',
    type: 'insurance',
    category: 'Insurance',
    fileType: 'pdf',
    size: 156420,
    uploadedAt: '2024-01-12T14:15:00Z',
    uploadedBy: {
      name: 'Robert Johnson',
      role: 'Client'
    },
    status: 'pending_review',
    isRequired: true,
    expiresAt: null,
    description: 'Long-term care insurance authorization for services',
    accessLevel: 'client_family',
    tags: ['insurance', 'pending']
  },
  {
    id: 'doc_003',
    name: 'Emergency Contact Information',
    type: 'emergency_info',
    category: 'Personal',
    fileType: 'pdf',
    size: 89640,
    uploadedAt: '2024-01-10T09:45:00Z',
    uploadedBy: {
      name: 'Robert Johnson',
      role: 'Client'
    },
    status: 'approved',
    isRequired: true,
    expiresAt: null,
    description: 'Emergency contacts and medical information',
    accessLevel: 'care_team',
    tags: ['emergency', 'personal', 'approved']
  },
  {
    id: 'doc_004',
    name: 'Medication List - Updated',
    type: 'medical',
    category: 'Medical',
    fileType: 'pdf',
    size: 125890,
    uploadedAt: '2024-01-18T16:20:00Z',
    uploadedBy: {
      name: 'Sarah Martinez',
      role: 'Caregiver'
    },
    status: 'current',
    isRequired: false,
    expiresAt: '2024-04-18T00:00:00Z',
    description: 'Current medication list from Dr. Smith',
    accessLevel: 'care_team',
    tags: ['medical', 'medication', 'current']
  },
  {
    id: 'doc_005',
    name: 'HIPAA Privacy Notice',
    type: 'legal',
    category: 'Legal',
    fileType: 'pdf',
    size: 310240,
    uploadedAt: '2024-01-08T11:00:00Z',
    uploadedBy: {
      name: 'Maria Rodriguez',
      role: 'Care Coordinator'
    },
    status: 'acknowledged',
    isRequired: true,
    expiresAt: null,
    description: 'HIPAA privacy practices and client rights',
    accessLevel: 'client_family',
    tags: ['hipaa', 'legal', 'acknowledged']
  },
  {
    id: 'doc_006',
    name: 'Care Plan Assessment Photos',
    type: 'assessment',
    category: 'Care Plans',
    fileType: 'zip',
    size: 5240000,
    uploadedAt: '2024-01-16T13:30:00Z',
    uploadedBy: {
      name: 'Maria Rodriguez',
      role: 'Care Coordinator'
    },
    status: 'archived',
    isRequired: false,
    expiresAt: null,
    description: 'Home safety assessment photos and notes',
    accessLevel: 'care_team',
    tags: ['assessment', 'photos', 'safety']
  }
]

const documentCategories = [
  'All Documents',
  'Contracts',
  'Insurance', 
  'Medical',
  'Personal',
  'Legal',
  'Care Plans'
]

const getFileIcon = (fileType: string) => {
  switch (fileType.toLowerCase()) {
    case 'pdf':
      return <PdfIcon className="h-8 w-8 text-red-500" />
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return <ImageIcon className="h-8 w-8 text-blue-500" />
    default:
      return <FileIcon className="h-8 w-8 text-gray-500" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'signed':
    case 'approved':
    case 'current':
      return 'bg-green-100 text-green-800'
    case 'pending_review':
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'expired':
    case 'rejected':
      return 'bg-red-100 text-red-800'
    case 'acknowledged':
      return 'bg-blue-100 text-blue-800'
    case 'archived':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'signed':
    case 'approved':
    case 'current':
      return <CheckCircleIcon className="h-4 w-4" />
    case 'pending_review':
    case 'pending':
      return <ClockIcon className="h-4 w-4" />
    case 'expired':
    case 'rejected':
      return <AlertCircleIcon className="h-4 w-4" />
    default:
      return <FileTextIcon className="h-4 w-4" />
  }
}

const formatFileSize = (bytes: number) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 Byte'
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString())
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i]
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const DocumentCard = ({ document, onView, onDownload, onShare }: any) => {
  const isExpiringSoon = document.expiresAt && 
    new Date(document.expiresAt).getTime() - new Date().getTime() < 30 * 24 * 60 * 60 * 1000 // 30 days

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {getFileIcon(document.fileType)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-sm truncate">{document.name}</h3>
                <p className="text-xs text-gray-600 mt-1">{document.description}</p>
                
                <div className="flex items-center space-x-2 mt-2">
                  <Badge className={getStatusColor(document.status)}>
                    {getStatusIcon(document.status)}
                    <span className="ml-1">{document.status.replace('_', ' ')}</span>
                  </Badge>
                  
                  {document.isRequired && (
                    <Badge variant="outline" className="text-xs">
                      Required
                    </Badge>
                  )}
                  
                  {isExpiringSoon && (
                    <Badge variant="destructive" className="text-xs">
                      Expires Soon
                    </Badge>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-1 mt-2">
                  {document.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-1">
                <Button variant="ghost" size="sm" onClick={() => onView(document)}>
                  <EyeIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDownload(document)}>
                  <DownloadIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onShare(document)}>
                  <ShareIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
              <div className="flex items-center space-x-2">
                <UserIcon className="h-3 w-3" />
                <span>{document.uploadedBy.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-3 w-3" />
                <span>{formatDate(document.uploadedAt)}</span>
              </div>
              <span>{formatFileSize(document.size)}</span>
            </div>
            
            {document.expiresAt && (
              <div className="flex items-center space-x-1 mt-1 text-xs text-gray-500">
                <AlertCircleIcon className="h-3 w-3" />
                <span>Expires: {formatDate(document.expiresAt)}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const UploadDialog = ({ isOpen, onClose, onUpload }: any) => {
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFiles = (files: FileList) => {
    setIsUploading(true)
    setUploadProgress(0)
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          onUpload(files)
          onClose()
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload documents related to your care
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <UploadIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm font-medium mb-2">Drag and drop files here</p>
            <p className="text-xs text-gray-600 mb-4">or click to browse</p>
            
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Choose Files
            </Button>
            
            <input
              ref={fileInputRef}
              type="file"
              hidden
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
            />
          </div>
          
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
          
          <Alert>
            <AlertCircleIcon className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Accepted formats: PDF, DOC, DOCX, JPG, PNG. Max size: 10MB per file.
            </AlertDescription>
          </Alert>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Documents')
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('all')

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = searchQuery === '' || 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'All Documents' || doc.category === selectedCategory
    
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'required' && doc.isRequired) ||
      (activeTab === 'signed' && doc.status === 'signed') ||
      (activeTab === 'pending' && (doc.status === 'pending' || doc.status === 'pending_review'))
    
    return matchesSearch && matchesCategory && matchesTab
  })

  const requiredDocuments = mockDocuments.filter(doc => doc.isRequired)
  const signedDocuments = mockDocuments.filter(doc => doc.status === 'signed')
  const pendingDocuments = mockDocuments.filter(doc => 
    doc.status === 'pending' || doc.status === 'pending_review'
  )

  const handleView = (document: any) => {
    console.log('View document:', document)
    // Implement document viewing logic
  }

  const handleDownload = (document: any) => {
    console.log('Download document:', document)
    // Implement download logic
  }

  const handleShare = (document: any) => {
    console.log('Share document:', document)
    // Implement sharing logic
  }

  const handleUpload = (files: FileList) => {
    console.log('Upload files:', files)
    // Implement upload logic
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-600 mt-1">
            Manage your care documents and agreements
          </p>
        </div>
        
        <Button onClick={() => setIsUploadOpen(true)}>
          <UploadIcon className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileTextIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDocuments.length}</div>
            <p className="text-xs text-muted-foreground">
              documents stored
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Required</CardTitle>
            <AlertCircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requiredDocuments.length}</div>
            <p className="text-xs text-muted-foreground">
              required documents
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Signed</CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{signedDocuments.length}</div>
            <p className="text-xs text-muted-foreground">
              signed agreements
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingDocuments.length}</div>
            <p className="text-xs text-muted-foreground">
              awaiting review
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <div className="flex space-x-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-md bg-white text-sm"
              >
                {documentCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <Button variant="outline" size="sm">
                <FilterIcon className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({mockDocuments.length})</TabsTrigger>
          <TabsTrigger value="required">Required ({requiredDocuments.length})</TabsTrigger>
          <TabsTrigger value="signed">Signed ({signedDocuments.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingDocuments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-6">
          {filteredDocuments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FolderIcon className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
                <p className="text-gray-500 text-center mb-4">
                  {searchQuery || selectedCategory !== 'All Documents' 
                    ? 'Try adjusting your search or filters' 
                    : 'Upload your first document to get started'}
                </p>
                <Button onClick={() => setIsUploadOpen(true)}>
                  <UploadIcon className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map((document) => (
                <DocumentCard
                  key={document.id}
                  document={document}
                  onView={handleView}
                  onDownload={handleDownload}
                  onShare={handleShare}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Upload Dialog */}
      <UploadDialog
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={handleUpload}
      />
    </div>
  )
}