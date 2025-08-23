import { QueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        if (failureCount > 3) return false;
        return true;
      },
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
    mutations: {
      onError: (error: any) => {
        toast.error(error?.message || 'An error occurred');
      },
    },
  },
});

// Query keys
export const queryKeys = {
  admin: {
    dashboard: ['admin', 'dashboard'],
    metrics: ['admin', 'metrics'],
    activities: ['admin', 'activities'],
    alerts: ['admin', 'alerts'],
    users: ['admin', 'users'],
    visits: ['admin', 'visits'],
    caregivers: ['admin', 'caregivers'],
    clients: ['admin', 'clients'],
  },
  client: {
    dashboard: ['client', 'dashboard'],
    visits: ['client', 'visits'],
    profile: ['client', 'profile'],
    notifications: ['client', 'notifications'],
    caregivers: ['client', 'caregivers'],
  },
  caregiver: {
    dashboard: ['caregiver', 'dashboard'],
    schedule: ['caregiver', 'schedule'],
    clients: ['caregiver', 'clients'],
    profile: ['caregiver', 'profile'],
  },
} as const;

// Prefetch utilities
export const prefetchQueries = {
  admin: {
    dashboard: () => queryClient.prefetchQuery({ queryKey: queryKeys.admin.dashboard }),
    metrics: () => queryClient.prefetchQuery({ queryKey: queryKeys.admin.metrics }),
    activities: () => queryClient.prefetchQuery({ queryKey: queryKeys.admin.activities }),
  },
};
