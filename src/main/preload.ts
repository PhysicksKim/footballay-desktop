// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels =
  // Update Status Channels
  | 'update-status'
  // App Channels
  | 'react-ready'
  | 'open-matchlive-window'
  // Stomp Channels
  | 'init-stomp-client'
  | 'stomp-publish'
  | 'stomp-subscribe'
  | 'stomp-message'
  | 'ws-status'
  // Main - Sub Channels
  | 'to-matchlive'
  | 'to-app';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: any[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: any[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: any[]) => {
        func(...args);
      };
      ipcRenderer.on(channel, subscription);
      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: any[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    removeAllListeners(channel: Channels) {
      ipcRenderer.removeAllListeners(channel);
    },
    invoke(channel: Channels, ...args: any[]) {
      return ipcRenderer.invoke(channel, ...args).catch((error) => {
        console.error(`Error invoking IPC channel ${channel}`, error);
      });
    },
  },
  stomp: {
    initClient: () => ipcRenderer.invoke('init-stomp-client'),
    publish: (destination: string, body: string) =>
      ipcRenderer.invoke('stomp-publish', destination, body),
    subscribe: (destination: string) =>
      ipcRenderer.invoke('stomp-subscribe', destination),
    onWsStatus: (callback: (status: string) => void) =>
      ipcRenderer.on('ws-status', (event, status) => callback(status)),
    onMessage: (callback: (message: string) => void) =>
      ipcRenderer.on('stomp-message', (event, message) => callback(message)),
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
