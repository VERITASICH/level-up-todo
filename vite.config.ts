import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url'; // Импортируем из Node.js
import path from 'path';

const __dirname = fileURLToPath(new URL('.', import.meta.url)); // Получаем текущую директорию

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Теперь работает!
    },
  },
});
