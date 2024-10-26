import React, { useEffect, useRef, useState } from 'react';
import '../styles/Body.scss';
import FixtureIpc from '../ipc/FixtureIpc';
import LineupTab from './tabs/lineup/LineupTab';
import '@matchlive/styles/Body.scss';
import '@matchlive/styles/Main.scss';
import TeamStatisticsTab from './tabs/teamstat/TeamStatisticsTab';
import styled, { css } from 'styled-components';
import FootballFieldCanvas from './tabs/lineup/FootballFieldCanvas';
import { CSSTransition } from 'react-transition-group';
import TeamColorProcessor from './processor/TeamColorProcessor';
import { useSelector } from 'react-redux';
import { stat } from 'fs';
import { RootState } from '../store/store';

export type ActiveTab = 'lineup' | 'teamStatistics';

const fadeAnimations = css`
  &.fade-enter {
    & > * {
      opacity: 0;
      scale: 1.05;
      transform: translate(0, -10px);
    }
  }

  &.fade-enter-active {
    & > * {
      opacity: 1;
      scale: 1;
      transform: translate(0, 0);
      transition:
        scale 0.5s ease-in-out,
        opacity 0.5s ease-in-out,
        transform 0.5s ease-in-out;
    }
  }

  &.fade-exit {
    & > * {
      opacity: 1;
      scale: 1;
      transform: translate(0, 0);
    }
  }

  &.fade-exit-active {
    & > * {
      opacity: 0;
      scale: 1.05;
      transform: translate(0, -10px);
      transition:
        scale 0.5s ease-in-out,
        opacity 0.5s ease-in-out,
        transform 0.5s ease-in-out;
    }
  }
`;

const ContentAreaContainer = styled.div<{
  $tabname: ActiveTab;
  $active: ActiveTab;
  $isLineup?: boolean;
}>`
  position: absolute;
  top: 0;
  left: 0;
  visibility: visible;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  opacity: ${(props) =>
    props.$tabname === props.$active ? 1 : props.$isLineup ? 0.2 : 0};
  scale: ${(props) =>
    props.$tabname === props.$active ? 1 : props.$isLineup ? 0.95 : 1.05};
  transform: ${(props) =>
    props.$tabname === props.$active ? 'translate(0,0)' : 'translate(0,-10px)'};

  transition:
    scale 0.5s ease-in-out,
    opacity 0.5s ease-in-out,
    transform 0.5s ease-in-out;

  & > * {
    pointer-events: ${(props) =>
      props.$tabname === props.$active ? 'all' : 'none'};
  }

  // teamstat 탭에 대해서만 적용
  // active 시 1 translate(0,0)
  // inactive 시 opa 0, scale 1.05 translate(0, -10px)
  ${(props) => !props.$isLineup && fadeAnimations}
`;

const SwitchTabButton = styled.div`
  position: absolute;
  bottom: 50%;
  left: 0;
  transform: translate(-60%, 50%);
  height: 90%;
  width: 10%;
  min-width: 10px;
  border-top-right-radius: 50%;
  border-bottom-right-radius: 50%;

  transition:
    background-color 0.2s ease,
    box-shadow 0.2s ease;

  cursor: pointer;
  -webkit-app-region: no-drag;
  user-select: none;
  pointer-events: all;
  z-index: 1;

  &:hover {
    background-color: #ffffff4b;
    box-shadow: 0 0 10px 0 #ffffff4b;

    // box shadow glow effect
    animation: glow 1s infinite ease-in-out;

    @keyframes glow {
      0% {
        background-color: #ffffff6a;
      }
      50% {
        background-color: #ffffff22;
      }
      100% {
        background-color: #ffffff6a;
      }
    }
  }
`;

const Main = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('lineup');
  const activeTabRef = useRef(activeTab);

  const [prevShortStatus, setPrevShortStatus] = useState<string | null>(null);

  const liveShortStatus = useSelector(
    (state: RootState) => state.fixture.liveStatus?.liveStatus.shortStatus,
  );

  // CSSTransition 을 위한 nodeRef 생성
  const lineupRef = useRef<HTMLDivElement>(null);
  const teamStatisticsRef = useRef<HTMLDivElement>(null);

  const switchTab = (_activeTab: ActiveTab) => {
    if (_activeTab === 'lineup') {
      setActiveTab('teamStatistics');
    } else if (_activeTab === 'teamStatistics') {
      setActiveTab('lineup');
    } else {
      console.error('Invalid activeTab:', _activeTab);
      setActiveTab('lineup');
    }
  };

  useEffect(() => {
    if (liveShortStatus && prevShortStatus !== liveShortStatus) {
      if (prevShortStatus === '1H' && liveShortStatus === 'HT') {
        setActiveTab('teamStatistics');
      }
      if (prevShortStatus === 'HT' && liveShortStatus === '2H') {
        setActiveTab('lineup');
      }

      if (prevShortStatus === '2H' && liveShortStatus === 'FT') {
        setActiveTab('teamStatistics');
      }

      setPrevShortStatus(liveShortStatus);
    }
  }, [liveShortStatus, prevShortStatus]);

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault(); // 기본 탭 동작 방지 (포커스 이동 방지)
      switchTab(activeTabRef.current);
    } else if (event.key === 'Escape') {
      setActiveTab('lineup');
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);

    // 이벤트 리스너를 정리(cleanup)하는 부분
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  return (
    <div className="root-container">
      <>
        <TeamColorProcessor />
        <FixtureIpc />
      </>
      <FootballFieldCanvas />
      <SwitchTabButton
        className="toggle-button left"
        onClick={() => switchTab(activeTab)}
      ></SwitchTabButton>
      <div className="contents-area">
        {/* LineupTab */}
        <CSSTransition
          in={activeTab === 'lineup'}
          timeout={500}
          classNames="fade"
          unmountOnExit={false}
          nodeRef={lineupRef}
        >
          <ContentAreaContainer
            ref={lineupRef}
            className={`tab ${activeTab === 'lineup' ? 'visible' : 'hidden'}`}
            $tabname="lineup"
            $active={activeTab}
            $isLineup={true}
          >
            <LineupTab isActive={activeTab === 'lineup'} />
          </ContentAreaContainer>
        </CSSTransition>

        {/* TeamStatisticsTab */}
        <CSSTransition
          in={activeTab === 'teamStatistics'}
          timeout={500}
          classNames="fade"
          /* 비활성시 unmount 하지 않으면 Lineup 을 가리기 때문에 lineup 에서 hover 이벤트가 발생하지 않음 */
          unmountOnExit={true}
          nodeRef={teamStatisticsRef}
        >
          <ContentAreaContainer
            ref={teamStatisticsRef}
            className={`tab ${activeTab === 'lineup' ? 'visible' : 'hidden'}`}
            $tabname="teamStatistics"
            $active={activeTab}
          >
            <TeamStatisticsTab />
          </ContentAreaContainer>
        </CSSTransition>
      </div>
    </div>
  );
};

export default Main;
