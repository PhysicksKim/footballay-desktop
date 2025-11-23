import React from 'react';
import styled, { css } from 'styled-components';
import { useSelector } from 'react-redux';

import { RootState, useAppDispatch } from '@app/store/store';
import {
  selectFeatureFlagStatus,
  updateDeveloperMode,
} from '@app/store/slices/settings/featureFlagsSlice';
import {
  selectTimezone,
  selectTimezoneStatus,
  updateTimezonePreference,
} from '@app/store/slices/settings/v1PreferencesSlice';
import { appEnv, getEnvLabel } from '@app/config/environment';

const statusLabelMap: Record<string, string> = {
  idle: '대기 중',
  loading: '불러오는 중',
  saving: '저장 중',
  error: '오류',
};

const SettingsV1Tab = () => {
  const dispatch = useAppDispatch();
  const developerMode = useSelector(
    (state: RootState) => state.featureFlags.developerMode
  );
  const status = useSelector(selectFeatureFlagStatus);
  const timezone = useSelector(selectTimezone);
  const timezoneStatus = useSelector(selectTimezoneStatus);
  const [timezoneInput, setTimezoneInput] = React.useState<string>(timezone);

  const handleToggle = () => {
    if (status === 'saving') {
      return;
    }
    dispatch(updateDeveloperMode(!developerMode));
  };

  React.useEffect(() => {
    setTimezoneInput(timezone);
  }, [timezone]);

  const handleTimezoneSave = () => {
    if (!timezoneInput.trim()) return;
    dispatch(updateTimezonePreference(timezoneInput));
  };

  const envLabel = getEnvLabel();

  return (
    <Container>
      <Section>
        <Title>개발자 모드</Title>
        <Description>
          개발 중인 v1 기능을 노출합니다. 문제 발생 시 오프라인 모드에서
          꺼주세요.
        </Description>
        <ToggleButton
          type="button"
          onClick={handleToggle}
          data-active={developerMode}
          disabled={status === 'saving'}
        >
          {developerMode ? 'ON' : 'OFF'}
        </ToggleButton>
        <StatusText $status={status}>
          상태: {statusLabelMap[status] ?? status}
        </StatusText>
      </Section>

      <Section>
        <Title>타임존 설정</Title>
        <Description>
          경기 목록과 매치라이브 데이터 요청에 사용할 기본 타임존입니다.
        </Description>
        <TimezoneInputRow>
          <TimezoneInput
            value={timezoneInput}
            onChange={(event) => setTimezoneInput(event.target.value)}
            placeholder="Asia/Seoul"
          />
          <SaveButton type="button" onClick={handleTimezoneSave}>
            저장
          </SaveButton>
        </TimezoneInputRow>
        <StatusText $status={timezoneStatus}>
          상태: {statusLabelMap[timezoneStatus] ?? timezoneStatus}
        </StatusText>
      </Section>

      <Section>
        <Title>환경 정보</Title>
        <InfoList>
          <li>
            현재 스테이지: <strong>{envLabel}</strong> ({appEnv})
          </li>
          <li>Domain URL: {import.meta.env.VITE_DOMAIN_URL}</li>
          <li>API URL: {import.meta.env.VITE_API_URL}</li>
          <li>Websocket URL: {import.meta.env.VITE_WEBSOCKET_URL}</li>
        </InfoList>
      </Section>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 30px;
  color: white;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 18px;
`;

const Description = styled.p`
  margin: 0;
  font-size: 14px;
  color: #c9c9c9;
`;

const ToggleButton = styled.button`
  width: 120px;
  padding: 8px 0;
  border-radius: 999px;
  border: none;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  background-color: #5c5c5c;
  color: white;
  transition: background 0.2s ease;

  &[data-active='true'] {
    background-color: #5934e0;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const StatusText = styled.span<{ $status: string }>`
  font-size: 13px;
  color: ${({ $status }) => ($status === 'error' ? '#ff7676' : '#b0b0b0')};
`;

const TimezoneInputRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
`;

const TimezoneInput = styled.input`
  flex: 1;
  min-width: 180px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.35);
  color: white;
  font-size: 14px;
`;

const InfoList = styled.ul`
  margin: 0;
  padding-left: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 4px;

  li {
    font-size: 14px;
    word-break: break-all;
  }
`;

const CommonButtonCss = css`
  padding: 0;

  width: 40px;
  height: 30px;
  font-size: 14px;
  border-radius: 5px;
  background-color: #5934e0;
  color: #ffffff;

  &:hover {
    background-color: #5e35f1;
    color: #ffffff;
    transform: none;
  }
`;

const SaveButton = styled.button`
  ${CommonButtonCss}
`;

export default SettingsV1Tab;
