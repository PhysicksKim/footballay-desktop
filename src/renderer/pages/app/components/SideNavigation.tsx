import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { faList, faSliders } from '@fortawesome/free-solid-svg-icons';
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
    <nav className="side-nav">
      <div className="nav-group top">
        <Link to="/" className="nav-item">
          <FontAwesomeIcon className="nav-icon" icon={faList} />
          <span className="nav-text">경기선택</span>
        </Link>
        <div className="nav-divider" />
        <Link to="/control" className="nav-item">
          <span className="nav-text">경기 정보</span>
        </Link>
      </div>

      <div className="nav-group bottom">
        <Link to="/settings" className="nav-item small-nav-item">
          <FontAwesomeIcon className="nav-icon" icon={faSliders} />
          <span className="nav-text">설정</span>
        </Link>
      </div>

      <div className="version-info">
        <span className="version-text">v {version}</span>
      </div>
    </nav>
  );
};

export default SideNavigation;
