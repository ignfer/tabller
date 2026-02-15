import { useState } from 'react';

// Símbolos de monedas comunes
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

// Formatear número sin decimales innecesarios
const formatNumber = (num) => {
  if (num % 1 === 0) {
    // Es un número entero
    return num.toLocaleString('es-UY');
  } else {
    // Tiene decimales
    return num.toLocaleString('es-UY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
};

export default function QuotationPreview({ quotation, onUpdate, onDownload, onReset }) {
  const [editedQuotation, setEditedQuotation] = useState(quotation);

  const handleItemChange = (index, field, value) => {
    const newItems = [...editedQuotation.items];
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index][field] = parseFloat(value) || 0;
    } else {
      newItems[index][field] = value;
    }
    const updated = { ...editedQuotation, items: newItems };
    setEditedQuotation(updated);
    onUpdate(updated);
  };

  const handleClientChange = (field, value) => {
    const updated = { ...editedQuotation, [field]: value };
    setEditedQuotation(updated);
    onUpdate(updated);
  };

  const addItem = () => {
    const newItem = {
      description: '',
      quantity: 1,
      unitPrice: 0,
      currency: 'UYU'
    };
    const updated = {
      ...editedQuotation,
      items: [...editedQuotation.items, newItem]
    };
    setEditedQuotation(updated);
    onUpdate(updated);
  };

  const removeItem = (index) => {
    const updated = {
      ...editedQuotation,
      items: editedQuotation.items.filter((_, i) => i !== index)
    };
    setEditedQuotation(updated);
    onUpdate(updated);
  };

  // Calcular totales agrupados por moneda
  const calculateTotalsByCurrency = () => {
    const totals = {};

    editedQuotation.items.forEach(item => {
      const currency = item.currency || 'UYU';
      const itemTotal = item.quantity * item.unitPrice;

      if (!totals[currency]) {
        totals[currency] = 0;
      }
      totals[currency] += itemTotal;
    });

    return totals;
  };

  const getCurrencySymbol = (currency) => {
    return CURRENCY_SYMBOLS[currency] || currency;
  };

  const totals = calculateTotalsByCurrency();
  const currencies = Object.keys(totals);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Vista Previa</h2>
          <button
            onClick={onReset}
            className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Nuevo Presupuesto
          </button>
        </div>

        {/* Client Info */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cliente
            </label>
            <input
              type="text"
              value={editedQuotation.clientName || ''}
              onChange={(e) => handleClientChange('clientName', e.target.value)}
              placeholder="Nombre del cliente"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vehículo
            </label>
            <input
              type="text"
              value={editedQuotation.vehicle || ''}
              onChange={(e) => handleClientChange('vehicle', e.target.value)}
              placeholder="Marca y modelo"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-300">
                <th className="text-left p-3 font-semibold text-gray-700">Descripción</th>
                <th className="text-center p-3 font-semibold text-gray-700 w-20">Cant.</th>
                <th className="text-center p-3 font-semibold text-gray-700 w-24">Moneda</th>
                <th className="text-right p-3 font-semibold text-gray-700 w-28">P. Unitario</th>
                <th className="text-right p-3 font-semibold text-gray-700 w-28">Total</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {editedQuotation.items.map((item, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-2">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent font-bold"
                    />
                  </td>
                  <td className="p-2">
                    <select
                      value={item.currency || 'UYU'}
                      onChange={(e) => handleItemChange(index, 'currency', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent font-bold"
                    >
                      <option value="UYU">UYU</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="ARS">ARS</option>
                      <option value="BRL">BRL</option>
                      <option value="CLP">CLP</option>
                      <option value="MXN">MXN</option>
                      <option value="PEN">PEN</option>
                      <option value="COP">COP</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent font-bold"
                    />
                  </td>
                  <td className="p-2 text-right font-bold">
                    {getCurrencySymbol(item.currency || 'UYU')} {formatNumber(item.quantity * item.unitPrice)}
                  </td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-800 font-bold text-lg"
                      title="Eliminar"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={addItem}
          className="mb-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
        >
          + Agregar Item
        </button>

        {/* Totals by Currency */}
        <div className="border-t-2 border-gray-300 pt-4 mb-6">
          {currencies.length === 1 ? (
            // Una sola moneda - mostrar como antes
            <div className="flex justify-end items-center">
              <span className="text-xl font-bold text-gray-700 mr-4">TOTAL:</span>
              <span className="text-2xl font-bold text-blue-600">
                {getCurrencySymbol(currencies[0])} {formatNumber(totals[currencies[0]])}
              </span>
            </div>
          ) : (
            // Múltiples monedas - mostrar desglosado
            <div>
              <div className="text-right mb-2">
                <span className="text-lg font-bold text-gray-700">TOTALES:</span>
              </div>
              {currencies.map(currency => (
                <div key={currency} className="flex justify-end items-center mb-1">
                  <span className="text-lg font-medium text-gray-600 mr-4">{currency}:</span>
                  <span className="text-xl font-bold text-blue-600">
                    {getCurrencySymbol(currency)} {formatNumber(totals[currency])}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <button
            onClick={() => onDownload(editedQuotation)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
          >
            📥 Descargar PDF
          </button>
        </div>
      </div>
    </div>
  );
}
