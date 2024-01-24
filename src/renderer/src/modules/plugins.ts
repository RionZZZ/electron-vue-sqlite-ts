import { type App } from 'vue'

import router from '../router'
import pinia from '../stores'

import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { zhCn } from 'element-plus/es/locale/index'
import 'element-plus/dist/index.css'
import 'virtual:svg-icons-register'

export default (app: App) => {
  app.use(router).use(pinia).use(ElementPlus, {
    locale: zhCn
  })

  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
}
