import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { resolve } from 'path'

export default defineConfig({
  main: {
    resolve: {
      alias: {
        '@main': resolve('src/main')
      }
    },
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        external: ['sqlite3']
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [
      vue(),
      vueSetupExtend(),
      Pages({
        dirs: 'src/views',
        exclude: ['**/components/*.vue'],
        extendRoute(route) {
          if (route.path === '/login') {
            return {
              ...route,
              meta: { ...route.meta, auth: false }
            }
          }
          return route
        }
      }),
      Layouts({
        layoutsDirs: 'src/layouts',
        defaultLayout: 'default'
      }),
      createSvgIconsPlugin({
        // 要缓存的图标文件夹
        iconDirs: [resolve(__dirname, 'src/assets/svg')],
        // 执行 icon name 的格式
        symbolId: 'icon-[name]'
      })
    ]
  }
})
