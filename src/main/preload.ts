// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels =
  | 'ipc-example'
  | 'open-test-window'
  | 'message'
  | 'isUpdating'
  | 'react-ready'
  | 'init-stomp-client'
  | 'stomp-publish'
  | 'stomp-subscribe'
  | 'ws-status'
  | 'stomp-message';

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
      return ipcRenderer.invoke(channel, ...args);
    },
  },
};

contextBridge.exposeInMainWorld('electron', {
  ...electronHandler,
  initStompClient: () => ipcRenderer.invoke('init-stomp-client'),
  stompPublish: (destination: string, body: string) =>
    ipcRenderer.invoke('stomp-publish', destination, body),
  stompSubscribe: (destination: string) =>
    ipcRenderer.invoke('stomp-subscribe', destination),
  onWsStatus: (callback: (status: string) => void) =>
    ipcRenderer.on('ws-status', (event, status) => callback(status)),
  onStompMessage: (callback: (message: string) => void) =>
    ipcRenderer.on('stomp-message', (event, message) => callback(message)),
});

export type ElectronHandler = typeof electronHandler;
