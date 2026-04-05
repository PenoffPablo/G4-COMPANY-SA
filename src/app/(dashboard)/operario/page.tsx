'use client';

import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { useOffline } from '@/context/OfflineContext';
import { TRACKING_STEPS } from '@/data/mockData';
import { useState } from 'react';

export default function OperarioPanel() {
  const { user } = useAuth();
  const { shipments } = useData();
  const { queueAdvanceShipment, isOnline, pendingCount } = useOffline();
  const [note, setNote] = useState('');
  const [activeNote, setActiveNote] = useState<string | null>(null);

  // Show all shipments for demo (in production, filter by user.id)
  const myShipments = shipments;

  const deliveredToday = myShipments.filter(s => {
    if (s.currentStatus !== 'Entregado') return false;
    const lastEvent = s.tracking[s.tracking.length - 1];
    return new Date(lastEvent.timestamp).toDateString() === new Date().toDateString();
  }).length;

  const activeShipments = myShipments.filter(s => s.currentStatus !== 'Entregado');

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-text-primary">Panel de Operario</h1>
        <p className="text-sm text-text-muted mt-1">Trazabilidad y gestión de envíos en tiempo real</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in delay-1">
        <div className="bg-surface-card border border-border-primary rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-info">{activeShipments.length}</p>
          <p className="text-xs text-text-muted">Envíos Activos</p>
        </div>
        <div className="bg-surface-card border border-border-primary rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-success">{deliveredToday}</p>
          <p className="text-xs text-text-muted">Entregas Hoy</p>
        </div>
        <div className="bg-surface-card border border-border-primary rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-text-primary">{myShipments.length}</p>
          <p className="text-xs text-text-muted">Total Envíos</p>
        </div>
        <div className={`bg-surface-card border rounded-xl p-4 text-center ${
          isOnline ? 'border-border-primary' : 'border-danger/40 bg-danger-bg'
        }`}>
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-success' : 'bg-danger animate-pulse'}`} />
            <p className={`text-sm font-bold ${isOnline ? 'text-success' : 'text-danger'}`}>{isOnline ? 'Online' : 'Offline'}</p>
          </div>
          <p className="text-xs text-text-muted">
            {pendingCount > 0 ? `${pendingCount} pendiente${pendingCount > 1 ? 's' : ''}` : 'Todo sincronizado'}
          </p>
        </div>
      </div>

      {/* Offline banner */}
      {!isOnline && (
        <div className="bg-warning-bg border border-warning/20 rounded-xl p-4 animate-fade-in flex items-center gap-3">
          <svg className="w-5 h-5 text-warning shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m-3.536-3.536a4 4 0 000-5.656m-3.536 3.536a1 1 0 010-1.414" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-warning">Modo sin conexión activo</p>
            <p className="text-xs text-text-muted mt-0.5">Podés seguir operando normalmente. Los cambios se guardan localmente y se sincronizarán automáticamente cuando recuperes la conexión.</p>
          </div>
        </div>
      )}

      {/* Shipments */}
      <div className="space-y-4">
        {myShipments.map((shipment, idx) => {
          const currentStepIdx = TRACKING_STEPS.indexOf(shipment.currentStatus);
          const isCompleted = shipment.currentStatus === 'Entregado';
          const progress = ((currentStepIdx + 1) / TRACKING_STEPS.length) * 100;

          return (
            <div key={shipment.id} className={`bg-surface-card border border-border-primary rounded-xl overflow-hidden animate-fade-in delay-${Math.min(idx + 1, 8)}`}>
              {/* Header */}
              <div className="p-5 border-b border-border-primary/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono text-g4-red font-medium">{shipment.id}</span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      isCompleted ? 'bg-success-bg text-success' : 'bg-info-bg text-info'
                    }`}>
                      {shipment.currentStatus}
                    </span>
                  </div>
                  <span className="text-xs text-text-muted">Pedido: {shipment.orderId}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">📍 {shipment.branchName}</span>
                  <span className="text-text-muted">Operario: {shipment.operatorName}</span>
                </div>
                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-text-muted">Progreso</span>
                    <span className="text-xs font-mono text-text-secondary">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-hover overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${
                        isCompleted ? 'bg-success' : 'bg-g4-red-dark'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="p-5">
                <div className="relative">
                  {TRACKING_STEPS.map((step, i) => {
                    const event = shipment.tracking.find(t => t.status === step);
                    const isActive = i <= currentStepIdx;
                    const isCurrent = i === currentStepIdx;

                    return (
                      <div key={step} className="flex gap-4 mb-0 last:mb-0">
                        {/* Line & dot */}
                        <div className="flex flex-col items-center">
                          <div className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 transition-all ${
                            isCurrent
                              ? 'border-g4-red bg-g4-red shadow-md shadow-g4-red/40'
                              : isActive
                                ? 'border-success bg-success'
                                : 'border-border-secondary bg-surface-hover'
                          }`} />
                          {i < TRACKING_STEPS.length - 1 && (
                            <div className={`w-0.5 h-8 ${isActive ? 'bg-success/40' : 'bg-border-primary'}`} />
                          )}
                        </div>
                        {/* Content */}
                        <div className="pb-6 -mt-0.5 flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className={`text-sm font-medium ${
                              isCurrent ? 'text-g4-red' : isActive ? 'text-text-primary' : 'text-text-muted'
                            }`}>
                              {step}
                            </span>
                            {event && (
                              <span className="text-xs text-text-muted font-mono">
                                {new Date(event.timestamp).toLocaleString('es-AR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                              </span>
                            )}
                          </div>
                          {event?.note && (
                            <p className="text-xs text-text-muted mt-0.5">{event.note}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Action */}
                {!isCompleted && (
                  <div className="mt-2 pt-4 border-t border-border-primary/50">
                    <div className="flex items-center gap-3">
                      {activeNote === shipment.id ? (
                        <>
                          <input
                            type="text"
                            value={note}
                            onChange={e => setNote(e.target.value)}
                            className="flex-1 px-3 py-2 rounded-lg bg-surface-input border border-border-primary text-text-primary text-sm focus:outline-none focus:border-g4-red"
                            placeholder="Nota opcional..."
                          />
                          <button
                            onClick={() => { queueAdvanceShipment(shipment.id, note || undefined); setNote(''); setActiveNote(null); }}
                            className="px-4 py-2 rounded-lg bg-g4-red text-white text-sm font-medium hover:bg-g4-red-dark transition-colors"
                          >
                            Confirmar
                          </button>
                          <button
                            onClick={() => { setActiveNote(null); setNote(''); }}
                            className="px-3 py-2 rounded-lg border border-border-primary text-text-secondary text-sm hover:bg-surface-hover transition-colors"
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setActiveNote(shipment.id)}
                          className="w-full px-4 py-2.5 rounded-xl bg-g4-red-dark text-white text-sm font-semibold hover:shadow-lg hover:shadow-g4-red/30 transition-all flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                          Avanzar a: {TRACKING_STEPS[currentStepIdx + 1]}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {myShipments.length === 0 && (
          <div className="bg-surface-card border border-border-primary rounded-xl p-12 text-center">
            <p className="text-text-muted">No hay envíos asignados</p>
          </div>
        )}
      </div>
    </div>
  );
}
