import axios from 'axios';
import { V1Urls } from '@app/constants/V1Urls';
import { appEnv } from '@app/config/environment';

const sanitizeBaseUrl = (base: string) => {
  if (!base) return '';
  return base.endsWith('/') ? base.slice(0, -1) : base;
};

const httpClient = axios.create({
  baseURL: sanitizeBaseUrl(V1Urls.apiUrl),
  timeout: 10000,
});

httpClient.interceptors.request.use((config) => {
  config.baseURL = sanitizeBaseUrl(V1Urls.apiUrl);

  if (config.url && config.url.startsWith('http')) {
    return config;
  }

  const normalizedUrl = config.url?.startsWith('/')
    ? config.url
    : `/${config.url ?? ''}`;
  config.url = normalizedUrl;

  config.headers = {
    'X-Footballay-Env': appEnv,
    ...config.headers,
  };

  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('V1 API error', error);
    return Promise.reject(error);
  }
);

export default httpClient;
