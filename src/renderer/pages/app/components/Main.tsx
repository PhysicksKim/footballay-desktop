import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import FixtureDataManager from './FixtureDataManager';
import '../App.css';
import icon from '../../../../../assets/icon.svg';
import MatchliveDataSender from './MatchliveDataSender';

const Main = () => {
  const fixtureInfo = useSelector((state: RootState) => state.fixture);
  const lastFetchTime = useSelector(
    (state: RootState) => state.fixture.lastFetchTime,
  );

  const openmatchlive = () => {
    window.electron.ipcRenderer.sendMessage('open-matchlive-window');
  };

  return (
    <div>
      <div className="Hello">
        <img width="100" alt="icon" src={icon} />
      </div>
      <div className="Hello">
        <button type="button" onClick={openmatchlive}>
          Open Test Window
        </button>
      </div>
      <FixtureDataManager />
      <MatchliveDataSender />
      <div>
        <h3>업데이트 체크</h3>
        <div>
          메세지 : <span>{'메세지내용'}</span>
        </div>
        <div>isUpdating : {'false'}</div>
      </div>
      <div className="fixture-info-box">
        <h3>경기정보</h3>
        <p>마지막 데이터 요청 시간 : {lastFetchTime.toString()}</p>
        {fixtureInfo ? (
          <div>
            <p>리그: {fixtureInfo.league?.name}</p>
            <p>경기 시작: {fixtureInfo.date?.toLocaleString()}</p>
            <p>상태: {fixtureInfo.liveStatus?.longStatus}</p>
            <p>
              경기시간:{' '}
              {fixtureInfo.liveStatus
                ? fixtureInfo.liveStatus.elapsed
                : 'Not Started'}
            </p>
            <p>홈팀: {fixtureInfo.home?.name}</p>
            <p>원정팀: {fixtureInfo.away?.name}</p>
            {fixtureInfo.lineup ? (
              <div>
                <h4>선발 라인업</h4>
                <div>
                  <h5>홈팀 ({fixtureInfo.home?.name})</h5>
                  <ul>
                    {fixtureInfo.lineup.home?.players.map(
                      (player: any, index: number) => (
                        <li key={index}>
                          <p>
                            {player.position} - {player.name} (번호:{' '}
                            {player.number})
                          </p>
                        </li>
                      ),
                    )}
                  </ul>
                  <h5>원정팀 ({fixtureInfo.away?.name})</h5>
                  <ul>
                    {fixtureInfo.lineup.away?.players.map(
                      (player: any, index: number) => (
                        <li key={index}>
                          <p>
                            {player.position} - {player.name} (번호:{' '}
                            {player.number})
                          </p>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </div>
            ) : (
              <p>라인업 정보가 없습니다.</p>
            )}
            <h4>이벤트</h4>
            <ul>
              {fixtureInfo.events?.map((event: any, index: number) => (
                <li key={index}>
                  <p>
                    {event.elapsed}분 - {event.player.name} - {event.type} -{' '}
                    {event.detail}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>경기 정보를 불러오는 중...</p>
        )}
      </div>
    </div>
  );
};

export default Main;
