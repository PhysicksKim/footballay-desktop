import path from 'path';
import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  session,
  webContents,
} from 'electron';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { setupIpcMainHandlers } from './ipc';
import { setupStompHandlers } from './stomp';
import { AppUpdater } from './AppUpdater';

let mainWindow: BrowserWindow | null = null;
let matchliveWindow: BrowserWindow | null = null;
let isMatchliveIpcListenersRegistered = false;
let isMatchliveReadyToShowListenersRegistered = false;

const sendIpcMatchliveWindowReady = async () => {
  mainWindow!.webContents.send('to-app', {
    type: 'MATCHLIVE_WINDOW_READY',
  });
};

const createMatchliveWindow = async () => {
  // 이미 생성되어 있다면
  if (matchliveWindow !== null) {
    if (matchliveWindow.isDestroyed()) {
      matchliveWindow = null;
    } else {
      // 곧바로 ready 상태임을 app window 에 알린다.
      sendIpcMatchliveWindowReady();
      matchliveWindow.focus();
      return;
    }
  }

  matchliveWindow = new BrowserWindow({
    width: 300,
    height: 400,
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

  // if(matchliveWindow === null) {
  //   return;
  // }

  matchliveWindow.loadURL(resolveHtmlPath('matchlive.html'));

  matchliveWindow.on('ready-to-show', () => {
    if (matchliveWindow === null) {
      return;
    }
    matchliveWindow.show();
  });

  matchliveWindow!.webContents.on('did-finish-load', () => {
    if (!isMatchliveIpcListenersRegistered) {
      ipcMain.on('to-matchlive', (event, data) => {
        matchliveWindow!.webContents.send('to-matchlive', data);
      });
      ipcMain.on('to-app', (event, data) => {
        mainWindow!.webContents.send('to-app', data);
      });

      isMatchliveIpcListenersRegistered = true;
    }
    sendIpcMatchliveWindowReady();
  });

  matchliveWindow.on('closed', () => {
    matchliveWindow = null;
    ipcMain.removeAllListeners('to-matchlive');
    ipcMain.removeAllListeners('to-app');
    isMatchliveIpcListenersRegistered = false;
    isMatchliveReadyToShowListenersRegistered = false;
    mainWindow?.webContents.send('to-app', {
      type: 'MATCHLIVE_WINDOW_CLOSED',
    });
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

  // ---- Menu Bar ---
  // const menuBuilder = new MenuBuilder(mainWindow);
  // menuBuilder.buildMenu();

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
