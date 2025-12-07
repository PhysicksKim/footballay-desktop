import { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '@app/store/store';
import {
  LiveInboundMessage,
  LiveOutboundMessage,
} from '@src/types/ipc/LiveChannels';
import { getLogger } from '@app/utils/logger';

const log = getLogger('app:v1:ipc-send');

const useMatchliveBridge = () => {
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
  const filterEvents = useSelector(
    (state: RootState) => state.eventFilter.filterEvents
  );

  const send = useCallback((message: LiveOutboundMessage) => {
    window.electron.ipcRenderer.send('live:to-matchlive', message);
    try {
      const payload: any = message.payload;
      const len =
        payload?.events && Array.isArray(payload.events)
          ? payload.events.length
          : undefined;
      const lastSeq =
        payload?.events && payload.events.length
          ? payload.events[payload.events.length - 1]?.sequence
          : undefined;
      log.info('send', {
        type: message.type,
        len,
        lastSeq,
      });
    } catch (_) {
      // ignore
    }
  }, []);

  const sendFullSync = useCallback(() => {
    send({ type: 'live.fixture.info', payload: info });
    send({ type: 'live.fixture.live-status', payload: liveStatus });
    send({ type: 'live.fixture.lineup', payload: lineup });
    send({ type: 'live.fixture.events', payload: events });
    send({ type: 'live.fixture.statistics', payload: statistics });
  }, [info, liveStatus, lineup, events, statistics, send]);

  useEffect(() => {
    send({ type: 'live.fixture.info', payload: info });
  }, [info, send]);

  useEffect(() => {
    send({ type: 'live.fixture.live-status', payload: liveStatus });
  }, [liveStatus, send]);

  useEffect(() => {
    send({ type: 'live.fixture.lineup', payload: lineup });
  }, [lineup, send]);

  useEffect(() => {
    send({ type: 'live.fixture.events', payload: events });
  }, [events, send]);

  useEffect(() => {
    send({ type: 'live.fixture.statistics', payload: statistics });
  }, [statistics, send]);

  useEffect(() => {
    send({ type: 'live.event-filter.update', payload: filterEvents });
  }, [filterEvents, send]);

  useEffect(() => {
    const unsubscribe = window.electron.ipcRenderer.on(
      'live:request-data',
      (message: LiveInboundMessage) => {
        if (!message) return;
        if (message.type === 'live.request.full-sync') {
          sendFullSync();
        }
      }
    );
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [sendFullSync]);
};

export default useMatchliveBridge;
