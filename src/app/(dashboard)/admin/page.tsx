'use client';

import { useData } from '@/context/DataContext';
import Link from 'next/link';

export default function AdminDashboard() {
  const { orders, products, shipments, lowStockProducts, operators } = useData();

  const todayOrders = orders.filter(o => {
    const d = new Date(o.createdAt);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  });
  const pendingOrders = orders.filter(o => o.status === 'Pendiente');
  const inTransit = orders.filter(o => o.status === 'En Camino');
  const delivered = orders.filter(o => o.status === 'Entregado');
  const activeOperators = operators.filter(o => o.active);

  const kpis = [
    { label: 'Pedidos Hoy', value: todayOrders.length, color: 'text-info', bg: 'bg-info-bg', icon: '📦' },
    { label: 'Pendientes', value: pendingOrders.length, color: 'text-warning', bg: 'bg-warning-bg', icon: '⏳' },
    { label: 'En Camino', value: inTransit.length, color: 'text-info', bg: 'bg-info-bg', icon: '🚛' },
    { label: 'Entregados', value: delivered.length, color: 'text-success', bg: 'bg-success-bg', icon: '✅' },
    { label: 'Alertas Stock', value: lowStockProducts.length, color: lowStockProducts.length > 0 ? 'text-danger' : 'text-success', bg: lowStockProducts.length > 0 ? 'bg-danger-bg' : 'bg-success-bg', icon: '⚠️' },
    { label: 'Operarios Activos', value: activeOperators.length, color: 'text-success', bg: 'bg-success-bg', icon: '👷' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Title */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-sm text-text-muted mt-1">Resumen general del sistema de logística</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, i) => (
          <div key={kpi.label} className={`bg-surface-card border border-border-primary rounded-xl p-4 hover:border-border-secondary transition-all animate-fade-in delay-${i + 1}`}>
            <div className={`w-10 h-10 rounded-lg ${kpi.bg} flex items-center justify-center text-xl mb-3`}>
              {kpi.icon}
            </div>
            <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
            <p className="text-xs text-text-muted mt-0.5">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {lowStockProducts.length > 0 && (
        <div className="bg-danger-bg border border-danger/20 rounded-xl p-4 animate-fade-in">
          <div className="flex items-center gap-3 mb-3">
            <span className="animate-pulse-alert text-lg">🔴</span>
            <h3 className="text-sm font-semibold text-danger">Productos con Stock Bajo</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {lowStockProducts.map(p => (
              <div key={p.id} className="flex items-center justify-between bg-surface-primary/50 rounded-lg px-3 py-2">
                <span className="text-sm text-text-primary">{p.name}</span>
                <span className="text-xs font-mono text-danger font-bold">{p.stock} uds</span>
              </div>
            ))}
          </div>
          <Link href="/inventario" className="inline-block mt-3 text-sm text-danger hover:text-g4-red-dark font-medium transition-colors">
            Gestionar Inventario →
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-surface-card border border-border-primary rounded-xl p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-text-primary">Últimos Pedidos</h3>
            <Link href="/admin/pedidos" className="text-sm text-g4-red hover:text-g4-red-dark transition-colors">
              Ver todos →
            </Link>
          </div>
          <div className="space-y-3">
            {orders.slice(0, 5).map(order => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-primary/50 hover:bg-surface-hover transition-colors">
                <div>
                  <p className="text-sm font-medium text-text-primary">{order.branchName}</p>
                  <p className="text-xs text-text-muted">{new Date(order.createdAt).toLocaleDateString('es-AR')}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono text-text-primary">${order.total.toLocaleString()}</p>
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${
                    order.status === 'Pendiente' ? 'bg-warning-bg text-warning' :
                    order.status === 'En Proceso' ? 'bg-info-bg text-info' :
                    order.status === 'En Camino' ? 'bg-info-bg text-info' :
                    order.status === 'Entregado' ? 'bg-success-bg text-success' :
                    'bg-danger-bg text-danger'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Shipments */}
        <div className="bg-surface-card border border-border-primary rounded-xl p-6 animate-fade-in delay-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-text-primary">Envíos Activos</h3>
          </div>
          <div className="space-y-3">
            {shipments.filter(s => s.currentStatus !== 'Entregado').map(shipment => (
              <div key={shipment.id} className="p-3 rounded-lg bg-surface-primary/50 hover:bg-surface-hover transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-text-primary">{shipment.branchName}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-info-bg text-info font-medium">
                    {shipment.currentStatus}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-text-muted">Operario: {shipment.operatorName}</p>
                  <p className="text-xs text-text-muted">Pedido: {shipment.orderId}</p>
                </div>
              </div>
            ))}
            {shipments.filter(s => s.currentStatus !== 'Entregado').length === 0 && (
              <p className="text-sm text-text-muted text-center py-6">No hay envíos activos</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
