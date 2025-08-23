import { useQuery } from '@tanstack/react-query';

export function useCaregiverStats(caregiverId: string) {
  return useQuery({
    queryKey: ['caregiver', caregiverId, 'stats'],
    queryFn: async () => {
      const response = await fetch(`/api/caregivers/${caregiverId}/stats`);
      if (!response.ok) throw new Error('Failed to fetch caregiver stats');
      return response.json();
    },
    enabled: !!caregiverId,
  });
}

export function useCaregiverSchedule(caregiverId: string, date?: string) {
  return useQuery({
    queryKey: ['caregiver', caregiverId, 'schedule', date || 'current'],
    queryFn: async () => {
      const url = date 
        ? `/api/caregivers/${caregiverId}/schedule?date=${date}`
        : `/api/caregivers/${caregiverId}/schedule`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch caregiver schedule');
      return response.json();
    },
    enabled: !!caregiverId,
  });
}

export function useCaregiverEVVHistory(caregiverId: string, limit = 10) {
  return useQuery({
    queryKey: ['caregiver', caregiverId, 'evv-history', limit],
    queryFn: async () => {
      const response = await fetch(`/api/caregivers/${caregiverId}/evv-history?limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch EVV history');
      return response.json();
    },
    enabled: !!caregiverId,
  });
}

export function useCaregiverClients(caregiverId: string) {
  return useQuery({
    queryKey: ['caregiver', caregiverId, 'clients'],
    queryFn: async () => {
      const response = await fetch(`/api/caregivers/${caregiverId}/clients`);
      if (!response.ok) throw new Error('Failed to fetch caregiver clients');
      return response.json();
    },
    enabled: !!caregiverId,
  });
}

export function useCaregiverAvailability(caregiverId: string) {
  return useQuery({
    queryKey: ['caregiver', caregiverId, 'availability'],
    queryFn: async () => {
      const response = await fetch(`/api/caregivers/${caregiverId}/availability`);
      if (!response.ok) throw new Error('Failed to fetch caregiver availability');
      return response.json();
    },
    enabled: !!caregiverId,
  });
}
