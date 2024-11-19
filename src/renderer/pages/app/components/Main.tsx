import ContentsArea from './ContentsArea';
import { HashRouter } from 'react-router-dom';

import TopBar from '@app/components/TopBar';
import SideNavigation from '@app/components/SideNavigation';
import Processors from '@app/components/processing/Processors';
import MatchliveIpc from '@app/components/processing/MatchliveIpc';

import '@app/styles/Main.scss';

const Main = () => {
  return (
    <div className="main-container">
      <MatchliveIpc />
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
