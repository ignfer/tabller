## Cotizador de Motos 🏍️

Sistema simple para crear cotizaciones profesionales con IA.

## 🚀 Instalación

```bash
npm install
npm run dev
```

## 📁 Estructura de Carpetas

Crea esta estructura en tu proyecto:

```
bike-quotation/
├── src/
│   ├── components/
│   │   ├── ApiKeyConfig.jsx
│   │   ├── ChatInput.jsx
│   │   ├── LogoUpload.jsx
│   │   └── QuotationPreview.jsx
│   ├── services/
│   │   └── gemini.js
│   ├── utils/
│   │   └── pdfGenerator.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🔑 API Key

1. Ve a https://makersuite.google.com/app/apikey
2. Crea una API key de Gemini (gratis)
3. Ingrésala en la app

## 🌐 Deploy en GitHub Pages

```bash
# Edita vite.config.js con tu repo name
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git push -u origin main
npm run deploy
```

Activa GitHub Pages en Settings → Pages → gh-pages

## 💰 Costo: $0

Todo gratis - GitHub Pages + Gemini API gratuita tabller
