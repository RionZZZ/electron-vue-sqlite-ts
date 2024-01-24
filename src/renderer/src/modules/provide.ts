import { InjectionKey, type App, readonly } from 'vue'

export const Vegetable: InjectionKey<VegetableType> = Symbol()

export default (app: App) => {
  app.provide(Vegetable, readonly(window.vegetable))
}
