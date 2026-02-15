import { useState, useEffect } from 'react';

export default function ApiKeyConfig({ onConfigSet }) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [branchName, setBranchName] = useState('');
  const [branchMail, setBranchMail] = useState('');
  const [branchPhone, setBranchPhone] = useState('');
  const [branchAddress, setBranchAddress] = useState('');
  const [branchColor, setBranchColor] = useState('#424242');

  useEffect(() => {
    const savedConfig = localStorage.getItem('branch_config');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setBranchName(config.branchName || '');
        setBranchMail(config.branchMail || '');
        setBranchPhone(config.branchPhone || '');
        setBranchAddress(config.branchAddress || '');
        setBranchColor(config.branchColor || '#424242');
      } catch (e) {
        console.error('Error loading config:', e);
      }
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (apiKey.trim()) {
      const config = {
        apiKey: apiKey.trim(),
        branchName: branchName.trim(),
        branchMail: branchMail.trim(),
        branchPhone: branchPhone.trim(),
        branchAddress: branchAddress.trim(),
        branchColor: branchColor
      };

      localStorage.setItem('branch_config', JSON.stringify({
        branchName: config.branchName,
        branchMail: config.branchMail,
        branchPhone: config.branchPhone,
        branchAddress: config.branchAddress,
        branchColor: config.branchColor
      }));

      onConfigSet(config);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Cotizador de Motos</h1>
        <p className="text-gray-600 mb-6 text-sm">Configura tu taller y API key de Gemini</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
              Gemini API Key *
            </label>
            <div className="relative">
              <input
                id="apiKey"
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIza..."
                required
                className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showKey ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Información del Taller</h3>
            <p className="text-xs text-gray-500 mb-4">Esta información aparecerá en los presupuestos</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="branchName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Taller
                </label>
                <input
                  id="branchName"
                  type="text"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  placeholder="Ej: Taller Mecánico Pro"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="branchPhone" className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  id="branchPhone"
                  type="text"
                  value={branchPhone}
                  onChange={(e) => setBranchPhone(e.target.value)}
                  placeholder="Ej: +598 99 123 456"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="branchMail" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="branchMail"
                  type="email"
                  value={branchMail}
                  onChange={(e) => setBranchMail(e.target.value)}
                  placeholder="Ej: taller@example.com"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="branchColor" className="block text-sm font-medium text-gray-700 mb-1">
                  Color del Taller
                </label>
                <div className="flex gap-2">
                  <input
                    id="branchColor"
                    type="color"
                    value={branchColor}
                    onChange={(e) => setBranchColor(e.target.value)}
                    className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={branchColor}
                    onChange={(e) => setBranchColor(e.target.value)}
                    placeholder="#424242"
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="branchAddress" className="block text-sm font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <input
                id="branchAddress"
                type="text"
                value={branchAddress}
                onChange={(e) => setBranchAddress(e.target.value)}
                placeholder="Ej: Av. Principal 1234, Montevideo"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!apiKey.trim()}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Continuar
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-xs text-gray-600">
            <strong>Obtén tu API key gratis:</strong><br />
            1. Visita <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google AI Studio</a><br />
            2. Crea una nueva API key<br />
            3. Cópiala y pégala aquí
          </p>
        </div>
      </div>
    </div>
  );
}
