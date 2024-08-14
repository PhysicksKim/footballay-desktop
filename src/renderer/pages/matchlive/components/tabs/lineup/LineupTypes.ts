export interface ViewPlayer {
  id: number;
  name: string;
  koreanName: string | null;
  number: number;
  photo: string;
  position: string;
  grid: string | null;
  events: {
    subIn: boolean;
    yellow: boolean;
    red: boolean;
    scored: boolean;
  };
  /**
   * 교체된 선수가 있을 경우 객체가 들어가며, 교체 선수가 다시 교체된 경우가 있을 수 있으므로 재귀적으로 검사해야 함
   */
  subInPlayer?: ViewPlayer | null;
}

export interface ViewLineup {
  teamId: number;
  teamName: string;
  players: ViewPlayer[][];
  substitutes: ViewPlayer[];
}

export interface DisplayPlayer {
  id: number;
  name: string;
  number: number;
  position: string;
  grid: string | null;
  substitute: boolean;
  card?: string; // 예: Yellow Card, Red Card
  scored?: boolean; // 골 여부
}

export interface DisplayLineup {
  teamId: number;
  teamName: string;
  players: DisplayPlayer[];
  substitutes: DisplayPlayer[];
}
