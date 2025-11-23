import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@app/store/store';
import fetchLeagueList from '@src/renderer/pages/app/store/slices/select/league/leagueSliceThunk';
import Urls from '@app/constants/Urls';

import '@app/styles/tabs/DebugTab.scss';

type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

const DebugTab = () => {
  const dispatch = useDispatch<AppDispatch>();
  const leagueData = useSelector((state: RootState) => state.league.leagues);

  const info = useSelector((state: RootState) => state.fixtureLive.info);
  const liveStatus = useSelector(
    (state: RootState) => state.fixtureLive.liveStatus
  );
  const lineup = useSelector((state: RootState) => state.fixtureLive.lineup);
  const events = useSelector((state: RootState) => state.fixtureLive.events);

  const apiUrl = Urls.domainUrl;

  const getLeagues = () => {
    dispatch(fetchLeagueList());
  };

  const handlePrintData = () => {
    console.log('info:', info);
    console.log('liveStatus:', liveStatus);
    console.log('lineup:', lineup);
    console.log('events:', events);
  };

  return (
    <div className="debug-tab-container">
      <div className="debug-tab-title">DEBUG Tab</div>
      <div className="api-url-box">
        <div className="api-url-box-title">API URL</div>
        <div className="api-url-box-contents">{apiUrl}</div>
      </div>
      <button onClick={handlePrintData}>PrintData</button>
      <div className="league-get-btn">
        <button onClick={getLeagues}>리그 정보 가져오기</button>
        <div className="league-data">{JSON.stringify(leagueData, null, 2)}</div>
      </div>
    </div>
  );
};

export default DebugTab;
