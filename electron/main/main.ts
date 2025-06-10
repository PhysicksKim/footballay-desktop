import { app, net, protocol } from 'electron';
import log from 'electron-log';
import { pathToFileURL } from 'node:url';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import CustomElectronStoreIpc from './store/CustomElectronStoreIpc';
import WindowManager from './WindowManager';
import UpdateManager from './UpdateManager';
import {
  setupappWindowIpcMainHandlers,
  setupCommonWindowIpcHandlers,
  setupMatchliveIpcMainHandlers,
} from './ipcManager';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

export const CUSTOM_PROTOCOL_NAME = 'footballay';

protocol.registerSchemesAsPrivileged([
  {
    scheme: CUSTOM_PROTOCOL_NAME,
    privileges: {
      standard: true, // 표준 프로토콜처럼 동작
      secure: true, // 보안 프로토콜로 간주 (https와 유사)
      supportFetchAPI: true, // Fetch API 지원
      corsEnabled: true, // CORS 요청 허용
      stream: true, // 스트림 지원
      bypassCSP: true, // Content Security Policy 우회 불가
    },
  },
]);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

const isDev = import.meta.env.MODE === 'development';
const isTestAutoUpdate = false;

if (isDev) {
  // 개발 환경에서 인증서 에러 무시
  app.commandLine.appendSwitch('ignore-certificate-errors');
  app.commandLine.appendSwitch('allow-insecure-localhost');
  app.commandLine.appendSwitch('ssl-version-fallback-min', 'tls1');
}

app
  .whenReady()
  .then(async () => {
    protocol.handle(CUSTOM_PROTOCOL_NAME, async (req) => {
      const parsedUrl = new URL(req.url);
      try {
        let relativePath = decodeURIComponent(parsedUrl.pathname);

        // Windows에서 경로가 '/'로 시작하므로 제거
        if (process.platform === 'win32') {
          relativePath = relativePath.replace(/^\/+/, '');
        }

        const basePath = path.join(app.getAppPath(), 'dist');
        const normalizedPath = path.normalize(
          path.join(basePath, relativePath)
        );

        // basePath 외부 접근 방지
        if (!normalizedPath.startsWith(basePath)) {
          log.warn(`Unauthorized access attempt: ${normalizedPath}`);
          return new Response('Not Found', {
            status: 404,
            statusText: 'Not Found',
          });
        }

        // 파일 존재 여부 확인 및 반환
        try {
          const fileURL = pathToFileURL(normalizedPath).toString();
          const response = await net.fetch(fileURL);
          if (!response.ok) {
            log.warn(`File not found or inaccessible: ${fileURL}`);
            return new Response('Not Found', {
              status: 404,
              statusText: 'Not Found',
            });
          }
          return response;
        } catch (error) {
          log.error(`Failed to fetch file: ${normalizedPath}`, error);
          return new Response('Internal Server Error', {
            status: 500,
            statusText: 'Internal Server Error',
          });
        }
      } catch (error) {
        log.error('Protocol handler error:', error);
        return new Response('Bad Request', {
          status: 400,
          statusText: 'Bad Request',
        });
      }
    });

    setupCommonWindowIpcHandlers();
    setupappWindowIpcMainHandlers();
    setupMatchliveIpcMainHandlers();
    new CustomElectronStoreIpc();
    const windowManager = WindowManager.getInstance();
    const appWindow = await windowManager.createappWindow();
    const updatecheckerWindow = await windowManager.createUpdatecheckerWindow();
    const updateManager = UpdateManager.getInstance(
      appWindow,
      updatecheckerWindow
    );
    updateManager.checkForUpdates();

    /* Close update checker window in development mode */
    if (isDev) {
      if (isTestAutoUpdate) {
        updatecheckerWindow.once('ready-to-show', () => {
          updatecheckerWindow.show();
        });
      }
      appWindow.webContents.openDevTools();
      setTimeout(() => {
        updatecheckerWindow?.close();
      }, 3000);
    }
  })
  .catch((e) => {
    log.error(e);
  });
