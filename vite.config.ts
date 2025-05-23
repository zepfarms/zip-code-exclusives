
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
  build: {
    // Add source maps for better debugging
    sourcemap: true,
    // Increase rollup optimizations chunk size to prevent module errors
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Group react modules together
          if (id.includes('node_modules/react') || 
              id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          // Group other large dependencies
          if (id.includes('node_modules/@supabase')) {
            return 'supabase-vendor';
          }
        }
      }
    }
  },
  optimizeDeps: {
    // Force include problematic dependencies
    include: ['react', 'react-dom', '@supabase/supabase-js']
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
