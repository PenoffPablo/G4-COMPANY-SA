'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  initialInvoices, initialMonthlyRevenue, initialDailyRevenue,
  initialBranchRevenue, initialProductRevenue,
  type PaymentStatus, type Invoice,
} from '@/data/mockData';

const PAYMENT_COLORS: Record<PaymentStatus, string> = {
  'Pagada': '#10b981',
  'Pendiente': '#f59e0b',
  'Vencida': '#ef4444',
  'Parcial': '#6366f1',
};

const PIE_COLORS = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#06b6d4', '#6366f1', '#8b5cf6', '#ec4899'];

const fmt = (n: number) => `$${(n / 1000).toFixed(0)}k`;
const fmtFull = (n: number) => `$${n.toLocaleString('es-AR')}`;

type TabKey = 'overview' | 'products';

export default function FinanzasPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [chartPeriod, setChartPeriod] = useState<'monthly' | 'daily'>('monthly');
  const [branchFilter, setBranchFilter] = useState<string>('all');

  const invoices = initialInvoices;
  const monthlyData = initialMonthlyRevenue;
  const dailyData = initialDailyRevenue;
  const branchData = initialBranchRevenue;
  const productData = initialProductRevenue;

  // Computed KPIs
  const totalRevenue = monthlyData.reduce((a, m) => a + m.revenue, 0);
  const totalCosts = monthlyData.reduce((a, m) => a + m.costs, 0);
  const totalProfit = monthlyData.reduce((a, m) => a + m.profit, 0);
  const profitMargin = ((totalProfit / totalRevenue) * 100).toFixed(1);
  const totalOrders = monthlyData.reduce((a, m) => a + m.orders, 0);
  const avgTicket = Math.round(totalRevenue / totalOrders);

  const paidInvoices = invoices.filter(i => i.paymentStatus === 'Pagada');
  const pendingInvoices = invoices.filter(i => i.paymentStatus === 'Pendiente' || i.paymentStatus === 'Parcial');
  const overdueInvoices = invoices.filter(i => i.paymentStatus === 'Vencida');
  const totalPending = pendingInvoices.reduce((a, i) => a + i.total, 0) + overdueInvoices.reduce((a, i) => a + i.total, 0);

  // Current vs previous month
  const currentMonth = monthlyData[monthlyData.length - 1];
  const prevMonth = monthlyData[monthlyData.length - 2];
  const revenueChange = prevMonth ? ((currentMonth.revenue - prevMonth.revenue) / prevMonth.revenue * 100).toFixed(1) : '0';

  // Filtered invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      if (branchFilter !== 'all' && inv.branchId !== branchFilter) return false;
      return true;
    });
  }, [invoices, branchFilter]);

  // Payment status distribution for pie
  const paymentDistribution = useMemo(() => {
    const counts: Record<PaymentStatus, number> = { 'Pagada': 0, 'Pendiente': 0, 'Vencida': 0, 'Parcial': 0 };
    invoices.forEach(i => { counts[i.paymentStatus] += i.total; });
    return Object.entries(counts).map(([status, value]) => ({ name: status, value })).filter(d => d.value > 0);
  }, [invoices]);

  const tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: 'overview', label: 'Resumen', icon: '📊' },
    { key: 'products', label: 'Productos', icon: '☕' },
  ];

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-surface-card border border-border-primary rounded-xl p-3 shadow-xl">
        <p className="text-xs font-semibold text-text-primary mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-xs" style={{ color: p.color }}>{p.name}: {fmtFull(p.value)}</p>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-text-primary">Finanzas</h1>
        <p className="text-sm text-text-muted mt-1">Análisis financiero, facturación y métricas de rendimiento</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 animate-fade-in delay-1">
        {[
          { label: 'Ingresos Totales', value: fmtFull(totalRevenue), sub: `${Number(revenueChange) >= 0 ? '+' : ''}${revenueChange}% vs mes ant.`, color: Number(revenueChange) >= 0 ? 'text-success' : 'text-danger', icon: '💰' },
          { label: 'Costos', value: fmtFull(totalCosts), sub: `${((totalCosts / totalRevenue) * 100).toFixed(0)}% de ingresos`, color: 'text-warning', icon: '📉' },
          { label: 'Ganancia Neta', value: fmtFull(totalProfit), sub: `Margen: ${profitMargin}%`, color: 'text-success', icon: '📈' },
          { label: 'Ticket Promedio', value: fmtFull(avgTicket), sub: `${totalOrders} pedidos`, color: 'text-info', icon: '🎫' },
          { label: 'Por Cobrar', value: fmtFull(totalPending), sub: `${pendingInvoices.length + overdueInvoices.length} facturas`, color: totalPending > 0 ? 'text-warning' : 'text-success', icon: '⏳' },
          { label: 'Fact. Vencidas', value: overdueInvoices.length.toString(), sub: overdueInvoices.length > 0 ? fmtFull(overdueInvoices.reduce((a, i) => a + i.total, 0)) : 'Sin vencidas', color: overdueInvoices.length > 0 ? 'text-danger' : 'text-success', icon: '⚠️' },
        ].map((kpi, i) => (
          <div key={kpi.label} className="bg-surface-card border border-border-primary rounded-xl p-4 hover:border-border-secondary transition-all">
            <span className="text-xl">{kpi.icon}</span>
            <p className={`text-lg font-bold mt-2 ${kpi.color} font-mono`}>{kpi.value}</p>
            <p className="text-[11px] text-text-muted mt-0.5">{kpi.label}</p>
            <p className={`text-[10px] mt-1 ${kpi.color} opacity-70`}>{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 bg-surface-card border border-border-primary rounded-xl p-1 animate-fade-in delay-2">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab.key
              ? 'bg-g4-red/10 text-g4-red border border-g4-red/20'
              : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover border border-transparent'
              }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* === TAB: OVERVIEW === */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          {/* Chart Period Toggle */}
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-text-primary">Evolución de Ingresos</h3>
            <div className="flex items-center gap-1 bg-surface-card border border-border-primary rounded-lg p-0.5">
              {(['monthly', 'daily'] as const).map(p => (
                <button key={p} onClick={() => setChartPeriod(p)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${chartPeriod === p ? 'bg-g4-red/10 text-g4-red' : 'text-text-muted hover:text-text-secondary'
                    }`}>
                  {p === 'monthly' ? 'Mensual' : 'Diario (30d)'}
                </button>
              ))}
            </div>
          </div>

          {/* Main Chart */}
          <div className="bg-surface-card border border-border-primary rounded-xl p-6">
            <ResponsiveContainer width="100%" height={320}>
              {chartPeriod === 'monthly' ? (
                <BarChart data={monthlyData} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                  <XAxis dataKey="monthLabel" tick={{ fill: '#888', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#888', fontSize: 12 }} tickFormatter={fmt} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, color: '#888' }} />
                  <Bar dataKey="revenue" name="Ingresos" fill="#dc2626" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="costs" name="Costos" fill="#444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="profit" name="Ganancia" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <AreaChart data={dailyData}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                  <XAxis dataKey="dateLabel" tick={{ fill: '#888', fontSize: 10 }} interval={2} />
                  <YAxis tick={{ fill: '#888', fontSize: 12 }} tickFormatter={fmt} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="revenue" name="Ingresos" stroke="#dc2626" fill="url(#revenueGrad)" strokeWidth={2} />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Branch & Payment Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Branch Revenue */}
            <div className="bg-surface-card border border-border-primary rounded-xl p-6">
              <h3 className="text-sm font-semibold text-text-primary mb-4">Ingresos por Sucursal</h3>
              <div className="space-y-3">
                {branchData.map((branch, i) => (
                  <div key={branch.branchId}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-text-primary">{branch.branchName}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-text-muted">{branch.orders} pedidos</span>
                        <span className="text-sm font-mono font-semibold text-text-primary">{fmtFull(branch.revenue)}</span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-surface-hover overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{
                        width: `${branch.percentage}%`,
                        backgroundColor: PIE_COLORS[i % PIE_COLORS.length],
                      }} />
                    </div>
                    <p className="text-[10px] text-text-muted mt-0.5 text-right">{branch.percentage}%</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Status Pie */}
            <div className="bg-surface-card border border-border-primary rounded-xl p-6">
              <h3 className="text-sm font-semibold text-text-primary mb-4">Estado de Pagos</h3>
              <div className="flex items-center gap-6">
                <ResponsiveContainer width="50%" height={200}>
                  <PieChart>
                    <Pie data={paymentDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                      {paymentDistribution.map((entry, i) => (
                        <Cell key={i} fill={PAYMENT_COLORS[entry.name as PaymentStatus]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => fmtFull(Number(value))} contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: 12, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-3">
                  {paymentDistribution.map(d => (
                    <div key={d.name} className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: PAYMENT_COLORS[d.name as PaymentStatus] }} />
                      <span className="text-xs text-text-secondary flex-1">{d.name}</span>
                      <span className="text-xs font-mono text-text-primary">{fmtFull(d.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}



      {/* === TAB: PRODUCTS === */}
      {activeTab === 'products' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Product Revenue Chart */}
            <div className="bg-surface-card border border-border-primary rounded-xl p-6">
              <h3 className="text-sm font-semibold text-text-primary mb-4">Ingresos por Producto</h3>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={productData} layout="vertical" barCategoryGap="15%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#888', fontSize: 11 }} tickFormatter={fmt} />
                  <YAxis type="category" dataKey="productName" tick={{ fill: '#aaa', fontSize: 11 }} width={120} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="revenue" name="Ingresos" radius={[0, 4, 4, 0]}>
                    {productData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Product Mix Pie */}
            <div className="bg-surface-card border border-border-primary rounded-xl p-6">
              <h3 className="text-sm font-semibold text-text-primary mb-4">Mix de Productos (% de ingresos)</h3>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={productData} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={2} dataKey="revenue" nameKey="productName">
                    {productData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => fmtFull(Number(value))} contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: 12, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {productData.map((p, i) => (
                  <div key={p.productId} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="text-[11px] text-text-muted truncate">{p.productName}</span>
                    <span className="text-[11px] font-mono text-text-secondary ml-auto">{p.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Product Performance Table */}
          <div className="bg-surface-card border border-border-primary rounded-xl p-6">
            <h3 className="text-sm font-semibold text-text-primary mb-4">Rendimiento por Producto</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-primary">
                    {['#', 'Producto', 'Ingresos', 'Uds. Vendidas', '% del Total', 'Tendencia'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {productData.map((p, i) => (
                    <tr key={p.productId} className="border-b border-border-primary/50 hover:bg-surface-hover/50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ backgroundColor: PIE_COLORS[i] }}>
                          {i + 1}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-text-primary">{p.productName}</td>
                      <td className="px-4 py-3 text-sm font-mono font-semibold text-text-primary">{fmtFull(p.revenue)}</td>
                      <td className="px-4 py-3 text-sm font-mono text-text-secondary">{p.unitsSold.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 rounded-full bg-surface-hover overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${p.percentage}%`, backgroundColor: PIE_COLORS[i] }} />
                          </div>
                          <span className="text-xs font-mono text-text-muted">{p.percentage}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium ${i < 3 ? 'text-success' : i < 6 ? 'text-warning' : 'text-text-muted'}`}>
                          {i < 3 ? '🔥 Top' : i < 6 ? '→ Estable' : '↓ Bajo'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}