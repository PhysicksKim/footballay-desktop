import React, { useEffect, useRef, useState } from 'react';
import '../styles/Body.scss';
import FixtureIpc from '../ipc/FixtureIpc';
import LineupTab from './tabs/lineup/LineupTab';
import '@matchlive/styles/Body.scss';
import '@matchlive/styles/Main.scss';
import TeamStatisticsTab from './tabs/teamstat/TeamStatisticsTab';
import styled from 'styled-components';
import FootballFieldCanvas from './tabs/lineup/FootballFieldCanvas';

export type ActiveTab = 'lineup' | 'teamStatistics';

const ContentAreaContainer = styled.div<{
  $tabname: ActiveTab;
  $active: ActiveTab;
}>`
  position: relative;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  visibility: ${(props) =>
    props.$tabname === props.$active ? 'visible' : 'hidden'};
`;

const SwitchTabButton = styled.div`
  position: absolute;
  bottom: 50%;
  left: 0;
  transform: translate(0, 50%);
  background-color: blue;
  height: 100%;
  width: 40px;
  /* z-index: 1; */
  -webkit-app-region: no-drag;
  user-select: none;
  pointer-events: all;
`;

const Main = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('teamStatistics');

  const switchTab = () => {
    if (activeTab === 'lineup') {
      setActiveTab('teamStatistics');
    } else if (activeTab === 'teamStatistics') {
      setActiveTab('lineup');
    } else {
      console.error('Invalid activeTab:', activeTab);
      setActiveTab('lineup');
    }
  };

  return (
    <div className="root-container">
      <>
        <FixtureIpc />
      </>
      <FootballFieldCanvas />
      <SwitchTabButton
        className="toggle-button left"
        onClick={() => switchTab()}
      >
        탭전환
      </SwitchTabButton>
      <div className="contents-area">
        {/* <LineupTab />
        <TeamStatisticsTab /> */}
        {/* LineupTab */}
        <ContentAreaContainer
          className={`tab ${activeTab === 'lineup' ? 'visible' : 'hidden'}`}
          $tabname="lineup"
          $active={activeTab}
        >
          <LineupTab />
        </ContentAreaContainer>
        {/* TeamStatisticsTab */}
        <ContentAreaContainer
          className={`tab ${activeTab === 'lineup' ? 'visible' : 'hidden'}`}
          $tabname="teamStatistics"
          $active={activeTab}
        >
          <TeamStatisticsTab />
        </ContentAreaContainer>
      </div>
    </div>
  );
};

export default Main;
