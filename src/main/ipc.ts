import { ipcMain, BrowserWindow } from 'electron';
import { AppUpdater } from './AppUpdater';

export function setupIpcMainHandlers(
  mainWindow: BrowserWindow | null,
  createTestWindow: () => void,
  appUpdater: AppUpdater,
) {
  console.log('setup ipc.ts');
  ipcMain.on('react-ready', (event, arg) => {
    console.log(arg);
    appUpdater.checkForUpdates();
    mainWindow?.webContents.send('message', '앱 업데이터 동작');
  });

  ipcMain.on('ipc-example', async (event, arg) => {
    const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
    console.log(msgTemplate(arg));
    event.reply('ipc-example', msgTemplate('pong'));
  });

  ipcMain.on('open-test-window', () => {
    createTestWindow();
  });
}
