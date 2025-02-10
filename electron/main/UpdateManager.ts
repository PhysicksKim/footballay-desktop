import electronUpdater from 'electron-updater';
import log from 'electron-log';
import { BrowserWindow } from 'electron';
import { AppState } from './AppState';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

const { autoUpdater } = electronUpdater;

class UpdateManager {
  private static instance: UpdateManager;
  private _isUpdateChecked: boolean = false;

  private appWindow: BrowserWindow;
  private updatecheckerWindow: BrowserWindow;

  private constructor(
    appWindow: BrowserWindow,
    updatecheckerWindow: BrowserWindow
  ) {
    this.appWindow = appWindow;
    this.updatecheckerWindow = updatecheckerWindow;

    if (import.meta.env.MODE === 'development') {
      autoUpdater.updateConfigPath = path.join(
        process.cwd(),
        'electron/main/dev-app-update.yml'
      );
    }

    this.setupAutoUpdaterListeners();

    log.transports.file.level = 'info';
    autoUpdater.logger = log;
  }

  static getInstance(
    appWindow: BrowserWindow,
    updatecheckerWindow: BrowserWindow
  ): UpdateManager {
    if (!UpdateManager.instance) {
      UpdateManager.instance = new UpdateManager(
        appWindow,
        updatecheckerWindow
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

    autoUpdater.on('update-available', (info) => {
      this._isUpdateChecked = true;
      log.info('Update available.');
      AppState.isUpdateInProgress = true;

      const currentVersion = autoUpdater.currentVersion?.version || 'unknown';
      const latestVersion = info.version || 'unknown';

      log.info(
        `Now version: ${currentVersion}, Latest version: ${latestVersion}`
      );

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
        this.appWindow?.show();
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
        this.appWindow?.show();
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
    autoUpdater.checkForUpdates();
  }
}

export default UpdateManager;
