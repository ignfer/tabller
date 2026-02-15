import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

let genAI = null;
let model = null;

export const initializeGemini = (apiKey) => {
  const key = apiKey || API_KEY;
  if (!key) {
    throw new Error('Gemini API key is required');
  }
  genAI = new GoogleGenerativeAI(key);
  model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
};

export const parseQuotationText = async (text) => {
  if (!model) {
    throw new Error('Gemini not initialized. Please provide an API key.');
  }

  const prompt = `
Eres un asistente que ayuda a crear cotizaciones para un taller de motos en Uruguay.

Analiza el siguiente texto y extrae:
1. Nombre del cliente (si está mencionado)
2. Vehículo/moto (marca, modelo, año si está disponible)
3. Lista de trabajos/servicios/repuestos con:
   - Descripción (corregida gramaticalmente y bien escrita)
   - Cantidad (por defecto 1 si no se especifica)
   - Precio unitario (si está mencionado, si no dejar en 0)
   - Moneda (UYU por defecto, pero puede ser USD, EUR, ARS, BRL, etc.)

Importante sobre monedas:
- Si NO se especifica moneda, usar "UYU"
- Si dice "dólares", "USD", "US$", usar "USD"
- Si dice "euros", "EUR", usar "EUR"
- Si dice "pesos argentinos", "ARS", usar "ARS"
- Si dice "reales", "BRL", "R$", usar "BRL"
- Detectar el símbolo o palabra que indica moneda
- Mantener consistencia en la moneda si se especifica una vez

Importante sobre corrección:
- Corrige cualquier error ortográfico o gramatical
- Mantén el significado original
- Usa lenguaje profesional pero claro
- Si menciona "x2", "x 3", "dos", etc., eso es la cantidad
- Si no hay precio mencionado, deja el precio en 0

Texto del mecánico:
"${text}"

Responde SOLO con un objeto JSON válido con esta estructura exacta:
{
  "clientName": "nombre o null",
  "vehicle": "descripción del vehículo o null",
  "items": [
    {
      "description": "descripción corregida",
      "quantity": 1,
      "unitPrice": 0,
      "currency": "UYU"
    }
  ]
}

No incluyas explicaciones, solo el JSON.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No se pudo extraer JSON de la respuesta');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    if (!parsed.items || !Array.isArray(parsed.items)) {
      throw new Error('Formato de respuesta inválido');
    }

    // Asegurar que cada item tenga una moneda (default UYU)
    parsed.items = parsed.items.map(item => ({
      ...item,
      currency: item.currency || 'UYU'
    }));

    return parsed;
  } catch (error) {
    console.error('Error parsing quotation:', error);
    throw new Error(`Error al procesar: ${error.message}`);
  }
};
