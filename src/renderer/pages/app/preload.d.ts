import {
  ElectronHandler,
  ElectronStore,
  ElectronLog,
} from '../../../main/preload';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electron: ElectronHandler;
    electronStore: ElectronStore;
    electronLog: ElectronLog;
    appVersion: string;
  }
}

export {};
