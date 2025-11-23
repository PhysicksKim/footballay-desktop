import {
  FixtureEventsResponse,
  FixtureInfoResponse,
  FixtureLineupResponse,
  FixtureLiveStatusResponse,
  FixtureStatisticsResponse,
} from '@app/v1/types/api';

export type V1OutboundMessage =
  | { type: 'v1.fixture.info'; payload?: FixtureInfoResponse }
  | { type: 'v1.fixture.live-status'; payload?: FixtureLiveStatusResponse }
  | { type: 'v1.fixture.lineup'; payload?: FixtureLineupResponse }
  | { type: 'v1.fixture.events'; payload?: FixtureEventsResponse }
  | { type: 'v1.fixture.statistics'; payload?: FixtureStatisticsResponse };

export type V1InboundMessage =
  | { type: 'v1.request.full-sync' }
  | {
      type: 'v1.request.extra-data';
      payload: { fixtureUid: string; resource: string; params?: any };
    };

