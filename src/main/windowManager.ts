import { BrowserWindow, Menu } from 'electron';
import path from 'path';
import { app } from 'electron';
import { resolveHtmlPath } from './util';
import { setupMatchliveIpcMainHandlers } from './ipcManager';

let mainWindow: BrowserWindow | null = null;
let matchliveWindow: BrowserWindow | null = null;

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../assets');

const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};

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

  console.log('createMainWindow');
  console.log(
    'preload path:',
    path.join(__dirname, '../../.erb/dll/preload.js'),
  );

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
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
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

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  return mainWindow;
};

export const createMatchliveWindow = async () => {
  if (matchliveWindow) {
    matchliveWindow.focus();
    return;
  }

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
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
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
