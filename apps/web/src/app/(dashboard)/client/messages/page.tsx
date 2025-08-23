'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  MessageSquareIcon,
  SendIcon,
  PaperclipIcon,
  PhoneIcon,
  VideoIcon,
  SearchIcon,
  MoreVerticalIcon,
  UserIcon,
  ClockIcon,
  CheckIcon,
  CheckCheckIcon,
  AlertCircleIcon,
  PlusIcon,
  FileIcon,
  ImageIcon
} from 'lucide-react'

// Mock data - in real app, this would come from API
const mockConversations = [
  {
    id: 'conv_1',
    type: 'direct',
    participant: {
      id: 'coord_1',
      name: 'Maria Rodriguez',
      role: 'Care Coordinator',
      avatar: null,
      isOnline: true,
      lastSeen: null
    },
    lastMessage: {
      id: 'msg_15',
      content: 'Your care plan has been updated. Please review the new schedule.',
      senderId: 'coord_1',
      timestamp: '2024-01-19T14:30:00Z',
      status: 'delivered'
    },
    unreadCount: 2,
    isActive: false
  },
  {
    id: 'conv_2',
    type: 'direct',
    participant: {
      id: 'caregiver_1',
      name: 'Sarah Martinez',
      role: 'Primary Caregiver',
      avatar: null,
      isOnline: false,
      lastSeen: '2024-01-19T12:15:00Z'
    },
    lastMessage: {
      id: 'msg_28',
      content: 'I\'ll be there at 9 AM tomorrow. See you then!',
      senderId: 'caregiver_1',
      timestamp: '2024-01-19T16:45:00Z',
      status: 'read'
    },
    unreadCount: 0,
    isActive: true
  },
  {
    id: 'conv_3',
    type: 'group',
    name: 'Care Team - Robert Johnson',
    participants: [
      { id: 'coord_1', name: 'Maria Rodriguez', role: 'Care Coordinator' },
      { id: 'caregiver_1', name: 'Sarah Martinez', role: 'Primary Caregiver' },
      { id: 'caregiver_2', name: 'Michael Chen', role: 'Backup Caregiver' }
    ],
    lastMessage: {
      id: 'msg_42',
      content: 'Updated medication schedule attached',
      senderId: 'coord_1',
      timestamp: '2024-01-18T11:20:00Z',
      status: 'delivered'
    },
    unreadCount: 1,
    isActive: false
  }
]

const mockMessages = [
  {
    id: 'msg_25',
    content: 'Hi Sarah! Just wanted to confirm our appointment tomorrow at 9 AM.',
    senderId: 'client_1',
    timestamp: '2024-01-19T15:30:00Z',
    status: 'read',
    type: 'text'
  },
  {
    id: 'msg_26',
    content: 'Yes, I\'ll be there right on time! Is there anything specific you\'d like me to focus on during our session?',
    senderId: 'caregiver_1',
    timestamp: '2024-01-19T15:45:00Z',
    status: 'read',
    type: 'text'
  },
  {
    id: 'msg_27',
    content: 'Could you help me organize my medications? I got some new prescriptions from the doctor.',
    senderId: 'client_1',
    timestamp: '2024-01-19T16:00:00Z',
    status: 'read',
    type: 'text'
  },
  {
    id: 'msg_28',
    content: 'Absolutely! I\'ll bring the medication organizer. I\'ll be there at 9 AM tomorrow. See you then!',
    senderId: 'caregiver_1',
    timestamp: '2024-01-19T16:45:00Z',
    status: 'read',
    type: 'text'
  },
  {
    id: 'msg_29',
    content: 'Thank you so much, Sarah. You\'re the best!',
    senderId: 'client_1',
    timestamp: '2024-01-19T17:00:00Z',
    status: 'delivered',
    type: 'text'
  }
]

const getMessageStatus = (status: string) => {
  switch (status) {
    case 'sent':
      return <CheckIcon className="h-3 w-3 text-gray-400" />
    case 'delivered':
      return <CheckCheckIcon className="h-3 w-3 text-gray-400" />
    case 'read':
      return <CheckCheckIcon className="h-3 w-3 text-blue-500" />
    default:
      return <ClockIcon className="h-3 w-3 text-gray-400" />
  }
}

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  
  if (diffInHours < 1) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } else if (diffInHours < 24) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } else {
    return date.toLocaleDateString()
  }
}

const ConversationList = ({ conversations, activeConversation, onSelectConversation }: any) => {
  return (
    <div className="space-y-1">
      {conversations.map((conversation: any) => (
        <div
          key={conversation.id}
          className={`p-3 rounded-lg cursor-pointer transition-colors ${
            activeConversation?.id === conversation.id 
              ? 'bg-blue-50 border-blue-200 border' 
              : 'hover:bg-gray-50'
          }`}
          onClick={() => onSelectConversation(conversation)}
        >
          <div className="flex items-start space-x-3">
            {conversation.type === 'direct' ? (
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={conversation.participant.avatar || undefined} />
                  <AvatarFallback>
                    {conversation.participant.name.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {conversation.participant.isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
            ) : (
              <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                <UserIcon className="h-5 w-5 text-gray-600" />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-medium truncate">
                  {conversation.type === 'direct' ? conversation.participant.name : conversation.name}
                </h3>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-500">
                    {formatTimestamp(conversation.lastMessage.timestamp)}
                  </span>
                  {conversation.unreadCount > 0 && (
                    <Badge className="bg-blue-500 text-white text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center">
                      {conversation.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
              
              {conversation.type === 'direct' && (
                <p className="text-xs text-gray-600 mb-1">{conversation.participant.role}</p>
              )}
              
              <p className="text-sm text-gray-600 truncate">
                {conversation.lastMessage.content}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

const MessageBubble = ({ message, isOwn }: any) => {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-1' : 'order-2'}`}>
        <div
          className={`px-4 py-2 rounded-lg ${
            isOwn
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-900'
          }`}
        >
          <p className="text-sm">{message.content}</p>
        </div>
        
        <div className={`flex items-center mt-1 space-x-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
          <span className="text-xs text-gray-500">
            {formatTimestamp(message.timestamp)}
          </span>
          {isOwn && getMessageStatus(message.status)}
        </div>
      </div>
    </div>
  )
}

const MessageInput = ({ onSendMessage }: any) => {
  const [message, setMessage] = useState('')
  const [isAttachmentOpen, setIsAttachmentOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim())
      setMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      // Handle file upload logic here
      console.log('Files selected:', files)
    }
  }

  return (
    <div className="border-t p-4">
      <div className="flex items-end space-x-2">
        <div className="flex-1">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="resize-none"
            rows={1}
          />
        </div>
        
        <div className="flex space-x-1">
          <Dialog open={isAttachmentOpen} onOpenChange={setIsAttachmentOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <PaperclipIcon className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Attach File</DialogTitle>
                <DialogDescription>
                  Choose what you&apos;d like to attach to your message
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-20 flex-col"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FileIcon className="h-6 w-6 mb-2" />
                  Document
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="h-6 w-6 mb-2" />
                  Image
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                hidden
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
            </DialogContent>
          </Dialog>
          
          <Button onClick={handleSend} disabled={!message.trim()}>
            <SendIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <p className="text-xs text-gray-500 mt-2">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  )
}

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[1])
  const [messages, setMessages] = useState(mockMessages)
  const [searchQuery, setSearchQuery] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = (content: string) => {
    const newMessage = {
      id: `msg_${Date.now()}`,
      content,
      senderId: 'client_1',
      timestamp: new Date().toISOString(),
      status: 'sent',
      type: 'text'
    }
    
    setMessages(prev => [...prev, newMessage])
    
    // Simulate message delivery
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: 'delivered' }
            : msg
        )
      )
    }, 1000)
  }

  const filteredConversations = mockConversations.filter(conv =>
    searchQuery === '' ||
    (conv.type === 'direct' 
      ? conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase())
      : conv.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  return (
    <div className="h-[calc(100vh-12rem)] flex">
      {/* Conversations Sidebar */}
      <Card className="w-80 mr-6 flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Messages</CardTitle>
            <Button size="sm" variant="outline">
              <PlusIcon className="h-4 w-4 mr-1" />
              New
            </Button>
          </div>
          
          <div className="relative">
            <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto p-0">
          <div className="px-6 pb-6">
            <ConversationList
              conversations={filteredConversations}
              activeConversation={selectedConversation}
              onSelectConversation={setSelectedConversation}
            />
          </div>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {selectedConversation.type === 'direct' ? (
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={selectedConversation.participant.avatar || undefined} />
                        <AvatarFallback>
                          {selectedConversation.participant.name.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {selectedConversation.participant.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                  ) : (
                    <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-gray-600" />
                    </div>
                  )}
                  
                  <div>
                    <h3 className="font-semibold">
                      {selectedConversation.type === 'direct' 
                        ? selectedConversation.participant.name 
                        : selectedConversation.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedConversation.type === 'direct' ? (
                        selectedConversation.participant.isOnline ? (
                          <span className="text-green-600">Online</span>
                        ) : selectedConversation.participant.lastSeen ? (
                          `Last seen ${formatTimestamp(selectedConversation.participant.lastSeen)}`
                        ) : (
                          selectedConversation.participant.role
                        )
                      ) : (
                        `${selectedConversation.participants.length} members`
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <PhoneIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <VideoIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreVerticalIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <Separator />

            {/* Messages Area */}
            <CardContent className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isOwn={message.senderId === 'client_1'}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>

            {/* Message Input */}
            <MessageInput onSendMessage={handleSendMessage} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquareIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-500">Choose a conversation from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </Card>

      {/* Privacy Notice */}
      <Alert className="absolute bottom-4 left-4 w-80">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertDescription className="text-xs">
          Messages are encrypted and HIPAA compliant. Only authorized care team members can access this conversation.
        </AlertDescription>
      </Alert>
    </div>
  )
}