/// <reference types="vite/client" />

import type { ElectronHandler, ElectronStore } from './electron/preload/preload'

declare global {
  interface Window {
    electron: ElectronHandler
    electronStore: ElectronStore
    appVersion: string
  }
}
