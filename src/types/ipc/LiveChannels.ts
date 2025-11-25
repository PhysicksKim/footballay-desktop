import {
  FixtureEventsResponse,
  FixtureInfoResponse,
  FixtureLineupResponse,
  FixtureLiveStatusResponse,
  FixtureStatisticsResponse,
} from '@app/v1/types/api';

export type LiveOutboundMessage =
  | { type: 'live.fixture.info'; payload?: FixtureInfoResponse }
  | { type: 'live.fixture.live-status'; payload?: FixtureLiveStatusResponse }
  | { type: 'live.fixture.lineup'; payload?: FixtureLineupResponse }
  | { type: 'live.fixture.events'; payload?: FixtureEventsResponse }
  | { type: 'live.fixture.statistics'; payload?: FixtureStatisticsResponse };

export type LiveInboundMessage =
  | { type: 'live.request.full-sync' }
  | {
      type: 'live.request.extra-data';
      payload: { fixtureUid: string; resource: string; params?: any };
    };

