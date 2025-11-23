import type { AppDispatch } from '@app/store/store';
import {
  loadV1FixtureEvents,
  loadV1FixtureInfo,
  loadV1FixtureLineup,
  loadV1FixtureLiveStatus,
  loadV1FixtureStatistics,
  setTargetFixture,
} from '@app/v1/store/fixtureDetailSlice';

export class V1DataController {
  private fixtureUid?: string;
  private pollTimer?: ReturnType<typeof setInterval>;
  private readonly intervalMs: number;

  constructor(
    private dispatch: AppDispatch,
    intervalMs = 5000
  ) {
    this.intervalMs = intervalMs;
  }

  setFixtureUid(fixtureUid?: string) {
    this.fixtureUid = fixtureUid;
    this.dispatch(setTargetFixture(fixtureUid));
    if (!fixtureUid) {
      this.stop();
      return;
    }
    this.dispatch(loadV1FixtureInfo(fixtureUid));
    this.dispatch(loadV1FixtureLineup(fixtureUid));
    this.dispatch(loadV1FixtureEvents(fixtureUid));
    this.dispatch(loadV1FixtureStatistics(fixtureUid));
    this.dispatch(loadV1FixtureLiveStatus(fixtureUid));
  }

  start() {
    if (this.pollTimer) {
      return;
    }
    this.pollTimer = setInterval(() => this.pollLiveData(), this.intervalMs);
  }

  stop() {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = undefined;
    }
  }

  private pollLiveData() {
    if (!this.fixtureUid) return;
    this.dispatch(loadV1FixtureLiveStatus(this.fixtureUid));
    this.dispatch(loadV1FixtureEvents(this.fixtureUid));
    this.dispatch(loadV1FixtureStatistics(this.fixtureUid));
  }
}

export const createV1DataController = (
  dispatch: AppDispatch,
  intervalMs?: number
) => new V1DataController(dispatch, intervalMs);
