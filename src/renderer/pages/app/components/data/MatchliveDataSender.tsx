import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const MatchliveDataSender = () => {
  const fixtureId = useSelector((state: RootState) => state.fixture.fixtureId);
  const referee = useSelector((state: RootState) => state.fixture.referee);
  const date = useSelector((state: RootState) => state.fixture.date);
  const league = useSelector((state: RootState) => state.fixture.league);
  const liveStatus = useSelector(
    (state: RootState) => state.fixture.liveStatus,
  );
  const home = useSelector((state: RootState) => state.fixture.home);
  const away = useSelector((state: RootState) => state.fixture.away);
  const events = useSelector((state: RootState) => state.fixture.events);
  const lineup = useSelector((state: RootState) => state.fixture.lineup);
  const lastFetchTime = useSelector(
    (state: RootState) => state.fixture.lastFetchTime,
  );

  const { ipcRenderer } = window.electron;

  useEffect(() => {
    ipcRenderer.send('to-matchlive', {
      type: 'fixtureId',
      data: fixtureId,
    });
  }, [fixtureId]);

  useEffect(() => {
    ipcRenderer.send('to-matchlive', {
      type: 'referee',
      data: referee,
    });
  }, [referee]);

  useEffect(() => {
    ipcRenderer.send('to-matchlive', {
      type: 'date',
      data: date,
    });
  }, [date]);

  useEffect(() => {
    ipcRenderer.send('to-matchlive', {
      type: 'league',
      data: league,
    });
  }, [league]);

  useEffect(() => {
    ipcRenderer.send('to-matchlive', {
      type: 'liveStatus',
      data: liveStatus,
    });
  }, [liveStatus]);

  useEffect(() => {
    ipcRenderer.send('to-matchlive', {
      type: 'home',
      data: home,
    });
  }, [home]);

  useEffect(() => {
    ipcRenderer.send('to-matchlive', {
      type: 'away',
      data: away,
    });
  }, [away]);

  useEffect(() => {
    ipcRenderer.send('to-matchlive', {
      type: 'events',
      data: events,
    });
  }, [events]);

  useEffect(() => {
    ipcRenderer.send('to-matchlive', {
      type: 'lineup',
      data: lineup,
    });
  }, [lineup]);

  useEffect(() => {
    ipcRenderer.send('to-matchlive', {
      type: 'lastFetchTime',
      data: lastFetchTime,
    });
  }, [lastFetchTime]);

  const sendToSubWindow = () => {
    ipcRenderer.send('to-matchlive', {
      type: 'testmsg',
      data: {
        msg: 'Hello from Main Window',
      },
    });
    console.log('Send to Sub Window');
  };

  return (
    <div>
      <button onClick={sendToSubWindow}>SEND test MSG</button>
    </div>
  );
};

export default MatchliveDataSender;
