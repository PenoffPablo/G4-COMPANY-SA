'use client';

import { useState } from 'react';
import { useData } from '@/context/DataContext';

export default function InventarioPage() {
  const { products, updateStock, addProduct, stockMovements, lowStockProducts } = useData();
  const [showStockModal, setShowStockModal] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [qty, setQty] = useState(1);
  const [moveType, setMoveType] = useState<'entrada' | 'salida'>('entrada');
  const [moveNote, setMoveNote] = useState('');

  // New product form
  const [np, setNp] = useState({ name: '', description: '', stock: 0, minStock: 10, price: 0, category: '', weight: '', origin: '' });

  const handleStock = () => {
    if (showStockModal && qty > 0) {
      updateStock(showStockModal, qty, moveType, moveNote || (moveType === 'entrada' ? 'Ingreso manual' : 'Egreso manual'));
      setShowStockModal(null);
      setQty(1);
      setMoveNote('');
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct(np);
    setNp({ name: '', description: '', stock: 0, minStock: 10, price: 0, category: '', weight: '', origin: '' });
    setShowAddModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Inventario & Stock</h1>
          <p className="text-sm text-text-muted mt-1">Control de productos de café en paquetes</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-xl bg-g4-red-dark text-white text-sm font-semibold hover:shadow-lg hover:shadow-g4-red/30 transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Producto
        </button>
      </div>

      {/* Low stock alerts */}
      {lowStockProducts.length > 0 && (
        <div className="bg-danger-bg border border-danger/20 rounded-xl p-4 animate-fade-in delay-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="animate-pulse-alert">🔴</span>
            <h3 className="text-sm font-semibold text-danger">
              ¡Atención! {lowStockProducts.length} producto(s) con stock bajo o agotado
            </h3>
          </div>
          <p className="text-xs text-text-muted">Reabastecer estos productos para evitar demoras en pedidos.</p>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product, i) => {
          const stockPercent = Math.min(100, (product.stock / (product.minStock * 3)) * 100);
          const isLow = product.stock <= product.minStock;
          const isWarning = !isLow && product.stock <= product.minStock * 1.5;

          return (
            <div key={product.id} className={`bg-surface-card border rounded-xl overflow-hidden transition-all hover:-translate-y-0.5 animate-fade-in delay-${Math.min(i + 1, 8)} ${
              isLow ? 'border-danger/40 shadow-lg shadow-danger/10' :
              isWarning ? 'border-warning/30' :
              'border-border-primary hover:border-border-secondary'
            }`}>
              {/* Alert bar */}
              {isLow && (
                <div className="px-3 py-1.5 bg-danger-bg flex items-center gap-2 animate-pulse-alert">
                  <span className="text-[10px]">⚠️</span>
                  <span className="text-[11px] font-semibold text-danger">STOCK BAJO</span>
                </div>
              )}
              {isWarning && (
                <div className="px-3 py-1.5 bg-warning-bg flex items-center gap-2">
                  <span className="text-[10px]">⚡</span>
                  <span className="text-[11px] font-semibold text-warning">Stock por debajo del óptimo</span>
                </div>
              )}

              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-text-primary">{product.name}</h4>
                    <span className="text-[11px] text-text-muted">{product.category} · {product.weight}</span>
                  </div>
                  <span className="text-xs font-mono text-g4-red font-semibold">${product.price.toLocaleString()}</span>
                </div>

                <p className="text-xs text-text-muted mb-4 line-clamp-2 leading-relaxed">{product.description}</p>

                {/* Stock bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-text-muted">Stock</span>
                    <span className={`text-sm font-bold font-mono ${
                      isLow ? 'text-danger' : isWarning ? 'text-warning' : 'text-success'
                    }`}>
                      {product.stock} <span className="text-text-muted font-normal text-[10px]">/ mín {product.minStock}</span>
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-hover overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isLow ? 'bg-danger' : isWarning ? 'bg-warning' : 'bg-success'
                      }`}
                      style={{ width: `${stockPercent}%` }}
                    />
                  </div>
                </div>

                <div className="text-[11px] text-text-muted mb-3">
                  Origen: {product.origin}
                </div>

                <button
                  onClick={() => setShowStockModal(product.id)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-hover/80 text-text-secondary text-xs font-medium hover:bg-g4-red/10 hover:text-g4-red transition-all border border-border-primary"
                >
                  Ajustar Stock
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stock Movements */}
      <div className="bg-surface-card border border-border-primary rounded-xl p-6 animate-fade-in">
        <h3 className="text-base font-semibold text-text-primary mb-4">Últimos Movimientos</h3>
        <div className="space-y-2">
          {stockMovements.slice(-8).reverse().map(mov => (
            <div key={mov.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-primary/50 hover:bg-surface-hover transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                  mov.type === 'entrada' ? 'bg-success-bg text-success' : 'bg-danger-bg text-danger'
                }`}>
                  {mov.type === 'entrada' ? '↑' : '↓'}
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">{mov.productName}</p>
                  <p className="text-xs text-text-muted">{mov.note}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-sm font-mono font-semibold ${
                  mov.type === 'entrada' ? 'text-success' : 'text-danger'
                }`}>
                  {mov.type === 'entrada' ? '+' : '-'}{mov.quantity} uds
                </span>
                <p className="text-[10px] text-text-muted">{new Date(mov.date).toLocaleDateString('es-AR')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stock Adjust Modal */}
      {showStockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-card border border-border-primary rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-scale-in">
            <h3 className="text-lg font-bold text-text-primary mb-4">Ajustar Stock</h3>
            <p className="text-sm text-text-muted mb-4">
              {products.find(p => p.id === showStockModal)?.name}
            </p>

            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setMoveType('entrada')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  moveType === 'entrada'
                    ? 'bg-success-bg text-success border border-success/30'
                    : 'bg-surface-input text-text-secondary border border-border-primary'
                }`}
              >
                ↑ Entrada
              </button>
              <button
                onClick={() => setMoveType('salida')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  moveType === 'salida'
                    ? 'bg-danger-bg text-danger border border-danger/30'
                    : 'bg-surface-input text-text-secondary border border-border-primary'
                }`}
              >
                ↓ Salida
              </button>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Cantidad</label>
                <input
                  type="number"
                  value={qty}
                  onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                  min={1}
                  className="w-full px-4 py-3 rounded-xl bg-surface-input border border-border-primary text-text-primary text-sm focus:outline-none focus:border-g4-red"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Nota (opcional)</label>
                <input
                  type="text"
                  value={moveNote}
                  onChange={e => setMoveNote(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-surface-input border border-border-primary text-text-primary text-sm focus:outline-none focus:border-g4-red"
                  placeholder="Motivo del movimiento..."
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setShowStockModal(null); setQty(1); setMoveNote(''); }}
                className="flex-1 px-4 py-2.5 rounded-xl border border-border-primary text-text-secondary text-sm font-medium hover:bg-surface-hover transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleStock}
                className="flex-1 px-4 py-2.5 rounded-xl bg-g4-red-dark text-white text-sm font-medium hover:shadow-lg hover:shadow-g4-red/30 transition-all"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-card border border-border-primary rounded-2xl p-6 max-w-lg w-full shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-text-primary mb-4">Nuevo Producto</h3>
            <form onSubmit={handleAddProduct} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-text-secondary mb-1">Nombre</label>
                  <input type="text" value={np.name} onChange={e => setNp({...np, name: e.target.value})} required
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-input border border-border-primary text-text-primary text-sm focus:outline-none focus:border-g4-red" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-text-secondary mb-1">Descripción</label>
                  <textarea value={np.description} onChange={e => setNp({...np, description: e.target.value})} rows={2}
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-input border border-border-primary text-text-primary text-sm focus:outline-none focus:border-g4-red resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">Categoría</label>
                  <input type="text" value={np.category} onChange={e => setNp({...np, category: e.target.value})} required
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-input border border-border-primary text-text-primary text-sm focus:outline-none focus:border-g4-red"
                    placeholder="Ej: Blend" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">Peso</label>
                  <input type="text" value={np.weight} onChange={e => setNp({...np, weight: e.target.value})} required
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-input border border-border-primary text-text-primary text-sm focus:outline-none focus:border-g4-red"
                    placeholder="Ej: 250g" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">Precio</label>
                  <input type="number" value={np.price || ''} onChange={e => setNp({...np, price: parseInt(e.target.value) || 0})} required
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-input border border-border-primary text-text-primary text-sm focus:outline-none focus:border-g4-red" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">Origen</label>
                  <input type="text" value={np.origin} onChange={e => setNp({...np, origin: e.target.value})} required
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-input border border-border-primary text-text-primary text-sm focus:outline-none focus:border-g4-red"
                    placeholder="Ej: Colombia" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">Stock Inicial</label>
                  <input type="number" value={np.stock || ''} onChange={e => setNp({...np, stock: parseInt(e.target.value) || 0})} required
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-input border border-border-primary text-text-primary text-sm focus:outline-none focus:border-g4-red" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">Stock Mínimo</label>
                  <input type="number" value={np.minStock || ''} onChange={e => setNp({...np, minStock: parseInt(e.target.value) || 0})} required
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-input border border-border-primary text-text-primary text-sm focus:outline-none focus:border-g4-red" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border-primary text-text-secondary text-sm font-medium hover:bg-surface-hover transition-colors">
                  Cancelar
                </button>
                <button type="submit"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-g4-red-dark text-white text-sm font-medium hover:shadow-lg hover:shadow-g4-red/30 transition-all">
                  Agregar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
