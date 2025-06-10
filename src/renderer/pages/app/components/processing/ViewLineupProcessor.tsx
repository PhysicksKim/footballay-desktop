import React, { useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '@app/store/store';
import { setProcessedLineup } from '@app/store/slices/fixtureProcessedDataSlice';

import { FixtureEvent } from '@src/types/FixtureIpc';
import { processLineupToView } from './ViewLineupLogic';
import { getFilteredEvents } from './MatchliveIpc';

// 간단한 깊은 비교 함수
const isDeepEqual = (obj1: any, obj2: any): boolean => {
  if (obj1 === obj2) return true;

  if (obj1 == null || obj2 == null) return obj1 === obj2;

  if (typeof obj1 !== 'object' || typeof obj2 !== 'object')
    return obj1 === obj2;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!isDeepEqual(obj1[key], obj2[key])) return false;
  }

  return true;
};

const ViewLineupProcessor = () => {
  const dispatch = useDispatch();
  const events = useSelector((state: RootState) => state.fixtureLive.events);
  const lineup = useSelector((state: RootState) => state.fixtureLive.lineup);
  const statistics = useSelector(
    (state: RootState) => state.fixtureLive.statistics
  );
  const filterEvents = useSelector(
    (state: RootState) => state.fixtureLiveControl.filterEvents
  );

  // 이전 처리된 결과를 추적하기 위한 ref
  const previousProcessedLineupRef = useRef<{
    home: any;
    away: any;
  } | null>(null);

  // 이전 입력값들을 추적하기 위한 ref
  const previousInputsRef = useRef<{
    eventsLength: number;
    filterEventsLength: number;
    lineupExists: boolean;
    statisticsExists: boolean;
  } | null>(null);

  // processedEvents를 useMemo로 최적화
  const processedEvents = useMemo(() => {
    if (!events || !events.events) {
      return [] as FixtureEvent[];
    }

    // filterEvents가 빈 배열이면 그냥 원본 events 반환
    if (!filterEvents || filterEvents.length === 0) {
      return events.events;
    }

    // 실제 필터링이 필요한 경우에만 getFilteredEvents 호출
    return getFilteredEvents(events, filterEvents).events;
  }, [
    events?.fixtureId,
    events?.events?.length,
    filterEvents?.length,
    // events와 filterEvents의 실제 내용이 변경되었는지도 체크
    events?.events?.[events.events.length - 1]?.sequence,
    filterEvents?.[filterEvents.length - 1]?.sequence,
  ]);

  // homeViewLineup을 useMemo로 최적화
  const homeViewLineup = useMemo(() => {
    if (!lineup?.lineup?.home) {
      return null;
    }

    return processLineupToView(
      lineup.lineup.home,
      processedEvents,
      statistics?.home?.playerStatistics
    );
  }, [
    lineup?.fixtureId,
    lineup?.lineup?.home?.teamId,
    lineup?.lineup?.home?.players?.length,
    lineup?.lineup?.home?.substitutes?.length,
    processedEvents?.length,
    processedEvents?.[processedEvents.length - 1]?.sequence,
    statistics?.home?.playerStatistics?.length,
  ]);

  // awayViewLineup을 useMemo로 최적화
  const awayViewLineup = useMemo(() => {
    if (!lineup?.lineup?.away) {
      return null;
    }

    return processLineupToView(
      lineup.lineup.away,
      processedEvents,
      statistics?.away?.playerStatistics
    );
  }, [
    lineup?.fixtureId,
    lineup?.lineup?.away?.teamId,
    lineup?.lineup?.away?.players?.length,
    lineup?.lineup?.away?.substitutes?.length,
    processedEvents?.length,
    processedEvents?.[processedEvents.length - 1]?.sequence,
    statistics?.away?.playerStatistics?.length,
  ]);

  // 실제 변경이 있을 때만 dispatch 호출
  useEffect(() => {
    const newProcessedLineup = {
      home: homeViewLineup,
      away: awayViewLineup,
    };

    // 이전 값과 깊은 비교를 통해 실제 변경이 있는지 확인
    const hasChanged = !isDeepEqual(
      previousProcessedLineupRef.current,
      newProcessedLineup
    );

    if (hasChanged) {
      dispatch(setProcessedLineup(newProcessedLineup));
      previousProcessedLineupRef.current = newProcessedLineup;
    }
  }, [homeViewLineup, awayViewLineup, dispatch]);

  return <></>;
};

export default ViewLineupProcessor;
