import { contextBridge, ipcMain, ipcRenderer } from 'electron';
import { StoreKey } from './StoreKey';

const electronStore = {
  get: (key: StoreKey) => ipcRenderer.invoke('get-store-value', key),
  set: (key: StoreKey, value: any) =>
    ipcRenderer.invoke('set-store-value', key, value),
  resetMatchliveWindowSizeAndPosition: () =>
    ipcRenderer.invoke('reset-matchlive-window'),
};

export default electronStore;
