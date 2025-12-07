import { Middleware } from '@reduxjs/toolkit';
import { getLogger } from '@app/utils/logger';
import {
  loadV1FixtureInfo,
  loadV1FixtureLiveStatus,
  loadV1FixtureLineup,
  loadV1FixtureEvents,
  loadV1FixtureStatistics,
} from '@app/v1/store/fixtureDetailSlice';

const log = getLogger('app:v1:redux');

/**
 * V1 Fixture Detail 관련 Redux 액션들을 로깅하는 middleware
 * reducer의 순수성을 유지하기 위해 로깅은 middleware에서 처리합니다.
 */
export const v1FixtureDetailLogger: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  const state = store.getState();

  // fulfilled 액션들을 감지하여 로깅
  if (loadV1FixtureInfo.fulfilled.match(action)) {
    const payload = action.payload;
    log.info('info:updated', {
      fixtureUid:
        payload?.fixtureUid ?? state.v1.fixtureDetail.targetFixtureUid,
    });
  } else if (loadV1FixtureLiveStatus.fulfilled.match(action)) {
    const payload = action.payload;
    log.info('liveStatus:updated', {
      fixtureUid:
        payload?.fixtureUid ?? state.v1.fixtureDetail.targetFixtureUid,
      shortStatus: payload?.liveStatus?.shortStatus,
    });
  } else if (loadV1FixtureLineup.fulfilled.match(action)) {
    const payload = action.payload;
    const lineup = payload;
    const homeCount = lineup?.lineup?.home?.players?.length ?? 0;
    const awayCount = lineup?.lineup?.away?.players?.length ?? 0;
    log.info('lineup:updated', {
      fixtureUid: lineup?.fixtureUid ?? state.v1.fixtureDetail.targetFixtureUid,
      homeCount,
      awayCount,
    });
  } else if (loadV1FixtureEvents.fulfilled.match(action)) {
    const payload = action.payload;
    const events = payload?.events ?? [];
    const lastSeq = events.length ? events[events.length - 1]?.sequence : null;
    log.info('events:updated', {
      fixtureUid:
        payload?.fixtureUid ?? state.v1.fixtureDetail.targetFixtureUid,
      length: events.length,
      lastSeq,
    });
  } else if (loadV1FixtureStatistics.fulfilled.match(action)) {
    const payload = action.payload;
    log.info('statistics:updated', {
      fixtureUid:
        payload?.fixture?.uid ?? state.v1.fixtureDetail.targetFixtureUid,
      homePlayers: payload?.home?.playerStatistics?.length ?? 0,
      awayPlayers: payload?.away?.playerStatistics?.length ?? 0,
    });
  }

  return result;
};
