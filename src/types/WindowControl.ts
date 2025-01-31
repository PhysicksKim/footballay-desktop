export interface WindowControlMsg {
  window: WindowNames;
  action: string;
}

export type WindowNames = 'app' | 'matchlive' | 'updatechecker';
