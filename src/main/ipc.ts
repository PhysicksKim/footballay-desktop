import { ipcMain, BrowserWindow } from 'electron';

export function setupIpcMainHandlers(
  mainWindow: BrowserWindow | null,
  createMatchliveWindow: () => void,
) {
  ipcMain.on('open-matchlive-window', () => {
    createMatchliveWindow();
  });
}
