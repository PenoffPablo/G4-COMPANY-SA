'use client';

import React, { forwardRef } from 'react';
import type { Invoice } from '@/data/mockData';

interface InvoiceTemplateProps {
  invoice: Invoice;
}

const InvoiceTemplate = forwardRef<HTMLDivElement, InvoiceTemplateProps>(({ invoice }, ref) => {
  const currentDate = new Date(invoice.issuedAt).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const compNro = invoice.id.replace(/\D/g, '').padEnd(8, '0').slice(0, 8); // e.g. 00000001
  const ptovta = '00100';

  return (
    <div ref={ref} className="p-8 w-[794px] h-[1123px] mx-auto box-border flex flex-col bg-[#ffffff] text-[#000000] font-sans text-xs" style={{ fontFamily: 'Arial, sans-serif' }}>
      
      <div className="flex-1 flex flex-col border-2 border-[#000000] overflow-hidden relative">
        <div className="border-b-2 border-[#000000] text-center py-1 font-bold text-[13px] tracking-widest uppercase bg-[#ffffff]">
          ORIGINAL
        </div>

        {/* Company & Invoice Info */}
        <div className="flex relative border-b-2 border-[#000000] min-h-[160px]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center bg-[#ffffff] border-x-2 border-b-2 border-[#000000] w-14 h-16 z-10 font-bold">
            <span className="text-[36px] font-black leading-none mt-1">X</span>
            <span className="text-[8px] mt-1 font-bold">COD. 00</span>
          </div>

          <div className="w-1/2 p-3 pr-10 border-r-2 border-[#000000] flex flex-col text-[11px] justify-between">
            <div className="mt-8">
              <span className="font-bold">Razón Social:</span> <span className="font-bold text-[14px] ml-1">G4 COMPANY S.R.L.</span>
            </div>
            <div>
              <span className="font-bold">Domicilio Comercial:</span> Av. Principal 1200, CABA<br/>Argentina
            </div>
            <div>
              <span className="font-bold">Condición frente al IVA:</span> Responsable Inscripto
            </div>
          </div>

          <div className="w-1/2 p-3 pl-8 flex flex-col relative justify-between">
            <h2 className="text-[16px] font-bold mt-1 tracking-wide">COMPROBANTE INTERNO</h2>
            
            <div className="text-[11px] font-bold mt-1">
              Compr. Nro: <span className="font-normal ml-8">{ptovta}-{compNro}</span>
            </div>
            <div className="text-[11px] font-bold">
              Fecha de Emisión: <span className="font-normal ml-3">{currentDate}</span>
            </div>

            <div className="mt-1 text-[11px] font-bold space-y-0.5">
              <div>CUIT: <span className="font-normal ml-16">30-71234567-8</span></div>
              <div>Ingresos Brutos: <span className="font-normal ml-3">30-71234567-8</span></div>
              <div>Fecha de Inicio de Actividades: <span className="font-normal ml-1">01/01/2026</span></div>
              <div className="pt-0.5">DOCUMENTO NO VÁLIDO COMO FACTURA</div>
            </div>
          </div>
        </div>

        {/* Client Info */}
        <div className="flex flex-col border-b-2 border-[#000000] p-2 text-[10px] space-y-1 bg-[#ffffff]">
          <div className="flex justify-between">
            <div className="w-[50%]"><span className="font-bold">Señor(es):</span> {invoice.branchName}</div>
            <div className="w-[50%]"><span className="font-bold">Domicilio:</span> {invoice.branchName === 'Sucursal Centro' ? 'Centro 123' : 'Interior 456'}</div>
          </div>
          <div><span className="font-bold">CUIT / DNI:</span> 20-12345678-9</div>
          <div><span className="font-bold">ID Cliente:</span> #{invoice.branchId || '0000'}</div>
        </div>

        {/* Divisa */}
        <div className="flex flex-col border-b-2 border-[#000000] p-2 text-[10px] space-y-1 bg-[#ffffff]">
          <div><span className="font-bold">Divisa:</span> ARS - Pesos Argentinos</div>
          <div><span className="font-bold">Destino del Comprobante:</span> SISTEMA G4 LOGÍSTICA</div>
        </div>

        {/* Info adicional block */}
        <div className="flex flex-col border-b-2 border-[#000000] p-2 text-[8px] bg-[#ffffff] h-10 justify-end">
          <p>Documento Interno - Operación registrada en la plataforma bajo ID: {invoice.id} - Monto Total Facturado: ARS {invoice.total.toFixed(2)}</p>
        </div>

        {/* Forma pago */}
        <div className="flex border-b-2 border-[#000000] text-[10px] bg-[#ffffff] divide-x-2 divide-[#000000]">
          <div className="w-[50%] p-2 flex gap-4 items-center">
            <span className="font-bold">Forma de Pago:</span>
            <span>{invoice.paymentMethod || 'Contado'}</span>
          </div>
          <div className="w-[50%] p-2 flex gap-4 items-center">
            <span className="font-bold">Estado:</span>
            <span className="bg-[#e6e6e6] px-2 py-0.5 rounded font-bold border border-[#000000] uppercase tracking-wider">{invoice.paymentStatus}</span>
          </div>
        </div>

        {/* Items Table */}
        <div className="flex-1 flex flex-col">
          <table className="w-full text-[9px] border-collapse bg-[#ffffff]">
            <thead className="bg-[#e6e6e6]">
              <tr className="border-b-2 border-[#000000] text-center">
                <th className="py-1.5 px-1 font-bold border-r-2 border-[#000000] w-[6%]">Ítem</th>
                <th className="py-1.5 px-2 font-bold border-r-2 border-[#000000] text-left">Descripción</th>
                <th className="py-1.5 px-1 font-bold border-r-2 border-[#000000] w-[15%]">Cantidad</th>
                <th className="py-1.5 px-1 font-bold border-r-2 border-[#000000] w-[18%]">Precio Unit. (ARS)</th>
                <th className="py-1.5 px-2 font-bold w-[18%] text-right">Total por ítem (ARS)</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, idx) => (
                <React.Fragment key={idx}>
                  <tr>
                    <td className="py-2 px-1 text-center font-bold" valign="top">{(idx + 1).toString().padStart(4, '0')}</td>
                    <td className="py-2 px-2 text-left" valign="top">{item.productId} - {item.productName}</td>
                    <td className="py-2 px-1 text-right border-x-2 border-transparent border-r-transparent border-l-transparent" valign="top">
                      {item.quantity.toFixed(6).replace('.', ',')}
                      <div className="text-[8px] font-bold mt-1 text-center">U. Medida: kg/unidad</div>
                    </td>
                    <td className="py-2 px-1 text-right" valign="top">{item.unitPrice.toFixed(6).replace('.', ',')}</td>
                    <td className="py-2 px-2 text-right font-bold" valign="top">{item.subtotal.toFixed(2).replace('.', ',')}</td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="flex border-t-2 border-[#000000] min-h-[90px] bg-[#ffffff]">
          {/* Left Tipo Cambio */}
          <div className="w-[50%] p-2 text-[10px]">
             <span className="font-bold underline">Tipo de Cambio: 1,000000</span>
          </div>
          {/* Summary right */}
          <div className="w-[50%] flex flex-col justify-end p-2 text-[11px] items-end pb-4">
            <div className="font-bold mb-3 underline">
              Divisa: ARS - Pesos Argentinos
            </div>
            <div className="flex justify-between w-[200px] font-bold text-[13px]">
              <span>Importe Total: <span className="text-[10px] ml-1">ARS</span></span>
              <span>{invoice.total.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>
        </div>

        {/* Footer Bar inside border */}
        <div className="h-4 bg-[#ffffff] border-t-2 border-[#000000] w-full"></div>
      </div>

      {/* Internal Non-AFIP Footer */}
      <div className="flex items-center px-1 mt-2 h-20">
        <div className="w-[100px] h-[64px] flex items-center justify-center">
          {/* Mock QR Placeholder */}
          <div className="w-16 h-16 bg-[#e0e0e0] border border-[#000000] grid grid-cols-4 grid-rows-4 p-1 gap-px opacity-80">
            {Array.from({length: 16}).map((_, i) => <div key={i} className={i%2===0 || i%3===0 ? 'bg-[#000000]' : 'bg-transparent'}></div>)}
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-center px-4">
          <span className="font-black text-[18px] italic mb-0.5 uppercase tracking-widest text-[#000000]">G4 LOGÍSTICA</span>
          <span className="text-[9px] font-bold italic mb-1 text-[#000000]">Comprobante validado por sistema interno.</span>
          <span className="text-[7.5px] italic font-medium leading-tight text-[#000000]">Este documento es de uso exclusivamente interno y carece de validez fiscal.<br/>No exigible como comprobante respaldatorio ante entidades recaudadoras.<br/>Impreso desde G4 Dashboard el {new Date().toLocaleDateString('es-AR')}.</span>
        </div>
        <div className="flex flex-col text-[11px] font-bold text-right py-2">
          <div className="flex justify-end gap-6 w-[250px]"><span className="text-right whitespace-nowrap tracking-wide">ID SISTEMA N°:</span> <span className="text-right min-w-[120px]">{Math.floor(Math.random()*10000000000000).toString().padStart(14, '0')}</span></div>
          <div className="flex justify-end gap-6 w-[250px]"><span className="text-right whitespace-nowrap tracking-wide">Fecha de Impresión:</span> <span className="text-right min-w-[120px]">{currentDate}</span></div>
        </div>
      </div>
    </div>
  );
});

InvoiceTemplate.displayName = 'InvoiceTemplate';

export default InvoiceTemplate;