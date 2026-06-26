import { defineConfig } from 'vitest/config';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      entryRoot: 'src',
      exclude: ['test', 'vite.config.ts']
    })
  ],
  build: {
    sourcemap: true,
    lib: {
      entry: {
        index: 'src/index.ts',
        react: 'src/react.ts'
      },
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: ['bootstrap/js/dist/modal', 'react'],
      output: {
        exports: 'named'
      }
    }
  },
  test: {
    environment: 'jsdom'
  }
});
