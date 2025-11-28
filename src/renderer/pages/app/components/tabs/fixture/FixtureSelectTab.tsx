import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { parseISO, format } from 'date-fns';

import { RootState, useAppDispatch } from '@app/store/store';
import { loadV1Leagues } from '@app/v1/store/leaguesSlice';
import {
  clearFixtures,
  loadV1Fixtures,
  setSelectedLeague,
} from '@app/v1/store/fixturesSlice';
import { selectTimezone } from '@app/store/slices/settings/v1PreferencesSlice';
import { FixtureMode } from '@app/v1/api/endpoints';
import {
  DEFAULT_TIMEZONE,
  getTodayDateString,
  isValidDateInput,
} from '@app/v1/utils/date';
import { createV1DataController } from '@app/v1/services/v1DataController';

import LeagueSelector from './LeagueSelector';
import FixtureList from './FixtureList';

const FixtureSelectTab = () => {
  const dispatch = useAppDispatch();
  const leagues = useSelector((state: RootState) => state.v1.leagues.items);
  const leaguesStatus = useSelector(
    (state: RootState) => state.v1.leagues.status
  );
  const fixtures = useSelector((state: RootState) => state.v1.fixtures.items);
  const fixturesStatus = useSelector(
    (state: RootState) => state.v1.fixtures.status
  );
  const selectedLeague = useSelector(
    (state: RootState) => state.v1.fixtures.selectedLeagueUid
  );

  const timezonePreference = useSelector(selectTimezone);
  const [selectedDate, setSelectedDate] = useState<string>(() =>
    getTodayDateString(timezonePreference || DEFAULT_TIMEZONE)
  );

  const [requestTimezone, setRequestTimezone] = useState<string>(
    timezonePreference || DEFAULT_TIMEZONE
  );

  const dataControllerRef = useRef<ReturnType<typeof createV1DataController>>();

  useEffect(() => {
    if (leaguesStatus === 'idle') {
      dispatch(loadV1Leagues());
    }
  }, [leaguesStatus, dispatch]);

  useEffect(() => {
    setRequestTimezone(timezonePreference || DEFAULT_TIMEZONE);
    setSelectedDate((prev) =>
      prev && isValidDateInput(prev)
        ? prev
        : getTodayDateString(timezonePreference || DEFAULT_TIMEZONE)
    );
  }, [timezonePreference]);

  useEffect(() => {
    if (!dataControllerRef.current) {
      dataControllerRef.current = createV1DataController(dispatch);
      dataControllerRef.current.start();
    }
    return () => {
      dataControllerRef.current?.stop();
    };
  }, [dispatch]);

  /**
   * 조회된 경기 데이터가 업데이트되면 해당 경기의 날짜로 UI 날짜를 동기화합니다.
   */
  useEffect(() => {
    if (fixtures.length > 0) {
      const firstFixture = fixtures[0];
      const kickoff = firstFixture.kickoff;
      if (kickoff) {
        try {
          const fixtureDate = parseISO(kickoff);
          const dateStr = format(fixtureDate, 'yyyy-MM-dd');
          if (dateStr !== selectedDate && isValidDateInput(dateStr)) {
            setSelectedDate(dateStr);
          }
        } catch (e) {
          console.error('경기 날짜 파싱 오류', e);
        }
      }
    }
  }, [fixtures, selectedDate]);

  const requestFixtures = (
    leagueUid: string,
    date: string,
    mode: FixtureMode
  ) => {
    const timezone =
      requestTimezone.trim() || timezonePreference || DEFAULT_TIMEZONE;

    dispatch(loadV1Fixtures({ leagueUid, date, mode, timezone }));
  };

  const handleSelectLeague = (leagueUid: string) => {
    dispatch(setSelectedLeague(leagueUid));
    requestFixtures(leagueUid, selectedDate, 'nearest');
  };

  /**
   * 날짜 변경 요청을 처리합니다.
   * 로컬 상태를 먼저 업데이트하지 않고 리덕스 액션만 디스패치하여
   * 실제 데이터 로드 완료 후 날짜 동기화가 이루어지도록 합니다.
   */
  const handleRequestFetch = (date: string, mode: FixtureMode) => {
    if (!selectedLeague) return;
    requestFixtures(selectedLeague, date, mode);
  };

  return (
    <Container>
      <LeagueSelector
        leagues={leagues}
        selectedLeagueUid={selectedLeague}
        onSelectLeague={handleSelectLeague}
      />
      <FixtureList
        fixtures={fixtures}
        selectedDate={selectedDate}
        loading={fixturesStatus === 'loading'}
        onRequestFetch={handleRequestFetch}
      />
    </Container>
  );
};

export default FixtureSelectTab;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 100%;
  min-width: 0;
  height: 100%;
  box-sizing: border-box;
  color: white;
  overflow: hidden;
  padding-bottom: 20px;
`;
