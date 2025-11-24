export interface TeamInfo {
  teamUid: string;
  name: string;
  koreanName?: string;
  logo?: string;
}

export interface AvailableLeagueResponse {
  uid: string;
  name: string;
  nameKo?: string;
  logo?: string;
}

export interface FixtureScore {
  home: number;
  away: number;
}

export interface StatusInfo {
  longStatus: string;
  shortStatus: string;
  elapsed?: number;
}

export interface FixtureByLeagueResponse {
  uid: string;
  kickoff: string;
  round: string;
  homeTeam: TeamInfo;
  awayTeam: TeamInfo;
  status: StatusInfo;
  score: FixtureScore;
  available: boolean;
}

export interface LiveStatus {
  elapsed?: number;
  shortStatus: string;
  longStatus: string;
  score: FixtureScore;
}

export interface FixtureLiveStatusResponse {
  fixtureUid: string;
  liveStatus: LiveStatus;
}

export interface FixtureInfoResponse {
  fixtureUid: string;
  referee?: string;
  date: string;
  league: {
    leagueUid: string;
    name: string;
    koreanName?: string;
    logo?: string;
  };
  home: TeamInfo;
  away: TeamInfo;
}

export interface LineupPlayer {
  matchPlayerUid: string;
  playerUid: string;
  name: string;
  koreanName?: string;
  number?: number;
  photo?: string;
  position?: string;
  grid?: string;
  substitute: boolean;
}

export interface StartLineup {
  teamUid: string;
  teamName: string;
  teamKoreanName?: string;
  formation?: string;
  players: LineupPlayer[];
  substitutes: LineupPlayer[];
}

export interface FixtureLineupResponse {
  fixtureUid: string;
  lineup: {
    home: StartLineup;
    away: StartLineup;
  };
}

export interface EventInfo {
  sequence: number;
  elapsed: number;
  extraTime?: number;
  team: TeamInfo;
  player?: LineupPlayer;
  assist?: LineupPlayer;
  type: string;
  detail?: string;
  comments?: string;
}

export interface FixtureEventsResponse {
  fixtureUid: string;
  events: EventInfo[];
}

export interface PlayerStatistics {
  minutesPlayed?: number;
  position?: string;
  rating?: string;
  captain?: boolean;
  substitute?: boolean;
  shotsTotal?: number;
  shotsOn?: number;
  goals?: number;
  assists?: number;
  yellowCards?: number;
  redCards?: number;
}

export interface TeamStatistics {
  shotsOnGoal?: number;
  shotsOffGoal?: number;
  totalShots?: number;
  blockedShots?: number;
  shotsInsideBox?: number;
  shotsOutsideBox?: number;
  fouls?: number;
  cornerKicks?: number;
  offsides?: number;
  ballPossession?: number;
  yellowCards?: number;
  redCards?: number;
  goalkeeperSaves?: number;
  totalPasses?: number;
  passesAccurate?: number;
}

export interface PlayerWithStatistics {
  player: LineupPlayer;
  statistics: PlayerStatistics;
}

export interface TeamWithStatistics {
  team: TeamInfo;
  teamStatistics: TeamStatistics;
  playerStatistics: PlayerWithStatistics[];
}

export interface FixtureStatisticsResponse {
  fixture: {
    uid: string;
    status: string;
    elapsed?: number;
  };
  home: TeamWithStatistics;
  away: TeamWithStatistics;
}
