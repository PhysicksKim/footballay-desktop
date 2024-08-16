import { ipcMain, BrowserWindow } from 'electron';
import { AppUpdater } from './AppUpdater';

export function setupIpcMainHandlers(
  mainWindow: BrowserWindow | null,
  createMatchliveWindow: () => void,
) {
  ipcMain.on('open-matchlive-window', () => {
    createMatchliveWindow();
  });
}
