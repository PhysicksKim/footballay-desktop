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
  private static instance: V1DataController | null = null;
  private fixtureUid?: string;
  private pollTimer?: ReturnType<typeof setInterval>;
  private intervalMs: number;
  private dispatch: AppDispatch;

  private constructor(dispatch: AppDispatch, intervalMs = 13000) {
    this.dispatch = dispatch;
    this.intervalMs = intervalMs;
  }

  static getInstance(
    dispatch: AppDispatch,
    intervalMs?: number
  ): V1DataController {
    if (!V1DataController.instance) {
      V1DataController.instance = new V1DataController(dispatch, intervalMs);
    } else {
      // Update dispatch in case it changed
      V1DataController.instance.dispatch = dispatch;
      if (intervalMs !== undefined) {
        V1DataController.instance.intervalMs = intervalMs;
      }
    }
    return V1DataController.instance;
  }

  static resetInstance() {
    if (V1DataController.instance) {
      V1DataController.instance.stop();
      V1DataController.instance = null;
    }
  }

  setFixtureUid(fixtureUid?: string) {
    // Stop previous polling before switching fixtures
    this.stop();

    this.fixtureUid = fixtureUid;
    this.dispatch(setTargetFixture(fixtureUid));
    if (!fixtureUid) {
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
    this.dispatch(loadV1FixtureLineup(this.fixtureUid));
    this.dispatch(loadV1FixtureEvents(this.fixtureUid));
    this.dispatch(loadV1FixtureStatistics(this.fixtureUid));
  }
}

export const createV1DataController = (
  dispatch: AppDispatch,
  intervalMs?: number
) => V1DataController.getInstance(dispatch, intervalMs);
