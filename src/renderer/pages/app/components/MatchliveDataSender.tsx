import React from 'react';

const MatchliveDataSender = () => {
  const sendToSubWindow = () => {
    const { ipcRenderer } = window.electron;
    ipcRenderer.sendMessage('main-to-sub', 'Hello from Main Window');
    console.log('Send to Sub Window');
  };

  return (
    <div>
      <div>MatchliveDataSender</div>
      <button onClick={sendToSubWindow}>SEND test MSG</button>
    </div>
  );
};

export default MatchliveDataSender;
