import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ['@scandit/web-datacapture-core', '@scandit/web-datacapture-barcode']
  },
  optimizeDeps: {
    include: [
      '@scandit/web-datacapture-core',
      '@scandit/web-datacapture-barcode'
    ],
    exclude: [] // Remove any excludes that might interfere
  },
  build: {
    commonjsOptions: {
      include: [/@scandit\/.*/, /node_modules/]
    }
  }
}));