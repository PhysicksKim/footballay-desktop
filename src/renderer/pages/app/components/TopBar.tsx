import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import '@app/styles/TopBar.scss';

const TopBar = () => {
  const handleMinimizeWindow = () => {
    window.electron.ipcRenderer.send('window-control', {
      window: 'app',
      action: 'minimize',
    });
  };
  const handleQuitApp = () => {
    window.electron.ipcRenderer.send('window-control', {
      window: 'app',
      action: 'quit',
    });
  };
  return (
    <div className="dragable topbar-dragable-area">
      <div className="non-dragable app-name-group">
        <div className="app-name">Footballay</div>
      </div>
      <div className="non-dragable window-control-group">
        <div className="minimize-window" onClick={handleMinimizeWindow}>
          <div className="minimize-icon"></div>
        </div>
        <div className="close-window" onClick={handleQuitApp}>
          <FontAwesomeIcon icon={faXmark} />
        </div>
      </div>
    </div>
  );
};

export default TopBar;
