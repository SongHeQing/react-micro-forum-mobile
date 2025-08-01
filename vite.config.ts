import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      host: '192.168.101.35',
    },
    esbuild: {
      drop: ['console', 'debugger'],
    },
    build: {
      outDir: `dist-${mode}`, // 根据不同模式输出不同目录，如 dist-production, dist-development
    }
  }
})
