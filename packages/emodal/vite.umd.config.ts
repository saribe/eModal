import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    emptyOutDir: false,
    minify: true,
    sourcemap: true,
    lib: {
      entry: 'src/index.ts',
      name: 'eModal',
      formats: ['umd'],
      fileName: () => 'eModal.min.js'
    },
    rollupOptions: {
      external: ['bootstrap/js/dist/modal'],
      output: {
        exports: 'named',
        globals: {
          'bootstrap/js/dist/modal': 'bootstrap.Modal'
        }
      }
    }
  }
});
