import path from 'path';
import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  session,
  webContents,
  Menu,
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
  if (!mainWindow) {
    console.log('mainWindow is null or undefined');
  }
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
    width: 400,
    height: 700,
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

  matchliveWindow.webContents.on('before-input-event', (event, input) => {
    if (input.control || input.meta) {
      switch (input.key.toLowerCase()) {
        case 'w': // Ctrl+W or Cmd+W (창 닫기)
        case 'q': // Ctrl+Q or Cmd+Q (앱 종료)
        case 't': // Ctrl+T or Cmd+T (새 탭 열기)
        case 'r': // Ctrl+R or Cmd+R (페이지 새로고침)
        case 'n': // Ctrl+N or Cmd+N (새 창 열기)
        case 'p': // Ctrl+P or Cmd+P (인쇄)
        case 'f': // Ctrl+F or Cmd+F (찾기)
        case 'r': // Ctrl+R or Cmd+R (페이지 새로고침)
          event.preventDefault();
          break;
        default:
          break;
      }
    }
  });

  Menu.setApplicationMenu(null);

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

  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.control || input.meta) {
      switch (input.key.toLowerCase()) {
        case 'w': // Ctrl+W or Cmd+W (창 닫기)
        case 'q': // Ctrl+Q or Cmd+Q (앱 종료)
        case 't': // Ctrl+T or Cmd+T (새 탭 열기)
        case 'r': // Ctrl+R or Cmd+R (페이지 새로고침)
        case 'n': // Ctrl+N or Cmd+N (새 창 열기)
        case 'p': // Ctrl+P or Cmd+P (인쇄)
        case 'f': // Ctrl+F or Cmd+F (찾기)
        case 'r': // Ctrl+R or Cmd+R (페이지 새로고침)
          event.preventDefault();
          break;
        default:
          break;
      }
    }
  });

  // ---- Menu Bar ---
  // const menuBuilder = new MenuBuilder(mainWindow);
  // menuBuilder.buildMenu();
  Menu.setApplicationMenu(null);

  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  ipcMain.on('control-to-matchlive', (event, action: string) => {
    if (!matchliveWindow) return;

    switch (action) {
      case 'refresh':
        matchliveWindow.reload();
        break;
      case 'minimize':
        if (matchliveWindow.isMinimized()) {
          matchliveWindow.restore(); // 창을 원래 크기로 되돌림
        } else {
          matchliveWindow.minimize(); // 창을 최소화
        }
        break;
      case 'close':
        matchliveWindow.close();
        break;
      default:
        console.log(`Unknown action: ${action}`);
    }
  });
};

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

export type MainWindowControlAction = 'minimize' | 'quit-app';

ipcMain.on('main-window-control', (event, action: MainWindowControlAction) => {
  if (!mainWindow) return;

  switch (action) {
    case 'minimize':
      mainWindow.minimize();
      break;
    case 'quit-app':
      app.quit(); // 모든 창을 닫고 애플리케이션을 종료합니다.
      break;
    default:
      console.log(`Unknown action: ${action}`);
  }
});

ipcMain.on('matchlive-react-ready', () => {
  mainWindow?.webContents.send('to-app', { type: 'SEND_SHOW_PHOTO' });
});

app
  .whenReady()
  .then(async () => {
    await createMainWindow();
    const appUpdater = new AppUpdater(mainWindow);
    appUpdater.checkForUpdates();
    setupIpcMainHandlers(mainWindow, createMatchliveWindow);
    setupStompHandlers(mainWindow);
  })
  .catch(async (e) => {
    console.log(e);
    log.error(e);
  });
