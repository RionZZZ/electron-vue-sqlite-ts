import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api
    vegetable: {
      db: { init: () => Promise }
      user: {
        findAll: (params: { offset?: number; limit?: number }) => void
        findOne: (params: object) => void
      }
    }
  }
}
