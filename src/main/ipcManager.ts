import log from 'electron-log';
import { ipcMain, BrowserWindow, app } from 'electron';
import matchliveWindowService from './matchliveWindowService';
import WindowManager from './windowManager';

export const setupMainWindowIpcMainHandlers = (
  mainWindow: BrowserWindow | undefined,
) => {
  if (!mainWindow) {
    console.error('mainWindow is undefined. IPC handlers not registered.');
    return;
  }

  ipcMain.on('open-matchlive-window', async () => {
    const matchliveWindow =
      await WindowManager.getInstance().createMatchliveWindow();
    if (!matchliveWindow) {
      console.error('Failed to create matchliveWindow.');
    }
  });

  ipcMain.on(
    'main-window-control',
    (event, action: 'minimize' | 'quit-app') => {
      if (!mainWindow) {
        console.error('mainWindow is undefined.');
        return;
      }

      switch (action) {
        case 'minimize':
          mainWindow.minimize();
          break;
        case 'quit-app':
          app.quit();
          break;
        default:
          console.log(`Unknown action: ${action}`);
      }
    },
  );

  ipcMain.on('to-app', (event, data) => {
    if (!mainWindow) {
      console.error('mainWindow is undefined.');
      return;
    }
    console.log(`to-app event received with data:`, data);
    mainWindow.webContents.send('to-app', data);
  });

  ipcMain.on('matchlive-react-ready', () => {
    if (!mainWindow) {
      console.error('mainWindow is undefined.');
      return;
    }
    mainWindow.webContents.send('to-app', { type: 'SEND_SHOW_PHOTO' });
  });
};

export const setupMatchliveIpcMainHandlers = (
  matchliveWindow: BrowserWindow | undefined,
) => {
  if (!matchliveWindow || matchliveWindow.isDestroyed()) {
    console.error('matchliveWindow is not ready. IPC handlers not registered.');
    return;
  }

  ipcMain.on('control-to-matchlive', (event, action: string) => {
    if (!matchliveWindow || matchliveWindow.isDestroyed()) {
      console.error('matchliveWindow is not ready.');
      return;
    }

    switch (action) {
      case 'refresh':
        matchliveWindow.reload();
        break;
      case 'minimize':
        if (matchliveWindow.isMinimized()) {
          matchliveWindow.restore();
        } else {
          matchliveWindow.minimize();
        }
        break;
      case 'close':
        matchliveWindow.close();
        break;
      default:
        console.log(`Unknown action: ${action}`);
    }
  });

  ipcMain.on('to-matchlive', (event, data) => {
    if (!matchliveWindow || matchliveWindow.isDestroyed()) {
      console.error('matchliveWindow is not ready.');
      return;
    }

    try {
      console.log(`to-matchlive event received with data:`, data);
      matchliveWindow.webContents.send('to-matchlive', data);
    } catch (e) {
      log.error('to-matchlive ipc error message', e);
    }
  });

  ipcMain.handle('reset-matchlive-window', async () => {
    if (!matchliveWindow || matchliveWindow.isDestroyed()) {
      console.error('matchliveWindow is not ready for reset.');
      return;
    }

    const { height, width } =
      await matchliveWindowService.getDefaultWindowSize();

    matchliveWindow.setSize(width, height);
    matchliveWindow.center();
    matchliveWindow.focus();
  });
};
