import Urls from '@app/common/Urls';
import axios from 'axios';
import React from 'react';
import '@app/styles/tabs/DebugTab.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@app/store/store';
import fetchLeagueList from '@app/store/slices/leagueSliceThunk';

type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

const DebugTab = () => {
  const dispatch = useDispatch<AppDispatch>();
  const leagueData = useSelector((state: RootState) => state.league.leagues);

  const apiUrl = Urls.apiUrl;

  const getLeagues = () => {
    dispatch(fetchLeagueList());
  };

  return (
    <div className="debug-tab-container">
      <div className="debug-tab-title">DEBUG Tab</div>
      <div className="api-url-box">
        <div className="api-url-box-title">API URL</div>
        <div className="api-url-box-contents">{apiUrl}</div>
      </div>
      <div className="league-get-btn">
        <button onClick={getLeagues}>리그 정보 가져오기</button>
        <div className="league-data">{JSON.stringify(leagueData, null, 2)}</div>
      </div>
    </div>
  );
};

export default DebugTab;
