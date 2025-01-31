import log from 'electron-log';
import { ipcMain, BrowserWindow, app } from 'electron';
import matchliveWindowService from './matchliveWindowService';
import WindowManager from './windowManager';
import { WindowControlMsg } from '@src/types/WindowControl';

export const setupCommonWindowIpcHandlers = () => {
  ipcMain.on('window-control', (event, msg: WindowControlMsg) => {
    if (msg.window === 'matchlive') {
      const nowMatchliveWindow = WindowManager.getInstance().matchliveWindow;
      if (!nowMatchliveWindow || nowMatchliveWindow.isDestroyed()) {
        console.error('matchliveWindow is not ready. window control ignored.');
        return;
      }
      switch (msg.action) {
        case 'reload':
          nowMatchliveWindow.reload();
          break;
        case 'minimize':
          if (nowMatchliveWindow.isMinimized()) {
            nowMatchliveWindow.restore();
          } else {
            nowMatchliveWindow.minimize();
          }
          break;
        case 'close':
          nowMatchliveWindow.close();
          break;
        case 'always-on-top':
          nowMatchliveWindow.setAlwaysOnTop(
            !nowMatchliveWindow.isAlwaysOnTop(),
          );
          break;
        default:
          log.error(`Unknown msg: ${JSON.stringify(msg)}`);
      }
      return;
    } else if (msg.window !== 'app') {
      const appWindow = WindowManager.getInstance().appWindow;
      if (!appWindow) {
        console.error('appWindow is undefined.');
        return;
      }
      switch (msg.action) {
        case 'minimize':
          appWindow.minimize();
          break;
        case 'quit':
          app.quit();
          break;
        default:
          log.error(`Unknown window contol: ${msg}`);
      }
      return;
    }
  });

  ipcMain.on('loginfo', (event, data) => {
    log.info(data);
  });
};

export const setupappWindowIpcMainHandlers = () => {
  const _appWindow = WindowManager.getInstance().appWindow;
  if (!_appWindow) {
    console.error('appWindow is undefined. IPC handlers not registered.');
    return;
  }

  ipcMain.on('open-matchlive-window', async () => {
    const matchliveWindow =
      await WindowManager.getInstance().createMatchliveWindow();
    if (!matchliveWindow) {
      console.error('Failed to create matchliveWindow.');
    }
  });

  ipcMain.on('to-app', (event, data) => {
    const appWindow = WindowManager.getInstance().appWindow;
    if (!appWindow) {
      console.error('appWindow is undefined.');
      return;
    }
    appWindow.webContents.send('to-app', data);
  });

  ipcMain.on('matchlive-react-ready', () => {
    const appWindow = WindowManager.getInstance().appWindow;
    if (!appWindow) {
      console.error('appWindow is undefined.');
      return;
    }
    appWindow.webContents.send('to-app', { type: 'SEND_SHOW_PHOTO' });
  });
};

export const setupMatchliveIpcMainHandlers = () => {
  if (
    !WindowManager.getInstance().matchliveWindow ||
    WindowManager.getInstance().matchliveWindow?.isDestroyed()
  ) {
    console.error('matchliveWindow is not ready. IPC handlers not registered.');
    return;
  }

  ipcMain.on('to-matchlive', (event, data) => {
    const nowMatchliveWindow = WindowManager.getInstance().matchliveWindow;
    if (!nowMatchliveWindow || nowMatchliveWindow.isDestroyed()) {
      console.error(
        'matchliveWindow is not ready. to-matchlive message ignored.',
      );
      return;
    }

    try {
      nowMatchliveWindow.webContents.send('to-matchlive', data);
    } catch (e) {
      log.error('to-matchlive ipc error message', e);
    }
  });

  ipcMain.handle('reset-matchlive-window', async () => {
    const nowMatchliveWindow = WindowManager.getInstance().matchliveWindow;
    if (!nowMatchliveWindow || nowMatchliveWindow.isDestroyed()) {
      console.error('matchliveWindow is not ready for reset.');
      return;
    }

    const { height, width } =
      await matchliveWindowService.getDefaultWindowSize();

    nowMatchliveWindow.setSize(width, height);
    nowMatchliveWindow.center();
    nowMatchliveWindow.focus();
  });
};

// export const removeAllappWindowIpcMainHandlers = () => {
//   ipcMain.removeAllListeners('loginfo');
//   ipcMain.removeAllListeners('open-matchlive-window');
//   ipcMain.removeAllListeners('to-app');
//   ipcMain.removeAllListeners('matchlive-react-ready');
// };

// export const removeAllMatchliveIpcMainHandlers = () => {
//   ipcMain.removeAllListeners('to-matchlive');
//   ipcMain.removeAllListeners('reset-matchlive-window');
// };
