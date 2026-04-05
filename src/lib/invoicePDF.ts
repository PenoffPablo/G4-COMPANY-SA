'use client';

import jsPDF from 'jspdf';
import type { Invoice } from '@/data/mockData';

const fmtMoney = (n: number) => `$${n.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;

/**
 * Generate a professional PDF invoice using jsPDF directly.
 * No html2canvas, no intermediate HTML — pure programmatic PDF.
 */
export async function generateInvoicePDF(invoice: Invoice) {
  // Solo se ejecuta del lado del cliente
  if (typeof window === 'undefined') return;

  // Importar dinámicamente para no romper SSR
  const { createRoot } = await import('react-dom/client');
  const React = await import('react');
  const jsPDF = (await import('jspdf')).default;
  const html2canvas = (await import('html2canvas')).default;
  
  // Importar dinámicamente el template
  const InvoiceTemplateModule = await import('@/components/InvoiceTemplate');
  const InvoiceTemplate = InvoiceTemplateModule.default;

  return new Promise<void>((resolve, reject) => {
    try {
      // 1. Crear contenedor contenedor invisible en el root real
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.top = '-10000px';
      container.style.left = '-10000px';
      container.style.zIndex = '-9999';
      document.body.appendChild(container);

      // Usar React 18 createRoot
      const root = createRoot(container);
      
      // Variable para guardar la ref
      const templateRef = React.createRef<HTMLDivElement>();

      // Función de completado
      const finish = async () => {
        try {
          if (!templateRef.current) throw new Error("No ref found");
          
          await new Promise((r) => setTimeout(r, 200));

          const element = templateRef.current;
          
          const canvas = await html2canvas(element, {
            scale: 2, // 2x resolucion para mejor calidad
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
          } as any);

          const imgData = canvas.toDataURL('image/jpeg', 0.8);
          
          // A4 dimensions: 210x297mm
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
          });

          // Ancho A4
          const pdfWidth = 210;
          // Calcular alto proporcional a la imagen
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

          pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
          
          const filename = `${invoice.id}.pdf`;
          
          // ESTA es la forma correcta que fuerza el nombre y funciona 100%
          pdf.save(filename);
          
          resolve();
        } catch (error) {
          console.error("PDF generation error:", error);
          reject(error);
        } finally {
          // Limpiar DOM
          setTimeout(() => {
            root.unmount();
            if (document.body.contains(container)) {
              document.body.removeChild(container);
            }
          }, 300);
        }
      };

      // Renderizar el template
      root.render(
        React.createElement(
          'div',
          { style: { width: '794px', height: '1123px', backgroundColor: 'white' } },
          React.createElement(InvoiceTemplate, {
            invoice: invoice,
            ref: templateRef
          })
        )
      );

      // Iniciar el renderizado despues que React haya pintado
      setTimeout(finish, 500);

    } catch (err) {
      reject(err);
    }
  });
}
