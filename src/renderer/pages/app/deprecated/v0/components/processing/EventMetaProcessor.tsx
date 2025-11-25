import {
  FixtureEvent,
  FixtureEventMeta,
  FixtureLineup,
  LineupPlayer,
  SubstMeta,
} from '@src/types/FixtureIpc';
import React, { useEffect } from 'react';
import {
  setEventMeta,
  SimpleLineup,
  SimpleLineupPlayer,
} from '../../store/slices/live/fixtureLiveSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { cloneDeep } from 'lodash';

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

export const isSubOutUnregisteredPlayer = (
  checkTempId: string,
  simpleLineup: SimpleLineup
) => {
  const players = simpleLineup.lineup;
  for (let i = 0; i < players.length; i++) {
    let currentPlayer = players[i];
    if (!currentPlayer) {
      continue;
    }

    while (currentPlayer.subInPlayer) {
      currentPlayer = currentPlayer.subInPlayer;
    }
    if (currentPlayer.tempId === checkTempId) {
      return true;
    }
  }
  return false;
};

/**
 * WindowControlTab 의 Fixture Event List 에 사용할 Lineup 정보를 생성합니다. <br>
 * @param lineup
 * @returns
 */
const createSimpleLineup = (lineup: FixtureLineup) => {
  const homeId = lineup.lineup.home.teamId;
  const awayId = lineup.lineup.away.teamId;

  const createSimpleLineupPlayer = (player: LineupPlayer) => {
    if (!player.id) {
      return {
        id: player.id,
        subInPlayer: null,
        tempId: player.tempId,
      };
    } else {
      return {
        id: player.id,
        subInPlayer: null,
        tempId: null,
      };
    }
  };

  const homeSimpleLineupPlayers: SimpleLineupPlayer[] =
    lineup.lineup.home.players.map((player) =>
      createSimpleLineupPlayer(player)
    );
  const awaySimpleLineupPlayers: SimpleLineupPlayer[] =
    lineup.lineup.away.players.map((player) =>
      createSimpleLineupPlayer(player)
    );
  const homeSubstitutes: SimpleLineupPlayer[] =
    lineup.lineup.home.substitutes.map((player) =>
      createSimpleLineupPlayer(player)
    );
  const awaySubstitutes: SimpleLineupPlayer[] =
    lineup.lineup.away.substitutes.map((player) =>
      createSimpleLineupPlayer(player)
    );

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

const updateSimpleLineup = (
  simpleLineup: SimpleLineup,
  inPlayerId: number | null,
  inPlayerTempId: string | null,
  outPlayerId: number | null,
  outPlayerTempId: string | null
) => {
  const { lineup } = simpleLineup;

  // find sub out player
  for (let i = 0; i < lineup.length; i++) {
    let nowPlayer = lineup[i];
    while (nowPlayer.subInPlayer) {
      nowPlayer = nowPlayer.subInPlayer;
    }

    if (
      matchRegisteredPlayer(nowPlayer.id, outPlayerId) ||
      matchUnregisteredPlayer(nowPlayer.tempId, outPlayerTempId)
    ) {
      const subInPlayer = {
        id: inPlayerId,
        subInPlayer: null,
        tempId: inPlayerTempId,
      };
      nowPlayer.subInPlayer = subInPlayer;
      break;
    }
  }
};

const matchRegisteredPlayer = (id1: number | any, id2: number | any) => {
  if (!id1 && !id2 && typeof id1 === 'number' && typeof id2 === 'number') {
    return id1 === id2;
  }
  return false;
};

const matchUnregisteredPlayer = (
  tempId1: string | any,
  tempId2: string | any
) => {
  if (
    !tempId1 &&
    !tempId2 &&
    typeof tempId1 === 'string' &&
    typeof tempId2 === 'string'
  ) {
    return tempId1 === tempId2;
  }
  return false;
};

/**
 * 이벤트에 필요한 메타 정보를 처리하고 FixtureEventMeta 배열을 반환합니다. <br>
 * EventMeta 생성을 위해 이벤트가 적용됨에 따라 라인업이 변경되는 것을 시뮬레이션하기 위해 SimpleLineup을 생성하여 사용합니다. <br>
 * @see FixtureEventMeta API 응답에 포함되지 않으며 프론트엔드에서 필요한 이벤트의 부가 정보입니다.
 * @param state Redux 상태입니다.
 * @param events sequence에 따라 정렬된 이벤트 리스트입니다.
 * @returns {@type FixtureEventMeta[]}
 */
const updateEventMeta = (lineup: FixtureLineup, events: FixtureEvent[]) => {
  if (!lineup || !lineup?.lineup) {
    return;
  }
  const sortedEvents = cloneDeep(events).sort(
    (a: FixtureEvent, b: FixtureEvent) => a.sequence - b.sequence
  );

  const { home: homeSimpleLineup, away: awaySimpleLineup } =
    createSimpleLineup(lineup);
  const homeId = lineup.lineup.home.teamId;

  const eventMetaList: FixtureEventMeta[] = [];

  sortedEvents.forEach((event: FixtureEvent) => {
    const nowTeamId = event.team.teamId;
    const nowPlayerId = event.player?.playerId;
    const nowPlayerTempId = event.player?.tempId;
    const nowAssistId: number | null = event.assist
      ? event.assist.playerId
      : null;
    const nowAssistTempId: string | null = event.assist
      ? event.assist.tempId
      : null;
    const nowEventType = event.type.toUpperCase();
    const nowSequence = event.sequence;

    switch (nowEventType) {
      case 'SUBST':
        // filter no id event
        if (!nowPlayerId && !nowPlayerTempId) {
          break;
        }
        if (!nowAssistId && !nowAssistTempId) {
          break;
        }

        const isPlayerSubOut = nowPlayerTempId
          ? isSubOutUnregisteredPlayer(
              nowPlayerTempId,
              nowTeamId === homeId ? homeSimpleLineup : awaySimpleLineup
            )
          : nowPlayerId
            ? isSubOutPlayer(
                nowPlayerId,
                nowTeamId === homeId ? homeSimpleLineup : awaySimpleLineup
              )
            : false;

        const { inPlayer, outPlayer } = isPlayerSubOut
          ? { inPlayer: 'assist', outPlayer: 'player' }
          : { inPlayer: 'player', outPlayer: 'assist' };
        const { subInId, subInTempId, subOutId, subOutTempId } = isPlayerSubOut
          ? {
              subInId: nowAssistId,
              subInTempId: nowAssistTempId,
              subOutId: nowPlayerId,
              subOutTempId: nowPlayerTempId,
            }
          : {
              subInId: nowPlayerId,
              subInTempId: nowPlayerTempId,
              subOutId: nowAssistId,
              subOutTempId: nowAssistTempId,
            };
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
        updateSimpleLineup(
          targetSimpleLineup,
          subInId ? subInId : null,
          subInTempId ? subInTempId : null,
          subOutId ? subOutId : null,
          subOutTempId ? subOutTempId : null
        );
        break;
      default:
        eventMetaList.push({
          sequence: nowSequence,
          data: null,
        });
    }
  });

  // sort eventMetaList by sequence
  eventMetaList.sort((a, b) => a.sequence - b.sequence);
  return eventMetaList;
};

const EventMetaProcessor = () => {
  const dispatch = useDispatch();

  const lineup = useSelector((state: RootState) => state.fixtureLive.lineup);
  const events = useSelector((state: RootState) => state.fixtureLive.events);

  useEffect(() => {
    if (
      !lineup ||
      !events ||
      !events.events ||
      events.meta?.length === events.events.length
    ) {
      return;
    }
    const sortedEvents = cloneDeep(events.events).sort(
      (a: FixtureEvent, b: FixtureEvent) => a.sequence - b.sequence
    );
    const eventMetaList = updateEventMeta(lineup, sortedEvents);
    if (eventMetaList) {
      dispatch(setEventMeta(eventMetaList));
    }
  }, [
    lineup?.fixtureId,
    events?.fixtureId,
    events?.events?.length,
    events?.meta?.length,
    // 마지막 이벤트의 sequence를 통해 실제 이벤트 내용 변경 감지
    events?.events?.[events.events.length - 1]?.sequence,
    dispatch,
  ]);

  return <></>;
};

export default EventMetaProcessor;
