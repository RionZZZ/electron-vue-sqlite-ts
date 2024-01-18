import type { App, Component } from 'vue'

interface FileModule {
  default: Component
}

export const GlobalComponents = (app: App) => {
  // Auto import src/component/global/**/*.vue
  const componentsContext = import.meta.glob('../components/global/*.vue', { eager: true })
  console.log(componentsContext)

  Object.keys(componentsContext).forEach((key: string) => {
    const componentConfig = componentsContext[key] as FileModule
    const comp = componentConfig.default
    app.component(comp.name!, comp)
  })
}

export const JCComponents = (app: App) => {
  // Auto import src/component/jc/**/*.vue
  const componentsContext = import.meta.glob('../components/jc/**/*.vue', { eager: true })
  console.log(componentsContext)

  Object.keys(componentsContext).forEach((key: string) => {
    const componentConfig = componentsContext[key] as FileModule
    const comp = componentConfig.default
    app.component(comp.name!, comp)
  })
}
