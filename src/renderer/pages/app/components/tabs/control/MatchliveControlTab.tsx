import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '@app/store/store';
import {
  addFilterEvent,
  removeFilterEvent,
  resetFilterEvents,
} from '@src/renderer/pages/app/store/slices/live/control/fixtureLiveControlSlice';
import FixtureEventList from '@app/components/tabs/control/FixtureEventList';

import { FixtureEvent } from '@src/types/FixtureIpc';
import '@app/styles/tabs/MatchliveControlTab.scss';
import { startFixtureLiveFetch } from '../../processing/StartMatchlive';

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
  const fixtureEvents = useSelector(
    (state: RootState) => state.fixtureLive.events,
  );
  const filterEvents = useSelector(
    (state: RootState) => state.fixtureLiveControl.filterEvents,
  ); // 필터된 이벤트 가져오기
  const selectedFixtureId = useSelector(
    (state: RootState) => state.fixtureLive.fixtureId,
  );
  const preferenceKey = useSelector(
    (state: RootState) => state.fixtureLiveOption.preference.key,
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
    if (selectedFixtureId) {
      startFixtureLiveFetch(selectedFixtureId, dispatch, preferenceKey);
    }
  };

  const minimizeMatchlive = () => {
    window.electron.ipcRenderer.send('control-to-matchlive', 'minimize');
  };

  const closeMatchlive = () => {
    window.electron.ipcRenderer.send('control-to-matchlive', 'close');
  };

  const handleAddFilter = (event: FixtureEvent) => {
    dispatch(addFilterEvent(event)); // 이벤트를 필터에 추가
  };

  const handleRemoveFilter = (event: FixtureEvent) => {
    dispatch(removeFilterEvent(event)); // 필터에서 이벤트 제거
  };

  const unfilteredEvents = fixtureEvents?.events.filter(
    (event) =>
      !filterEvents.some(
        (filterEvent) => filterEvent.sequence === event.sequence,
      ),
  );

  /**
   * matchlive window 의 사이즈를 초기화하고, 화면 중앙에 위치하도록 한다.
   */
  const resetMatchliveWindowSizeAndPosition = () => {
    window.electronStore.resetMatchliveWindowSizeAndPosition();
  };

  return (
    <div ref={contentTabContainerRef} className="matchlive-control-container">
      <div className="matchlive-control-title">
        <span>라이브 경기 정보</span>
      </div>
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

      <div className="event-filter" style={{ width: '100%' }}>
        <FixtureEventList
          events={unfilteredEvents}
          meta={fixtureEvents?.meta || []}
          isFiltered={false}
          handleEventClick={handleAddFilter}
        />
        <FixtureEventList
          events={filterEvents}
          meta={fixtureEvents?.meta || []}
          isFiltered={true}
          handleEventClick={handleRemoveFilter}
        />
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
        <button
          className="reset-window-btn win-con-btn"
          onClick={resetMatchliveWindowSizeAndPosition}
        >
          크기 초기화
        </button>
        <button className="close-btn win-con-btn" onClick={closeMatchlive}>
          닫기
        </button>
      </div>

      {/* <div className="additional-options-section">
        <input
          type="checkbox"
          id="show-profile"
          className="show-profile-checkbox"
          checked={showPhoto}
          onChange={(e) => {
            const isChecked = e.target.checked;
            window.electron.ipcRenderer.send('to-matchlive', {
              type: 'SET_SHOW_PHOTO',
              data: isChecked,
            });
            dispatch(setShowPhoto(isChecked));
          }}
        />
        <label htmlFor="show-profile" className="show-profile-box-label">
          프로필 사진 표시
        </label>
      </div> */}
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
    </div>
  );
};

export default MatchliveControlTab;
