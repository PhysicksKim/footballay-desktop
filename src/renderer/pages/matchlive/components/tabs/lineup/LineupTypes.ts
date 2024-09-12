export interface ViewPlayer {
  id: number;
  name: string;
  koreanName: string | null;
  number: number;
  photo: string;
  position: string;
  grid: string | null;
  events: ViewPlayerEvents;
  /**
   * 교체된 선수가 있을 경우 객체가 들어가며, 교체 선수가 다시 교체된 경우가 있을 수 있으므로 재귀적으로 검사해야 함
   */
  subInPlayer?: ViewPlayer | null;
}

export interface ViewPlayerEvents {
  subIn: boolean;
  yellow: boolean;
  red: boolean;
  goal: Goal[];
}

export interface Goal {
  minute: number;
  ownGoal: boolean;
}

export interface ViewLineup {
  teamId: number;
  teamName: string;
  players: ViewPlayer[][];
  substitutes: ViewPlayer[];
}
