import type { App } from 'vue'
import { GlobalComponents, JCComponents } from './components'
import Plugins from './plugins'
import Provide from './provide'

export default (app: App) => {
  GlobalComponents(app)
  JCComponents(app)
  Plugins(app)
  Provide(app)
}
