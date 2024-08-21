import { app } from 'electron';
import log from 'electron-log';
import { createMainWindow, createMatchliveWindow } from './windowManager';
import { setupMainWindowIpcMainHandlers } from './ipcManager';
import { AppUpdater } from './AppUpdater';

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(async () => {
    const mainWindow = await createMainWindow();
    const appUpdater = new AppUpdater(mainWindow);
    appUpdater.checkForUpdates();
    setupMainWindowIpcMainHandlers(mainWindow, createMatchliveWindow);
  })
  .catch((e) => {
    console.log(e);
    log.error(e);
  });
