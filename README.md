# Calculadora de Facturación VMA (React + Vite + Tailwind)

Este repo contiene la calculadora con el estilo de tablas (TH/TD) igual al modelo.

## Requisitos
- Node.js 18+
- npm (o yarn/pnpm)

## Instalación
```bash
npm i
```

## Desarrollo
```bash
npm run dev
```

## Build + Preview
```bash
npm run build
npm run preview
```

## Estructura
- `src/CalculoFacturacion.jsx` — componente principal (lo puedes editar aquí).
- `src/App.jsx`, `src/main.jsx` — bootstrap de React.
- `tailwind.config.js`, `postcss.config.js`, `src/index.css` — Tailwind listo.

## Deploy en GitHub Pages
1. Haz *push* a GitHub.
2. En **Settings → Pages**, selecciona **Deploy from a branch** y la carpeta `/dist` del branch que uses tras correr `npm run build` con un workflow de Actions (si quieres, te paso un `workflow.yml`).

