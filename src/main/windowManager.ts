import { BrowserWindow, Event, Menu } from 'electron';
import path from 'path';
import { app } from 'electron';
import { resolveHtmlPath } from './util';
import { setupMatchliveIpcMainHandlers } from './ipcManager';
import { AppState } from './AppState';

let mainWindow: BrowserWindow | null = null;
let matchliveWindow: BrowserWindow | null = null;
let updatecheckerWindow: BrowserWindow | null = null;

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../assets');

const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};

const isDev = process.env.NODE_ENV === 'development';

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
  app.commandLine.appendSwitch('ignore-certificate-errors');
}

export const createMainWindow = async () => {
  if (mainWindow) {
    mainWindow.focus();
    return;
  }
  mainWindow = new BrowserWindow({
    show: false,
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    icon: getAssetPath('icon.png'),
    frame: false,
    webPreferences: {
      contextIsolation: true,
      backgroundThrottling: false,
      preload:
        app.isPackaged && !isDev
          ? path.join(__dirname, 'preload.js')
          : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
    movable: true,
  });

  // hide menu and only show title bar
  mainWindow.menuBarVisible = false;
  Menu.setApplicationMenu(null);

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) throw new Error('"mainWindow" is not defined');
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', (e: Electron.Event) => {
    if (AppState.isUpdateInProgress) {
      e.preventDefault();
      AppState.isQuitInitiated = true;
      mainWindow?.webContents.send('to-app', {
        type: 'UPDATE_IN_PROGRESS',
      });
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
    if (!AppState.isUpdateInProgress) {
      app.quit(); // 업데이트가 진행 중이 아니면 앱 종료
    }
  });

  return mainWindow;
};

export const createUpdatecheckerWindow = async () => {
  if (!mainWindow) {
    return;
  }

  updatecheckerWindow = new BrowserWindow({
    width: 300,
    height: 200,
    resizable: false,
    parent: mainWindow,
    frame: false,
    transparent: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      backgroundThrottling: false,
      preload:
        app.isPackaged && !isDev
          ? path.join(__dirname, 'preload.js')
          : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
    movable: true,
  });

  updatecheckerWindow.loadURL(resolveHtmlPath('updatechecker.html'));

  updatecheckerWindow.on('ready-to-show', () => {
    if (updatecheckerWindow === null) return;
    updatecheckerWindow.show();
  });

  updatecheckerWindow.on('closed', () => {
    mainWindow?.webContents.send('to-app', {
      type: 'AUTO_UPDATER_WINDOW_CLOSED',
    });
  });

  return updatecheckerWindow;
};

export const createMatchliveWindow = async () => {
  if (!mainWindow) {
    return;
  }

  if (matchliveWindow) {
    matchliveWindow.focus();
    return;
  }

  /*
  작게 : 330 x 680
  */
  matchliveWindow = new BrowserWindow({
    width: 415,
    height: 850,
    resizable: true,
    transparent: true,
    frame: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      backgroundThrottling: false,
      preload:
        app.isPackaged && !isDev
          ? path.join(__dirname, 'preload.js')
          : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
    movable: true,
  });

  matchliveWindow.loadURL(resolveHtmlPath('matchlive.html'));

  matchliveWindow.on('ready-to-show', () => {
    if (matchliveWindow === null) return;
    matchliveWindow.show();
  });

  matchliveWindow.on('closed', () => {
    matchliveWindow = null;
    mainWindow?.webContents.send('to-app', {
      type: 'MATCHLIVE_WINDOW_CLOSED',
    });
  });

  setupMatchliveIpcMainHandlers(matchliveWindow);

  return matchliveWindow;
};
