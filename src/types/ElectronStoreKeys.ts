export type MatchliveStoreKey =
  | 'matchlive_window_height'
  | 'matchlive_window_width';

export type AppWindowStoreKey = 'preference.key' | 'preference.isValid';

export type ElectronStoreKeys = MatchliveStoreKey | AppWindowStoreKey;
