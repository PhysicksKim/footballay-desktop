import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { BrowserWindow } from 'electron';

export class AppUpdater {
  constructor(private mainWindow: BrowserWindow | null) {
    console.log('AppUpdater constructor');
    log.transports.file.level = 'info';
    autoUpdater.logger = log;

    autoUpdater.on('checking-for-update', () => {
      log.info('Checking for update...');
      console.log('Checking for update...');
      if (this.mainWindow) {
        this.mainWindow.webContents.send('message', '업데이트 확인 중...');
        this.mainWindow.webContents.send('isUpdating', true);
      }
    });

    autoUpdater.on('update-available', (info) => {
      log.info('Update available.');
      if (this.mainWindow) {
        this.mainWindow.webContents.send(
          'message',
          '업데이트 가능. 다운로드 중...',
        );
      }
    });

    autoUpdater.on('update-not-available', (info) => {
      log.info('Update not available.');
      if (this.mainWindow) {
        this.mainWindow.webContents.send(
          'message',
          '업데이트가 없습니다. 앱을 시작합니다...',
        );
        this.mainWindow.webContents.send('isUpdating', false);
      }
    });

    autoUpdater.on('error', (err) => {
      log.error('Error in auto-updater. ' + err);
      if (this.mainWindow) {
        this.mainWindow.webContents.send('message', '오류: ' + err);
        this.mainWindow.webContents.send('isUpdating', false);
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
      if (this.mainWindow) {
        this.mainWindow.webContents.send('message', `로그:${logMessage}`);
      }
    });

    autoUpdater.on('update-downloaded', (info) => {
      log.info('Update downloaded');
      if (this.mainWindow) {
        this.mainWindow.webContents.send(
          'message',
          '업데이트 다운로드 완료. 앱을 재시작합니다...',
        );
      }
      autoUpdater.quitAndInstall(true, true);
    });
  }

  checkForUpdates() {
    autoUpdater.checkForUpdatesAndNotify();
  }
}
