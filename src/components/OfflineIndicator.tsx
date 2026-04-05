'use client';

import { useOffline } from '@/context/OfflineContext';

export default function OfflineIndicator() {
  const { isOnline, pendingCount, isSyncing, lastSyncAt, syncNow } = useOffline();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {/* Syncing indicator */}
      {isSyncing && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-info-bg border border-info/20 shadow-lg animate-scale-in">
          <svg className="w-4 h-4 text-info animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-xs font-medium text-info">Sincronizando...</span>
        </div>
      )}

      {/* Pending actions badge */}
      {pendingCount > 0 && !isSyncing && (
        <button
          onClick={syncNow}
          disabled={!isOnline}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-warning-bg border border-warning/20 shadow-lg hover:bg-warning/20 transition-colors animate-scale-in disabled:opacity-50"
        >
          <svg className="w-4 h-4 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="text-xs font-medium text-warning">
            {pendingCount} pendiente{pendingCount > 1 ? 's' : ''}
          </span>
          {isOnline && (
            <span className="text-[10px] text-warning/70">· Click para sincronizar</span>
          )}
        </button>
      )}

      {/* Connection status */}
      <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border shadow-lg transition-all duration-500 ${
        isOnline
          ? 'bg-surface-card border-border-primary'
          : 'bg-danger-bg border-danger/30 animate-pulse-alert'
      }`}>
        {/* Dot */}
        <span className={`w-2.5 h-2.5 rounded-full ${
          isOnline ? 'bg-success' : 'bg-danger'
        }`} />

        {isOnline ? (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-success">En línea</span>
            {lastSyncAt && (
              <span className="text-[10px] text-text-muted">
                · Última sync: {new Date(lastSyncAt).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m-2.829-2.829a5 5 0 000-7.07m-4.243 4.243a1 1 0 010-1.414" />
            </svg>
            <span className="text-xs font-semibold text-danger">Sin conexión</span>
            <span className="text-[10px] text-danger/70">· Los cambios se guardarán localmente</span>
          </div>
        )}
      </div>
    </div>
  );
}
