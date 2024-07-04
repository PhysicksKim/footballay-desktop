import React, { useEffect, useRef, useState } from 'react';
import './Body.scss';
import { Client, IMessage, StompConfig } from '@stomp/stompjs';

const Application = () => {
  const [count, setCount] = useState(0);

  const clientRef = useRef<Client>();
  const [wsStatus, setWsStatus] = useState('idle');

  const initStompClient = () => {
    if (!clientRef.current) {
      clientRef.current = new Client(stompConfig);
      clientRef.current.activate();
    } else if (!clientRef.current?.active) {
      clientRef.current.activate();
    }
  };

  const stompConfig: StompConfig = {
    brokerURL: process.env.WEBSOCKET_URL,
    // brokerURL: 'wss://gyechunsik.site/ws',
    onConnect: () => {
      // Subscribe : /user/topic/remote
      subscribeHello();
      setWsStatus('connected');
    },
    onDisconnect: () => {
      console.log('websocket disconnect');
      setWsStatus('disconnected');
    },
  };

  const subscribeHello = () => {
    if (!clientRef.current) {
      console.error('Websocket Client is null or undefined');
      return;
    }

    clientRef.current.subscribe(
      '/topic/hello',
      (message: IMessage) => {
        console.log(`receive hello response : ${message.body}`);
      },
      { id: 'helloSub' },
    );
  };

  const publishHello = () => {
    if (!clientRef.current) {
      console.log('Websocket Client is null or undefined');
      return;
    }

    console.log('published HELLO');
    clientRef.current.publish({
      destination: '/app/hello',
      body: JSON.stringify({ hello: 'send hello message' }),
    });
  };

  return (
    <div>
      <h1>Test Window</h1>

      <div className="drag-area">여기를끌어드래그</div>
      <div className="contents-area">
        <p>Count: {count}</p>
        <button type="button" onClick={() => setCount(count + 1)}>
          Increase Count
        </button>
      </div>
      <div className="ws-test-box">
        <button onClick={initStompClient}>웹소켓연결</button>
        <div>WebSocket 상태 : {wsStatus}</div>
        <button onClick={publishHello}>헬로우!</button>
      </div>
    </div>
  );
};

export default Application;
