import Urls from '@app/common/Urls';
import axios from 'axios';
import React from 'react';

import '@app/styles/tabs/DebugTab.scss';

type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

const DebugTab = () => {
  const [leagueData, setLeagueData] = React.useState<any>(null);
  const [leagueDataLoading, setLeagueDataLoading] =
    React.useState<RequestStatus>('idle');

  const apiUrl = Urls.apiUrl;

  const getLeagues = () => {
    setLeagueDataLoading('loading');
    axios
      .get(apiUrl + Urls.football.leagues)
      .then((response) => {
        setLeagueData(response.data);
        setLeagueDataLoading('success');
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        setLeagueDataLoading('error');
      });
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
        <div className="league-get-status">{'' + leagueDataLoading}</div>
        <div className="league-data">{JSON.stringify(leagueData, null, 2)}</div>
      </div>
    </div>
  );
};

export default DebugTab;
