import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { BrowserWindow } from 'electron';

export class AppUpdater {
  constructor(private mainWindow: BrowserWindow | null) {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;

    autoUpdater.on('checking-for-update', () => {
      log.info('Checking for update...');
      if (this.mainWindow) {
        this.mainWindow.webContents.send('update-status', {
          message: '업데이트 확인 중...',
          status: 'check',
        });
      }
    });

    autoUpdater.on('update-available', (info) => {
      log.info('Update available.');
      if (this.mainWindow) {
        this.mainWindow.webContents.send('update-status', {
          message: '업데이트가 있습니다. 다운로드 중...',
          status: 'downloading',
        });
      }
    });

    autoUpdater.on('update-not-available', (info) => {
      log.info('Update not available.');
      if (this.mainWindow) {
        this.mainWindow.webContents.send('update-status', {
          message: '최신 버전입니다.',
          status: 'latest',
        });
      }
    });

    autoUpdater.on('error', (err) => {
      log.error('Error in auto-updater. ' + err);
      if (this.mainWindow) {
        this.mainWindow.webContents.send('update-status', {
          message: '업데이트 중 오류가 발생했습니다.',
          status: 'error',
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
    });

    autoUpdater.on('update-downloaded', (info) => {
      log.info('Update downloaded');
      if (this.mainWindow) {
        this.mainWindow.webContents.send('update-status', {
          message: '업데이트 다운로드 완료. 앱을 재시작합니다...',
          status: 'downloaded',
        });
      }
      autoUpdater.quitAndInstall(true, true);
    });
  }

  checkForUpdates() {
    autoUpdater.checkForUpdatesAndNotify();
  }
}
