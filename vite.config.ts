import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import dynamicImport from 'vite-plugin-dynamic-import'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), dynamicImport()],

    assetsInclude: ['**/*.md'],
    resolve: {
        alias: {
            '@': path.join(__dirname, 'src'),
        },
    },
    server: {
        host: '0.0.0.0',
        port: 3000, // Asosiy port
        strictPort: false, // false => band bo'lsa boshqa bo'sh portga o'tqazadi
        proxy: {
            '/api': {
                // target: 'https://staging-edo.hippo.uz',
                target: 'http://0.0.0.0:3000',
                changeOrigin: true,
                secure: false,
            },
        },
    },
    optimizeDeps: {
        force: false,
    },
    build: {
        outDir: 'build',
        sourcemap: true,
    },
})
