const APP_ENV_VALUES = ['devlocal', 'dev', 'prod'] as const;

export type AppEnvironment = (typeof APP_ENV_VALUES)[number];

const normalizeEnv = (value?: string): AppEnvironment => {
  if (!value) {
    return 'devlocal';
  }
  const lower = value.toLowerCase();
  if (APP_ENV_VALUES.includes(lower as AppEnvironment)) {
    return lower as AppEnvironment;
  }
  return 'devlocal';
};

export const appEnv: AppEnvironment = normalizeEnv(
  import.meta.env.VITE_APP_ENV ?? import.meta.env.MODE
);

export const isDevlocal = appEnv === 'devlocal';
export const isDev = appEnv === 'dev';
export const isProd = appEnv === 'prod';

export const getEnvLabel = () => {
  switch (appEnv) {
    case 'devlocal':
      return 'Dev Local';
    case 'dev':
      return 'Dev';
    case 'prod':
      return 'Production';
    default:
      return appEnv;
  }
};

