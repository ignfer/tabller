import { useState, useEffect } from 'react';
import ChatInput from './components/chat-input.jsx';
import QuotationPreview from './components/quotation-preview.jsx';
import ApiKeyConfig from './components/api-key-config.jsx';
import LogoUpload from './components/logo-upload.jsx';
import { initializeGemini, parseQuotationText } from './services/gemini';
import { downloadPDF } from './utils/pdf-generator.js';
import './index.css';

function App() {
  const [apiKey, setApiKey] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quotation, setQuotation] = useState(null);
  const [logo, setLogo] = useState(null);

  useEffect(() => {
    const savedApiKey = localStorage.getItem('gemini_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      try {
        initializeGemini(savedApiKey);
      } catch (err) {
        console.error('Error initializing Gemini:', err);
        localStorage.removeItem('gemini_api_key');
        setApiKey(null);
      }
    }
  }, []);

  const handleApiKeySet = (key) => {
    try {
      initializeGemini(key);
      localStorage.setItem('gemini_api_key', key);
      setApiKey(key);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMessageSubmit = async (message) => {
    setIsLoading(true);
    setError(null);

    try {
      const parsed = await parseQuotationText(message);
      setQuotation(parsed);
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuotationUpdate = (updatedQuotation) => {
    setQuotation(updatedQuotation);
  };

  const handleDownloadPDF = (quotationData) => {
    try {
      downloadPDF(quotationData, logo);
    } catch (err) {
      setError('Error al generar el PDF: ' + err.message);
      console.error('PDF Error:', err);
    }
  };

  const handleReset = () => {
    setQuotation(null);
    setError(null);
  };

  const handleLogoChange = (logoDataUrl) => {
    setLogo(logoDataUrl);
  };

  if (!apiKey) {
    return <ApiKeyConfig onApiKeySet={handleApiKeySet} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Cotizador de Motos</h1>
          <p className="text-gray-600">Sistema simple para crear cotizaciones profesionales</p>
          <button
            onClick={() => {
              if (confirm('¿Estás seguro de que quieres cambiar la API key?')) {
                localStorage.removeItem('gemini_api_key');
                setApiKey(null);
                setQuotation(null);
              }
            }}
            className="mt-2 text-sm text-blue-600 hover:underline"
          >
            Cambiar API Key
          </button>
        </header>

        {!quotation && <LogoUpload onLogoChange={handleLogoChange} />}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm"><strong>Error:</strong> {error}</p>
          </div>
        )}

        {!quotation ? (
          <ChatInput onSubmit={handleMessageSubmit} isLoading={isLoading} />
        ) : (
          <QuotationPreview
            quotation={quotation}
            onUpdate={handleQuotationUpdate}
            onDownload={handleDownloadPDF}
            onReset={handleReset}
          />
        )}

        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>Cotizador Simple v1.0</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
