import { BrowserWindow, Menu, app } from 'electron';
import log from 'electron-log';
import { AppState } from './AppState';
import { resolveHtmlPath } from './util';
import { getMatchliveWindowSize } from './store/DefaultSettingData';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

type AppWindow = BrowserWindow | null;
const isDev = import.meta.env.MODE === 'development';

/**
 * 각 윈도우는 싱글톤으로 관리합니다.
 * create___Window 메서드를 통해 윈도우를 생성하거나 이전에 생성된 윈도우를 focus 합니다.
 */
class WindowManager {
  static instance: WindowManager;

  appWindow: AppWindow = null;
  matchliveWindow: AppWindow = null;
  updatecheckerWindow: AppWindow = null;

  static getInstance() {
    if (!WindowManager.instance) {
      WindowManager.instance = new WindowManager();
    }
    return WindowManager.instance;
  }

  /**
   * App window 를 생성하고 열거나, 이전에 생성되어 있다면 창을 focus 합니다.
   * @returns BrowserWindow 객체
   */
  async createappWindow() {
    if (this.appWindow) {
      this.appWindow.focus();
      return this.appWindow;
    }

    this.appWindow = new BrowserWindow({
      show: false,
      width: 800,
      height: 600,
      minWidth: 800,
      minHeight: 600,
      icon: this.getAssetPath('icon.png'),
      frame: false,
      webPreferences: {
        contextIsolation: true,
        backgroundThrottling: false,
        preload: path.join(__dirname, '../preload/preload.mjs'),
      },
      movable: true,
    });

    this.appWindow.menuBarVisible = false;
    Menu.setApplicationMenu(null);
    this.appWindow.loadURL(resolveHtmlPath('app.html'));

    this.appWindow.on('ready-to-show', () => {
      this.appWindow?.show();
    });

    this.appWindow.on('closed', () => {
      if (AppState.isUpdateInProgress) {
        AppState.isQuitInitiated = true;
        this.appWindow?.webContents.send('to-app', {
          type: 'UPDATE_IN_PROGRESS',
        });
      } else {
        app.quit();
      }

      this.appWindow = null;
    });

    this.appWindow.on('show', () => {
      if (!this.appWindow) return;

      if (isDev) {
        this.appWindow.webContents.openDevTools();
      }
      this.appWindow.focus();
    });

    return this.appWindow;
  }

  /**
   * Matchlive window 를 생성하고 열거나, 이전에 생성되어 있다면 창을 focus 합니다.
   * @returns BrowserWindow 객체
   */
  async createMatchliveWindow() {
    if (this.matchliveWindow) {
      this.matchliveWindow.focus();
      return this.matchliveWindow;
    }

    const { height, width } = await getMatchliveWindowSize();
    this.matchliveWindow = new BrowserWindow({
      width,
      height,
      resizable: true,
      transparent: true,
      frame: false,
      webPreferences: {
        contextIsolation: true,
        backgroundThrottling: false,
        preload: path.join(__dirname, '../preload/preload.mjs'),
      },
      movable: true,
    });

    this.matchliveWindow.loadURL(resolveHtmlPath('matchlive.html'));

    this.matchliveWindow.on('ready-to-show', () => {
      this.matchliveWindow?.show();
      if (isDev) {
        this.matchliveWindow?.webContents.openDevTools();
      }
    });

    this.matchliveWindow.on('closed', () => {
      this.appWindow?.webContents.send('to-app', {
        type: 'MATCHLIVE_WINDOW_CLOSED',
      });

      this.matchliveWindow = null;
    });

    return this.matchliveWindow;
  }

  /**
   * Update checker window 를 생성하고 열거나, 이전에 생성되어 있다면 창을 focus 합니다.
   * @returns BrowserWindow 객체
   */
  async createUpdatecheckerWindow() {
    if (this.updatecheckerWindow) {
      this.updatecheckerWindow.focus();
      return this.updatecheckerWindow;
    }

    if (!this.appWindow) {
      log.error('Main window is required for update checker window');
      throw new Error('Main window is required for update checker window');
    }

    this.updatecheckerWindow = new BrowserWindow({
      width: 300,
      height: 200,
      resizable: false,
      parent: this.appWindow,
      frame: false,
      transparent: true,
      webPreferences: {
        contextIsolation: true,
        backgroundThrottling: false,
        preload: path.join(__dirname, '../preload/preload.mjs'),
      },
      movable: true,
    });

    this.updatecheckerWindow.loadURL(resolveHtmlPath('updatechecker.html'));

    this.updatecheckerWindow.on('ready-to-show', () => {
      this.updatecheckerWindow?.show();
    });

    this.updatecheckerWindow.on('closed', () => {
      this.updatecheckerWindow = null;
      this.appWindow?.webContents.send('to-app', {
        type: 'AUTO_UPDATER_WINDOW_CLOSED',
      });
    });

    return this.updatecheckerWindow;
  }

  /**
   * Asset 폴더 내의 파일 경로를 반환합니다. dev 환경과 packaged 환경에 따라 적절한 경로를 반환합니다.
   * @param paths 얻고자 하는 파일의 경로 (예: 'icon.png')
   * @returns 파일의 절대 경로.
   */
  private getAssetPath(...paths: string[]) {
    let basePath: string;
    if (app.isPackaged) {
      // 패키징된 앱에서는 electron-builder가 assets 폴더를 resources 폴더 아래로 복사함.
      basePath = path.join(process.resourcesPath, 'assets');
    } else {
      // 개발 환경에서는 프로젝트 루트에 위치한 assets 폴더를 사용. process.cwd()는 프로젝트 루트를 가리킴.
      basePath = path.join(process.cwd(), 'assets');
    }
    return path.join(basePath, ...paths);
  }
}

export default WindowManager;
