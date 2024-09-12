import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  FixtureEvent,
  FixtureInfo,
  FixtureLiveStatus,
  FixtureLineup,
  FixtureEventState,
  EventPlayer,
  FixtureEventMeta,
  SubstMeta,
  SubstPlayer,
} from '@src/types/FixtureIpc';
import {
  fetchFixtureEvents,
  fetchFixtureInfo,
  fetchFixtureLineup,
  fetchFixtureLiveStatus,
} from './fixtureLiveSliceThunk';
import { AppDispatch, RootState } from '../store';

export interface FixtureState {
  fixtureId: number | null;
  info: FixtureInfo | null;
  liveStatus: FixtureLiveStatus | null;
  lineup: FixtureLineup | null;
  events: FixtureEventState | null;
  taskState: {
    init: InitTaskState;
  };
  intervalIds: NodeJS.Timeout[]; // interval IDs 배열
  lastFetchedAt: string | null;
}

export interface InitTaskState {
  matchliveWindowReady: boolean;
  fixtureIdUpdated: boolean;
  fixtureLiveStateReset: boolean;
}

export const initialState: FixtureState = {
  fixtureId: null,
  info: null,
  liveStatus: null,
  lineup: null,
  events: null,
  taskState: {
    init: {
      matchliveWindowReady: false,
      fixtureIdUpdated: false,
      fixtureLiveStateReset: false,
    },
  },
  intervalIds: [],
  lastFetchedAt: null,
};

const resetFixtureLiveState = (state: FixtureState) => {
  state.info = null;
  state.liveStatus = null;
  state.lineup = null;
  state.events = null;
};

const resetTaskState = (state: FixtureState) => {
  state.taskState.init.matchliveWindowReady = false;
  state.taskState.init.fixtureIdUpdated = false;
  state.taskState.init.fixtureLiveStateReset = false;
};

const removeAllIntervals = (state: FixtureState) => {
  state.intervalIds.forEach((id) => clearInterval(id));
  state.intervalIds = [];
};

const updateLastFetchedAt = (state: FixtureState) => {
  state.lastFetchedAt = new Date().toISOString();
};

export interface SimpleLineupPlayer {
  id: number;
  subInPlayer: SimpleLineupPlayer | null;
}

export interface SimpleLineup {
  teamId: number;
  lineup: SimpleLineupPlayer[];
  substitutes: SimpleLineupPlayer[];
}

export const isSubOutPlayer = (checkId: number, simpleLineup: SimpleLineup) => {
  const players = simpleLineup.lineup;
  for (let i = 0; i < players.length; i++) {
    let currentPlayer = players[i];
    if (!currentPlayer) {
      continue;
    }

    while (currentPlayer.subInPlayer) {
      currentPlayer = currentPlayer.subInPlayer;
    }
    if (currentPlayer.id === checkId) {
      return true;
    }
  }
  return false;
};

const createSimpleLineup = (lineup: FixtureLineup) => {
  const homeId = lineup.lineup.home.teamId;
  const awayId = lineup.lineup.away.teamId;
  const homeSimpleLineupPlayers: SimpleLineupPlayer[] =
    lineup.lineup.home.players.map((player) => ({
      id: player.id,
      subInPlayer: null,
    }));
  const awaySimpleLineupPlayers: SimpleLineupPlayer[] =
    lineup.lineup.away.players.map((player) => ({
      id: player.id,
      subInPlayer: null,
    }));
  const homeSubstitutes: SimpleLineupPlayer[] =
    lineup.lineup.home.substitutes.map((player) => ({
      id: player.id,
      subInPlayer: null,
    }));
  const awaySubstitutes: SimpleLineupPlayer[] =
    lineup.lineup.away.substitutes.map((player) => ({
      id: player.id,
      subInPlayer: null,
    }));

  const home: SimpleLineup = {
    teamId: homeId,
    lineup: homeSimpleLineupPlayers,
    substitutes: homeSubstitutes,
  };
  const away: SimpleLineup = {
    teamId: awayId,
    lineup: awaySimpleLineupPlayers,
    substitutes: awaySubstitutes,
  };
  return { home, away };
};

const updateEventMeta = (state: FixtureState, sortedEvents: FixtureEvent[]) => {
  if (!state.lineup || !state.lineup?.lineup) {
    return;
  }

  const { home: homeSimpleLineup, away: awaySimpleLineup } = createSimpleLineup(
    state.lineup,
  );

  const homeId = state.lineup.lineup.home.teamId;
  const awayId = state.lineup.lineup.away.teamId;

  // sortedEvents 를 순회하면서 EventMeta 를 추가하는 로직
  const eventMetaList: FixtureEventMeta[] = [];
  sortedEvents.forEach((event) => {
    const nowTeamId = event.team.teamId;
    const nowPlayerId = event.player.playerId;
    const nowAssistId: number | null = event.assist
      ? event.assist.playerId
      : null;
    const nowEventType = event.type.toUpperCase();
    const nowSequence = event.sequence;

    switch (nowEventType) {
      case 'SUBST':
        if (!nowPlayerId || !nowAssistId) {
          return;
        }
        const isPlayerSubOut = isSubOutPlayer(
          nowPlayerId,
          nowTeamId === homeId ? homeSimpleLineup : awaySimpleLineup,
        );

        const { inPlayer, outPlayer } = isPlayerSubOut
          ? { inPlayer: 'assist', outPlayer: 'player' }
          : { inPlayer: 'player', outPlayer: 'assist' };
        const { subInId, subOutId } = isPlayerSubOut
          ? { subInId: nowAssistId, subOutId: nowPlayerId }
          : { subInId: nowPlayerId, subOutId: nowAssistId };
        const substMeta = {
          inPlayer,
          outPlayer,
          teamId: nowTeamId,
        } as SubstMeta;

        eventMetaList.push({
          sequence: nowSequence,
          data: substMeta,
        });

        const targetSimpleLineup =
          nowTeamId === homeId ? homeSimpleLineup : awaySimpleLineup;
        updateSimpleLineup(targetSimpleLineup, subInId, subOutId);
        break;
      default:
        eventMetaList.push({
          sequence: nowSequence,
          data: null,
        });
    }
  });

  return eventMetaList;
};

const updateSimpleLineup = (
  simpleLineup: SimpleLineup,
  inPlayerId: number,
  outPlayerId: number,
) => {
  const { lineup } = simpleLineup;

  // find sub out player
  for (let i = 0; i < lineup.length; i++) {
    let nowPlayer = lineup[i];
    while (nowPlayer.subInPlayer) {
      nowPlayer = nowPlayer.subInPlayer;
    }

    if (nowPlayer.id === outPlayerId) {
      const subInPlayer = {
        id: inPlayerId,
        subInPlayer: null,
      };
      nowPlayer.subInPlayer = subInPlayer;
      break;
    }
  }
};

const fixtureLiveSlice = createSlice({
  name: 'fixtureLive',
  initialState,
  reducers: {
    setFixtureIdAndClearInterval(state, action: PayloadAction<number>) {
      state.fixtureId = action.payload;
      resetFixtureLiveState(state);
      removeAllIntervals(state);
      state.taskState.init.fixtureIdUpdated = true;
      state.taskState.init.fixtureLiveStateReset = true;
    },
    setMatchliveWindowReady(state, action: PayloadAction<boolean>) {
      state.taskState.init.matchliveWindowReady = action.payload;
    },
    resetInitTaskState(state) {
      state.taskState.init.matchliveWindowReady = false;
      state.taskState.init.fixtureIdUpdated = false;
      state.taskState.init.fixtureLiveStateReset = false;
    },
    addIntervalId(state, action: PayloadAction<NodeJS.Timeout>) {
      state.intervalIds.push(action.payload);
    },
    removeIntervalId(state, action: PayloadAction<NodeJS.Timeout>) {
      state.intervalIds = state.intervalIds.filter(
        (id) => id !== action.payload,
      );
    },
    clearAllIntervals(state) {
      removeAllIntervals(state);
    },
    clearFixtureLive(state) {
      state.fixtureId = null;
      resetFixtureLiveState(state);
      removeAllIntervals(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchFixtureInfo.fulfilled,
        (state, action: PayloadAction<FixtureInfo>) => {
          state.info = action.payload;
          updateLastFetchedAt(state);
        },
      )
      .addCase(
        fetchFixtureLiveStatus.fulfilled,
        (state, action: PayloadAction<FixtureLiveStatus>) => {
          state.liveStatus = action.payload;
          updateLastFetchedAt(state);
        },
      )
      .addCase(
        fetchFixtureLineup.fulfilled,
        (state, action: PayloadAction<FixtureLineup>) => {
          state.lineup = action.payload;
          updateLastFetchedAt(state);
        },
      )
      .addCase(
        fetchFixtureEvents.fulfilled,
        (state, action: PayloadAction<FixtureEventState>) => {
          const sortedEvents = action.payload.events.sort(
            (a, b) => a.sequence - b.sequence,
          );

          const eventMetaList = updateEventMeta(state, sortedEvents);

          const processedEvents: FixtureEventState = {
            ...action.payload,
            events: sortedEvents,
            meta: eventMetaList ? eventMetaList : [],
          };
          console.log('processedEvents', processedEvents);
          state.events = processedEvents;
          updateLastFetchedAt(state);
        },
      );
  },
});

export const {
  setFixtureIdAndClearInterval,
  addIntervalId,
  removeIntervalId,
  clearAllIntervals,
  setMatchliveWindowReady,
  resetInitTaskState,
  clearFixtureLive,
} = fixtureLiveSlice.actions;
export default fixtureLiveSlice.reducer;
