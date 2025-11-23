import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

import V1Header from './V1Header';
import V1LineupTab from './tabs/V1LineupTab';
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

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      switchToNextTab();
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
      <V1Header />
      
      <TabSelector>
        <TabButton $active={activeTab === 'lineup'} onClick={() => setActiveTab('lineup')}>
          라인업
        </TabButton>
        <TabButton $active={activeTab === 'stats'} onClick={() => setActiveTab('stats')}>
          통계
        </TabButton>
        <TabButton $active={activeTab === 'events'} onClick={() => setActiveTab('events')}>
          이벤트
        </TabButton>
      </TabSelector>

      <TabsContainer>
        <TabPane $active={activeTab === 'lineup'}>
          <V1LineupTab isActive={activeTab === 'lineup'} />
        </TabPane>
        <TabPane $active={activeTab === 'stats'}>
          <V1StatsTab isActive={activeTab === 'stats'} />
        </TabPane>
        <TabPane $active={activeTab === 'events'}>
          <V1EventsTab isActive={activeTab === 'events'} />
        </TabPane>
      </TabsContainer>
    </LayoutContainer>
  );
};

const LayoutContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  z-index: 1;
`;

const TabSelector = styled.div`
  position: absolute;
  top: 120px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  padding: 6px;
  border-radius: 12px;
  z-index: 101;
`;

const TabButton = styled.button<{ $active: boolean }>`
  padding: 8px 20px;
  border: none;
  background: ${(props) =>
    props.$active ? 'rgba(255, 255, 255, 0.25)' : 'transparent'};
  color: ${(props) => (props.$active ? 'white' : 'rgba(255, 255, 255, 0.7)')};
  font-size: 13px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  -webkit-app-region: no-drag;
  user-select: none;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: white;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const TabsContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const TabPane = styled.div<{ $active: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: ${(props) => (props.$active ? 1 : 0)};
  pointer-events: ${(props) => (props.$active ? 'all' : 'none')};
  transition: opacity 0.3s ease;
  z-index: ${(props) => (props.$active ? 2 : 1)};
`;

export default V1Layout;

