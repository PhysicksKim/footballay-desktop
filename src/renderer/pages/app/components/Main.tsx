import ContentsArea from './ContentsArea';
import { HashRouter } from 'react-router-dom';

import TopBar from '@app/components/TopBar';
import SideNavigation from '@app/components/SideNavigation';
import Processors from '@app/components/processing/Processors';
import MatchliveIpc from '@app/components/processing/MatchliveIpc';
import V1MatchliveBridge from '@app/components/processing/V1MatchliveBridge';

import '@app/styles/Main.scss';

window.electron.ipcRenderer.send('loginfo', 'app window started');

const Main = () => {
  return (
    <div className="main-container">
      <MatchliveIpc />
      <V1MatchliveBridge />
      <Processors />
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
