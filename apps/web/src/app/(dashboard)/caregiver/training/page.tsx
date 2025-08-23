'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from '@/hooks/use-toast'
import { 
  BookOpen, 
  Award, 
  PlayCircle, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Calendar,
  Download,
  Star,
  Users,
  FileText,
  Video,
  Headphones,
  Monitor,
  Trophy,
  Target,
  TrendingUp,
  ExternalLink
} from 'lucide-react'

// Mock data for training programs
const mockTrainingPrograms = [
  {
    id: '1',
    title: 'Dementia Care Fundamentals',
    description: 'Learn essential skills for caring for clients with dementia and Alzheimer\'s',
    category: 'Specialized Care',
    duration: 120, // minutes
    format: 'video',
    difficulty: 'beginner',
    rating: 4.8,
    enrolled: 245,
    progress: 0,
    status: 'available',
    modules: [
      { id: '1', title: 'Understanding Dementia', duration: 30, completed: false },
      { id: '2', title: 'Communication Techniques', duration: 25, completed: false },
      { id: '3', title: 'Behavioral Management', duration: 35, completed: false },
      { id: '4', title: 'Safety Considerations', duration: 30, completed: false }
    ],
    instructor: 'Dr. Sarah Mitchell, RN',
    prerequisites: ['Basic Caregiving Fundamentals'],
    certification: true,
    ceuHours: 2.0
  },
  {
    id: '2',
    title: 'Fall Prevention and Safety',
    description: 'Comprehensive training on preventing falls and maintaining client safety',
    category: 'Safety',
    duration: 90,
    format: 'interactive',
    difficulty: 'intermediate',
    rating: 4.9,
    enrolled: 189,
    progress: 100,
    status: 'completed',
    modules: [
      { id: '1', title: 'Risk Assessment', duration: 20, completed: true },
      { id: '2', title: 'Environmental Safety', duration: 25, completed: true },
      { id: '3', title: 'Mobility Assistance', duration: 30, completed: true },
      { id: '4', title: 'Emergency Response', duration: 15, completed: true }
    ],
    instructor: 'Michael Chen, PT',
    prerequisites: [],
    certification: true,
    ceuHours: 1.5,
    completedDate: '2025-01-10'
  },
  {
    id: '3',
    title: 'Medication Management for Non-Medical Caregivers',
    description: 'Understanding medication reminders and safety protocols',
    category: 'Medication',
    duration: 75,
    format: 'video',
    difficulty: 'beginner',
    rating: 4.7,
    enrolled: 312,
    progress: 45,
    status: 'in_progress',
    modules: [
      { id: '1', title: 'Medication Basics', duration: 20, completed: true },
      { id: '2', title: 'Storage and Handling', duration: 15, completed: true },
      { id: '3', title: 'Reminder Systems', duration: 20, completed: false },
      { id: '4', title: 'Documentation', duration: 20, completed: false }
    ],
    instructor: 'Lisa Rodriguez, PharmD',
    prerequisites: [],
    certification: true,
    ceuHours: 1.25
  },
  {
    id: '4',
    title: 'Cultural Competency in Caregiving',
    description: 'Providing culturally sensitive care to diverse populations',
    category: 'Communication',
    duration: 60,
    format: 'audio',
    difficulty: 'beginner',
    rating: 4.6,
    enrolled: 156,
    progress: 0,
    status: 'available',
    modules: [
      { id: '1', title: 'Cultural Awareness', duration: 15, completed: false },
      { id: '2', title: 'Language Barriers', duration: 15, completed: false },
      { id: '3', title: 'Religious Considerations', duration: 15, completed: false },
      { id: '4', title: 'Best Practices', duration: 15, completed: false }
    ],
    instructor: 'Dr. Maria Santos',
    prerequisites: [],
    certification: false,
    ceuHours: 1.0
  }
]

const mockCertifications = [
  {
    id: '1',
    name: 'CNA License',
    type: 'Professional License',
    issuer: 'Virginia Board of Nursing',
    issuedDate: '2023-06-15',
    expirationDate: '2025-06-15',
    status: 'active',
    renewalRequired: true,
    daysToExpiration: 147
  },
  {
    id: '2',
    name: 'CPR Certification',
    type: 'Safety Certification',
    issuer: 'American Heart Association',
    issuedDate: '2024-09-20',
    expirationDate: '2026-09-20',
    status: 'active',
    renewalRequired: false,
    daysToExpiration: 612
  },
  {
    id: '3',
    name: 'Dementia Care Specialist',
    type: 'Specialty Certification',
    issuer: 'Caring Compass Academy',
    issuedDate: '2025-01-10',
    expirationDate: '2027-01-10',
    status: 'active',
    renewalRequired: false,
    daysToExpiration: 730
  },
  {
    id: '4',
    name: 'First Aid Certification',
    type: 'Safety Certification',
    issuer: 'American Red Cross',
    issuedDate: '2023-11-30',
    expirationDate: '2024-11-30',
    status: 'expired',
    renewalRequired: true,
    daysToExpiration: -81
  }
]

const mockLearningPaths = [
  {
    id: '1',
    title: 'New Caregiver Orientation',
    description: 'Essential training for new team members',
    totalPrograms: 5,
    completedPrograms: 3,
    estimatedHours: 8,
    progress: 60,
    programs: ['1', '2', '3', '7', '8']
  },
  {
    id: '2',
    title: 'Dementia Care Specialist Track',
    description: 'Comprehensive training for dementia care specialization',
    totalPrograms: 4,
    completedPrograms: 1,
    estimatedHours: 12,
    progress: 25,
    programs: ['1', '9', '10', '11']
  }
]

export default function TrainingPage() {
  const [activeTab, setActiveTab] = useState('programs')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedProgram, setSelectedProgram] = useState<any>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success'
      case 'in_progress': return 'default'
      case 'available': return 'secondary'
      case 'active': return 'success'
      case 'expired': return 'destructive'
      default: return 'outline'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'secondary'
      case 'intermediate': return 'default'
      case 'advanced': return 'destructive'
      default: return 'outline'
    }
  }

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'video': return <Video className="h-4 w-4" />
      case 'audio': return <Headphones className="h-4 w-4" />
      case 'interactive': return <Monitor className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const handleStartProgram = (programId: string) => {
    toast({
      title: "Training Started",
      description: "You have successfully enrolled in this training program.",
    })
  }

  const handleContinueProgram = (programId: string) => {
    toast({
      title: "Resuming Training",
      description: "Continuing where you left off...",
    })
  }

  const categories = ['all', ...Array.from(new Set(mockTrainingPrograms.map(p => p.category)))]
  const filteredPrograms = selectedCategory === 'all' 
    ? mockTrainingPrograms 
    : mockTrainingPrograms.filter(p => p.category === selectedCategory)

  const totalCEUHours = mockTrainingPrograms
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.ceuHours, 0)

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Training & Development</h1>
          <p className="text-muted-foreground">
            Enhance your skills and maintain your certifications
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm">
            {totalCEUHours} CEU Hours Earned
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">
                  {mockTrainingPrograms.filter(p => p.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Training programs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">
                  {mockTrainingPrograms.filter(p => p.status === 'in_progress').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Current enrollments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Certifications</p>
                <p className="text-2xl font-bold">
                  {mockCertifications.filter(c => c.status === 'active').length}
                </p>
              </div>
              <Award className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Active credentials
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">CEU Hours</p>
                <p className="text-2xl font-bold">{totalCEUHours}</p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              This year
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="programs">Training Programs</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="paths">Learning Paths</TabsTrigger>
          <TabsTrigger value="progress">My Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="programs" className="space-y-6">
          {/* Category Filter */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category === 'all' ? 'All Categories' : category}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Training Programs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((program) => (
              <Card key={program.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <Badge variant={getDifficultyColor(program.difficulty) as any}>
                      {program.difficulty}
                    </Badge>
                    <div className="flex items-center gap-1">
                      {getFormatIcon(program.format)}
                      <span className="text-xs text-muted-foreground">{program.format}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{program.title}</CardTitle>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {program.description}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{program.duration} min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{program.enrolled}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{program.rating}</span>
                    </div>
                  </div>

                  {program.progress > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{program.progress}%</span>
                      </div>
                      <Progress value={program.progress} className="h-2" />
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Instructor: {program.instructor}</span>
                    {program.certification && (
                      <Badge variant="outline" className="text-xs">
                        Certificate
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {program.status === 'available' && (
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleStartProgram(program.id)}
                      >
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Start
                      </Button>
                    )}
                    {program.status === 'in_progress' && (
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleContinueProgram(program.id)}
                      >
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Continue
                      </Button>
                    )}
                    {program.status === 'completed' && (
                      <Button size="sm" variant="outline" className="flex-1">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Completed
                      </Button>
                    )}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedProgram(program)}
                        >
                          Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{program.title}</DialogTitle>
                          <DialogDescription>
                            {program.description}
                          </DialogDescription>
                        </DialogHeader>
                        {selectedProgram && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Duration:</span>
                                <p>{selectedProgram.duration} minutes</p>
                              </div>
                              <div>
                                <span className="font-medium">Format:</span>
                                <p className="capitalize">{selectedProgram.format}</p>
                              </div>
                              <div>
                                <span className="font-medium">Instructor:</span>
                                <p>{selectedProgram.instructor}</p>
                              </div>
                              <div>
                                <span className="font-medium">CEU Hours:</span>
                                <p>{selectedProgram.ceuHours}</p>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <h4 className="font-medium">Course Modules:</h4>
                              <div className="space-y-2">
                                {selectedProgram.modules.map((module: any, index: number) => (
                                  <div key={module.id} className="flex items-center justify-between p-2 border rounded">
                                    <div className="flex items-center gap-2">
                                      {module.completed ? (
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                      ) : (
                                        <div className="w-4 h-4 rounded-full border-2" />
                                      )}
                                      <span className="text-sm">{index + 1}. {module.title}</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">{module.duration} min</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {selectedProgram.prerequisites.length > 0 && (
                              <div className="space-y-2">
                                <h4 className="font-medium">Prerequisites:</h4>
                                <ul className="text-sm text-muted-foreground">
                                  {selectedProgram.prerequisites.map((prereq: string, index: number) => (
                                    <li key={index}>• {prereq}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            <div className="flex gap-2">
                              {selectedProgram.status === 'available' && (
                                <Button 
                                  className="flex-1"
                                  onClick={() => handleStartProgram(selectedProgram.id)}
                                >
                                  <PlayCircle className="h-4 w-4 mr-2" />
                                  Start Training
                                </Button>
                              )}
                              {selectedProgram.status === 'in_progress' && (
                                <Button 
                                  className="flex-1"
                                  onClick={() => handleContinueProgram(selectedProgram.id)}
                                >
                                  <PlayCircle className="h-4 w-4 mr-2" />
                                  Continue Training
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="certifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                My Certifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockCertifications.map((cert) => (
                <div key={cert.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{cert.name}</h4>
                      <Badge variant={getStatusColor(cert.status) as any}>
                        {cert.status}
                      </Badge>
                      {cert.daysToExpiration > 0 && cert.daysToExpiration < 30 && (
                        <Badge variant="destructive">
                          Expires in {cert.daysToExpiration} days
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{cert.type}</p>
                    <p className="text-sm text-muted-foreground">
                      Issued by {cert.issuer} on {new Date(cert.issuedDate).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {cert.status === 'expired' ? 'Expired' : 'Expires'}: {new Date(cert.expirationDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    {cert.renewalRequired && (cert.daysToExpiration < 60 || cert.status === 'expired') && (
                      <Button size="sm" variant={cert.status === 'expired' ? 'destructive' : 'default'}>
                        {cert.status === 'expired' ? 'Renew Now' : 'Renew'}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paths" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Learning Paths
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockLearningPaths.map((path) => (
                <Card key={path.id}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{path.title}</h3>
                          <p className="text-sm text-muted-foreground">{path.description}</p>
                        </div>
                        <Badge variant="outline">
                          {path.completedPrograms}/{path.totalPrograms} Complete
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{path.progress}%</span>
                        </div>
                        <Progress value={path.progress} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Estimated time: {path.estimatedHours} hours</span>
                        <Button size="sm">
                          Continue Path
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Learning Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Completed Programs</span>
                    <span className="font-medium">
                      {mockTrainingPrograms.filter(p => p.status === 'completed').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Study Time</span>
                    <span className="font-medium">
                      {mockTrainingPrograms
                        .filter(p => p.status === 'completed')
                        .reduce((sum, p) => sum + p.duration, 0)} minutes
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">CEU Hours Earned</span>
                    <span className="font-medium">{totalCEUHours}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Rating Given</span>
                    <span className="font-medium">4.8/5.0</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Completed &quot;Fall Prevention and Safety&quot;</p>
                      <p className="text-xs text-muted-foreground">January 10, 2025</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Started &quot;Medication Management&quot;</p>
                      <p className="text-xs text-muted-foreground">January 8, 2025</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-purple-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Earned &quot;Dementia Care Specialist&quot; certification</p>
                      <p className="text-xs text-muted-foreground">January 10, 2025</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Deadlines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockCertifications
                  .filter(cert => cert.daysToExpiration > 0 && cert.daysToExpiration < 90)
                  .map((cert) => (
                    <div key={cert.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className={`h-5 w-5 ${
                          cert.daysToExpiration < 30 ? 'text-red-600' : 'text-yellow-600'
                        }`} />
                        <div>
                          <p className="font-medium">{cert.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Expires in {cert.daysToExpiration} days
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant={cert.daysToExpiration < 30 ? 'destructive' : 'default'}>
                        Renew
                      </Button>
                    </div>
                  ))}
                {mockCertifications.filter(cert => cert.daysToExpiration > 0 && cert.daysToExpiration < 90).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    <p>All certifications are up to date!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}