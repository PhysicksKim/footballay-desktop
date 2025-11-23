/// <reference types="vite/client" />

import type {
  ElectronHandler,
  ElectronStore,
} from './electron/preload/preload';

declare global {
  interface Window {
    electron: ElectronHandler;
    electronStore: ElectronStore;
    appVersion?: string;
    getVersion?: () => Promise<string>;
  }
}

interface ImportMetaEnv {
  readonly VITE_APP_ENV?: 'devlocal' | 'dev' | 'prod';
  readonly VITE_DOMAIN_URL: string;
  readonly VITE_API_URL: string;
  readonly VITE_WEBSOCKET_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
