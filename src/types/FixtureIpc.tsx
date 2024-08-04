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

export interface FixtureEventResponse {
  fixtureId: number;
  events: FixtureEvent[];
}

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

export interface FixtureLineup {
  fixtureId: number;
  lineup: {
    home: LineupTeam;
    away: LineupTeam;
  };
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
