import type { RouteMeta } from 'vue-router'

export interface Meta extends RouteMeta {
  title?: string
  menuIndex?: string
  layout?: boolean
}
