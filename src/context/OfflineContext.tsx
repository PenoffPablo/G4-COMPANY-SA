'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  addPendingAction,
  getPendingActions,
  getPendingCount,
  markActionSynced,
  clearSyncedActions,
  type PendingAction,
} from '@/lib/offlineDB';
import { useData } from '@/context/DataContext';

interface OfflineContextType {
  isOnline: boolean;
  pendingCount: number;
  pendingActions: PendingAction[];
  isSyncing: boolean;
  lastSyncAt: string | null;
  /** Queue a tracking advance for offline-safe execution */
  queueAdvanceShipment: (shipmentId: string, note?: string) => Promise<void>;
  /** Manually trigger sync */
  syncNow: () => Promise<void>;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export function OfflineProvider({ children }: { children: React.ReactNode }) {
  const { advanceShipment } = useData();
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);
  const syncingRef = useRef(false);

  // Track online/offline status
  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      // Auto-sync when coming back online
      syncPendingActions();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load pending count on mount
  useEffect(() => {
    refreshPendingState();
  }, []);

  const refreshPendingState = async () => {
    try {
      const count = await getPendingCount();
      setPendingCount(count);
      if (count > 0) {
        const actions = await getPendingActions();
        setPendingActions(actions);
      } else {
        setPendingActions([]);
      }
    } catch (err) {
      console.error('Error reading offline DB:', err);
    }
  };

  /**
   * Queue a shipment advance action.
   * - If online: execute immediately + save to DB as synced
   * - If offline: save to DB as pending, apply locally for instant UI feedback
   */
  const queueAdvanceShipment = useCallback(async (shipmentId: string, note?: string) => {
    const timestamp = new Date().toISOString();

    // Always apply locally for immediate UI feedback
    advanceShipment(shipmentId, note);

    if (isOnline) {
      // Online: In a real app, this would be an API call.
      // For now, the local state update above is the "sync".
      // We still save to DB as synced for audit trail.
      try {
        const id = await addPendingAction({
          type: 'advance_shipment',
          payload: { shipmentId, note, timestamp },
        });
        await markActionSynced(id);
        await clearSyncedActions(); // cleanup
      } catch (err) {
        console.error('Error saving to offline DB:', err);
      }
    } else {
      // Offline: Save as pending — will sync when back online
      try {
        await addPendingAction({
          type: 'advance_shipment',
          payload: { shipmentId, note, timestamp },
        });
        await refreshPendingState();
      } catch (err) {
        console.error('Error queuing offline action:', err);
      }
    }
  }, [isOnline, advanceShipment]);

  /**
   * Process all pending actions.
   * In a real app, each action would be an API call.
   * Here we simulate the sync process.
   */
  const syncPendingActions = useCallback(async () => {
    if (syncingRef.current) return;
    syncingRef.current = true;
    setIsSyncing(true);

    try {
      const pending = await getPendingActions();
      if (pending.length === 0) {
        setIsSyncing(false);
        syncingRef.current = false;
        return;
      }

      // Process each action in order (FIFO)
      for (const action of pending) {
        try {
          // In a real app: await fetch('/api/tracking', { method: 'POST', body: JSON.stringify(action.payload) })
          // The local state was already updated when the action was queued,
          // so here we just need to send to server.

          // Simulate network delay
          await new Promise(r => setTimeout(r, 300));

          // Mark as synced
          if (action.id !== undefined) {
            await markActionSynced(action.id);
          }
        } catch (err) {
          console.error(`Failed to sync action ${action.id}:`, err);
          // Don't mark as synced — will retry next time
          if (action.id !== undefined) {
            // incrementRetry would be called here in production
          }
        }
      }

      setLastSyncAt(new Date().toISOString());
      await clearSyncedActions();
      await refreshPendingState();
    } catch (err) {
      console.error('Sync failed:', err);
    } finally {
      setIsSyncing(false);
      syncingRef.current = false;
    }
  }, []);

  const syncNow = useCallback(async () => {
    if (isOnline) {
      await syncPendingActions();
    }
  }, [isOnline, syncPendingActions]);

  // Periodic sync attempt (every 30 seconds if online and has pending)
  useEffect(() => {
    const interval = setInterval(() => {
      if (isOnline && pendingCount > 0 && !syncingRef.current) {
        syncPendingActions();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isOnline, pendingCount, syncPendingActions]);

  return (
    <OfflineContext.Provider value={{
      isOnline,
      pendingCount,
      pendingActions,
      isSyncing,
      lastSyncAt,
      queueAdvanceShipment,
      syncNow,
    }}>
      {children}
    </OfflineContext.Provider>
  );
}

export function useOffline() {
  const context = useContext(OfflineContext);
  if (!context) throw new Error('useOffline must be used within OfflineProvider');
  return context;
}
