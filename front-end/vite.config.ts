import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

const PASTA_LOGICA = fileURLToPath(new URL('../logica/src', import.meta.url));
const PASTA_DO_PROJETO = fileURLToPath(new URL('..', import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@logica': PASTA_LOGICA },
  },
  server: {
    port: 5173,
    fs: { allow: [PASTA_DO_PROJETO] },
  },
});
