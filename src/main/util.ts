/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';
import { CUSTOM_PROTOCOL_NAME } from './main';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`https://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  // return `${CUSTOM_PROTOCOL_NAME}://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
  return `${CUSTOM_PROTOCOL_NAME}://chuncity.app/${htmlFileName}`;
}
