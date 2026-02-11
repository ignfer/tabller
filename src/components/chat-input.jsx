import { useState } from 'react';

export default function ChatInput({ onSubmit, isLoading }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSubmit(message);
      setMessage('');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Describe la cotización
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Ejemplo: "Cliente Juan Perez, moto Honda CG 150, cambio de luz trasera x2, cambio de aceite, precio luz 500, aceite 800"
          </p>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe aquí los detalles de la cotización..."
            className="w-full min-h-[150px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
            disabled={isLoading}
          />
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={isLoading || !message.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isLoading ? 'Procesando...' : 'Generar Cotización'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
