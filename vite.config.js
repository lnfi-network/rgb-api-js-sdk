import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    // Enable library mode
    lib: {
      // Entry file for the library
      entry: path.resolve(__dirname, './src/index.js'),
      // Name of the global variable for UMD builds
      name: 'RgbApiSdk',
      // Output file names for different formats
      fileName: (format) => {
        switch (format) {
          case 'es':
            return 'rgb-api-sdk.mjs';
          case 'cjs':
            return 'rgb-api-sdk.cjs';
          case 'umd':
            return 'rgb-api-sdk.umd.js';
          default:
            return `rgb-api-sdk.${format}.js`;
        }
      },
      // Generate multiple formats
      formats: ['es', 'cjs', 'umd']
    },
    rollupOptions: {
      // Externalize dependencies that should not be bundled into the library
      external: ['axios'],
      output: {
        // Use named exports to avoid default export warnings
        exports: 'named',
        // Global names for externalized dependencies in UMD/IIFE builds
        globals: {
          'axios': 'axios'
        }
      }
    },
    // Generate source maps for debugging
    sourcemap: true,
    // Minify the output
    minify: 'esbuild'
  },
  // Define global constants for different environments
  define: {
    __VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0')
  }
}); 