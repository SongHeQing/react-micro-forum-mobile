import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import compression from 'vite-plugin-compression'
import svgr from 'vite-plugin-svgr'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react(),
      svgr(),
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
    },
    css: {
      preprocessorOptions: {
        scss: {
          // 关键配置在这里！
          // additionalData 会在每个 SCSS 文件的内容之前自动注入
          additionalData: `
                    // 使用修正后的路径常量
                    @use "@/styles/functions" as func;
                    @use "@/styles/mixins" as mixins;
          `,
        },
      },
    },
    test: {
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts',
      globals: true,
    }
  }
})