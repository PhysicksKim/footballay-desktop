import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../../../assets/icon.svg';
import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

export const Urls = {
  apiUrl: process.env.API_URL,
  websocketUrl: process.env.WEBSOCKET_URL,
};

function Hello() {
  const [message, setMessage] = useState<string>('메세지내용');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const [count, setCount] = useState(0);
  const [wsStatus, setWsStatus] = useState('idle');

  const [fixtureId, setFixtureId] = useState(1225853);
  const [fixtureInfo, setFixtureInfo] = useState([]);

  useEffect(() => {
    window.electron.stomp.onWsStatus((status) => {
      setWsStatus(status);
    });

    window.electron.stomp.onMessage((message) => {
      console.log(`Received STOMP message: ${message}`);
    });
  }, []);

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

  const getFixtureInfo = () => {
    axios
      .get(Urls.apiUrl + '/api/football/fixtures', {
        params: { fixtureId: fixtureId },
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
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
        <button onClick={getFixtureInfo}>경기정보</button>
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
