import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import UserStore from './modules/user'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export { UserStore }

export default pinia
