import { io, Socket } from 'socket.io-client';
import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  connect() {
    if (this.socket?.connected) return;

    this.socket = io(WS_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.handleReconnection();
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  private handleReconnection() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  subscribe(channel: string, callback: (data: any) => void) {
    if (!this.socket) return;

    this.socket.on(channel, callback);
    return () => {
      this.socket?.off(channel, callback);
    };
  }

  emit(event: string, data: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    }
  }
}

export const wsService = new WebSocketService();

// Custom hook for real-time data
export function useRealtimeSubscription<T>(
  channel: string,
  queryKey: string[],
  transformFn?: (data: T) => T
) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = wsService.subscribe(channel, (data: T) => {
      const transformedData = transformFn ? transformFn(data) : data;
      
      queryClient.setQueryData(queryKey, (oldData: T | undefined) => {
        return transformedData;
      });
      
      queryClient.invalidateQueries({ queryKey });
    });

    return unsubscribe;
  }, [channel, queryKey, queryClient, transformFn]);
}

// Hook for dashboard metrics
export function useRealtimeMetrics() {
  useRealtimeSubscription('metrics:update', ['admin', 'metrics']);
}

// Hook for recent activities
export function useRealtimeActivities() {
  useRealtimeSubscription('activities:update', ['admin', 'activities']);
}

// Hook for alerts
export function useRealtimeAlerts() {
  useRealtimeSubscription('alerts:update', ['admin', 'alerts']);
}
