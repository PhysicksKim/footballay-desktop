export interface Player {
  id: number;
  name: string;
  koreanName: string | null;
  photo: string;
}

export interface FixtureEvent {
  teamId: number;
  player: Player;
  assist: Player | null;
  elapsed: number;
  type: string;
  detail: string;
  comments: string | null;
}

export interface Team {
  id: number;
  name: string;
  koreanName: string | null;
  logo: string;
}

export interface LiveStatus {
  elapsed: number;
  shortStatus: string;
  longStatus: string;
}

export interface League {
  id: number;
  name: string;
  koreanName: string | null;
  logo: string;
}

export interface Lineup {
  teamId: number;
  formation: string;
  players: PlayerLineup[];
  substitutes: PlayerLineup[];
}

export interface PlayerLineup extends Player {
  number: number;
  position: string;
  grid: string | null;
  substitute: boolean;
}

export interface Fixture {
  fixtureId: number;
  referee: string;
  date: string;
  league: League;
  home: Team;
  away: Team;
  liveStatus: LiveStatus;
  events: FixtureEvent[];
  lineup: {
    home: Lineup;
    away: Lineup;
  };
}
