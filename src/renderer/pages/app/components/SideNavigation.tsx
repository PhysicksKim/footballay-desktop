import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { faList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import '@app/styles/SideNavigation.scss';

const SideNavigation = () => {
  const [version, setVersion] = useState<string>(window.appVersion || '');

  useEffect(() => {
    if (version) return;
    const fetchVersion = async () => {
      try {
        if (window.getVersion) {
          const v = await window.getVersion();
          setVersion(v);
        }
      } catch (e) {
        // ignore
      }
    };
    fetchVersion();
  }, [version]);
  return (
    <div className="side-navigation-container">
      <Link to="/" className="fixture-selection">
        <FontAwesomeIcon className="fixture-selection-icon" icon={faList} />
        <div className="fixture-selection-text">경기선택</div>
      </Link>
      <div className="division-bar" />
      <Link to="/matchlive-control" className="matchlive-control">
        <div className="selected-fixture">
          <div className="selected-fixture-item">라이브 정보 컨트롤</div>
        </div>
      </Link>
      {/* <Link to="/settings" className="settings">
        <div className="settings-tab">
          <div className="settings-tab-item">설정</div>
        </div>
      </Link> */}
      <div className="version-text-box">
        <div className="version-text">v {version}</div>
      </div>
    </div>
  );
};

export default SideNavigation;
