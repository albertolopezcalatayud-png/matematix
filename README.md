# Matematix

Mates y ciencias paso a paso, sin prisas y sin cuentas. Primaria y ESO, en castellano, valenciano (AVL) e inglés británico.

- Sin cuentas, sin anuncios, sin analítica: el progreso se guarda solo en el dispositivo.
- Papel primero: la app acompaña a las fichas, no las sustituye.
- Sin diagnósticos ni etiquetas.

## Desarrollo

    npm install
    npm run dev          # servidor local
    npm test             # generadores: 10 000 semillas por estación
    npm run build && npx vite preview --port 4174
    node tests/e2e/flow.cjs   # recorrido completo en móvil, en los tres idiomas
