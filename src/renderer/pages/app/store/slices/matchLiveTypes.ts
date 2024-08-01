export interface FixtureEventResponse {
  sequence: number;
  elapsed: number;
  extraTime: number;
  team: {
    teamId: number;
    name: string;
    koreanName: string | null;
  };
  player: {
    playerId: number;
    name: string;
    koreanName: string | null;
    number: number;
  };
  assist: {
    playerId: number;
    name: string;
    koreanName: string | null;
    number: number;
  } | null;
  type: string;
  detail: string;
  comments: string | null;
}

export interface FixtureInfoResponse {
  fixtureId: number;
  referee: string;
  date: string;
  liveStatus: {
    elapsed: number;
    shortStatus: string;
    longStatus: string;
  };
  league: {
    id: number;
    name: string;
    koreanName: string | null;
    logo: string;
  };
  home: {
    id: number;
    name: string;
    koreanName: string | null;
    logo: string;
  };
  away: {
    id: number;
    name: string;
    koreanName: string | null;
    logo: string;
  };
  events: Event[];
}

export interface MatchState {
  fixtureId: number | null;
  infos: FixtureInfoResponse | null;
  events: FixtureEventResponse[] | null;
  loading: boolean;
  error: string | null;
}
