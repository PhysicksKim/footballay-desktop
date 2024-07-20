import TabList from './TabList';
import ContentsArea from './tabs/ContentsArea';
import '../styles/Main.scss';

const Main = () => {
  return (
    <div className="main-container">
      {/* <FixtureDataManager />
      <MatchliveDataSender />
      <div className="Hello">
        <img width="100" alt="icon" src={icon} />
      </div> */}
      <div className="tablist-area">
        <TabList />
      </div>
      <div className="contents-area">
        <ContentsArea />
      </div>
    </div>
  );
};

export default Main;
