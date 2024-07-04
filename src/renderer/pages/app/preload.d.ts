import { ElectronHandler } from '../../../main/preload';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electron: ElectronHandler & {
      initStompClient: () => void;
      stompPublish: (destination: string, body: string) => void;
      stompSubscribe: (destination: string) => void;
      onWsStatus: (callback: (status: string) => void) => void;
      onStompMessage: (callback: (message: string) => void) => void;
    };
  }
}

export {};
