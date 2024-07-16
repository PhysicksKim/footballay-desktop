import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../../../assets/icon.svg';
import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

export const Urls = {
  apiUrl: process.env.API_URL,
  websocketUrl: process.env.WEBSOCKET_URL,
};

const defaultFixtureId = 1232551;
const prevFixtureId = 1225853;

function Hello() {
  const [message, setMessage] = useState<string>('메세지내용');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const [wsStatus, setWsStatus] = useState('idle');

  const [fixtureId, setFixtureId] = useState(defaultFixtureId);
  const [fixtureInfo, setFixtureInfo] = useState<any>(null);
  const [lastFetchTime, setLastFetchTime] = useState<Date>(new Date());

  useEffect(() => {
    window.electron.stomp.onWsStatus((status) => {
      setWsStatus(status);
    });

    window.electron.stomp.onMessage((message) => {
      console.log(`Received STOMP message: ${message}`);
    });

    const fetchData = () => {
      setLastFetchTime(new Date());
      axios
        .get(Urls.apiUrl + '/api/football/fixtures', {
          params: { fixtureId: fixtureId },
        })
        .then((response) => {
          setFixtureInfo(response.data.response[0]);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    // Fetch data initially
    fetchData();

    // Set interval to fetch data every minute
    const intervalId = setInterval(fetchData, 60000);

    return () => clearInterval(intervalId);
  }, [fixtureId]);

  const initStompClient = () => {
    window.electron.stomp.initClient();
  };

  const publishHello = () => {
    const message = JSON.stringify({ hello: 'send hello message' });
    window.electron.stomp.publish('/app/hello', message);
  };

  const subscribeHello = () => {
    window.electron.stomp.subscribe('/topic/hello');
  };

  useEffect(() => {
    const { ipcRenderer } = window.electron;

    ipcRenderer.on('message', (msg) => {
      console.log('message ipc 수신', msg);
      setMessage(msg as string);
    });

    ipcRenderer.on('isUpdating', (status) => {
      setIsUpdating(status as boolean);
    });

    ipcRenderer.sendMessage('react-ready', 'react is ready');

    return () => {
      ipcRenderer.removeAllListeners('message');
      ipcRenderer.removeAllListeners('isUpdating');
    };
  }, []);

  const openmatchlive = () => {
    window.electron.ipcRenderer.sendMessage('open-matchlive-window');
  };

  return (
    <div>
      <div className="Hello">
        <img width="100" alt="icon" src={icon} />
      </div>
      <div className="Hello">
        <button type="button" onClick={openmatchlive}>
          Open Test Window
        </button>
      </div>
      <div>
        <h3>업데이트 체크</h3>
        <div>
          메세지 : <div>{message}</div>
        </div>
        <div>isUpdating : {isUpdating.toString()}</div>
      </div>
      <div className="ws-test-box">
        <button onClick={initStompClient}>웹소켓연결</button>
        <div>WebSocket 상태 : {wsStatus}</div>
        <button onClick={publishHello}>헬로우!</button>
        <button onClick={subscribeHello}>헬로우 구독</button>
      </div>
      <div className="fixture-info-box">
        <h3>경기정보</h3>
        <p>마지막 데이터 요청 시간 : {lastFetchTime.toString()}</p>
        {fixtureInfo ? (
          <div>
            <p>리그: {fixtureInfo.league.name}</p>
            <p>날짜: {new Date(fixtureInfo.date).toLocaleString()}</p>
            <p>상태: {fixtureInfo.liveStatus.longStatus}</p>
            <p>
              경기시간:{' '}
              {fixtureInfo.liveStatus
                ? fixtureInfo.liveStatus.elapsed
                : 'Not Started'}
            </p>
            <p>홈팀: {fixtureInfo.home.name}</p>
            <p>원정팀: {fixtureInfo.away.name}</p>
            {fixtureInfo.lineup ? (
              <div>
                <h4>선발 라인업</h4>
                <div>
                  <h5>홈팀 ({fixtureInfo.home.name})</h5>
                  <ul>
                    {fixtureInfo.lineup.home.players.map(
                      (player: any, index: number) => (
                        <li key={index}>
                          <p>
                            {player.position} - {player.name} (번호:{' '}
                            {player.number})
                          </p>
                        </li>
                      ),
                    )}
                  </ul>
                  <h5>원정팀 ({fixtureInfo.away.name})</h5>
                  <ul>
                    {fixtureInfo.lineup.away.players.map(
                      (player: any, index: number) => (
                        <li key={index}>
                          <p>
                            {player.position} - {player.name} (번호:{' '}
                            {player.number})
                          </p>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </div>
            ) : (
              <p>라인업 정보가 없습니다.</p>
            )}
            <h4>이벤트</h4>
            <ul>
              {fixtureInfo.events.map((event: any, index: number) => (
                <li key={index}>
                  <p>
                    {event.elapsed}분 - {event.player.name} - {event.type} -{' '}
                    {event.detail}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>경기 정보를 불러오는 중...</p>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
