import { app } from 'electron';
import log from 'electron-log';
import CustomElectronStoreIpc from './store/CustomElectronStoreIpc';
import WindowManager from './windowManager';
import UpdateManager from './UpdateManager';

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

const isDev = process.env.NODE_ENV === 'development';
const isTestAutoUpdate = false;

if (isDev) {
  // 개발 환경에서 인증서 에러 무시
  app.commandLine.appendSwitch('ignore-certificate-errors');
}

if (isDev && isTestAutoUpdate) {
  // 임의로 낮은 버전을 설정하여 업데이트를 트리거
  app.getVersion = () => '0.0.1';
  Object.defineProperty(app, 'isPackaged', {
    get() {
      return true;
    },
  });
} else {
  if (isDev) {
    console.log('skipped update property injection for dev environment');
  }
}

app
  .whenReady()
  .then(async () => {
    new CustomElectronStoreIpc();
    const windowManager = WindowManager.getInstance();
    const mainWindow = await windowManager.createMainWindow();
    const updatecheckerWindow = await windowManager.createUpdatecheckerWindow();
    const updateManager = UpdateManager.getInstance(
      mainWindow,
      updatecheckerWindow,
    );
    updateManager.checkForUpdates();

    // if (isDev) {
    //   mainWindow.webContents.openDevTools();
    // }

    /* Close update checker window in development mode */
    if (isDev && !isTestAutoUpdate) {
      setTimeout(() => {
        updatecheckerWindow?.close();
      }, 1000);
    }
  })
  .catch((e) => {
    log.error(e);
  });
