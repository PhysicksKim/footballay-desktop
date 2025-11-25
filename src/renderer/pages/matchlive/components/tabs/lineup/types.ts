import { LineupPlayer, PlayerStatistics } from '@src/renderer/pages/app/v1/types/api';

export interface ViewPlayerEvents {
  subIn: boolean;
  yellow: boolean;
  red: boolean;
  goal: {
    minute: number;
    ownGoal: boolean;
  }[];
}

export interface ViewPlayer extends LineupPlayer {
  events: ViewPlayerEvents;
  statistics: PlayerStatistics | null;
  subInPlayer: ViewPlayer | null;
}

export interface ViewLineup {
  teamUid: string;
  teamName: string;
  players: ViewPlayer[][]; // Grid structure [row][col]
  substitutes: ViewPlayer[];
}
