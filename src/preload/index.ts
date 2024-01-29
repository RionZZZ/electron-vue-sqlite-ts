import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('vegetable', {
      db: {
        init: () => ipcRenderer.invoke('db-init')
      },
      user: {
        findAll: (params: object) => ipcRenderer.invoke('user-find-all', params),
        findAndCountAll: (params: object & { offset?: number; limit?: number }) =>
          ipcRenderer.invoke('user-find-and-count-all', params),
        findOne: (params: object) => ipcRenderer.invoke('user-find-one', params),
        create: (params: object) => ipcRenderer.invoke('user-create', params),
        update: (params: object) => ipcRenderer.invoke('user-update', params),
        resetPassword: (params: object) => ipcRenderer.invoke('user-reset-password', params),
        changePassword: (params: object) => ipcRenderer.invoke('user-change-password', params),
        destroy: (id: string[]) => ipcRenderer.invoke('user-destroy', id)
      }
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
