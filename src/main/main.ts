import { app } from 'electron';
import log from 'electron-log';
import {
  createMainWindow,
  createMatchliveWindow,
  createUpdatecheckerWindow,
} from './windowManager';
import { setupMainWindowIpcMainHandlers } from './ipcManager';
import { AppUpdater } from './AppUpdater';

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

if (process.env.NODE_ENV === 'development') {
  // Useful for some dev/debugging tasks, but download can
  // not be validated becuase dev app is not signed

  Object.defineProperty(app, 'isPackaged', {
    get() {
      return true;
    },
  });
}

app
  .whenReady()
  .then(async () => {
    const mainWindow = await createMainWindow();
    const updatecheckerWindow = await createUpdatecheckerWindow();
    const appUpdater = new AppUpdater(mainWindow);
    appUpdater.checkForUpdates();
    setupMainWindowIpcMainHandlers(mainWindow, createMatchliveWindow);
  })
  .catch((e) => {
    console.log(e);
    log.error(e);
  });
