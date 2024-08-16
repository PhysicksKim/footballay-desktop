import React from 'react';
import '@app/styles/TopBar.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { electron } from 'process';

const TopBar = () => {
  const handleMinimizeWindow = () => {
    window.electron.ipcRenderer.send('main-window-control', 'minimize');
  };
  const handleQuitApp = () => {
    window.electron.ipcRenderer.send('main-window-control', 'quit-app');
  };
  return (
    <div className="dragable topbar-dragable-area">
      <div className="non-dragable app-name-group">
        <div className="app-name">Chun City</div>
      </div>
      <div className="non-dragable window-control-group">
        <div className="minimize-window" onClick={handleMinimizeWindow}>
          <div className="minimize-icon"></div>
        </div>
        {/* <div className="maximize-window">
          <div className="maximize-icon"></div>
        </div> */}
        <div className="close-window" onClick={handleQuitApp}>
          <FontAwesomeIcon icon={faXmark} />
        </div>
      </div>
    </div>
  );
};

export default TopBar;
