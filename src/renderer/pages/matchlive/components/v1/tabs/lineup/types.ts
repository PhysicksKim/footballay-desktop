import { LineupPlayer, PlayerStatistics } from '@src/renderer/pages/app/v1/types/api';

export interface V1ViewPlayerEvents {
  subIn: boolean;
  yellow: boolean;
  red: boolean;
  goal: {
    minute: number;
    ownGoal: boolean;
  }[];
}

export interface V1ViewPlayer extends LineupPlayer {
  events: V1ViewPlayerEvents;
  statistics: PlayerStatistics | null;
  subInPlayer: V1ViewPlayer | null;
}

export interface V1ViewLineup {
  teamUid: string;
  teamName: string;
  players: V1ViewPlayer[][]; // Grid structure [row][col]
  substitutes: V1ViewPlayer[];
}

