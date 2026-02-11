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
  model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
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
   - Precio unitario en UYU (si está mencionado, si no dejar en 0)

Importante:
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
      "unitPrice": 0
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

    return parsed;
  } catch (error) {
    console.error('Error parsing quotation:', error);
    throw new Error(`Error al procesar: ${error.message}`);
  }
};
