import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { queryKeys } from '@/lib/query-client';
import { format } from 'date-fns';

// Types
interface AdminDashboardStats {
  totalClients: number;
  totalCaregivers: number;
  totalVisits: number;
  pendingApprovals: number;
  activeAlerts: number;
  revenue: {
    today: number;
    week: number;
    month: number;
  };
}

interface RecentActivity {
  id: string;
  type: 'visit_completed' | 'visit_scheduled' | 'caregiver_onboarded' | 'client_registered';
  description: string;
  timestamp: string;
  user: {
    name: string;
    role: string;
  };
}

interface Alert {
  id: string;
  type: 'missed_visit' | 'late_check_in' | 'caregiver_issue' | 'client_concern';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  caregiver?: {
    id: string;
    name: string;
  };
  client?: {
    id: string;
    name: string;
  };
}

// Mock data - replace with actual API calls
const mockStats: AdminDashboardStats = {
  totalClients: 245,
  totalCaregivers: 89,
  totalVisits: 1234,
  pendingApprovals: 12,
  activeAlerts: 5,
  revenue: {
    today: 2847.50,
    week: 19832.75,
    month: 84729.25,
  },
};

const mockActivities: RecentActivity[] = [
  {
    id: '1',
    type: 'visit_completed',
    description: 'Visit completed for Mrs. Johnson',
    timestamp: new Date().toISOString(),
    user: { name: 'Sarah Smith', role: 'Caregiver' },
  },
  {
    id: '2',
    type: 'caregiver_onboarded',
    description: 'New caregiver onboarded: John Doe',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    user: { name: 'Admin', role: 'System' },
  },
  {
    id: '3',
    type: 'client_registered',
    description: 'New client registered: Robert Williams',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    user: { name: 'Admin', role: 'System' },
  },
];

const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'missed_visit',
    severity: 'high',
    title: 'Missed Visit Alert',
    description: 'Caregiver Sarah Smith missed scheduled visit for Mrs. Johnson at 2:00 PM',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    caregiver: { id: '1', name: 'Sarah Smith' },
    client: { id: '1', name: 'Mrs. Johnson' },
  },
  {
    id: '2',
    type: 'late_check_in',
    severity: 'medium',
    title: 'Late Check-in',
    description: 'Caregiver Mike Johnson checked in 15 minutes late for visit',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    caregiver: { id: '2', name: 'Mike Johnson' },
  },
];

// API functions - replace with actual API calls
const fetchAdminStats = async (): Promise<AdminDashboardStats> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockStats;
};

const fetchRecentActivities = async (): Promise<RecentActivity[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockActivities;
};

const fetchAlerts = async (): Promise<Alert[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockAlerts;
};

const dismissAlert = async (alertId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  console.log(`Alert ${alertId} dismissed`);
};

// Hooks
export function useAdminStats() {
  return useQuery({
    queryKey: queryKeys.admin.dashboard,
    queryFn: fetchAdminStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useRecentActivities() {
  return useQuery({
    queryKey: queryKeys.admin.activities,
    queryFn: fetchRecentActivities,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useAlerts() {
  return useQuery({
    queryKey: queryKeys.admin.alerts,
    queryFn: fetchAlerts,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export function useDismissAlert() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: dismissAlert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.alerts });
    },
  });
}

// Real-time updates hook
export function useAdminRealtimeUpdates() {
  const queryClient = useQueryClient();
  
  // This would connect to WebSocket for real-time updates
  // For now, we'll use polling
  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.activities });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.alerts });
    }, 30000); // Poll every 30 seconds
    
    return () => clearInterval(interval);
  }, [queryClient]);
}

// Utility functions
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatRelativeTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
  
  if (diffInMinutes < 1) return 'just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return format(date, 'MMM d');
};

export const getAlertColor = (severity: Alert['severity']) => {
  const colors = {
    low: 'text-blue-600 bg-blue-50',
    medium: 'text-yellow-600 bg-yellow-50',
    high: 'text-orange-600 bg-orange-50',
    critical: 'text-red-600 bg-red-50',
  };
  return colors[severity];
};

export const getActivityIcon = (type: RecentActivity['type']) => {
  const icons = {
    visit_completed: '✅',
    visit_scheduled: '📅',
    caregiver_onboarded: '👤',
    client_registered: '🏠',
  };
  return icons[type];
};
