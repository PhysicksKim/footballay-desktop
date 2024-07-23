import { faList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import '@app/styles/SideNavigation.scss';

const SideNavigation = () => {
  return (
    <div className="side-navigation-container">
      <div className="fixture-selection">
        <FontAwesomeIcon className="fixture-selection-icon" icon={faList} />
        <div className="fixture-selection-text">경기선택</div>
      </div>
      <div className="division-bar" />
      <div className="selected-fixture">
        <div className="selected-fixture-item fixture_01">맨유 vs 맨시티</div>
      </div>
    </div>
  );
};

export default SideNavigation;
