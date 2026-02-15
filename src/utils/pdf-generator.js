import jsPDF from 'jspdf';

const CURRENCY_SYMBOLS = {
  'UYU': '$U',
  'USD': 'US$',
  'EUR': '€',
  'ARS': 'AR$',
  'BRL': 'R$',
  'CLP': 'CL$',
  'MXN': 'MX$',
  'PEN': 'S/',
  'COP': 'CO$',
};

const getCurrencySymbol = (currency) => {
  return CURRENCY_SYMBOLS[currency] || currency;
};

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 66, g: 66, b: 66 };
};

const formatNumber = (num) => {
  if (num % 1 === 0) {
    return num.toLocaleString('es-UY');
  } else {
    return num.toLocaleString('es-UY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
};

export const generateQuotationPDF = (quotationData, logoDataUrl = null, branchConfig = {}) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const brandColor = branchConfig.branchColor || '#424242';
  const rgb = hexToRgb(brandColor);

  let yPosition = 15;

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('PRESUPUESTO', pageWidth / 2, yPosition, { align: 'center' });

  yPosition = 25;
  let leftYPos = yPosition;

  if (branchConfig.branchName || branchConfig.branchMail || branchConfig.branchPhone || branchConfig.branchAddress) {
    doc.setFontSize(10);

    if (branchConfig.branchName) {
      doc.setFont('helvetica', 'bold');
      doc.text(branchConfig.branchName, 15, leftYPos);
      leftYPos += 5;
    }

    if (branchConfig.branchAddress) {
      doc.setFont('helvetica', 'bold');
      const addressLabel = 'Dirección: ';
      const addressLabelWidth = doc.getTextWidth(addressLabel);
      doc.text(addressLabel, 15, leftYPos);
      doc.setFont('helvetica', 'normal');
      doc.text(branchConfig.branchAddress, 15 + addressLabelWidth, leftYPos);
      leftYPos += 5;
    }

    if (branchConfig.branchPhone) {
      doc.setFont('helvetica', 'bold');
      const phoneLabel = 'Teléfono: ';
      const phoneLabelWidth = doc.getTextWidth(phoneLabel);
      doc.text(phoneLabel, 15, leftYPos);
      doc.setFont('helvetica', 'normal');
      doc.text(branchConfig.branchPhone, 15 + phoneLabelWidth, leftYPos);
      leftYPos += 5;
    }

    if (branchConfig.branchMail) {
      doc.setFont('helvetica', 'bold');
      const emailLabel = 'Email: ';
      const emailLabelWidth = doc.getTextWidth(emailLabel);
      doc.text(emailLabel, 15, leftYPos);
      doc.setFont('helvetica', 'normal');
      doc.text(branchConfig.branchMail, 15 + emailLabelWidth, leftYPos);
      leftYPos += 5;
    }

    const today = new Date().toLocaleDateString('es-UY');
    doc.setFont('helvetica', 'bold');
    const dateLabel = 'Fecha: ';
    const dateLabelWidth = doc.getTextWidth(dateLabel);
    doc.text(dateLabel, 15, leftYPos);
    doc.setFont('helvetica', 'normal');
    doc.text(today, 15 + dateLabelWidth, leftYPos);
    leftYPos += 5;
  }

  if (logoDataUrl) {
    try {
      const logoX = pageWidth - 55;
      doc.addImage(logoDataUrl, 'PNG', logoX, 25, 40, 40);
    } catch (error) {
      console.error('Error adding logo:', error);
    }
  }

  yPosition = Math.max(leftYPos + 10, 70);

  if (quotationData.clientName) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    const clientLabel = 'Cliente: ';
    const clientLabelWidth = doc.getTextWidth(clientLabel);
    doc.text(clientLabel, 15, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(quotationData.clientName, 15 + clientLabelWidth, yPosition);
    yPosition += 7;
  }

  if (quotationData.vehicle) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    const vehicleLabel = 'Vehículo: ';
    const vehicleLabelWidth = doc.getTextWidth(vehicleLabel);
    doc.text(vehicleLabel, 15, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(quotationData.vehicle, 15 + vehicleLabelWidth, yPosition);
    yPosition += 7;
  }

  yPosition += 5;

  const headerHeight = 10;
  doc.setFillColor(rgb.r, rgb.g, rgb.b);
  doc.rect(15, yPosition, pageWidth - 30, headerHeight, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);

  const headerY = yPosition + 4;
  doc.text('Descripción', 17, headerY);
  doc.text('Cant.', pageWidth - 85, headerY);
  doc.text('Moneda', pageWidth - 65, headerY);
  doc.text('P. Unit.', pageWidth - 45, headerY);
  doc.text('Total', pageWidth - 25, headerY);

  yPosition += headerHeight;
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');

  const totalsByCurrency = {};

  quotationData.items.forEach((item, index) => {
    const itemTotal = item.quantity * item.unitPrice;
    const currency = item.currency || 'UYU';

    if (!totalsByCurrency[currency]) {
      totalsByCurrency[currency] = 0;
    }
    totalsByCurrency[currency] += itemTotal;

    if (index % 2 === 0) {
      doc.setFillColor(245, 245, 245);
      doc.rect(15, yPosition - 4, pageWidth - 30, 7, 'F');
    }

    const maxWidth = pageWidth - 110;
    const lines = doc.splitTextToSize(item.description, maxWidth);
    doc.setFont('helvetica', 'normal');
    doc.text(lines, 17, yPosition);

    doc.setFont('helvetica', 'bold');
    doc.text(item.quantity.toString(), pageWidth - 85, yPosition);
    doc.text(currency, pageWidth - 65, yPosition);
    doc.text(formatNumber(item.unitPrice), pageWidth - 45, yPosition);
    doc.text(formatNumber(itemTotal), pageWidth - 25, yPosition);

    doc.setFont('helvetica', 'normal');

    yPosition += lines.length * 5 + 2;

    if (yPosition > pageHeight - 50) {
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

  const currencies = Object.keys(totalsByCurrency);

  if (currencies.length === 1) {
    const currency = currencies[0];
    const total = totalsByCurrency[currency];
    doc.text('TOTAL:', 15, yPosition);
    doc.text(
      `${getCurrencySymbol(currency)} ${formatNumber(total)}`,
      pageWidth - 15,
      yPosition,
      { align: 'right' }
    );
  } else {
    doc.text('TOTALES:', 15, yPosition);
    yPosition += 6;

    doc.setFontSize(11);
    currencies.forEach(currency => {
      const total = totalsByCurrency[currency];
      doc.text(`${currency}:`, 15, yPosition);
      doc.text(
        `${getCurrencySymbol(currency)} ${formatNumber(total)}`,
        pageWidth - 15,
        yPosition,
        { align: 'right' }
      );
      yPosition += 5;
    });
  }

  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(128, 128, 128);
  doc.text('Gracias por su confianza', pageWidth / 2, pageHeight - 15, { align: 'center' });

  return doc;
};

export const downloadPDF = (quotationData, logoDataUrl = null, branchConfig = {}) => {
  const doc = generateQuotationPDF(quotationData, logoDataUrl, branchConfig);
  const fileName = `presupuesto_${quotationData.clientName || 'cliente'}_${new Date().getTime()}.pdf`;
  doc.save(fileName);
};
