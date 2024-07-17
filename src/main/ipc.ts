import { ipcMain, BrowserWindow } from 'electron';
import { AppUpdater } from './AppUpdater';

export function setupIpcMainHandlers(
  mainWindow: BrowserWindow | null,
  createMatchliveWindow: () => void,
  appUpdater: AppUpdater,
) {
  console.log('setup ipc.ts');
  ipcMain.on('react-ready', (event, arg) => {
    appUpdater.checkForUpdates();
    mainWindow?.webContents.send('update-status', {
      message: '앱 업데이터 동작',
      status: 'updater start',
    });
  });

  ipcMain.on('open-matchlive-window', () => {
    createMatchliveWindow();
  });
}
