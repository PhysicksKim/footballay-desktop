import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  faArrowUpRightFromSquare,
  faBan,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { AppDispatch, RootState } from '@app/store/store';
import { setFixtureIdAndClearInterval } from '@src/renderer/pages/app/store/slices/live/fixtureLiveSlice';
import { fetchFixtureInfo } from '@src/renderer/pages/app/store/slices/live/fixtureLiveSliceThunk';
import {
  startFetchEvents,
  startFetchLineup,
  startFetchLiveStatus,
  startFetchStatistics,
} from '@src/renderer/pages/app/store/slices/live/fixtureLiveDataUpdater';
import TeamLogo from './TeamLogo';

import '@app/styles/tabs/FixtureListItem.scss';
import { startFixtureLiveFetch } from '../../../processing/StartMatchlive';

export interface FixtureListItemProps {
  leagueId: number | null;
  fixtureId: number;
  matchSchedule: {
    kickoff: string;
    round: string;
  };
  teamA: {
    name: string;
    logo: string;
    koreanName: string | null;
  };
  teamB: {
    name: string;
    logo: string;
    koreanName: string | null;
  };
  status: {
    longStatus: string;
    shortStatus: string;
    elapsed: number | null;
    score: {
      home: number | null;
      away: number | null;
    };
  };
  index: number;
  available: boolean;
}

const FixtureListItem = ({
  leagueId,
  fixtureId,
  matchSchedule,
  teamA,
  teamB,
  status,
  index,
  available,
}: FixtureListItemProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const preferenceKey = useSelector(
    (state: RootState) => state.fixtureLiveOption.preference.key
  );

  const convertKickoffTimeToHHMM = (kickoff: string) => {
    return kickoff.split(' ')[1];
  };

  const convertRoundText = (round: string) => {
    if (leagueId === 39) {
      const roundNumber = round.split(' ')[3];
      return `${roundNumber} 라운드`;
    }
    return round;
  };

  const openMatchlivePopup = () => {
    window.electron.ipcRenderer.send('open-matchlive-window', fixtureId);
  };

  const handleSelectMatchLiveClick = () => {
    if (available) {
      startFixtureLiveFetch(fixtureId, dispatch, preferenceKey);
      openMatchlivePopup();
    }
  };

  return (
    <div className={`fixture-list-item fixture-list-item_${index}`}>
      <div className="match-schedule-box">
        <div className="kickoff-time">
          {convertKickoffTimeToHHMM(matchSchedule.kickoff)}
        </div>
        <div className="match-round">
          {convertRoundText(matchSchedule.round)}
        </div>
      </div>
      <div className="match-versus-box">
        <div className="team-logo-box team-a-logo-box">
          <div className="team-mark home-team-mark">
            <div className="team-mark-text home-team-mark-text">H</div>
          </div>
          <div className="team-logo team-a-logo">
            <TeamLogo
              key={fixtureId + teamA.name}
              logo={teamA.logo}
              name={teamA.name}
            />
          </div>
        </div>
        <div className="team-versus-box">
          <div className="team-a-name">{teamA.koreanName || teamA.name}</div>
          <div className="match-score">
            <div className="home-score">
              {status?.score?.home ? status.score.home : 0}
            </div>
            <div className="score-division">:</div>
            <div className="away-score">
              {status?.score?.away ? status.score.away : 0}
            </div>
          </div>
          <div className="team-b-name">{teamB.koreanName || teamB.name}</div>
        </div>
        <div className="team-logo-box team-b-logo-box">
          <div className="team-logo team-b-logo">
            <TeamLogo
              key={fixtureId + teamB.name}
              logo={teamB.logo}
              name={teamB.name}
            />
          </div>
          <div className="team-mark away-team-mark">
            <div className="team-mark-text away-team-mark-text">A</div>
          </div>
        </div>
      </div>
      <div className="match-status-box">
        <div className="match-status-title">경기상태</div>
        <div className="match-status-now">{status.shortStatus}</div>
      </div>
      <div
        className={`live-match-btn-box ${available ? 'enabled' : 'disabled'}`}
        onClick={handleSelectMatchLiveClick}
      >
        <div className={`popup-icon-box ${available ? 'enabled' : 'disabled'}`}>
          {available ? (
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
          ) : (
            <FontAwesomeIcon icon={faBan} />
          )}
        </div>
      </div>
    </div>
  );
};

export default FixtureListItem;
