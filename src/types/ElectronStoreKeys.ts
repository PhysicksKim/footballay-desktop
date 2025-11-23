export type MatchliveStoreKey =
  | 'matchlive_window_height'
  | 'matchlive_window_width';

export type AppWindowStoreKey =
  | 'preference.key'
  | 'preference.isValid'
  | 'settings.developerMode'
  | 'settings.timezone';

export type ElectronStoreKeys = MatchliveStoreKey | AppWindowStoreKey;
