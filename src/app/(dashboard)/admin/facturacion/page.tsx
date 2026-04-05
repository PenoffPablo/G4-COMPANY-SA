'use client';

import React, { useState, useMemo } from 'react';
import { initialFiscalDocuments, FiscalDocCategory, FiscalDocType, initialInvoices, Invoice, PaymentStatus } from '@/data/mockData';
import { generateInvoicePDF } from '@/lib/invoicePDF';

const fmtMoney = (n: number) => `$${n.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const DOC_COLORS: Record<FiscalDocType, { bg: string, text: string, border: string }> = {
  'Factura A': { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20' },
  'Factura B': { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/20' },
  'Factura C': { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20' },
  'Nota de Crédito': { bg: 'bg-rose-500/10', text: 'text-rose-500', border: 'border-rose-500/20' },
};

const PAYMENT_COLORS: Record<PaymentStatus, string> = {
  'Pagada': '#10b981',
  'Pendiente': '#f59e0b',
  'Vencida': '#ef4444',
  'Parcial': '#6366f1',
};

export default function FacturacionPage() {
  const [activeTab, setActiveTab] = useState<FiscalDocCategory>('Venta');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedMsg, setUploadedMsg] = useState('');
  const [expandedInvoice, setExpandedInvoice] = useState<string | null>(null);

  const [generatingPDF, setGeneratingPDF] = useState<string | null>(null);

  const handleDownloadPDF = async (inv: Invoice) => {
    try {
      setGeneratingPDF(inv.id);
      await generateInvoicePDF(inv);
    } catch (error: any) {
      console.error('Error generando PDF:', error);
      alert('Hubo un error al generar el PDF: ' + (error?.message || error));
    } finally {
      setGeneratingPDF(null);
    }
  };

  const comprasDocs = useMemo(() => initialFiscalDocuments.filter(d => d.categoria === 'Compra'), []);
  const ventasDocs = initialInvoices;

  const totalNetoCompras = comprasDocs.reduce((acc, d) => acc + d.netoGrabado, 0);
  const totalIvaCompras = comprasDocs.reduce((acc, d) => acc + d.iva, 0);
  const totalFacturadoCompras = comprasDocs.reduce((acc, d) => acc + d.total, 0);
  const totalPendienteCompras = comprasDocs.filter(d => d.estado === 'Pendiente').reduce((acc, d) => acc + d.total, 0);

  const totalNetoVentas = ventasDocs.reduce((acc, d) => acc + d.subtotal, 0);
  const totalIvaVentas = ventasDocs.reduce((acc, d) => acc + d.tax, 0);
  const totalFacturadoVentas = ventasDocs.reduce((acc, d) => acc + d.total, 0);
  const totalPendienteVentas = ventasDocs.filter(d => d.paymentStatus === 'Pendiente' || d.paymentStatus === 'Vencida' || d.paymentStatus === 'Parcial').reduce((acc, d) => acc + d.total, 0);

  const totalNeto = activeTab === 'Compra' ? totalNetoCompras : totalNetoVentas;
  const totalIva = activeTab === 'Compra' ? totalIvaCompras : totalIvaVentas;
  const totalFacturado = activeTab === 'Compra' ? totalFacturadoCompras : totalFacturadoVentas;
  const totalPendiente = activeTab === 'Compra' ? totalPendienteCompras : totalPendienteVentas;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setUploadedMsg('Comprobante procesado y guardado digitalmente.');
    setTimeout(() => setUploadedMsg(''), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Facturador G4</h1>
          <p className="text-sm text-text-muted mt-1">Gestión centralizada de facturación emitida y comprobantes de proveedores</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-surface-card border border-border-primary rounded-xl p-1 w-full md:w-fit animate-fade-in delay-1">
        {(['Venta', 'Compra'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`w-36 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-g4-red/10 text-g4-red border border-g4-red/20'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover border border-transparent'
            }`}
          >
            {tab === 'Venta' ? 'Facturación a Clientes' : 'Compras y Costos'}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in delay-2">
        {[
          { label: 'Neto Gravado', value: fmtMoney(totalNeto), color: 'text-text-primary', icon: '💎' },
          { label: activeTab === 'Venta' ? 'IVA Débito Fiscal' : 'IVA Crédito Fiscal', value: fmtMoney(totalIva), color: 'text-sky-500', icon: '🏛️' },
          { label: 'Total Operado', value: fmtMoney(totalFacturado), color: 'text-success', icon: '💰' },
          { label: activeTab === 'Venta' ? 'Por Cobrar' : 'Por Pagar', value: fmtMoney(totalPendiente), color: totalPendiente > 0 ? 'text-warning' : 'text-success', icon: '⏳' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-surface-card border border-border-primary rounded-xl p-5 hover:border-border-secondary transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xl">{kpi.icon}</span>
            </div>
            <p className={`text-xl font-bold mt-1 ${kpi.color} font-mono tracking-tight`}>{kpi.value}</p>
            <p className="text-xs text-text-muted mt-1 font-medium">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Upload Zone (Only for Compras/Costos usually, but let's leave it for both) */}
      <div className="animate-fade-in delay-3">
        <label className="block text-sm font-semibold text-text-primary mb-3">
          {activeTab === 'Venta' ? 'Cargar comprobante externo de venta' : 'Cargar nuevo documento de costo'}
        </label>
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden
            ${isDragging 
              ? 'border-g4-red bg-g4-red/5 scale-[1.01]' 
              : 'border-border-primary bg-surface-card hover:border-text-muted hover:bg-surface-hover'}`}
        >
          <div className="w-12 h-12 rounded-full bg-surface-hover flex items-center justify-center text-text-secondary mb-4 shadow-inner">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <p className="text-sm font-medium text-text-primary mb-1">
            Arrastra tu PDF aquí o <span className="text-g4-red underline decoration-g4-red/30 underline-offset-2 hover:decoration-g4-red transition-all">explora tus archivos</span>
          </p>
          <p className="text-xs text-text-muted">Formatos soportados: .pdf, .xml (Facturas AFIP)</p>
          
          {uploadedMsg && (
            <div className="absolute inset-0 bg-success/10 backdrop-blur-sm flex flex-col items-center justify-center animate-fade-in z-10">
              <div className="w-10 h-10 rounded-full bg-success text-white flex items-center justify-center mb-2 shadow-lg shadow-success/40 scale-in-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
              <p className="text-success font-semibold text-sm">{uploadedMsg}</p>
            </div>
          )}
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-surface-card border border-border-primary rounded-xl overflow-hidden animate-fade-in delay-4">
        <div className="px-6 py-4 border-b border-border-primary flex items-center justify-between bg-surface-hover/30">
          <h3 className="text-sm font-semibold text-text-primary">Registros de {activeTab === 'Venta' ? 'Ventas' : 'Compras y Costos'}</h3>
          <span className="px-2.5 py-1 rounded-full bg-surface-input text-text-muted text-[10px] font-bold tracking-wider">
            {activeTab === 'Venta' ? ventasDocs.length : comprasDocs.length} DOCUMENTOS
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-primary">
                {(activeTab === 'Venta' 
                  ? ['Factura', 'Cliente / Sucursal', 'Fecha', 'Método', 'Neto', 'IVA', 'Total', 'Estado', 'Acción']
                  : ['Tipo', 'Número / ID', 'Emisor/Receptor', 'CUIT', 'Fecha', 'Neto', 'IVA', 'Total', 'Estado', 'Archivo']
                ).map(head => (
                  <th key={head} className="px-5 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider whitespace-nowrap">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activeTab === 'Venta' && ventasDocs.map((inv) => (
                <React.Fragment key={inv.id}>
                  <tr className="border-b border-border-primary/50 hover:bg-surface-hover/50 transition-colors cursor-pointer"
                    onClick={() => setExpandedInvoice(expandedInvoice === inv.id ? null : inv.id)}>
                    <td className="px-5 py-4">
                      <span className="text-sm font-mono text-g4-red font-bold">{inv.id}</span>
                      {inv.orderId && <p className="text-[10px] text-text-muted mt-0.5">Pedido: {inv.orderId}</p>}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-text-primary">{inv.branchName}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-text-primary">{new Date(inv.issuedAt).toLocaleDateString('es-AR')}</p>
                      <p className="text-[10px] text-text-muted">Vence: {new Date(inv.dueDate).toLocaleDateString('es-AR')}</p>
                    </td>
                    <td className="px-5 py-4 text-xs text-text-secondary">{inv.paymentMethod}</td>
                    <td className="px-5 py-4 text-sm font-mono text-text-secondary">{fmtMoney(inv.subtotal)}</td>
                    <td className="px-5 py-4 text-sm font-mono text-text-muted">{fmtMoney(inv.tax)}</td>
                    <td className="px-5 py-4 text-sm font-mono font-bold text-text-primary">{fmtMoney(inv.total)}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-block text-[11px] px-2.5 py-1 rounded-full font-bold tracking-wide`}
                        style={{ backgroundColor: PAYMENT_COLORS[inv.paymentStatus] + '20', color: PAYMENT_COLORS[inv.paymentStatus] }}>
                        {inv.paymentStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        title="Generar PDF"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadPDF(inv);
                        }}
                        disabled={generatingPDF === inv.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-g4-red/10 text-g4-red text-xs font-bold hover:bg-g4-red/20 transition-colors disabled:opacity-50"
                      >
                        {generatingPDF === inv.id ? (
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        )}
                        PDF
                      </button>
                    </td>
                  </tr>
                  
                  {expandedInvoice === inv.id && (
                    <tr key={`${inv.id}-details`}>
                      <td colSpan={10} className="px-5 py-4 bg-surface-primary/30 border-b border-border-primary/50 shadow-inner">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">Detalle del Comprobante {inv.id}</p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadPDF(inv);
                            }}
                            disabled={generatingPDF === inv.id}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-g4-red-dark text-white text-xs font-bold hover:scale-105 hover:shadow-lg hover:shadow-g4-red/30 transition-all disabled:opacity-50"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            {generatingPDF === inv.id ? 'Generando Documento...' : 'Descargar Factura PDF'}
                          </button>
                        </div>
                        <div className="space-y-1">
                          {inv.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-surface-hover/50 text-sm">
                              <span className="text-text-primary font-medium">{item.productName}</span>
                              <div className="flex items-center gap-8 text-xs">
                                <span className="text-text-muted">x {item.quantity}</span>
                                <span className="font-mono text-text-muted">@ {fmtMoney(item.unitPrice)}</span>
                                <span className="font-mono font-bold text-text-primary">{fmtMoney(item.subtotal)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        {inv.paidAt && (
                          <p className="text-xs font-medium text-success mt-3">✓ Pagada el {new Date(inv.paidAt).toLocaleDateString('es-AR')}</p>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}

              {activeTab === 'Compra' && comprasDocs.map((doc) => {
                const style = DOC_COLORS[doc.tipo];
                return (
                  <tr key={doc.id} className="border-b border-border-primary/30 hover:bg-surface-hover/50 transition-colors">
                    <td className="px-5 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded border text-[10px] font-bold tracking-wide ${style.bg} ${style.text} ${style.border}`}>
                        {doc.tipo}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-mono text-text-primary">{doc.numero}</p>
                      <p className="text-[10px] font-mono text-text-muted mt-0.5">{doc.id}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-text-primary truncate max-w-[150px]">{doc.emisor}</p>
                    </td>
                    <td className="px-5 py-4 text-xs font-mono text-text-secondary">{doc.cuit}</td>
                    <td className="px-5 py-4 text-sm text-text-secondary">{new Date(doc.fechaEmision).toLocaleDateString('es-AR')}</td>
                    <td className="px-5 py-4 text-sm font-mono text-text-secondary">{fmtMoney(doc.netoGrabado)}</td>
                    <td className="px-5 py-4 text-sm font-mono text-text-muted">{fmtMoney(doc.iva)}</td>
                    <td className="px-5 py-4 text-sm font-mono font-bold text-text-primary">{fmtMoney(doc.total)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${doc.estado === 'Pagado' ? 'bg-success' : 'bg-warning'}`} />
                        <span className="text-xs text-text-secondary font-medium">{doc.estado}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <button className="p-2 rounded-lg bg-surface-input text-text-muted hover:text-g4-red hover:bg-g4-red/10 transition-colors group relative" title="Ver PDF Original">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                )
              })}

              {((activeTab === 'Venta' && ventasDocs.length === 0) || (activeTab === 'Compra' && comprasDocs.length === 0)) && (
                <tr>
                  <td colSpan={10} className="px-5 py-12 text-center text-text-muted">
                    No hay documentos registrados para esta categoría.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
