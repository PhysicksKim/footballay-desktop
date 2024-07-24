import { faList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import '@app/styles/SideNavigation.scss';
import { Link } from 'react-router-dom';

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
      <div className="selected-fixture">
        <div className="selected-fixture-item fixture_01">맨유 vs 맨시티</div>
      </div>
      <Link to="/debug-tool" className="debug-tool-menu">
        <div className="debug-tool">DEBUG</div>
      </Link>
    </div>
  );
};

export default SideNavigation;
