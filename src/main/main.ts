import path from 'path';
import { app, BrowserWindow, shell, ipcMain, session } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { setupIpcMainHandlers } from './ipc';
import { setupStompHandlers } from './stomp';
import { AppUpdater } from './AppUpdater';

let mainWindow: BrowserWindow | null = null;
let matchliveWindow: BrowserWindow | null = null;

const createMatchliveWindow = async () => {
  if (matchliveWindow !== null) {
    if (matchliveWindow.isDestroyed()) {
      matchliveWindow = null;
    } else {
      matchliveWindow.focus();
      return;
    }
  }

  matchliveWindow = new BrowserWindow({
    width: 500,
    height: 800,
    transparent: true,
    frame: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  matchliveWindow.loadURL(resolveHtmlPath('matchlive.html'));

  matchliveWindow.on('ready-to-show', () => {
    console.log('matchlive window ready-to-show');
    // IPC 핸들러 설정
    matchliveWindow!.webContents.on('did-finish-load', () => {
      console.log('matclive window did-finish-load');
      ipcMain.on('main-to-sub', (event, data) => {
        console.log('main-to-sub data', data);
        matchliveWindow!.webContents.send('main-to-sub', data);
      });

      ipcMain.on('sub-to-main', (event, data) => {
        console.log('sub-to-main data', data);
        mainWindow!.webContents.send('sub-to-main', data);
      });
    });
  });

  matchliveWindow.on('closed', () => {
    matchliveWindow = null;
    ipcMain.removeAllListeners('main-to-sub');
    ipcMain.removeAllListeners('sub-to-main');
  });

  return matchliveWindow;
};

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
  app.commandLine.appendSwitch('ignore-certificate-errors');
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createMainWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  if (mainWindow !== null) {
    mainWindow.focus();
    return;
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    console.log('main ready to show!');
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });
};

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(async () => {
    await createMainWindow();
    const appUpdater = new AppUpdater(mainWindow);
    setupIpcMainHandlers(mainWindow, createMatchliveWindow, appUpdater);
    setupStompHandlers(mainWindow);
  })
  .catch(async (e) => {
    console.log(e);
    log.error(e);
  });
