import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import '@app/styles/tabs/MatchliveControlTab.scss';
import { setShowPhoto } from '../../store/slices/fixtureLiveOptionSlice';

const MatchliveControlTab = () => {
  const dispatch = useDispatch();
  const info = useSelector((state: RootState) => state.fixtureLive.info);
  const lastFetch = useSelector(
    (state: RootState) => state.fixtureLive.lastFetchedAt,
  );
  const fixtureLive = useSelector((state: RootState) => state.fixtureLive);
  const showPhoto = useSelector(
    (state: RootState) => state.fixtureLiveOption.showPhoto,
  );
  const contentTabContainerRef = useRef<HTMLDivElement>(null);

  const parseKickoffTime = (dateString: string) => {
    const kickoffTime = new Date(dateString);
    const month = String(kickoffTime.getMonth() + 1).padStart(2, '0');
    const date = String(kickoffTime.getDate()).padStart(2, '0');
    const hour = String(kickoffTime.getHours()).padStart(2, '0');
    const minute = String(kickoffTime.getMinutes()).padStart(2, '0');
    return `${month}/${date} ${hour}:${minute}`;
  };

  /**
   *
   * @param dateString
   * @returns MM/DD HH:mm:ss 형식으로 변환
   */
  const parseLastFetchTimeString = (dateString: string) => {
    const lastFetchTime = new Date(dateString);
    const month = String(lastFetchTime.getMonth() + 1).padStart(2, '0');
    const date = String(lastFetchTime.getDate()).padStart(2, '0');
    const hour = String(lastFetchTime.getHours()).padStart(2, '0');
    const minute = String(lastFetchTime.getMinutes()).padStart(2, '0');
    const second = String(lastFetchTime.getSeconds()).padStart(2, '0');
    return `${month}/${date} ${hour}:${minute}:${second}`;
  };

  const isInfoReady =
    info &&
    info.fixtureId &&
    info.league &&
    info.home &&
    info.away &&
    info.date &&
    fixtureLive;

  const reloadMatchlive = () => {
    window.electron.ipcRenderer.send('control-to-matchlive', 'refresh');
  };

  const minimizeMatchlive = () => {
    window.electron.ipcRenderer.send('control-to-matchlive', 'minimize');
  };

  const closeMatchlive = () => {
    window.electron.ipcRenderer.send('control-to-matchlive', 'close');
  };

  return (
    <div ref={contentTabContainerRef} className="matchlive-control-container">
      <div className="matchlive-control-title">
        <span>라이브 경기 정보</span>
      </div>
      {/* 상단 영역: 경기 정보 */}
      <div className="match-info-section">
        {isInfoReady ? (
          <>
            <div className="league-info-box">
              <div className="league-logo-img">
                <img src={info?.league.logo} alt={info?.league.name} />
              </div>
              <div className="league-info">
                <span>{info?.league.koreanName || info?.league.name}</span>
              </div>
            </div>
            <div className="fixture-info-box">
              <div className="home-team-box team-box">
                <div className="home-mark">홈</div>
                <div className="home-team-name team-name">
                  {info.home.koreanName ? info.home.koreanName : info.home.name}
                </div>
                <div className="home-team-logo team-logo">
                  <img src={info?.home.logo} alt={'홈팀로고'} />
                </div>
              </div>
              <div className="match-detail-box">
                <div className="match-status">
                  {fixtureLive.liveStatus?.liveStatus.shortStatus}
                </div>
                <div className="match-date">{parseKickoffTime(info.date)}</div>
              </div>
              <div className="away-team-box team-box">
                <div className="away-team-logo team-logo">
                  <img src={info?.away.logo} alt={'원정팀로고'} />
                </div>
                <div className="away-team-name team-name">
                  {info.away.koreanName ? info.away.koreanName : info.away.name}
                </div>
                <div className="away-mark">
                  {/* 사이즈 맞추기 위한 빈 태그 */}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="fixture-not-selected">
              아직 경기가 선택되지 않았습니다.
            </div>
          </>
        )}
      </div>

      <div className="last-fetch-title-box">
        <span>데이터 갱신 시각</span>
      </div>
      <div className="last-fetch-time-box">
        <div
          className={`last-fetch-time ${lastFetch ? 'exist-last-fetch' : 'no-last-fetch'}`}
        >
          {lastFetch
            ? '마지막 데이터 갱신 : ' + parseLastFetchTimeString(lastFetch)
            : '경기가 선택되지 않았습니다.'}
        </div>
      </div>

      <div className="window-control-section-title">
        <span>팝업 창 컨트롤</span>
      </div>
      <div className="window-control-section">
        <button className="refresh-btn win-con-btn" onClick={reloadMatchlive}>
          새로고침
        </button>
        <button
          className="minimize-btn win-con-btn"
          onClick={minimizeMatchlive}
        >
          최소화
        </button>
        <button className="close-btn win-con-btn" onClick={closeMatchlive}>
          닫기
        </button>
      </div>

      {/* 하단 영역: 추가 옵션 섹션 */}
      <div className="additional-options-section">
        <input
          type="checkbox"
          id="show-profile"
          className="show-profile-checkbox"
          checked={showPhoto} // 초기값 설정
          onChange={(e) => {
            const isChecked = e.target.checked;
            window.electron.ipcRenderer.send('to-matchlive', {
              type: 'SET_SHOW_PHOTO',
              data: isChecked,
            });
            dispatch(setShowPhoto(isChecked)); // 리덕스 상태 업데이트
          }}
        />
        <label htmlFor="show-profile" className="show-profile-box-label">
          프로필 사진 표시
        </label>
      </div>
    </div>
  );
};

export default MatchliveControlTab;
