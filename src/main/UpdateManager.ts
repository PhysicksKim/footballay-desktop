/**
  import { autoUpdater } from 'electron-updater';
  import log from 'electron-log';
  import { BrowserWindow } from 'electron';
  import { AppState } from './AppState';
  import path from 'path';

  export class AppUpdater {
    private _isUpdateChecked: boolean = false;

    get isUpdateChecked() {
      return this._isUpdateChecked;
    }

    constructor(
      private mainWindow: BrowserWindow | undefined,
      private updatecheckerWindow: BrowserWindow | undefined,
    ) {
      if (process.env.NODE_ENV === 'development') {
        autoUpdater.updateConfigPath = path.join(__dirname, 'dev-app-update.yml');
      }

      // 이벤트 리스너를 추가하여 업데이트 체크 여부 확인
      autoUpdater.on('checking-for-update', () => {
        this._isUpdateChecked = true;
      });

      autoUpdater.on('update-available', () => {
        this._isUpdateChecked = true;
      });

      autoUpdater.on('update-not-available', () => {
        this._isUpdateChecked = true;
      });

      autoUpdater.on('error', () => {
        this._isUpdateChecked = true;
      });

      console.log('AppUpdater constructor');
      log.transports.file.level = 'info';
      autoUpdater.logger = log;

      autoUpdater.on('checking-for-update', () => {
        log.info('Checking for update...');
        console.log('Checking for update...');
        AppState.isUpdateInProgress = true;
        if (this.updatecheckerWindow) {
          this.updatecheckerWindow?.webContents.send('to-updatechecker', {
            type: 'CHECKING_FOR_UPDATE',
            data: {},
          });
        }
      });

      autoUpdater.on('update-available', (info) => {
        log.info('Update available.');
        AppState.isUpdateInProgress = true;
        if (this.updatecheckerWindow) {
          this.updatecheckerWindow?.webContents.send('to-updatechecker', {
            type: 'UPDATE_AVAILABLE',
            data: {},
          });
        }
      });

      autoUpdater.on('update-not-available', (info) => {
        log.info('Update not available.');
        AppState.isUpdateInProgress = false;
        if (this.updatecheckerWindow) {
          this.updatecheckerWindow?.webContents.send('to-updatechecker', {
            type: 'UPDATE_NOT_AVAILABLE',
            data: {},
          });
        }

        setTimeout(() => {
          this.updatecheckerWindow?.close();
          this.mainWindow?.show();
        }, 200);
      });

      autoUpdater.on('error', (err) => {
        log.error('Error in auto-updater. ' + err);
        AppState.isUpdateInProgress = false;
        if (this.updatecheckerWindow) {
          this.updatecheckerWindow?.webContents.send('to-updatechecker', {
            type: 'UPDATE_ERROR',
            data: {
              error: err,
            },
          });
        }

        setTimeout(() => {
          this.updatecheckerWindow?.close();
          this.mainWindow?.show();
        }, 200);
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

        this.updatecheckerWindow?.webContents.send('to-updatechecker', {
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
        if (this.updatecheckerWindow && !this.updatecheckerWindow.isDestroyed()) {
          this.updatecheckerWindow?.webContents.send('to-updatechecker', {
            type: 'UPDATE_DOWNLOADED',
            data: {},
          });
        }
        // quitAndInstall: (isSilent: boolean, isForceRunAfter: boolean) => void;
        setTimeout(() => {
          autoUpdater.quitAndInstall(true, true);
        }, 1000);
      });
    }

    checkForUpdates() {
      console.log('checkForUpdates');
      autoUpdater.checkForUpdates();
    }
  }
*/
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { BrowserWindow } from 'electron';
import { AppState } from './AppState';
import path from 'path';

class UpdateManager {
  private static instance: UpdateManager;
  private _isUpdateChecked: boolean = false;

  private mainWindow: BrowserWindow;
  private updatecheckerWindow: BrowserWindow;

  private constructor(
    mainWindow: BrowserWindow,
    updatecheckerWindow: BrowserWindow,
  ) {
    this.mainWindow = mainWindow;
    this.updatecheckerWindow = updatecheckerWindow;

    if (process.env.NODE_ENV === 'development') {
      autoUpdater.updateConfigPath = path.join(__dirname, 'dev-app-update.yml');
    }

    this.setupAutoUpdaterListeners();

    console.log('UpdateManager constructor');
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
  }

  static getInstance(
    mainWindow: BrowserWindow,
    updatecheckerWindow: BrowserWindow,
  ): UpdateManager {
    if (!UpdateManager.instance) {
      UpdateManager.instance = new UpdateManager(
        mainWindow,
        updatecheckerWindow,
      );
    }
    return UpdateManager.instance;
  }

  get isUpdateChecked() {
    return this._isUpdateChecked;
  }

  private setupAutoUpdaterListeners() {
    autoUpdater.on('checking-for-update', () => {
      this._isUpdateChecked = true;
      log.info('Checking for update...');
      AppState.isUpdateInProgress = true;
      this.updatecheckerWindow?.webContents.send('to-updatechecker', {
        type: 'CHECKING_FOR_UPDATE',
        data: {},
      });
    });

    autoUpdater.on('update-available', () => {
      this._isUpdateChecked = true;
      log.info('Update available.');
      AppState.isUpdateInProgress = true;
      this.updatecheckerWindow?.webContents.send('to-updatechecker', {
        type: 'UPDATE_AVAILABLE',
        data: {},
      });
    });

    autoUpdater.on('update-not-available', () => {
      this._isUpdateChecked = true;
      log.info('Update not available.');
      AppState.isUpdateInProgress = false;
      this.updatecheckerWindow?.webContents.send('to-updatechecker', {
        type: 'UPDATE_NOT_AVAILABLE',
        data: {},
      });

      setTimeout(() => {
        this.updatecheckerWindow?.close();
        this.mainWindow?.show();
      }, 200);
    });

    autoUpdater.on('error', (err) => {
      this._isUpdateChecked = true;
      log.error('Error in auto-updater. ' + err);
      AppState.isUpdateInProgress = false;
      this.updatecheckerWindow?.webContents.send('to-updatechecker', {
        type: 'UPDATE_ERROR',
        data: { error: err },
      });

      setTimeout(() => {
        this.updatecheckerWindow?.close();
        this.mainWindow?.show();
      }, 200);
    });

    autoUpdater.on('download-progress', (progressObj) => {
      const logMessage = `다운로드 속도: ${progressObj.bytesPerSecond} - 다운로드 ${progressObj.percent}% 완료 (${progressObj.transferred}/${progressObj.total})`;
      log.info(logMessage);

      this.updatecheckerWindow?.webContents.send('to-updatechecker', {
        type: 'DOWNLOAD_PROGRESS',
        data: {
          bytesPerSecond: progressObj.bytesPerSecond,
          percent: progressObj.percent,
          transferred: progressObj.transferred,
          total: progressObj.total,
        },
      });
    });

    autoUpdater.on('update-downloaded', () => {
      log.info('Update downloaded');
      AppState.isUpdateInProgress = false;
      this.updatecheckerWindow?.webContents.send('to-updatechecker', {
        type: 'UPDATE_DOWNLOADED',
        data: {},
      });

      setTimeout(() => {
        autoUpdater.quitAndInstall(true, true);
      }, 1000);
    });
  }

  checkForUpdates() {
    console.log('checkForUpdates');
    autoUpdater.checkForUpdates();
  }
}

export default UpdateManager;
