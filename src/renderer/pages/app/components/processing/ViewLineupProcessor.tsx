import React, { useEffect, useRef } from 'react';
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

/**
 * ViewLineupProcessor
 *
 * 변경 사항:
 * - useMemo를 제거하여 통계 값(예: rating) 변화처럼 배열 길이가 동일한 경우에도
 *   재계산이 보장되도록 수정했습니다.
 * - 기존 구현은 통계 배열의 length 의존으로 인해 값 변경이 반영되지 않는 경우가 있어
 *   초기 표시 누락/지연 문제가 발생했습니다.
 * - 성능 최적화는 추후 안전한 체크섬(내용 기반)으로 대체하는 것이 바람직합니다.
 */
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

  // 항상 최신 이벤트 필터링 결과를 계산
  const processedEvents: FixtureEvent[] = (() => {
    if (!events || !events.events) {
      return [] as FixtureEvent[];
    }
    if (!filterEvents || filterEvents.length === 0) {
      return events.events;
    }
    return getFilteredEvents(events, filterEvents).events;
  })();

  // 항상 최신 홈 라인업 뷰 계산
  const homeViewLineup = (() => {
    if (!lineup?.lineup?.home) {
      return null;
    }
    return processLineupToView(
      lineup.lineup.home,
      processedEvents,
      statistics?.home?.playerStatistics
    );
  })();

  // 항상 최신 원정 라인업 뷰 계산
  const awayViewLineup = (() => {
    if (!lineup?.lineup?.away) {
      return null;
    }
    return processLineupToView(
      lineup.lineup.away,
      processedEvents,
      statistics?.away?.playerStatistics
    );
  })();

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
