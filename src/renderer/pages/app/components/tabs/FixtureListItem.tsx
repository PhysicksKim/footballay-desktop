import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export interface FixtureListItemProps {
  matchSchedule: {
    kickoffTime: string;
    matchRound: string;
  };
  teamALogo: {
    homeTeamMark: string;
    teamLogoUrl: string;
    teamName: string;
  };
  teamBLogo: {
    homeTeamMark: string;
    teamLogoUrl: string;
    teamName: string;
  };
  matchStatus: {
    matchStatusTitle: string;
    matchStatusNow: string;
  };
  index: number;
}

const FixtureListItem = () => {
  const fixtureInfos = {
    matchSchedule: {
      kickoffTime: '01:00',
      matchRound: '12 라운드',
    },
    teamALogo: {
      homeTeamMark: 'H',
      teamLogoUrl: 'https://media.api-sports.io/football/teams/33.png',
      teamName: '맨시티',
    },
    teamBLogo: {
      homeTeamMark: 'A',
      teamLogoUrl: 'https://media.api-sports.io/football/teams/50.png',
      teamName: '맨유',
    },
    matchStatus: {
      matchStatusTitle: '경기상태',
      matchStatusNow: '종료',
    },
    index: 1,
  };

  return (
    <div
      className={`fixture-list-item fixture-list-item_${fixtureInfos.index}`}
    >
      <div className="match-schedule-box">
        <div className="kickoff-time">
          {fixtureInfos.matchSchedule.kickoffTime}
        </div>
        <div className="match-round">
          {fixtureInfos.matchSchedule.matchRound}
        </div>
      </div>
      <div className="team-a-logo-box">
        <div className="home-team-mark">
          {fixtureInfos.teamALogo.homeTeamMark}
        </div>
        <div className="team-a-logo">
          <img src={fixtureInfos.teamALogo.teamLogoUrl} />
        </div>
      </div>
      <div className="team-versus-box">
        <div className="team-a-name">{fixtureInfos.teamALogo.teamName}</div>
        <div className="match-score">0:0</div>
        <div className="team-b-name">{fixtureInfos.teamBLogo.teamName}</div>
      </div>
      <div className="team-b-logo-box">
        <div className="team-a-logo">
          <img src={fixtureInfos.teamBLogo.teamLogoUrl} />
        </div>
        <div className="home-team-mark">
          {fixtureInfos.teamBLogo.homeTeamMark}
        </div>
      </div>
      <div className="match-status-box">
        <div className="match-status-title">
          {fixtureInfos.matchStatus.matchStatusTitle}
        </div>
        <div className="match-status-now">
          {fixtureInfos.matchStatus.matchStatusNow}
        </div>
      </div>
      <div className="live-match-btn-box">
        <div className="popup-icon-box">
          <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
        </div>
      </div>
    </div>
  );
};

export default FixtureListItem;
