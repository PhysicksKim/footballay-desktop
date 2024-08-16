import {
  faArrowUpRightFromSquare,
  faBan,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '@app/styles/tabs/FixtureListItem.scss';
import React from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { setFixtureIdAndClearInterval } from '../../store/slices/fixtureLiveSlice';
import { fetchFixtureInfo } from '../../store/slices/fixtureLiveSliceThunk';
import {
  startFetchEvents,
  startFetchLineup,
  startFetchLiveStatus,
} from '../../store/slices/fixtureLiveDataUpdater';
import TeamLogo from './TeamLogo';

export interface FixtureListItemProps {
  leagueId: number | null;
  fixtureId: number;
  matchSchedule: {
    kickoff: string;
    round: string;
  };
  teamALogo: {
    name: string;
    logo: string;
    koreanName: string | null;
  };
  teamBLogo: {
    name: string;
    logo: string;
    koreanName: string | null;
  };
  status: {
    longStatus: string;
    shortStatus: string;
    elapsed: number | null;
    score: {
      home: number;
      away: number;
    };
  };
  index: number;
  available: boolean;
}

const FixtureListItem = ({
  leagueId,
  fixtureId,
  matchSchedule,
  teamALogo,
  teamBLogo,
  status,
  index,
  available,
}: FixtureListItemProps) => {
  const dispatch = useDispatch<AppDispatch>();
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
      dispatch(setFixtureIdAndClearInterval(fixtureId));
      dispatch(fetchFixtureInfo(fixtureId));
      openMatchlivePopup();
      dispatch(startFetchLineup(fixtureId));
      dispatch(startFetchLiveStatus(fixtureId));
      dispatch(startFetchEvents(fixtureId));
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
            <TeamLogo logo={teamALogo.logo} name={teamALogo.name} />
          </div>
        </div>
        <div className="team-versus-box">
          <div className="team-a-name">
            {teamALogo.koreanName || teamALogo.name}
          </div>
          <div className="match-score">
            <div className="home-score">{status.score.home}</div>
            <div className="score-division">:</div>
            <div className="away-score">{status.score.away}</div>
          </div>
          <div className="team-b-name">
            {teamBLogo.koreanName || teamBLogo.name}
          </div>
        </div>
        <div className="team-logo-box team-b-logo-box">
          <div className="team-logo team-b-logo">
            <TeamLogo logo={teamBLogo.logo} name={teamBLogo.name} />
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
