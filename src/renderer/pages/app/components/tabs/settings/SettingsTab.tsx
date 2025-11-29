import React from 'react';
import styled, { css } from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '@app/store/store';
import {
  selectTimezone,
  selectTimezoneStatus,
  updateTimezonePreference,
} from '@app/store/slices/settings/v1PreferencesSlice';
import {
  selectCfAccessClientId,
  selectCfAccessClientSecret,
  selectCfAccessStatus,
  saveCfAccessCredentials,
} from '@app/store/slices/settings/cfAccessSlice';
import { appEnv, getEnvLabel } from '@app/config/environment';
import { scrollbarStyle } from '@app/components/common/scrollbarStyle';

const statusLabelMap: Record<string, string> = {
  idle: '대기 중',
  loading: '불러오는 중',
  saving: '인증 확인 중',
  success: '인증 성공',
  error: '인증 실패',
};

const SettingsTab = () => {
  const dispatch = useAppDispatch();
  const timezone = useSelector(selectTimezone);
  const timezoneStatus = useSelector(selectTimezoneStatus);
  const [timezoneInput, setTimezoneInput] = React.useState<string>(timezone);

  const cfClientId = useSelector(selectCfAccessClientId);
  const cfClientSecret = useSelector(selectCfAccessClientSecret);
  const cfStatus = useSelector(selectCfAccessStatus);
  const [cfClientIdInput, setCfClientIdInput] =
    React.useState<string>(cfClientId);
  const [cfClientSecretInput, setCfClientSecretInput] =
    React.useState<string>(cfClientSecret);

  React.useEffect(() => {
    setTimezoneInput(timezone);
  }, [timezone]);

  React.useEffect(() => {
    setCfClientIdInput(cfClientId);
  }, [cfClientId]);

  React.useEffect(() => {
    setCfClientSecretInput(cfClientSecret);
  }, [cfClientSecret]);

  const handleTimezoneSave = () => {
    if (!timezoneInput.trim()) return;
    dispatch(updateTimezonePreference(timezoneInput));
  };

  const handleCfAccessSave = () => {
    dispatch(
      saveCfAccessCredentials({
        clientId: cfClientIdInput.trim(),
        clientSecret: cfClientSecretInput.trim(),
      })
    );
  };

  const envLabel = getEnvLabel();

  return (
    <Container>
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

      {appEnv === 'dev' && (
        <Section>
          <Title>Cloudflare Access (Dev 전용)</Title>
          <Description>
            개발 서버 접근을 위한 Cloudflare Zero Trust 서비스 토큰입니다. 빌드
            버전에서만 설정이 필요하며, dev 서버 실행 시에는 .env.secret에서
            자동으로 로드됩니다.
          </Description>
          <CfInputGroup>
            <Label>Client ID</Label>
            <CfInput
              type="text"
              value={cfClientIdInput}
              onChange={(event) => setCfClientIdInput(event.target.value)}
              placeholder="your-client-id.access"
            />
          </CfInputGroup>
          <CfInputGroup>
            <Label>Client Secret</Label>
            <CfInput
              type="password"
              value={cfClientSecretInput}
              onChange={(event) => setCfClientSecretInput(event.target.value)}
              placeholder="your-secret-here"
            />
          </CfInputGroup>
          <TimezoneInputRow>
            <SaveButton type="button" onClick={handleCfAccessSave}>
              저장
            </SaveButton>
          </TimezoneInputRow>
          <StatusText $status={cfStatus}>
            상태: {statusLabelMap[cfStatus] ?? cfStatus}
          </StatusText>
        </Section>
      )}

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
  overflow-y: auto;

  ${scrollbarStyle}
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

const StatusText = styled.span<{ $status: string }>`
  font-size: 13px;
  color: ${({ $status }) => {
    if ($status === 'error') return '#ff7676';
    if ($status === 'success') return '#76ff76';
    return '#b0b0b0';
  }};
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

const CfInputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 13px;
  color: #c9c9c9;
`;

const CfInput = styled.input`
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

export default SettingsTab;
