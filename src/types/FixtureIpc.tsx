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
