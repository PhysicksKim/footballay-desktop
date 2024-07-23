import React from 'react';
import '@app/styles/TopBar.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const TopBar = () => {
  return (
    <div className="dragable topbar-dragable-area">
      <div className="non-dragable app-name-group">
        <div className="app-name">이름뭐로하지</div>
      </div>
      <div className="non-dragable window-control-group">
        <div className="minimize-window">
          <div className="minimize-icon"></div>
        </div>
        <div className="maximize-window">
          <div className="maximize-icon"></div>
        </div>
        <div className="close-window">
          <FontAwesomeIcon icon={faXmark} />
        </div>
      </div>
    </div>
  );
};

export default TopBar;
