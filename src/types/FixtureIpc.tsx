export interface League {
  id: number;
  name: string;
  koreanName: string | null;
  logo: string;
}

export interface Team {
  id: number;
  name: string;
  koreanName: string | null;
  logo: string;
}

export interface FixtureInfo {
  fixtureId: number;
  referee: string;
  date: string;
  league: League;
  home: Team;
  away: Team;
}

export type EventType = 'GOAL' | 'CARD' | 'SUBST' | 'VAR' | string;

export interface EventTeam {
  teamId: number;
  name: string;
  koreanName: string;
}

export interface EventPlayer {
  playerId: number;
  name: string;
  koreanName: string;
  number: number;
}

export interface FixtureEvent {
  sequence: number;
  elapsed: number;
  extraTime: number;
  team: EventTeam;
  player: EventPlayer;
  assist: EventPlayer | null;
  type: EventType;
  detail: string;
  comments: string | null;
}

export type SubstPlayer = 'player' | 'assist';

export type SubstMeta = {
  inPlayer: SubstPlayer;
  outPlayer: SubstPlayer;
  teamId: number;
};

export type FixtureEventMeta = {
  sequence: number;
  data: SubstMeta | null;
};

export interface FixtureEventState {
  fixtureId: number;
  events: FixtureEvent[];
  meta: FixtureEventMeta[];
}

export type EventMeta =
  | {
      type: 'subst';
      inPlayer: EventPlayer;
      outPlayer: EventPlayer;
      isAssistIn: boolean;
    }
  | { type: 'card'; cardType: 'yellow' | 'red'; player: EventPlayer }
  | { type: 'goal'; scorer: EventPlayer; assist?: EventPlayer }
  | { type: 'var'; decision: string; player?: EventPlayer };

export interface FixtureLiveStatus {
  fixtureId: number;
  liveStatus: {
    elapsed: number;
    shortStatus: string;
    longStatus: string;
  };
}

export interface FixtureInfo {
  fixtureId: number;
  referee: string;
  date: string;
  league: League;
  home: Team;
  away: Team;
}

export interface TeamLineups {
  home: LineupTeam;
  away: LineupTeam;
}

export interface FixtureLineup {
  fixtureId: number;
  lineup: TeamLineups;
}

export interface LineupTeam {
  teamId: number;
  teamName: string;
  teamKoreanName: string | null;
  formation: string;
  players: LineupPlayer[];
  substitutes: LineupPlayer[];
}

export interface LineupPlayer {
  id: number;
  name: string;
  koreanName: string;
  number: number;
  photo: string;
  position: string;
  grid: string;
  substitute: boolean;
}

// ---------------------------------------------------
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
