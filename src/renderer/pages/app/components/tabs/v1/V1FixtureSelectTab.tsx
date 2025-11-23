import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { RootState, useAppDispatch } from '@app/store/store';
import { loadV1Leagues } from '@app/v1/store/leaguesSlice';
import {
  clearFixtures,
  loadV1Fixtures,
  setSelectedLeague,
} from '@app/v1/store/fixturesSlice';
import { selectTimezone } from '@app/store/slices/settings/v1PreferencesSlice';
import { FixtureMode } from '@app/v1/api/endpoints';
import { FIXTURE_MODES } from '@app/v1/utils/fixtureParams';
import {
  DEFAULT_TIMEZONE,
  getTodayDateString,
  isValidDateInput,
} from '@app/v1/utils/date';
import { createV1DataController } from '@app/v1/services/v1DataController';

const V1FixtureSelectTab = () => {
  const dispatch = useAppDispatch();
  const developerMode = useSelector(
    (state: RootState) => state.featureFlags.developerMode
  );
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
  const activeFixtureUid = useSelector(
    (state: RootState) => state.v1.fixtureDetail.targetFixtureUid
  );
  const timezonePreference = useSelector(selectTimezone);
  const [selectedDate, setSelectedDate] = useState<string>(() =>
    getTodayDateString(timezonePreference || DEFAULT_TIMEZONE)
  );
  const [mode, setMode] = useState<FixtureMode>('exact');
  const [requestTimezone, setRequestTimezone] = useState<string>(
    timezonePreference || DEFAULT_TIMEZONE
  );
  const dataControllerRef = useRef<ReturnType<typeof createV1DataController>>();

  useEffect(() => {
    if (!developerMode) return;
    if (leaguesStatus === 'idle') {
      dispatch(loadV1Leagues());
    }
  }, [developerMode, leaguesStatus, dispatch]);

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

  if (!developerMode) {
    return <Navigate to="/" replace />;
  }

  const buildRequestParams = (leagueUid: string) => {
    const timezone =
      requestTimezone.trim() || timezonePreference || DEFAULT_TIMEZONE;
    const date = isValidDateInput(selectedDate)
      ? selectedDate
      : getTodayDateString(timezone);
    return { leagueUid, date, mode, timezone };
  };

  const requestFixtures = (leagueUid: string) => {
    const params = buildRequestParams(leagueUid);
    dispatch(loadV1Fixtures(params));
  };

  const handleSelectLeague = (leagueUid: string) => {
    dispatch(setSelectedLeague(leagueUid));
    requestFixtures(leagueUid);
  };

  const handleRefreshFixtures = () => {
    if (!selectedLeague) return;
    requestFixtures(selectedLeague);
  };

  const handleOpenMatchlive = (fixtureUid: string) => {
    if (!dataControllerRef.current) {
      dataControllerRef.current = createV1DataController(dispatch);
      dataControllerRef.current.start();
    }
    dataControllerRef.current?.setFixtureUid(fixtureUid);
    window.electron.ipcRenderer.send('open-matchlive-window', fixtureUid);
  };

  const handleClearFixtures = () => {
    dispatch(setSelectedLeague(undefined));
    dispatch(clearFixtures());
  };

  return (
    <Container>
      <Title>V1 경기 선택</Title>
      <Description>
        v1 백엔드와 연동된 새로운 경기 선택 화면입니다. 개발자 모드에서만 접근할
        수 있습니다.
      </Description>
      <Section>
        <SectionTitle>가용 리그</SectionTitle>
        {leaguesStatus === 'loading' && (
          <HelperText>리그 정보를 불러오는 중...</HelperText>
        )}
        <LeaguesGrid>
          {leagues.map((league) => (
            <LeagueButton
              key={league.uid}
              data-active={league.uid === selectedLeague}
              onClick={() => handleSelectLeague(league.uid)}
            >
              <span>{league.nameKo ?? league.name}</span>
              <small>{league.uid}</small>
            </LeagueButton>
          ))}
        </LeaguesGrid>
      </Section>
      <Section>
        <SectionTitle>요청 조건</SectionTitle>
        <ControlsGrid>
          <Field>
            <FieldLabel>날짜</FieldLabel>
            <Input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>모드</FieldLabel>
            <Select
              value={mode}
              onChange={(event) => setMode(event.target.value as FixtureMode)}
            >
              {FIXTURE_MODES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </Field>
          <Field>
            <FieldLabel>타임존</FieldLabel>
            <Input
              value={requestTimezone}
              onChange={(event) => setRequestTimezone(event.target.value)}
              placeholder="Asia/Seoul"
            />
          </Field>
        </ControlsGrid>
        <ActionsRow>
          <ActionButton
            type="button"
            onClick={handleRefreshFixtures}
            disabled={!selectedLeague}
          >
            경기 목록 갱신
          </ActionButton>
          {selectedLeague && (
            <ResetButton type="button" onClick={handleClearFixtures}>
              선택 해제
            </ResetButton>
          )}
        </ActionsRow>
        {fixturesStatus === 'loading' && (
          <HelperText>경기 정보를 불러오는 중...</HelperText>
        )}
        <FixtureList>
          {fixtures.map((fixture) => (
            <FixtureItem
              key={fixture.uid}
              $active={fixture.uid === activeFixtureUid}
            >
              <div>
                <strong>{fixture.homeTeam.name}</strong> vs{' '}
                <strong>{fixture.awayTeam.name}</strong>
              </div>
              <span className="fixture-time">{fixture.kickoff}</span>
              <FixtureActions>
                <AvailabilityBadge data-available={fixture.available}>
                  {fixture.available ? 'available' : 'unavailable'}
                </AvailabilityBadge>
                <MatchliveButton
                  type="button"
                  onClick={() => handleOpenMatchlive(fixture.uid)}
                >
                  Matchlive 열기
                </MatchliveButton>
              </FixtureActions>
            </FixtureItem>
          ))}
          {!fixtures.length && (
            <HelperText>리그를 선택하면 경기가 여기에 표시됩니다.</HelperText>
          )}
        </FixtureList>
      </Section>
    </Container>
  );
};

const Container = styled.div`
  padding: 30px;
  color: white;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
`;

const Title = styled.h1`
  margin: 0 0 12px 0;
`;

const Description = styled.p`
  margin: 0;
  color: #cfcfcf;
`;

const Section = styled.section`
  margin-top: 24px;
`;

const SectionTitle = styled.h3`
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const HelperText = styled.p`
  margin: 0 0 12px 0;
  color: #9d9d9d;
  font-size: 14px;
`;

const ControlsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 12px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FieldLabel = styled.label`
  font-size: 13px;
  color: #bbbbbb;
`;

const Input = styled.input`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 14px;
`;

const Select = styled.select`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 14px;
`;

const ActionsRow = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  border-radius: 999px;
  border: none;
  background: #5934e0;
  color: white;
  cursor: pointer;
  font-size: 14px;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LeaguesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 10px;
`;

const LeagueButton = styled.button`
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 12px;
  background: transparent;
  color: white;
  text-align: left;
  cursor: pointer;

  &[data-active='true'] {
    background: rgba(89, 52, 224, 0.2);
    border-color: #5934e0;
  }

  small {
    display: block;
    margin-top: 4px;
    color: #8a8a8a;
  }
`;

const FixtureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FixtureItem = styled.div<{ $active?: boolean }>`
  padding: 12px;
  border-radius: 8px;
  background: ${({ $active }) =>
    $active ? 'rgba(89, 52, 224, 0.25)' : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid
    ${({ $active }) => ($active ? '#5934e0' : 'rgba(255, 255, 255, 0.05)')};
  display: flex;
  flex-direction: column;
  gap: 6px;

  .fixture-time {
    font-size: 13px;
    color: #8c8c8c;
  }
`;

const FixtureActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const MatchliveButton = styled.button`
  padding: 6px 14px;
  border-radius: 999px;
  border: none;
  background: #ff7a18;
  color: black;
  font-weight: 600;
  cursor: pointer;
`;

const AvailabilityBadge = styled.span`
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
  text-transform: uppercase;
  background: ${({ ['data-available' as never]: available }) =>
    available ? 'rgba(78, 201, 176, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  color: ${({ ['data-available' as never]: available }) =>
    available ? '#4ec9b0' : '#bbbbbb'};
`;

const ResetButton = styled.button`
  padding: 4px 10px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  font-size: 12px;
`;

export default V1FixtureSelectTab;
