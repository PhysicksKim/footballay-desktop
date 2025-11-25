import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  faList,
  faSliders,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import '@app/styles/SideNavigation.scss';
import { getEnvLabel } from '@app/config/environment';

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
      <div className="settings">
        <Link to="/settings" className="settings-tab">
          <div className="settings-tab-item">
            <FontAwesomeIcon icon={faSliders} />
            <span className="settings-tab-text">설정</span>
          </div>
        </Link>
      </div>
      <div className="version-text-box">
        <div className="version-text">v {version}</div>
      </div>
    </div>
  );
};

export default SideNavigation;
