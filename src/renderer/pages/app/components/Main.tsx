import ContentsArea from './ContentsArea';
import { HashRouter } from 'react-router-dom';

import TopBar from '@app/components/TopBar';
import SideNavigation from '@app/components/SideNavigation';
import MatchliveBridge from '@app/components/processing/MatchliveBridge';

import '@app/styles/Main.scss';

window.electron.ipcRenderer.send('loginfo', 'app window started');

const Main = () => {
  return (
    <div className="main-container">
      <MatchliveBridge />
      <div className="top-bar-area">
        <TopBar />
      </div>
      <HashRouter>
        <div className="main-layout">
          <div className="side-navigation-area">
            <SideNavigation />
          </div>
          <div className="contents-area">
            <ContentsArea />
          </div>
        </div>
      </HashRouter>
    </div>
  );
};

export default Main;
