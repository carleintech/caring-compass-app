import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { queryKeys } from '@/lib/query-client';
import { format } from 'date-fns';

// Types
interface ClientDashboardStats {
  totalVisits: number;
  upcomingVisits: number;
  completedVisits: number;
  activeCaregivers: number;
  totalHours: number;
  satisfactionScore: number;
}

interface Visit {
  id: string;
  clientId: string;
  caregiverId: string;
  caregiverName: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  serviceType: string;
  notes?: string;
}

interface Caregiver {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  totalVisits: number;
  lastVisit?: string;
}

interface Notification {
  id: string;
  type: 'visit_reminder' | 'caregiver_update' | 'visit_completed' | 'schedule_change';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

// Mock data - replace with actual API calls
const mockStats: ClientDashboardStats = {
  totalVisits: 156,
  upcomingVisits: 8,
  completedVisits: 148,
  activeCaregivers: 3,
  totalHours: 312,
  satisfactionScore: 4.8,
};

const mockUpcomingVisits: Visit[] = [
  {
    id: '1',
    clientId: 'client-1',
    caregiverId: 'caregiver-1',
    caregiverName: 'Sarah Johnson',
    scheduledDate: new Date().toISOString(),
    startTime: '09:00',
    endTime: '11:00',
    status: 'scheduled',
    serviceType: 'Personal Care',
    notes: 'Morning routine assistance',
  },
  {
    id: '2',
    clientId: 'client-1',
    caregiverId: 'caregiver-2',
    caregiverName: 'Michael Chen',
    scheduledDate: new Date(Date.now() + 86400000).toISOString(),
    startTime: '14:00',
    endTime: '16:00',
    status: 'scheduled',
    serviceType: 'Medication Management',
  },
];

const mockCaregivers: Caregiver[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: '/avatars/sarah.jpg',
    rating: 4.9,
    totalVisits: 45,
    lastVisit: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '2',
    name: 'Michael Chen',
    avatar: '/avatars/michael.jpg',
    rating: 4.7,
    totalVisits: 32,
    lastVisit: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    avatar: '/avatars/emily.jpg',
    rating: 4.8,
    totalVisits: 28,
  },
];

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'visit_reminder',
    title: 'Visit Reminder',
    message: 'Sarah Johnson will arrive in 30 minutes for your 9:00 AM appointment',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    read: false,
  },
  {
    id: '2',
    type: 'visit_completed',
    title: 'Visit Completed',
    message: 'Michael Chen completed your visit yesterday',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    read: true,
  },
];

// API functions - replace with actual API calls
const fetchClientStats = async (clientId: string): Promise<ClientDashboardStats> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockStats;
};

const fetchUpcomingVisits = async (clientId: string): Promise<Visit[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockUpcomingVisits;
};

const fetchMyCaregivers = async (clientId: string): Promise<Caregiver[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockCaregivers;
};

const fetchNotifications = async (clientId: string): Promise<Notification[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockNotifications;
};

const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  console.log(`Notification ${notificationId} marked as read`);
};

const cancelVisit = async (visitId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log(`Visit ${visitId} cancelled`);
};

// Hooks
export function useClientStats(clientId: string) {
  return useQuery({
    queryKey: [queryKeys.client.dashboard, clientId],
    queryFn: () => fetchClientStats(clientId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!clientId,
  });
}

export function useUpcomingVisits(clientId: string) {
  return useQuery({
    queryKey: [queryKeys.client.visits, clientId, 'upcoming'],
    queryFn: () => fetchUpcomingVisits(clientId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!clientId,
  });
}

export function useMyCaregivers(clientId: string) {
  return useQuery({
    queryKey: [queryKeys.client.caregivers, clientId],
    queryFn: () => fetchMyCaregivers(clientId),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!clientId,
  });
}

export function useNotifications(clientId: string) {
  return useQuery({
    queryKey: [queryKeys.client.notifications, clientId],
    queryFn: () => fetchNotifications(clientId),
    staleTime: 1 * 60 * 1000, // 1 minute
    enabled: !!clientId,
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: (_, notificationId) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.client.notifications] });
    },
  });
}

export function useCancelVisit() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: cancelVisit,
    onSuccess: (_, visitId) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.client.visits] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.client.dashboard] });
    },
  });
}

// Real-time updates hook
export function useClientRealtimeUpdates(clientId: string) {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    if (!clientId) return;
    
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.client.dashboard, clientId] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.client.visits, clientId] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.client.notifications, clientId] });
    }, 30000); // Poll every 30 seconds
    
    return () => clearInterval(interval);
  }, [queryClient, clientId]);
}

// Utility functions
export const formatVisitTime = (startTime: string, endTime: string) => {
  return `${startTime} - ${endTime}`;
};

export const getVisitStatusColor = (status: Visit['status']) => {
  const colors = {
    scheduled: 'text-blue-600 bg-blue-50',
    in_progress: 'text-green-600 bg-green-50',
    completed: 'text-gray-600 bg-gray-50',
    cancelled: 'text-red-600 bg-red-50',
  };
  return colors[status];
};

export const getNotificationIcon = (type: Notification['type']) => {
  const icons = {
    visit_reminder: '⏰',
    caregiver_update: '👤',
    visit_completed: '✅',
    schedule_change: '📅',
  };
  return icons[type];
};
