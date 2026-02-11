import jsPDF from 'jspdf';

export const generateQuotationPDF = (quotationData, logoDataUrl = null) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  let yPosition = 20;

  if (logoDataUrl) {
    try {
      doc.addImage(logoDataUrl, 'PNG', 15, yPosition, 40, 40);
      yPosition += 45;
    } catch (error) {
      console.error('Error adding logo:', error);
      yPosition += 10;
    }
  }

  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('PRESUPUESTO', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const today = new Date().toLocaleDateString('es-UY');
  doc.text(`Fecha: ${today}`, 15, yPosition);
  yPosition += 10;

  if (quotationData.clientName) {
    doc.setFont('helvetica', 'bold');
    doc.text('Cliente:', 15, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(quotationData.clientName, 40, yPosition);
    yPosition += 7;
  }

  if (quotationData.vehicle) {
    doc.setFont('helvetica', 'bold');
    doc.text('Vehículo:', 15, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(quotationData.vehicle, 40, yPosition);
    yPosition += 7;
  }

  yPosition += 5;

  doc.setFillColor(66, 66, 66);
  doc.rect(15, yPosition, pageWidth - 30, 8, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Descripción', 17, yPosition + 5.5);
  doc.text('Cant.', pageWidth - 75, yPosition + 5.5);
  doc.text('P. Unit.', pageWidth - 55, yPosition + 5.5);
  doc.text('Total', pageWidth - 30, yPosition + 5.5);

  yPosition += 10;
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');

  let total = 0;
  quotationData.items.forEach((item, index) => {
    const itemTotal = item.quantity * item.unitPrice;
    total += itemTotal;

    if (index % 2 === 0) {
      doc.setFillColor(245, 245, 245);
      doc.rect(15, yPosition - 4, pageWidth - 30, 7, 'F');
    }

    const maxWidth = pageWidth - 100;
    const lines = doc.splitTextToSize(item.description, maxWidth);
    doc.text(lines, 17, yPosition);

    doc.text(item.quantity.toString(), pageWidth - 75, yPosition);
    doc.text(item.unitPrice.toLocaleString('es-UY'), pageWidth - 55, yPosition);
    doc.text(itemTotal.toLocaleString('es-UY'), pageWidth - 30, yPosition);

    yPosition += lines.length * 5 + 2;

    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 20;
    }
  });

  yPosition += 5;
  doc.setLineWidth(0.5);
  doc.line(15, yPosition, pageWidth - 15, yPosition);
  yPosition += 8;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('TOTAL:', pageWidth - 70, yPosition);
  doc.text(`$U ${total.toLocaleString('es-UY')}`, pageWidth - 30, yPosition, { align: 'right' });

  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(128, 128, 128);
  doc.text('Gracias por su confianza', pageWidth / 2, pageHeight - 15, { align: 'center' });

  return doc;
};

export const downloadPDF = (quotationData, logoDataUrl = null) => {
  const doc = generateQuotationPDF(quotationData, logoDataUrl);
  const fileName = `cotizacion_${quotationData.clientName || 'cliente'}_${new Date().getTime()}.pdf`;
  doc.save(fileName);
};
