import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

import V1Header from './V1Header';
import V1LineupTab from './tabs/lineup/V1LineupTab';
import V1StatsTab from './tabs/V1StatsTab';
import V1EventsTab from './tabs/V1EventsTab';

export type V1ActiveTab = 'lineup' | 'stats' | 'events';

const V1Layout = () => {
  const [activeTab, setActiveTab] = useState<V1ActiveTab>('lineup');
  const activeTabRef = useRef(activeTab);

  const switchToNextTab = () => {
    setActiveTab((current) => {
      if (current === 'lineup') return 'stats';
      if (current === 'stats') return 'events';
      return 'lineup';
    });
  };

  const switchToPrevTab = () => {
    setActiveTab((current) => {
      if (current === 'lineup') return 'events';
      if (current === 'stats') return 'lineup';
      return 'stats'; // events -> stats
    });
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      if (event.shiftKey) {
        switchToPrevTab();
      } else {
        switchToNextTab();
      }
    } else if (event.key === 'Escape') {
      setActiveTab('lineup');
    } else if (event.key === '1') {
      setActiveTab('lineup');
    } else if (event.key === '2') {
      setActiveTab('stats');
    } else if (event.key === '3') {
      setActiveTab('events');
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  return (
    <LayoutContainer>
      {/* Lineup is always rendered in background */}
      <LineupBackground $isBlurred={activeTab !== 'lineup'}>
        <V1LineupTab isActive={true} />
      </LineupBackground>

      {/* Stats and Events tabs overlay with header */}
      {activeTab !== 'lineup' ? (
        <TabsContainer>
          <V1Header
            activeTab={activeTab}
            onTabChange={setActiveTab}
            $isAbsolute={false}
          />
          <TabPane $active={activeTab === 'stats'}>
            <V1StatsTab isActive={activeTab === 'stats'} />
          </TabPane>
          <TabPane $active={activeTab === 'events'}>
            <V1EventsTab isActive={activeTab === 'events'} />
          </TabPane>
        </TabsContainer>
      ) : null}
    </LayoutContainer>
  );
};

const LayoutContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  z-index: 1;
`;

const LineupBackground = styled.div<{ $isBlurred: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  filter: ${(props) => (props.$isBlurred ? 'blur(8px)' : 'none')};
  transition: filter 0.3s ease;
`;

const TabsContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 2;
  display: grid;
  grid-template-rows: auto 1fr;
  overflow: hidden;

  & > * {
    pointer-events: all;
  }
`;

const TabPane = styled.div<{ $active: boolean }>`
  grid-row: 2;
  grid-column: 1;
  opacity: ${(props) => (props.$active ? 1 : 0)};
  transition: opacity 0.3s ease;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

export default V1Layout;
