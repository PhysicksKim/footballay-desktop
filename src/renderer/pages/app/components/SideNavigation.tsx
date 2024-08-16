import { faList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import '@app/styles/SideNavigation.scss';
import { Link } from 'react-router-dom';
import MatchliveControlTab from './tabs/MatchliveControlTab';

const SideNavigation = () => {
  return (
    <div className="side-navigation-container">
      {/* <div className="fixture-selection"> */}
      <Link to="/" className="fixture-selection">
        <FontAwesomeIcon className="fixture-selection-icon" icon={faList} />
        <div className="fixture-selection-text">경기선택</div>
      </Link>
      {/* </div> */}
      <div className="division-bar" />
      <Link to="/matchlive-control" className="matchlive-control">
        <div className="selected-fixture">
          <div className="selected-fixture-item">라이브 정보 컨트롤</div>
        </div>
      </Link>
      {/* <Link to="/debug-tool" className="debug-tool-menu">
        <div className="debug-tool">DEBUG</div>
      </Link> */}
    </div>
  );
};

export default SideNavigation;
