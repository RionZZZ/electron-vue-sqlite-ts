import type { HttpConfig } from '@renderer/types/config'

export const httpConfig: HttpConfig = {
  requestTimeout: 120000,
  baseURL: import.meta.env.VITE_APP_URL,
  flag: 1
}
