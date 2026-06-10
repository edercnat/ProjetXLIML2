import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'Tycle.js'),
      name: 'Tycle',
      fileName: (format) => `tycle.${format}.js`,
      formats: ['es', 'cjs', 'umd']
    }
  }
});