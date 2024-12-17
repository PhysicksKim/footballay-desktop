// import { app } from 'electron';
// import log from 'electron-log';
// // import {
// //   createMainWindow,
// //   createMatchliveWindow,
// //   createUpdatecheckerWindow,
// // } from './windowManager';
// import { setupMainWindowIpcMainHandlers } from './ipcManager';
// import { AppUpdater } from './AppUpdater';
// import CustomElectronStoreIpc from './store/CustomElectronStoreIpc';
// import WindowManager from './windowManager';

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
// });

// const isDev = process.env.NODE_ENV === 'development';
// const isTestAutoUpdate = false;

// if (isDev && isTestAutoUpdate) {
//   app.getVersion = () => '0.0.1'; // 임의로 낮은 버전을 설정하여 업데이트를 트리거
//   Object.defineProperty(app, 'isPackaged', {
//     get() {
//       return true;
//     },
//   });
// } else {
//   if (isDev) {
//     console.log('skipped update property injection for dev environment');
//   }
// }

// app
//   .whenReady()
//   .then(async () => {
//     new CustomElectronStoreIpc();
//     const mainWindow = await createMainWindow();
//     const updatecheckerWindow = await createUpdatecheckerWindow();
//     const appUpdater = new AppUpdater(mainWindow, updatecheckerWindow);
//     appUpdater.checkForUpdates();
//     setupMainWindowIpcMainHandlers(mainWindow, createMatchliveWindow);

//     if (isDev && !isTestAutoUpdate) {
//       setTimeout(() => {
//         updatecheckerWindow?.close();
//       }, 1000);
//     }
//   })
//   .catch((e) => {
//     console.log(e);
//     log.error(e);
//   });
import { app } from 'electron';
import log from 'electron-log';
import { setupMainWindowIpcMainHandlers } from './ipcManager';
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
  app.getVersion = () => '0.0.1'; // 임의로 낮은 버전을 설정하여 업데이트를 트리거
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

    // Set up IPC handlers
    setupMainWindowIpcMainHandlers(
      mainWindow,
      windowManager.createMatchliveWindow.bind(windowManager),
    );

    // Close update checker window in development mode
    if (isDev && !isTestAutoUpdate) {
      setTimeout(() => {
        updatecheckerWindow?.close();
      }, 1000);
    }
  })
  .catch((e) => {
    console.log(e);
    log.error(e);
  });
