import ContentsArea from './ContentsArea';
import '@app/styles/Main.scss';
import TopBar from './TopBar';
import SideNavigation from './SideNavigation';
import { HashRouter } from 'react-router-dom';

const Main = () => {
  return (
    <div className="main-container">
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
