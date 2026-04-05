'use client';

import { useState } from 'react';
import { useData } from '@/context/DataContext';
import type { OrderStatus } from '@/data/mockData';

const STATUS_OPTIONS: OrderStatus[] = ['Pendiente', 'En Proceso', 'En Camino', 'Entregado', 'Cancelado'];

function statusColor(status: OrderStatus) {
  switch (status) {
    case 'Pendiente': return 'bg-warning-bg text-warning';
    case 'En Proceso': return 'bg-info-bg text-info';
    case 'En Camino': return 'bg-info-bg text-info';
    case 'Entregado': return 'bg-success-bg text-success';
    case 'Cancelado': return 'bg-danger-bg text-danger';
  }
}

export default function PedidosPage() {
  const { orders, updateOrderStatus, cancelOrder, branches } = useData();
  const [filterBranch, setFilterBranch] = useState('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [cancelModal, setCancelModal] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const filtered = orders.filter(o => {
    if (filterBranch !== 'all' && o.branchId !== filterBranch) return false;
    if (filterStatus !== 'all' && o.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Title */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-text-primary">Pedidos de Sucursales</h1>
        <p className="text-sm text-text-muted mt-1">Gestión y seguimiento de pedidos</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 animate-fade-in delay-1">
        <select
          value={filterBranch}
          onChange={e => setFilterBranch(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-surface-input border border-border-primary text-text-primary text-sm focus:outline-none focus:border-g4-red transition-colors"
        >
          <option value="all">Todas las sucursales</option>
          {branches.map(b => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-surface-input border border-border-primary text-text-primary text-sm focus:outline-none focus:border-g4-red transition-colors"
        >
          <option value="all">Todos los estados</option>
          {STATUS_OPTIONS.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <span className="ml-auto text-sm text-text-muted self-center">{filtered.length} pedido(s)</span>
      </div>

      {/* Orders Table */}
      <div className="bg-surface-card border border-border-primary rounded-xl overflow-hidden animate-fade-in delay-2">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-primary">
                <th className="text-left px-5 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Pedido</th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Sucursal</th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Fecha / Hora</th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Items</th>
                <th className="text-right px-5 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Monto</th>
                <th className="text-center px-5 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Estado</th>
                <th className="text-center px-5 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order, i) => (
                <>
                  <tr key={order.id} className={`border-b border-border-primary/50 hover:bg-surface-hover/50 transition-colors animate-fade-in delay-${Math.min(i + 1, 8)}`}>
                    <td className="px-5 py-4">
                      <span className="text-sm font-mono text-g4-red font-medium">{order.id}</span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-text-primary">{order.branchName}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-text-primary">{new Date(order.createdAt).toLocaleDateString('es-AR')}</p>
                      <p className="text-xs text-text-muted">{new Date(order.createdAt).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</p>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                        className="text-sm text-text-secondary hover:text-g4-red transition-colors flex items-center gap-1"
                      >
                        {order.items.length} producto(s)
                        <svg className={`w-3 h-3 transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="text-sm font-mono font-semibold text-text-primary">${order.total.toLocaleString()}</span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      {order.status === 'Cancelado' || order.status === 'Entregado' ? (
                        <span className={`inline-block text-xs px-3 py-1 rounded-full font-medium ${statusColor(order.status)}`}>
                          {order.status}
                        </span>
                      ) : (
                        <select
                          value={order.status}
                          onChange={e => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className={`text-xs px-3 py-1.5 rounded-full font-medium border-0 focus:outline-none focus:ring-1 focus:ring-g4-red/30 cursor-pointer ${statusColor(order.status)}`}
                        >
                          {STATUS_OPTIONS.filter(s => s !== 'Cancelado').map(s => (
                            <option key={s} value={s} className="bg-surface-primary text-text-primary">{s}</option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="px-5 py-4 text-center">
                      {order.status !== 'Cancelado' && order.status !== 'Entregado' && (
                        <button
                          onClick={() => setCancelModal(order.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-danger bg-danger-bg hover:bg-danger/20 transition-colors"
                        >
                          Cancelar
                        </button>
                      )}
                    </td>
                  </tr>
                  {/* Expanded items */}
                  {expandedOrder === order.id && (
                    <tr key={`${order.id}-items`}>
                      <td colSpan={7} className="px-5 py-3 bg-surface-primary/30">
                        <div className="space-y-1">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between px-4 py-2 rounded-lg bg-surface-hover/50 text-sm">
                              <span className="text-text-primary">{item.productName}</span>
                              <div className="flex items-center gap-6">
                                <span className="text-text-muted">x{item.quantity}</span>
                                <span className="font-mono text-text-secondary">${(item.quantity * item.unitPrice).toLocaleString()}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3 p-4">
          {filtered.map(order => (
            <div key={order.id} className="bg-surface-primary/50 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono text-g4-red font-medium">{order.id}</span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">{order.branchName}</p>
                <p className="text-xs text-text-muted">
                  {new Date(order.createdAt).toLocaleDateString('es-AR')} - {new Date(order.createdAt).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">{order.items.length} producto(s)</span>
                <span className="text-base font-mono font-bold text-text-primary">${order.total.toLocaleString()}</span>
              </div>
              {order.status !== 'Cancelado' && order.status !== 'Entregado' && (
                <div className="flex gap-2">
                  <select
                    value={order.status}
                    onChange={e => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                    className="flex-1 text-xs px-3 py-2 rounded-lg bg-surface-input border border-border-primary text-text-primary focus:outline-none"
                  >
                    {STATUS_OPTIONS.filter(s => s !== 'Cancelado').map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => setCancelModal(order.id)}
                    className="px-3 py-2 rounded-lg text-xs font-medium text-danger bg-danger-bg"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-muted">No se encontraron pedidos con los filtros seleccionados</p>
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {cancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-card border border-border-primary rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-scale-in">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-danger-bg flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">¿Cancelar pedido?</h3>
              <p className="text-sm text-text-muted mb-6">
                Esta acción cancelará el pedido <strong className="text-text-secondary">{cancelModal}</strong>. Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setCancelModal(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border-primary text-text-secondary text-sm font-medium hover:bg-surface-hover transition-colors"
                >
                  Volver
                </button>
                <button
                  onClick={() => { cancelOrder(cancelModal); setCancelModal(null); }}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-danger text-white text-sm font-medium hover:bg-danger/90 transition-colors"
                >
                  Sí, Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
