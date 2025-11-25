/*
SHORT	LONG	                TYPE	        DESCRIPTION
TBD	  Time To Be Defined	  Scheduled	    Scheduled but date and time are not known
NS	  Not Started	          Scheduled
1H	  First Half, Kick Off	In Play	      First half in play
HT	  Halftime	            In Play	      Finished in the regular time
2H	  Second Half, 	        In Play	      Second half in play
      2nd Half Started
ET	  Extra Time	          In Play	      Extra time in play
BT	  Break Time	          In Play	      Break during extra time
P	    Penalty In Progress	  In Play	      Penaly played after extra time
SUSP	Match Suspended	      In Play	      Suspended by referee's decision, may be rescheduled another day
INT	  Match Interrupted	    In Play	      Interrupted by referee's decision, should resume in a few minutes
FT	  Match Finished	      Finished	    Finished in the regular time
AET	  Match Finished	      Finished	    Finished after extra time without going to the penalty shootout
PEN	  Match Finished	      Finished	    Finished after the penalty shootout
PST	  Match Postponed	      Postponed	    Postponed to another day, once the new date and time is known the status will change to Not Started
CANC	Match Cancelled	      Cancelled	    Cancelled, match will not be played
ABD	  Match Abandoned	      Abandoned	    Abandoned for various reasons (Bad Weather, Safety, Floodlights, Playing Staff Or Referees), Can be rescheduled or not, it depends on the competition
AWD	  Technical Loss	      Not Played
WO	  WalkOver	            Not Played	  Victory by forfeit or absence of competitor
LIVE	In Progress	          In Play	      Used in very rare cases. It indicates a fixture in progress but the data indicating the half-time or elapsed time are not available
*/
const ShortStatusToKorean = (status: string) => {
  switch (status) {
    case 'TBD':
      return '미정';
    case 'NS':
      return '경기전';
    case '1H':
      return '전반전';
    case 'HT':
      return '하프타임';
    case '2H':
      return '후반전';
    case 'ET':
      return '연장전';
    case 'BT':
      return '휴식';
    case 'P':
      return '페널티';
    case 'SUSP':
      return '경기중단';
    case 'INT':
      return '일시중단';
    case 'FT':
      return '경기종료';
    case 'AET':
      return '연장종료';
    case 'PEN':
      return '페널티종료';
    case 'PST':
      return '연기';
    case 'CANC':
      return '경기취소';
    case 'ABD':
      return '중단';
    case 'AWD':
      return '기술적문제';
    case 'WO':
      return '부전승';
    case 'LIVE':
      return '진행중';
    default:
      return status;
  }
};

export { ShortStatusToKorean };
