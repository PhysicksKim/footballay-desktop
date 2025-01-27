import { app, net, protocol } from 'electron';
import log from 'electron-log';
import CustomElectronStoreIpc from './store/CustomElectronStoreIpc';
import WindowManager from './windowManager';
import UpdateManager from './UpdateManager';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const CUSTOM_PROTOCOL_NAME = 'chuncity';

protocol.registerSchemesAsPrivileged([
  {
    scheme: CUSTOM_PROTOCOL_NAME,
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true,
      stream: true,
    },
  },
]);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

const isDev = process.env.NODE_ENV === 'development';
const isTestAutoUpdate = false;

if (isDev) {
  // 개발 환경에서 인증서 에러 무시
  app.commandLine.appendSwitch('ignore-certificate-errors');
}

if (isDev && isTestAutoUpdate) {
  // 임의로 낮은 버전을 설정하여 업데이트를 트리거
  app.getVersion = () => '0.0.1';
  Object.defineProperty(app, 'isPackaged', {
    get() {
      return true;
    },
  });
} else {
  if (isDev) {
    console.log('skipped update property injection for dev environment');
  }
}

app
  .whenReady()
  .then(async () => {
    protocol.handle(CUSTOM_PROTOCOL_NAME, async (request) => {
      try {
        const parsedUrl = new URL(request.url);
        let relativePath = decodeURIComponent(parsedUrl.pathname);

        // Windows에서 경로가 '/'로 시작하므로 제거
        if (process.platform === 'win32') {
          relativePath = relativePath.replace(/^\/+/, '');
        }

        // 프로덕션 환경: {projectRoot}/release/app/dist/renderer
        // 개발 환경: {projectRoot}/release/app/dist/renderer (동일하게 설정)
        const basePath = path.join(__dirname, '..', 'renderer');

        const normalizedPath = path.normalize(
          path.join(basePath, relativePath),
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

    new CustomElectronStoreIpc();
    const windowManager = WindowManager.getInstance();
    const mainWindow = await windowManager.createMainWindow();
    const updatecheckerWindow = await windowManager.createUpdatecheckerWindow();
    const updateManager = UpdateManager.getInstance(
      mainWindow,
      updatecheckerWindow,
    );
    updateManager.checkForUpdates();

    // if (isDev) {
    //   mainWindow.webContents.openDevTools();
    // }

    /* Close update checker window in development mode */
    if (isDev && !isTestAutoUpdate) {
      setTimeout(() => {
        updatecheckerWindow?.close();
      }, 1000);
    }
  })
  .catch((e) => {
    log.error(e);
  });
