import ContentsArea from './ContentsArea';
import '@app/styles/Main.scss';
import TopBar from './TopBar';
import SideNavigation from './SideNavigation';

const Main = () => {
  return (
    <div className="main-container">
      <div className="top-bar-area">
        <TopBar />
      </div>
      <div className="main-layout">
        <div className="side-navigation-area">
          <SideNavigation />
        </div>
        <div className="contents-area">
          <ContentsArea />
        </div>
      </div>
    </div>
  );
};

export default Main;
