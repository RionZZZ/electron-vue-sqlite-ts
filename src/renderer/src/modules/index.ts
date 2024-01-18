import type { App } from 'vue'
import { GlobalComponents, JCComponents } from './components'
import Plugins from './plugins'

export default (app: App) => {
  GlobalComponents(app)
  JCComponents(app)
  Plugins(app)
}
