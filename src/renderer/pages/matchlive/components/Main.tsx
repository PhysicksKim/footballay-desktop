import React, { useEffect, useRef, useState } from 'react';
import '../styles/Body.scss';
import FixtureIpc from '../ipc/FixtureIpc';
import LineupTab from './tabs/lineup/LineupTab';
import '@matchlive/styles/Body.scss';
import '@matchlive/styles/Main.scss';
import TeamStatisticsTab from './tabs/teamstat/TeamStatisticsTab';
import styled from 'styled-components';
import FootballFieldCanvas from './tabs/lineup/FootballFieldCanvas';
import { CSSTransition } from 'react-transition-group';

export type ActiveTab = 'lineup' | 'teamStatistics';

const ContentAreaContainer = styled.div<{
  $tabname: ActiveTab;
  $active: ActiveTab;
}>`
  position: absolute;
  top: 0;
  left: 0;
  visibility: visible;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  opacity: ${(props) => (props.$tabname === props.$active ? 1 : 0)};
  transform: ${(props) =>
    props.$tabname === props.$active ? 'translate(0,0)' : 'translate(0,-10px)'};

  transition:
    opacity 0.5s ease-in-out,
    transform 0.5s ease-in-out;

  &.fade-exit-done {
    visibility: hidden;
  }
  &.fade-enter {
    visibility: visible;
  }
`;

const SwitchTabButton = styled.div`
  position: absolute;
  bottom: 50%;
  left: 0;
  transform: translate(-60%, 50%);
  height: 90%;
  width: 10%;
  min-width: 10px;
  -webkit-app-region: no-drag;
  user-select: none;
  pointer-events: all;
  border-top-right-radius: 50%;
  border-bottom-right-radius: 50%;

  transition:
    background-color 0.2s ease,
    box-shadow 0.2s ease;

  cursor: pointer;

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
  const [activeTab, setActiveTab] = useState<ActiveTab>('teamStatistics');
  const activeTabRef = useRef(activeTab);

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

  const handleKeyPress = (event: KeyboardEvent) => {
    console.log('key pressed:', event.key);
    if (event.key === 'Tab') {
      event.preventDefault(); // 기본 탭 동작 방지 (포커스 이동 방지)
      switchTab(activeTabRef.current);
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

  // TODO : CSS transition 이용해서 탭 전환 구현
  return (
    <div className="root-container">
      <>
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
          unmountOnExit={false} // unmount 방지
        >
          <ContentAreaContainer
            className={`tab ${activeTab === 'lineup' ? 'visible' : 'hidden'}`}
            $tabname="lineup"
            $active={activeTab}
          >
            <LineupTab />
          </ContentAreaContainer>
        </CSSTransition>
        {/* TeamStatisticsTab */}
        <CSSTransition
          in={activeTab === 'teamStatistics'}
          timeout={500}
          classNames="fade"
          unmountOnExit={false} // unmount 방지
        >
          <ContentAreaContainer
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
