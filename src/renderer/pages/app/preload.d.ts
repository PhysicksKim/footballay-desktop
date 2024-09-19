import { ElectronHandler, ElectronStore } from '../../../main/preload';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electron: ElectronHandler;
    electronStore: ElectronStore;
  }
}

export {};
