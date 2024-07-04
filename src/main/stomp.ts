import { ipcMain, BrowserWindow } from 'electron';
import { Client, IMessage, StompConfig } from '@stomp/stompjs';
import WebSocket from 'ws';

let stompClient: Client | null = null;

const brokerURL = 'wss://gyechunsik.site/ws';
const stompConfig: StompConfig = {
  brokerURL: brokerURL,
  onConnect: () => {
    console.log('Connected to WebSocket');
  },
  onDisconnect: () => {
    console.log('Disconnected from WebSocket');
  },
};

export function setupStompHandlers(mainWindow: BrowserWindow | null) {
  console.log('setup stomp.js');
  ipcMain.handle('init-stomp-client', async (_) => {
    console.log('init stomp client');
    stompClient = new Client({
      ...stompConfig,
      webSocketFactory: () => new WebSocket(brokerURL),
    });

    stompClient.onConnect = () => {
      console.log(`main window is null? = ${mainWindow}`);
      mainWindow?.webContents.send('ws-status', 'connected');
      console.log('onconnect');
    };

    stompClient.onDisconnect = () => {
      console.log(`main window is null? = ${mainWindow}`);
      mainWindow?.webContents.send('ws-status', 'disconnected');
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
    },
  );

  ipcMain.handle('stomp-subscribe', async (_, destination: string) => {
    if (stompClient) {
      stompClient.subscribe(destination, (message: IMessage) => {
        mainWindow?.webContents.send('stomp-message', message.body);
      });
    }
  });
}
