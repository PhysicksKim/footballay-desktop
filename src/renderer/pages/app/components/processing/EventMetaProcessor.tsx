import {
  FixtureEvent,
  FixtureEventMeta,
  FixtureLineup,
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
    (a, b) => a.sequence - b.sequence,
  );

  const { home: homeSimpleLineup, away: awaySimpleLineup } =
    createSimpleLineup(lineup);
  const homeId = lineup.lineup.home.teamId;
  const awayId = lineup.lineup.away.teamId;

  // sortedEvents 를 순회하면서 EventMeta 를 추가하는 로직
  const eventMetaList: FixtureEventMeta[] = [];
  sortedEvents.forEach((event) => {
    const nowTeamId = event.team.teamId;
    const nowPlayerId = event.player?.playerId;
    const nowAssistId: number | null = event.assist
      ? event.assist.playerId
      : null;
    const nowEventType = event.type.toUpperCase();
    const nowSequence = event.sequence;

    switch (nowEventType) {
      case 'SUBST':
        if (!nowPlayerId || !nowAssistId) {
          break;
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

  // sort eventMetaList by sequence
  eventMetaList.sort((a, b) => a.sequence - b.sequence);

  return eventMetaList;
};

const EventMetaProcessor = () => {
  const dispatch = useDispatch();

  const lineup = useSelector((state: RootState) => state.fixtureLive.lineup);
  const events = useSelector((state: RootState) => state.fixtureLive.events);

  useEffect(() => {
    if (!lineup || !events || !events.events || events.meta) {
      return;
    }
    const sortedEvents = cloneDeep(events.events).sort(
      (a, b) => a.sequence - b.sequence,
    );
    const eventMetaList = updateEventMeta(lineup, sortedEvents);
    if (eventMetaList) {
      dispatch(setEventMeta(eventMetaList));
    }
  }, [lineup, events]);

  return <></>;
};

export default EventMetaProcessor;
