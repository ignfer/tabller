import { useState, useEffect } from 'react';

export default function LogoUpload({ onLogoChange }) {
  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const savedLogo = localStorage.getItem('quotation_logo');
    if (savedLogo) {
      setLogo(savedLogo);
      setPreview(savedLogo);
      onLogoChange(savedLogo);
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result;
        setLogo(dataUrl);
        setPreview(dataUrl);
        localStorage.setItem('quotation_logo', dataUrl);
        onLogoChange(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    setLogo(null);
    setPreview(null);
    localStorage.removeItem('quotation_logo');
    onLogoChange(null);
  };

  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Logo del Taller</h3>

      {preview ? (
        <div className="flex items-center space-x-4">
          <img src={preview} alt="Logo" className="h-16 w-16 object-contain border border-gray-300 rounded" />
          <button onClick={handleRemove} className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors">
            Eliminar Logo
          </button>
        </div>
      ) : (
        <div>
          <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <span className="text-sm text-gray-700">Subir Logo</span>
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
          <p className="text-xs text-gray-500 mt-2">El logo se guardará y aparecerá en todas las cotizaciones</p>
        </div>
      )}
    </div>
  );
}
