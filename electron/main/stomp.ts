import { ipcMain, BrowserWindow } from 'electron';
import { Client, IMessage, StompConfig } from '@stomp/stompjs';
import WebSocket from 'ws';

let stompClient: Client | null = null;

const brokerURL = 'wss://footballay.com/ws';
const stompConfig: StompConfig = {
  brokerURL: brokerURL,
  onConnect: () => {
    console.log('Connected to WebSocket');
  },
  onDisconnect: () => {
    console.log('Disconnected from WebSocket');
  },
};

export function setupStompHandlers(appWindow: BrowserWindow | null) {
  ipcMain.handle('init-stomp-client', async (_) => {
    stompClient = new Client({
      ...stompConfig,
      webSocketFactory: () => new WebSocket(brokerURL),
    });
    stompClient.onConnect = () => {
      appWindow?.webContents.send('ws-status', 'connected');
    };
    stompClient.onDisconnect = () => {
      appWindow?.webContents.send('ws-status', 'disconnected');
    };
    stompClient.activate();
  });

  ipcMain.handle(
    'stomp-publish',
    async (_, destination: string, body: string) => {
      if (stompClient) {
        stompClient.publish({
          destination: destination,
          body: body,
        });
      }
    }
  );

  ipcMain.handle('stomp-subscribe', async (_, destination: string) => {
    if (stompClient) {
      stompClient.subscribe(destination, (message: IMessage) => {
        appWindow?.webContents.send('stomp-message', message.body);
      });
    }
  });
}
