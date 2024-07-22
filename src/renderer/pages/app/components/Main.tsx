import ContentsArea from './tabs/ContentsArea';
import '@app/styles/Main.scss';
import MenuList from './MenuList';

const Main = () => {
  return (
    <div className="main-container">
      <div className="top-bar"></div>
      <div className="menu-list-area">
        <MenuList />
      </div>
      <div className="contents-area">
        <ContentsArea />
      </div>
    </div>
  );
};

export default Main;
