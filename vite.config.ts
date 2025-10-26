import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import compression from 'vite-plugin-compression'
import path from 'path'
// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react(),
      compression({
        algorithm: 'gzip',
        ext: '.gz',
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      host: true,
    },
    esbuild: {
      // 根据环境决定是否删除 console 和 debugger
      drop: mode === 'production' || mode === 'docker-production' || mode === 'linux-production' || mode === 'docker-test-local'
        ? ['console', 'debugger']
        : [],
    },
    build: {
      outDir: `dist-${mode}`, // 根据不同模式输出不同目录
    },
    // 根据环境设置不同的配置
    define: {
      __APP_ENV__: JSON.stringify(mode),
    }
  }
})