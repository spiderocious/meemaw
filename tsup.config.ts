import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: true,
  clean: true,
  minify: true,
  treeshake: true,
  external: ['react', 'react-dom'],
  sourcemap: false,
  target: 'es2015',
});
