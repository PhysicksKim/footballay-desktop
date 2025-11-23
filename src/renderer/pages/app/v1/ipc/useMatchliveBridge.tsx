import { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '@app/store/store';
import { V1InboundMessage, V1OutboundMessage } from '@src/types/ipc/V1Channels';

const useMatchliveBridge = () => {
  const developerMode = useSelector(
    (state: RootState) => state.featureFlags.developerMode
  );
  const info = useSelector((state: RootState) => state.v1.fixtureDetail.info);
  const liveStatus = useSelector(
    (state: RootState) => state.v1.fixtureDetail.liveStatus
  );
  const lineup = useSelector(
    (state: RootState) => state.v1.fixtureDetail.lineup
  );
  const events = useSelector(
    (state: RootState) => state.v1.fixtureDetail.events
  );
  const statistics = useSelector(
    (state: RootState) => state.v1.fixtureDetail.statistics
  );

  const send = useCallback((message: V1OutboundMessage) => {
    window.electron.ipcRenderer.send('v1:to-matchlive', message);
  }, []);

  const sendFullSync = useCallback(() => {
    send({ type: 'v1.fixture.info', payload: info });
    send({ type: 'v1.fixture.live-status', payload: liveStatus });
    send({ type: 'v1.fixture.lineup', payload: lineup });
    send({ type: 'v1.fixture.events', payload: events });
    send({ type: 'v1.fixture.statistics', payload: statistics });
  }, [info, liveStatus, lineup, events, statistics, send]);

  useEffect(() => {
    if (!developerMode) return;
    send({ type: 'v1.fixture.info', payload: info });
  }, [developerMode, info, send]);

  useEffect(() => {
    if (!developerMode) return;
    send({ type: 'v1.fixture.live-status', payload: liveStatus });
  }, [developerMode, liveStatus, send]);

  useEffect(() => {
    if (!developerMode) return;
    send({ type: 'v1.fixture.lineup', payload: lineup });
  }, [developerMode, lineup, send]);

  useEffect(() => {
    if (!developerMode) return;
    send({ type: 'v1.fixture.events', payload: events });
  }, [developerMode, events, send]);

  useEffect(() => {
    if (!developerMode) return;
    send({ type: 'v1.fixture.statistics', payload: statistics });
  }, [developerMode, statistics, send]);

  useEffect(() => {
    if (!developerMode) return;
    const unsubscribe = window.electron.ipcRenderer.on(
      'v1:request-data',
      (message: V1InboundMessage) => {
        if (!message) return;
        if (message.type === 'v1.request.full-sync') {
          sendFullSync();
        }
      }
    );
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [developerMode, sendFullSync]);
};

export default useMatchliveBridge;

