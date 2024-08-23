import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { BrowserWindow } from 'electron';
import { AppState } from './AppState';
import path from 'path';

export class AppUpdater {
  constructor(private mainWindow: BrowserWindow | undefined) {
    if (process.env.NODE_ENV === 'development') {
      autoUpdater.updateConfigPath = path.join(__dirname, 'dev-app-update.yml');
    }

    console.log('AppUpdater constructor');
    log.transports.file.level = 'info';
    autoUpdater.logger = log;

    autoUpdater.on('checking-for-update', () => {
      log.info('Checking for update...');
      console.log('Checking for update...');
      AppState.isUpdateInProgress = true;
      if (this.mainWindow) {
        this.mainWindow.webContents.send('to-updatechecker', {
          type: 'CHECKING_FOR_UPDATE',
          data: {},
        });
      }
    });

    autoUpdater.on('update-available', (info) => {
      log.info('Update available.');
      AppState.isUpdateInProgress = true;
      if (this.mainWindow) {
        this.mainWindow.webContents.send('to-updatechecker', {
          type: 'UPDATE_AVAILABLE',
          data: {},
        });
      }
    });

    autoUpdater.on('update-not-available', (info) => {
      log.info('Update not available.');
      AppState.isUpdateInProgress = false;
      if (this.mainWindow) {
        this.mainWindow.webContents.send('to-updatechecker', {
          type: 'UPDATE_NOT_AVAILABLE',
          data: {},
        });
      }
    });

    autoUpdater.on('error', (err) => {
      log.error('Error in auto-updater. ' + err);
      AppState.isUpdateInProgress = false;
      if (this.mainWindow) {
        this.mainWindow.webContents.send('to-updatechecker', {
          type: 'UPDATE_ERROR',
          data: {
            error: err,
          },
        });
      }
    });

    autoUpdater.on('download-progress', (progressObj) => {
      let logMessage = '다운로드 속도: ' + progressObj.bytesPerSecond;
      logMessage = logMessage + ' - 다운로드 ' + progressObj.percent + '% 완료';
      logMessage =
        logMessage +
        ' (' +
        progressObj.transferred +
        '/' +
        progressObj.total +
        ')';
      log.info(logMessage);

      this.mainWindow?.webContents.send('to-updatechecker', {
        type: 'DOWNLOAD_PROGRESS',
        data: {
          bytesPerSecond: progressObj.bytesPerSecond,
          percent: progressObj.percent,
          transferred: progressObj.transferred,
          total: progressObj.total,
        },
      });
    });

    autoUpdater.on('update-downloaded', (info) => {
      log.info('Update downloaded');
      AppState.isUpdateInProgress = false;
      if (this.mainWindow) {
        this.mainWindow.webContents.send('to-updatechecker', {
          type: 'UPDATE_DOWNLOADED',
          data: {},
        });
      }
      // quitAndInstall: (isSilent: boolean, isForceRunAfter: boolean) => void;
      autoUpdater.quitAndInstall(true, true);
    });
  }

  checkForUpdates() {
    console.log('checkForUpdates');
    autoUpdater.checkForUpdates();
  }
}
