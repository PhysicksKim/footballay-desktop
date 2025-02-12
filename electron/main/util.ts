import { URL } from 'url';
import { CUSTOM_PROTOCOL_NAME } from './main';
import log from 'electron-log';

export function resolveHtmlPath(htmlFileName: string): string {
  if (import.meta.env.MODE === 'development') {
    // VITE_DEV_SERVER_URL이 설정되어 있으면 이를 사용
    const devServerUrl = process.env.VITE_DEV_SERVER_URL;
    if (!devServerUrl) {
      throw new Error('VITE_DEV_SERVER_URL is not set');
    }
    const url = new URL(devServerUrl);
    url.pathname = htmlFileName;
    return url.href;
  } else {
    // 프로덕션 환경에서는 커스텀 프로토콜을 사용
    return `${CUSTOM_PROTOCOL_NAME}://chuncity.app/${htmlFileName}`;
  }
}
