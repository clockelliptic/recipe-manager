import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    alias: {
      '@': path.resolve(__dirname, './'),
    },
    css: false,
    workspace: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['lib/**/*.test.ts'],
          environment: 'node',
        },
      },
      {
        extends: true,
        test: {
          name: 'component',
          include: ['components/**/*.test.tsx'],
          environment: 'happy-dom',
          setupFiles: ['./vitest.setup.ts'],
        },
      },
    ],
  },
});
